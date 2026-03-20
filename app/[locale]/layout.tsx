import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales } from "@/lib/i18n";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Tobi LiveProof | Công Cụ Tăng Chuyển Đổi & Social Proof Cho Website",
    template: "%s | Tobi LiveProof"
  },
  description: "Tăng 300% chuyển đổi với Social Proof. Thông báo đơn hàng, số người đang xem, chương trình khách hàng thân thiết (Loyalty) và Flash Sale. Giải pháp toàn diện cho E-commerce.",
  keywords: ["social proof", "tăng chuyển đổi", "thông báo đơn hàng", "loyalty program", "flash sale widget", "live proof", "công cụ marketing", "ecommerce tool"],
  metadataBase: new URL('https://tobi-liveproof.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Tobi LiveProof | Giải Pháp Tăng Chuyển Đổi Tức Thì",
    description: "Biến khách truy cập thành khách mua hàng bằng hiệu ứng đám đông. Cài đặt chỉ trong 30 giây.",
    url: 'https://tobi-liveproof.vercel.app',
    siteName: 'Tobi LiveProof',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Tobi LiveProof Social Proof Dashboard'
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tobi LiveProof | Social Proof Widget",
    description: "Tăng uy tín thương hiệu với các thông báo đơn hàng thời gian thực.",
    images: ['/logo.png'],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  other: {
    'fb:app_id': '801234567890123',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
