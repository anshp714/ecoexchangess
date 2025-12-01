'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, FileUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { imageBasedWasteSearch } from '@/ai/flows/image-based-waste-search';
import Image from 'next/image';

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function ImageSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setSearchResult(null);

    try {
      const dataUri = await fileToDataUri(file);
      setSelectedImage(dataUri);

      const result = await imageBasedWasteSearch({ photoDataUri: dataUri });
      setSearchResult(result.description);
      toast({
        title: 'Image Analyzed',
        description: 'We found the following waste type. You can now search based on this description.',
      });
    } catch (error) {
      console.error('Image search failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the image. Please try another one.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Camera className="h-5 w-5" />
          <span className="sr-only">Search by Image</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search by Image</DialogTitle>
          <DialogDescription>
            Upload a photo of agricultural waste, and our AI will identify it for you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : selectedImage ? (
              <Image src={selectedImage} alt="Uploaded waste" layout="fill" objectFit="contain" className="rounded-lg" />
            ) : (
                <>
                    <FileUp className="w-8 h-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                </>
            )}
             <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
          </div>
          {searchResult && (
            <div className="p-4 border rounded-md bg-muted/50">
              <h4 className="font-semibold">Analysis Result:</h4>
              <p className="text-sm text-muted-foreground">{searchResult}</p>
            </div>
          )}
          <Button className="w-full" disabled={!searchResult || isLoading}>
            Search for &quot;{searchResult ? searchResult.split(',')[0] : '...'}&quot;
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
