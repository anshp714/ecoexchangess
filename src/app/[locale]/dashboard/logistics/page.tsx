
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle, DollarSign, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const overviewStats = [
    { title: "Jobs Assigned Today", value: 5, icon: Truck },
    { title: "Active Deliveries", value: 2, icon: Truck, color: "text-blue-500" },
    { title: "Completed Deliveries", value: 12, icon: CheckCircle, color: "text-green-500" },
    { title: "Total Earnings", value: "₹15,250", icon: DollarSign, color: "text-primary" },
];

const notifications = [
    { id: 1, text: "New job available in Pune, MH.", time: "5m ago" },
    { id: 2, text: "Job #D5821 status updated to 'Delivered'.", time: "1h ago" },
    { id: 3, text: "Route for job #D5822 has been optimized.", time: "3h ago" },
];

export default function LogisticsDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-headline">Logistics Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {overviewStats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color || ''}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Next Pickup</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            {/* In a real app, this would be an interactive map component */}
                            <MapPin className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold">GreenFarms Inc.</p>
                            <p className="text-sm text-muted-foreground">123 Farm Lane, Punjab, IN</p>
                            <Button className="mt-2 w-full">View Details</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {notifications.map(notif => (
                            <div key={notif.id} className="flex items-start gap-3">
                                <div className="bg-primary/10 rounded-full p-2">
                                    <Bell className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm">{notif.text}</p>
                                    <p className="text-xs text-muted-foreground">{notif.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
