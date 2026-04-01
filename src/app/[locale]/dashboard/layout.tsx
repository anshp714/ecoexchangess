
'use client';

import dynamic from 'next/dynamic';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProvider, useUser } from '@/context/UserContext';
import { useEffect } from 'react';
import { useCurrentLocale } from '@/locales/client';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/loading-screen';

const DashboardSidebar = dynamic(
  () => import('@/components/dashboard/sidebar').then(mod => mod.DashboardSidebar),
  { ssr: false }
);

const DashboardHeader = dynamic(
  () => import('@/components/dashboard/dashboard-header').then(mod => mod.DashboardHeader),
  {
    ssr: false,
    loading: () => <DashboardHeaderSkeleton />
  }
);

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const locale = useCurrentLocale();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, isLoading, router, locale]);

  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </UserProvider>
  );
}


function DashboardHeaderSkeleton() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6">
      <div className="hidden group-data-[variant=sidebar]:md:flex">
         <Skeleton className="h-7 w-7" />
      </div>
      <div className="relative flex-1">
        <Skeleton className="h-10 w-full md:w-1/2 lg:w-1/3" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </header>
  )
}
