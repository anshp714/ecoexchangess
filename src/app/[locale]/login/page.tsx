import { LoginForm } from '@/components/login-form';
import Link from 'next/link';
import { EcoExchangeLogo } from '@/lib/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <EcoExchangeLogo className="h-6 w-6 text-primary" />
          <span className="font-headline">EcoExchange</span>
        </Link>
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
