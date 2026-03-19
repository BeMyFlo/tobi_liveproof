import AuthForm from '@/components/AuthForm';
import MarketingNavbar from '@/components/MarketingNavbar';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      <MarketingNavbar />
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full" />
      
      <AuthForm mode="login" />
    </main>
  );
}
