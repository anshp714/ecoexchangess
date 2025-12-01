
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Truck, User, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";

const vehicles = [
    { id: 'V01', number: 'MH 12 AB 3456', driver: 'John Doe', status: 'Available' },
    { id: 'V02', number: 'KA 01 CD 7890', driver: 'Jane Smith', status: 'Busy' },
    { id: 'V03', number: 'TN 07 EF 1234', driver: 'N/A', status: 'Maintenance' },
];

const drivers = [
    { id: 'D01', name: 'John Doe', vehicle: 'V01', rating: 4.8 },
    { id: 'D02', name: 'Jane Smith', vehicle: 'V02', rating: 4.9 },
    { id: 'D03', name: 'Peter Jones', vehicle: 'N/A', rating: 4.5 },
];


export default function FleetManagementPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-headline">Fleet Management</h1>
                <div className="flex gap-2">
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle</Button>
                    <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Driver</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Truck /> Vehicles</CardTitle>
                        <CardDescription>Manage your fleet of vehicles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Number</TableHead>
                                    <TableHead>Assigned Driver</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.map(v => (
                                    <TableRow key={v.id}>
                                        <TableCell className="font-medium">{v.number}</TableCell>
                                        <TableCell>{v.driver}</TableCell>
                                        <TableCell>
                                            <Badge variant={v.status === 'Available' ? 'default' : v.status === 'Busy' ? 'secondary' : 'destructive'}>{v.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User /> Drivers</CardTitle>
                         <CardDescription>Manage your team of drivers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                          <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Rating</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drivers.map(d => (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-medium">{d.name}</TableCell>
                                        <TableCell>{d.vehicle}</TableCell>
                                        <TableCell className="flex items-center gap-1">{d.rating} <Star className="h-4 w-4 text-yellow-400" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
