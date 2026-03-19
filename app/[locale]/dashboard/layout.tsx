import { setRequestLocale } from 'next-intl/server';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export const dynamic = "force-dynamic";

export default function DashboardRootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
