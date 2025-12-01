
'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Weight, Route, ListFilter, Clock, Package, Star, AlertCircle, Calendar, Truck, CheckCircle, CircleDollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobDetailsDialog } from "@/components/dashboard/logistics/job-details-dialog";


const newJobs = [
    { 
        id: 'NJ001', 
        from: 'GreenFarms Inc., Punjab', 
        to: 'BioEnergy Corp, Haryana', 
        distance: 150,
        deliveryTime: '4 hours',
        deliveryWindow: 'Before 6 PM',
        type: 'Wheat Straw', 
        packageSize: 'Large',
        weight: 50,
        instructions: 'Handle with care',
        earning: 8000,
        incentive: 500
    },
    { 
        id: 'NJ002', 
        from: 'Heartland Organics, Iowa', 
        to: 'Central Biogas, Illinois', 
        distance: 320,
        deliveryTime: 'Overnight',
        deliveryWindow: 'Tomorrow 9 AM - 12 PM',
        type: 'Corn Stover', 
        packageSize: 'Heavy Load',
        weight: 100,
        instructions: 'Requires forklift at drop-off',
        earning: 12500,
        incentive: 0
    },
];

const activeJobs = [
    { id: 'AJ001', from: 'Sunshine Sugars, Florida', to: 'Gulf Power, Florida', type: 'Sugarcane Bagasse', qty: '500 tons', status: 'Picked Up' },
];

const completedJobs = [
    { id: 'CJ001', from: 'Delta Rice Co., Arkansas', to: 'Southern Renewables, Arkansas', type: 'Rice Husks', qty: '250 tons', earning: '₹15,000', date: '2024-05-28' },
];

const earningsSummary = {
    today: '₹3,500',
    pending: '₹22,300',
    acceptedJobs: 3,
    rating: 4.9
}

export default function LogisticsJobsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-headline">Job Marketplace</h1>

             <Card>
                <CardHeader>
                    <CardTitle>Your Performance</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-primary">{earningsSummary.today}</p>
                        <p className="text-sm text-muted-foreground">Today's Earnings</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{earningsSummary.pending}</p>
                        <p className="text-sm text-muted-foreground">Pending Payouts</p>
                    </div>
                     <div>
                        <p className="text-2xl font-bold">{earningsSummary.acceptedJobs}</p>
                        <p className="text-sm text-muted-foreground">Accepted Today</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <p className="text-2xl font-bold">{earningsSummary.rating}</p>
                        <Star className="h-6 w-6 text-yellow-400 ml-1" />
                        <p className="text-sm text-muted-foreground ml-2">Your Rating</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Available Jobs</h2>
                 <div className="flex items-center gap-2">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by distance" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="under-50">Under 50km</SelectItem>
                            <SelectItem value="50-100">50-100km</SelectItem>
                            <SelectItem value="over-100">Over 100km</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fee-desc">Highest Paying</SelectItem>
                            <SelectItem value="closest">Closest First</SelectItem>
                            <SelectItem value="newest">Latest Added</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                        <ListFilter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="new" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="new">New Jobs ({newJobs.length})</TabsTrigger>
                    <TabsTrigger value="active">My Deliveries ({activeJobs.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="new" className="grid md:grid-cols-2 gap-4 mt-4">
                    {newJobs.map(job => (
                       <Card key={job.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <span>Job #{job.id}</span>
                                    <Badge>{job.type}</Badge>
                                </CardTitle>
                                <div className="text-sm text-muted-foreground space-y-2 pt-2">
                                     <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> <strong>From:</strong> {job.from}</div>
                                     <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> <strong>To:</strong> {job.to}</div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3 text-sm">
                                <Separator />
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div className="flex items-center gap-2"><Route className="h-4 w-4 text-muted-foreground" /> {job.distance} km</div>
                                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> {job.deliveryTime}</div>
                                    <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /> {job.packageSize}</div>
                                    <div className="flex items-center gap-2"><Weight className="h-4 w-4 text-muted-foreground" /> {job.weight} tons</div>
                                </div>
                                {job.instructions && <div className="flex items-start gap-2 text-amber-700"><AlertCircle className="h-4 w-4 mt-0.5" /> <div><strong>Instructions:</strong> {job.instructions}</div></div>}
                                 <Separator />
                                <div className="flex justify-between items-center">
                                    <div className="text-base">Delivery Fee: <span className="font-bold text-primary">₹{job.earning.toLocaleString()}</span></div>
                                    {job.incentive > 0 && <Badge variant="secondary">+ ₹{job.incentive} Peak Bonus</Badge>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <JobDetailsDialog job={job}>
                                     <Button className="w-full">View Details</Button>
                                </JobDetailsDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value="active" className="space-y-4 mt-4">
                     {activeJobs.map(job => (
                        <Card key={job.id}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Job #{job.id}</span>
                                    <Badge variant="secondary">{job.status}</Badge>
                                </CardTitle>
                                <CardDescription>
                                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> From: {job.from}</div>
                                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> To: {job.to}</div>
                                </CardDescription>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                    <Route className="h-16 w-16 text-muted-foreground" />
                                </div>
                                <Button variant="outline" className="w-full"><Route className="mr-2 h-4 w-4" /> Optimize Route</Button>
                             </CardContent>
                            <CardFooter className="grid grid-cols-2 gap-2">
                                <Button variant="outline"><Phone className="mr-2 h-4 w-4" /> Contact Seller</Button>
                                <Button><Truck className="mr-2 h-4 w-4" />Mark as Picked Up</Button>
                                <Button className="col-span-2"><CheckCircle className="mr-2 h-4 w-4" />Mark as Delivered</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value="completed" className="space-y-4 mt-4">
                     {completedJobs.map(job => (
                        <Card key={job.id}>
                            <CardHeader>
                                <CardTitle>Job #{job.id}</CardTitle>
                                <CardDescription className="flex items-center gap-2"><Calendar className="h-4 w-4" />{job.date}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-semibold">From:</span> {job.from}</p>
                                    <p><span className="font-semibold">To:</span> {job.to}</p>
                                    <p><span className="font-semibold">Waste:</span> {job.type} ({job.qty})</p>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Earning:</span>
                                        <span className="text-green-600 flex items-center gap-1"><CircleDollarSign className="h-4 w-4" />{job.earning}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

