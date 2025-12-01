
'use client';
import { EcoExchangeLogo } from '@/lib/icons';

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background text-primary">
            <EcoExchangeLogo className="w-24 h-24" animationDuration={2.5} />
            <p className="mt-4 text-lg font-semibold text-foreground animate-pulse">
                Loading EcoExchange...
            </p>
        </div>
    );
}
