import WidgetPreview from '@/components/WidgetPreview';
import { setRequestLocale } from 'next-intl/server';

// Dòng này hoạt động mạnh mẽ nhất ở đây (Server Component)
export const dynamic = "force-dynamic";

export default function WidgetPage({ 
  params: { locale },
  searchParams
}: {
  params: { locale: string },
  searchParams: { key: string }
}) {
  // Đồng bộ ngôn ngữ
  setRequestLocale(locale);

  // Lấy key trực tiếp từ Server-side props
  const apiKey = searchParams.key;

  return (
    <main className="min-h-screen bg-transparent p-4 flex items-center justify-center">
      {/* Truyền key xuống Client component của bạn */}
      <WidgetPreview apiKey={apiKey} />
    </main>
  );
}
