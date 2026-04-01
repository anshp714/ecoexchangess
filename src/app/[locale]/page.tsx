'use client';
import { MainHeader } from '@/components/main-header';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Recycle, Tractor } from 'lucide-react';
import { mockListings } from '@/lib/data';
import { ListingCard } from '@/components/dashboard/listing-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useI18n } from '@/locales/client';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  const t = useI18n();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MainHeader />
      <main className="flex-1">
        <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
          {heroImage && <Image src={heroImage.imageUrl} fill objectFit="cover" alt={heroImage.description} className="z-0 brightness-50" data-ai-hint={heroImage.imageHint} priority />}
          <div className="z-10 p-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">{t('home.hero.title')}</h1>
            <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">{t('home.hero.subtitle')}</p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">{t('home.hero.browse')}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/signup">{t('home.hero.sell')}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline">{t('home.howItWorks.title')}</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 rounded-full p-6 mb-4">
                  <Leaf className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('home.howItWorks.step1.title')}</h3>
                <p className="text-muted-foreground">{t('home.howItWorks.step1.description')}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 rounded-full p-6 mb-4">
                  <Recycle className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('home.howItWorks.step2.title')}</h3>
                <p className="text-muted-foreground">{t('home.howItWorks.step2.description')}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 rounded-full p-6 mb-4">
                  <Tractor className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('home.howItWorks.step3.title')}</h3>
                <p className="text-muted-foreground">{t('home.howItWorks.step3.description')}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="featured" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline">{t('home.featured.title')}</h2>
            <Carousel opts={{ loop: true }} className="w-full max-w-6xl mx-auto">
              <CarouselContent>
                {mockListings.slice(0, 5).map((listing) => (
                  <CarouselItem key={listing.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <ListingCard listing={listing} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12" />
            </Carousel>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
