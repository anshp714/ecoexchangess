"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EcoExchangeLogo } from '@/lib/icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useI18n, useChangeLocale, useCurrentLocale } from '@/locales/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function MainHeader() {
  const t = useI18n();
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  const navLinks = [
    { href: '#how-it-works', label: t('header.howItWorks') },
    { href: '#featured', label: t('header.listings') },
    { href: '#', label: t('header.about') },
    { href: '#', label: t('header.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <EcoExchangeLogo className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">EcoExchange</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">{t('header.login')}</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/signup">{t('header.signup')}</Link>
          </Button>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => changeLocale('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => changeLocale('hi')}>
                हिन्दी (Hindi)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <EcoExchangeLogo className="h-6 w-6 text-primary" />
                <span className="font-bold">EcoExchange</span>
              </Link>
              <div className="flex flex-col space-y-2">
                {navLinks.map(link => (
                  <Link key={link.label} href={link.href} className="transition-colors hover:text-primary py-2">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
