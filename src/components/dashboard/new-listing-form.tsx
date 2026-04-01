
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
import { FileUp, Loader2, Sparkles, MapPin, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { saveListing } from '@/actions/listing';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [analysis, setAnalysis] = useState<AIAnalysisState>(null);
    const [priceSuggestion, setPriceSuggestion] = useState<AIPriceState>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        
        // Priority: Manual User Input (via formData) > AI state
        const listingData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            quantity: Number(formData.get('quantity')),
            unit: formData.get('quantity-unit') as string,
            location: location,
            wasteType: (formData.get('waste-type') as string) || analysis?.wasteType,
            quality: (formData.get('quality') as string) || analysis?.quality,
            calorificValue: (formData.get('calorific-value') as string) || analysis?.calorificValue,
            suggestedPriceInr: Number(formData.get('price')) || priceSuggestion?.suggestedPrice,
            aiConfidenceScore: priceSuggestion?.confidenceScore,
        };

        const result = await saveListing(listingData);
        if (result.success) {
             toast({ title: 'Listing Published!', description: 'Your listing has been successfully saved to the database.' });
        } else {
             toast({ variant: 'destructive', title: 'Failed to Publish', description: result.error });
        }

        setIsSubmitting(false);
    };

    const renderConfidenceBadge = (score: number | undefined) => {
        if (score === undefined) return null;
        const level = score > 0.8 ? 'High' : score > 0.5 ? 'Medium' : 'Low';
        const colorClass = score > 0.8 ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                         : score > 0.5 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                         : 'bg-red-500/10 text-red-500 border-red-500/20';
        
        return (
            <Badge variant="outline" className={cn("ml-2 font-medium px-2 py-0", colorClass)}>
                {level} Confidence
            </Badge>
        );
    };

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
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Listing Details</CardTitle>
                        <CardDescription>Provide information about your agricultural waste.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Listing Title</Label>
                            <Input id="title" name="title" placeholder="e.g., High-Quality Wheat Straw Bales" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Describe the waste, its condition, and potential uses." required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input id="quantity" name="quantity" type="number" placeholder="50" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity-unit">Unit</Label>
                                <Input id="quantity-unit" name="quantity-unit" placeholder="tons" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="flex gap-2">
                                <Input id="location" name="location" placeholder="City, State, Country" value={location} onChange={(e) => setLocation(e.target.value)} required />
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
                <Card className="border-primary/20 shadow-lg overflow-hidden bg-gradient-to-br from-background to-primary/5">
                    <CardHeader className="border-b border-primary/10">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Sparkles className="w-5 h-5 text-primary animate-pulse" /> 
                            AI Analysis
                        </CardTitle>
                        <CardDescription>Automated material estimation and pricing.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-6">
                        <div className="relative group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all hover:border-primary/50 hover:bg-primary/5 overflow-hidden">
                            {isLoading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                    <p className="text-sm font-medium animate-pulse">Running Vision AI...</p>
                                </div>
                            ) : uploadedImage ? (
                                <Image src={uploadedImage} alt="Uploaded waste" layout="fill" objectFit="cover" className="transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="flex flex-col items-center text-center p-4">
                                     <div className="p-3 bg-muted rounded-full mb-3">
                                        <FileUp className="w-6 h-6 text-muted-foreground" />
                                     </div>
                                     <p className="text-sm font-semibold">Drop photo here</p>
                                     <p className="text-xs text-muted-foreground mt-1">or click to browse from device</p>
                                </div>
                            )}
                            <Input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={isLoading} />
                        </div>
                        
                        <div className={cn("space-y-4 transition-all duration-500", !analysis && "opacity-50 grayscale")}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center">
                                        <Label htmlFor="waste-type" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Waste Type</Label>
                                        {analysis && <CheckCircle2 className="w-3 h-3 text-green-500 ml-1.5" />}
                                    </div>
                                    <Input id="waste-type" name="waste-type" placeholder="e.g., Corn Stover" defaultValue={analysis?.wasteType || ''} className="bg-background/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center">
                                        <Label htmlFor="quality" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Quality</Label>
                                        {analysis && <CheckCircle2 className="w-3 h-3 text-green-500 ml-1.5" />}
                                    </div>
                                    <Input id="quality" name="quality" placeholder="e.g., Dry, clean" defaultValue={analysis?.quality || ''} className="bg-background/50" />
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label htmlFor="calorific-value" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Calorific Value</Label>
                                <Input id="calorific-value" name="calorific-value" placeholder="e.g., 16 MJ/kg" defaultValue={analysis?.calorificValue || ''} className="bg-background/50" />
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-primary/5">
                                <div className="flex items-center justify-between mb-1">
                                    <Label htmlFor="price" className="text-xs uppercase tracking-wider font-bold text-primary">Market Price Suggestion</Label>
                                    {renderConfidenceBadge(priceSuggestion?.confidenceScore)}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                                    <Input id="price" name="price" type="number" placeholder="8000" defaultValue={priceSuggestion?.suggestedPrice?.toFixed(0) || ''} className="pl-7 font-bold text-lg bg-primary/5 border-primary/30" />
                                </div>
                                {priceSuggestion && (
                                    <div className="flex gap-2 p-2.5 bg-background/50 rounded-lg border border-dashed border-primary/10 mt-2">
                                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <p className="text-[11px] leading-relaxed italic text-muted-foreground">
                                            {priceSuggestion.reasoning || "Based on current seasonal market rates found in our real-time database."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Button type="submit" size="lg" className="w-full" disabled={isLoading || isSubmitting}>
                    {isLoading || isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Publish Listing'}
                </Button>
            </div>
        </form>
    );
}
