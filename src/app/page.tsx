
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChangeLocale, useCurrentLocale } from '@/locales/client';
import { EcoExchangeLogo } from '@/lib/icons';

function setCookie(name: string, value: string, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export default function LanguageSelectionPage() {
  const router = useRouter();
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  const handleLanguageSelect = (locale: 'en' | 'hi') => {
    setCookie('NEXT_LOCALE', locale);
    changeLocale(locale);
  };
  
  useEffect(() => {
    if (currentLocale) {
        router.push(`/${currentLocale}`);
    }
  }, [currentLocale, router]);


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2 font-bold text-lg">
        <EcoExchangeLogo className="h-6 w-6 text-primary" />
        <span className="font-headline">EcoExchange</span>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-headline">Choose Your Language</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={() => handleLanguageSelect('en')} size="lg">
            English
          </Button>
          <Button onClick={() => handleLanguageSelect('hi')} size="lg">
            हिन्दी (Hindi)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
