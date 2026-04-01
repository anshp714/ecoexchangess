
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const totalEarnings = "₹85,750";
const upcomingPayout = "₹22,300";

const weeklyEarningsData = [
  { week: 'Week 1', earnings: 15000 },
  { week: 'Week 2', earnings: 22500 },
  { week: 'Week 3', earnings: 18000 },
  { week: 'Week 4', earnings: 30250 },
];

const settlementHistory = [
    { id: 'S001', date: '2024-05-25', amount: '₹15,000', status: 'Paid' },
    { id: 'S002', date: '2024-05-18', amount: '₹22,500', status: 'Paid' },
    { id: 'S003', date: '2024-05-11', amount: '₹18,000', status: 'Paid' },
];

export default function EarningsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-headline">Payments & Earnings</h1>
            
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Earnings (YTD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">{totalEarnings}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Next Upcoming Payout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{upcomingPayout}</p>
                        <p className="text-sm text-muted-foreground">Scheduled for June 5, 2024</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Earnings</CardTitle>
                    <CardDescription>Your earnings over the last four weeks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyEarningsData}>
                            <XAxis dataKey="week" />
                            <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Earnings"]} />
                            <Bar dataKey="earnings" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Past Settlements</CardTitle>
                        <CardDescription>Your history of received payouts.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Download All</Button>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Settlement ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {settlementHistory.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.id}</TableCell>
                                    <TableCell>{s.date}</TableCell>
                                    <TableCell>{s.amount}</TableCell>
                                    <TableCell className="text-green-600 font-semibold">{s.status}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
