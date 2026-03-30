import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Visitor from '@/models/Visitor';
import ProductRelation from '@/models/ProductRelation';

/**
 * Phân biệt trang sản phẩm vs trang danh sách bằng độ sâu URL.
 * Hoạt động với mọi website mà không cần cấu hình.
 * Độ sâu >= 2: product (/shop/product-name, /san-pham/ten-sp)
 * Độ sâu <= 1: listing (/shop, /san-pham, /products)
 *
 * Nếu user đặt productPattern (ví dụ "san-pham"), chỉ track URL chứa pattern đó.
 */
function isProductUrl(url: string, productPattern?: string): boolean {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.replace(/\/$/, '').split('/').filter(s => s.length > 0);
    const hasDepth = segments.length >= 2;  // /san-pham/product-name = 2 segments

    if (productPattern && productPattern.trim()) {
      // Nếu user có cấu hình pattern, URL phải chứa pattern đó và phải có depth
      return hasDepth && pathname.includes(productPattern.trim());
    }

    return hasDepth;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, visitorId, url, email, product } = await req.json();

    if (!key || !visitorId) {
      return NextResponse.json({ error: 'Missing information' }, { status: 400 });
    }

    await dbConnect();

    // 1. Find the site owner
    const user = await User.findOne({ apiKey: key });
    if (!user) {
      return NextResponse.json({ error: 'Invalid API Key' }, { status: 404 });
    }

    // Security check: Whitelisted domains
    const origin = req.headers.get('origin') || req.headers.get('referer');
    if (user.allowedDomains?.length > 0 && origin) {
      const isAuthorized = (user.allowedDomains as string[]).some((d: string) => d && origin.includes(d.trim()));
      if (!isAuthorized) {
        return NextResponse.json({ error: 'This domain is not authorized' }, { 
            status: 403, 
            headers: { 'Access-Control-Allow-Origin': '*' } 
        });
      }
    }

    // 2. Loyalty Logic
    let orderCount = 0;
    let allMilestones = [];
    //@ts-ignore
    const LoyaltyMilestone = (await import('@/models/LoyaltyMilestone')).default;
    //@ts-ignore
    const Purchase = (await import('@/models/Purchase')).default;

    allMilestones = await LoyaltyMilestone.find({ userId: user._id }).sort({ threshold: 1 });

    if (email) {
      orderCount = await Purchase.countDocuments({ userId: user._id, customerEmail: email });
    }

    // 3. Track the visitor & update ProductRelation
    let visitor = await Visitor.findOne({ visitorId, userId: user._id });
    let specialTrigger = null;
    let isReturning = false;
    const upsellSettings = user.widgets?.upsell;

    if (visitor) {
      isReturning = true;
      const now = new Date();
      const lastVisit = new Date(visitor.lastVisit);
      const diffDays = Math.floor((now.getTime() - lastVisit.getTime()) / (1000 * 3600 * 24));

      if (diffDays >= 30) specialTrigger = 'LONG_TIME_NO_SEE';

      visitor.lastVisit = now;
      visitor.visitCount += 1;

      // --- ProductRelation: Ghi nhận hành vi A → B ---
      const productPattern = upsellSettings?.productPattern;
      const currentIsProduct = isProductUrl(product?.url || '', productPattern);

      if (upsellSettings?.enabled && product?.url && product?.title && currentIsProduct) {
        const lastView = visitor.viewHistory.length > 0
          ? visitor.viewHistory[visitor.viewHistory.length - 1]
          : null;

        if (lastView && lastView.url !== product.url && isProductUrl(lastView.url, productPattern)) {
          await ProductRelation.findOneAndUpdate(
            { userId: user._id, fromUrl: lastView.url, toUrl: product.url },
            {
              $inc: { count: 1 },
              $set: { toTitle: product.title, toImage: product.image || '', updatedAt: new Date() },
              $setOnInsert: { userId: user._id, fromUrl: lastView.url, toUrl: product.url }
            },
            { upsert: true, new: true }
          );
          console.log(`[UPSELL] Record: ${lastView.url} -> ${product.url}`);
        }

        // Cập nhật viewHistory
        if (!lastView || lastView.url !== product.url) {
          visitor.viewHistory.push({ url: product.url, title: product.title, image: product.image || '', timestamp: now });
          if (visitor.viewHistory.length > 5) visitor.viewHistory.shift();
        }
      }

      await visitor.save();
    } else {
      // New visitor
      isReturning = false;
      visitor = await Visitor.create({
        visitorId,
        userId: user._id,
        viewHistory: (upsellSettings?.enabled && product?.url) ? [{
          url: product.url, title: product.title, image: product.image || '', timestamp: new Date()
        }] : [],
        metadata: {
          userAgent: req.headers.get('user-agent') || 'unknown',
          ip: req.headers.get('x-forwarded-for') || 'unknown'
        }
      });
    }

    // 4. Smart Upsell: O(1) lookup từ bảng ProductRelation
    let upsell = null;
    const isUrlAllowed = !upsellSettings?.targetUrls?.length || upsellSettings.targetUrls.some((u: string) => url?.includes(u));

    if (upsellSettings?.enabled && isUrlAllowed && product?.url) {
      // Chỉ lấy kết quả có title (image là tùy chọn)
      const best = await ProductRelation.findOne({
        userId: user._id,
        fromUrl: product.url,
        toTitle: { $ne: '' },
      }).sort({ count: -1 }).lean() as any;

      if (best) {
        upsell = {
          url: best.toUrl,
          title: best.toTitle,
          image: best.toImage,
          template: upsellSettings.template || 'Có thể bạn quan tâm'
        };
      }
    }

    console.log(`[VISITOR] ${visitorId} @ ${url} | Upsell: ${upsell ? upsell.title : 'None'}`);

    return NextResponse.json({ 
      success: true, 
      specialTrigger,
      isReturning,
      orderCount,
      allMilestones,
      upsell
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Track Visitor Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
