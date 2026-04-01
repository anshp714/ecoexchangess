
'use client'

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { analyzeWasteFromImage, type WasteAnalysisFromImageOutput } from '@/ai/flows/waste-analysis-from-image';
import { suggestPrice, type SuggestPriceOutput } from '@/ai/flows/price-suggestion';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Loader2, Sparkles, MapPin } from 'lucide-react';

type AIAnalysisState = WasteAnalysisFromImageOutput | null;
type AIPriceState = SuggestPriceOutput | null;

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export function NewListingForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [location, setLocation] = useState('');
    
    const [analysis, setAnalysis] = useState<AIAnalysisState>(null);
    const [priceSuggestion, setPriceSuggestion] = useState<AIPriceState>(null);

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setAnalysis(null);
        setPriceSuggestion(null);

        try {
            const dataUri = await fileToDataUri(file);
            setUploadedImage(dataUri);

            toast({ title: 'Analyzing image...', description: 'Our AI is estimating waste properties.' });
            const analysisResult = await analyzeWasteFromImage({ photoDataUri: dataUri });
            setAnalysis(analysisResult);
            toast({ title: 'Analysis complete!', description: `Confidence: ${(analysisResult.confidenceScore * 100).toFixed(0)}%` });

            toast({ title: 'Suggesting price...', description: 'Considering market data for similar waste.' });
            const priceResult = await suggestPrice({
                wasteType: analysisResult.wasteType,
                quality: analysisResult.quality,
                calorificValue: analysisResult.calorificValue,
            });
            setPriceSuggestion(priceResult);
            toast({ title: 'Price suggested!', description: `Confidence: ${(priceResult.confidenceScore * 100).toFixed(0)}%` });

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'AI Analysis Failed', description: 'Please try another image or enter details manually.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            toast({ variant: 'destructive', title: 'Geolocation Not Supported', description: 'Your browser does not support geolocation.' });
            return;
        }

        setIsFetchingLocation(true);
        toast({ title: 'Fetching location...' });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        setLocation(data.display_name);
                        toast({ title: 'Location found!', description: 'Location has been filled in.' });
                    } else {
                        throw new Error('Could not find address.');
                    }
                } catch (error) {
                    toast({ variant: 'destructive', title: 'Could not fetch address', description: 'Please enter your location manually.' });
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                let description = 'An unknown error occurred.';
                if (error.code === 1) {
                    description = 'Please allow location access in your browser settings.'
                } else if (error.code === 2) {
                    description = 'Location information is unavailable.'
                }
                toast({ variant: 'destructive', title: 'Geolocation Failed', description });
                setIsFetchingLocation(false);
            }
        );
    };

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Listing Details</CardTitle>
                        <CardDescription>Provide information about your agricultural waste.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Listing Title</Label>
                            <Input id="title" placeholder="e.g., High-Quality Wheat Straw Bales" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Describe the waste, its condition, and potential uses." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input id="quantity" type="number" placeholder="50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity-unit">Unit</Label>
                                <Input id="quantity-unit" placeholder="tons" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="flex gap-2">
                                <Input id="location" placeholder="City, State, Country" value={location} onChange={(e) => setLocation(e.target.value)} />
                                <Button variant="outline" size="icon" onClick={handleFetchLocation} disabled={isFetchingLocation}>
                                    {isFetchingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                                    <span className="sr-only">Fetch Location</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" /> AI Analysis
                        </CardTitle>
                        <CardDescription>Upload an image for automated analysis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg">
                            {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-primary" />
                             : uploadedImage ? <Image src={uploadedImage} alt="Uploaded waste" layout="fill" objectFit="contain" className="rounded-lg" />
                             : <>
                                 <FileUp className="w-8 h-8 text-muted-foreground" />
                                 <p className="mt-2 text-sm text-center text-muted-foreground">Upload an image to start AI analysis</p>
                               </>
                            }
                            <Input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isLoading} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="waste-type">Waste Type</Label>
                                <Input id="waste-type" placeholder="e.g., Corn Stover" defaultValue={analysis?.wasteType} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="quality">Quality</Label>
                                <Input id="quality" placeholder="e.g., Dry, clean" defaultValue={analysis?.quality} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="calorific-value">Calorific Value</Label>
                            <Input id="calorific-value" placeholder="e.g., 16 MJ/kg" defaultValue={analysis?.calorificValue} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="price">Price (INR)</Label>
                            <Input id="price" type="number" placeholder="8000" defaultValue={priceSuggestion?.suggestedPrice.toFixed(0)} />
                             {priceSuggestion && <p className="text-xs text-muted-foreground">AI suggestion: ₹{priceSuggestion.suggestedPrice.toFixed(0)} with {(priceSuggestion.confidenceScore * 100).toFixed(0)}% confidence.</p>}
                        </div>
                    </CardContent>
                </Card>
                <Button size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Publish Listing'}
                </Button>
            </div>
        </div>
    );
}
