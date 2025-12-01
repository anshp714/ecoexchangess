import type { Listing } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Thermometer, Weight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={listing.image.url}
            alt={listing.title}
            fill
            className="object-cover"
            data-ai-hint={listing.image.hint}
          />
        </div>
        <div className="p-4">
          <Badge variant="secondary" className="mb-2">{listing.attributes.type}</Badge>
          <CardTitle className="text-lg leading-tight font-headline">{listing.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0 space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> <span>{listing.location}</span>
        </div>
        <div className="flex items-center gap-2">
            <Weight className="w-4 h-4" /> <span>{listing.quantity} {listing.quantityUnit} available</span>
        </div>
         <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4" /> <span>{listing.attributes.moisture} moisture</span>
        </div>
         <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" /> <span>{listing.attributes.calorificValue}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0 mt-auto">
        <div>
            <p className="text-xl font-bold text-primary">₹{listing.price.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground">per {listing.quantityUnit.slice(0, -1)}</p>
        </div>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  );
}
