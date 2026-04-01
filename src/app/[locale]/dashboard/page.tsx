
'use client';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListingCard } from "@/components/dashboard/listing-card";
import { mockListings } from "@/lib/data";
import { ListFilter, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentLocale } from "@/locales/client";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const locale = useCurrentLocale();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on role from the main dashboard entry
      if (user.role === 'seller') {
        router.replace(`/${locale}/dashboard/seller`);
      } else if (user.role === 'logistics') {
        router.replace(`/${locale}/dashboard/logistics`);
      }
      // Buyers stay here
    }
  }, [user, isLoading, router, locale]);

  if (isLoading || !user || user.role !== 'buyer') {
    // Show a loading state or nothing while redirecting
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold font-headline">Marketplace</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat-straw">Wheat Straw</SelectItem>
                <SelectItem value="corn-stover">Corn Stover</SelectItem>
                <SelectItem value="rice-husks">Rice Husks</SelectItem>
              </SelectContent>
            </Select>
             <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>
          {/* This button is correctly hidden for buyers now based on the check below */}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
