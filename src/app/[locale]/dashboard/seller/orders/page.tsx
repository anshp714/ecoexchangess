
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockOrders } from '@/lib/data';
import type { Order } from '@/lib/data';

export default function SellerOrdersPage() {

  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Shipped':
        case 'Processing':
            return 'secondary';
        case 'Delivered':
            return 'default';
        case 'Cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
  }

  const renderOrdersTable = (orders: Order[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.product}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
            </TableCell>
            <TableCell className="text-right">₹{order.amount.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const filteredOrders = (status: Order['status']) => mockOrders.filter(o => o.status === status);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Manage Orders</h1>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="p-4 border-b">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="Processing">Processing</TabsTrigger>
                    <TabsTrigger value="Shipped">Shipped</TabsTrigger>
                    <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                    <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="all" className="p-4">
                <CardTitle className="mb-4">All Orders</CardTitle>
                {renderOrdersTable(mockOrders)}
            </TabsContent>
            <TabsContent value="Processing" className="p-4">
                 <CardTitle className="mb-4">Processing Orders</CardTitle>
                {renderOrdersTable(filteredOrders('Processing'))}
            </TabsContent>
             <TabsContent value="Shipped" className="p-4">
                <CardTitle className="mb-4">Shipped Orders</CardTitle>
                {renderOrdersTable(filteredOrders('Shipped'))}
            </TabsContent>
             <TabsContent value="Delivered" className="p-4">
                <CardTitle className="mb-4">Delivered Orders</CardTitle>
                {renderOrdersTable(filteredOrders('Delivered'))}
            </TabsContent>
            <TabsContent value="Cancelled" className="p-4">
                <CardTitle className="mb-4">Cancelled Orders</CardTitle>
                {renderOrdersTable(filteredOrders('Cancelled'))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
