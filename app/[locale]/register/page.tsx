import AuthForm from '@/components/AuthForm';
import MarketingNavbar from '@/components/MarketingNavbar';

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 md:px-6 pt-20 md:pt-0">
      <MarketingNavbar />
      
      {/* Background blobs - responsive placement */}
      <div className="absolute top-1/4 -left-40 md:-left-20 w-64 md:w-80 h-64 md:h-80 bg-blue-500/10 md:bg-blue-500/20 blur-[80px] md:blur-[100px] rounded-full z-[-1]" />
      <div className="absolute bottom-1/4 -right-40 md:-right-20 w-64 md:w-80 h-64 md:h-80 bg-purple-500/5 md:bg-purple-500/10 blur-[80px] md:blur-[100px] rounded-full z-[-1]" />
      
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
