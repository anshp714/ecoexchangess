'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { mockPurchaseHistory, mockSpendByCategory } from '@/lib/data';
import { predictFuturePurchases, PredictFuturePurchasesOutput } from '@/ai/flows/predict-future-purchases';
import { useEffect, useState } from 'react';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const COLORS = ['#386641', '#6A994E', '#A7C957', '#F2E8CF', '#BC4749'];

export default function AnalyticsPage() {
  const [predictions, setPredictions] = useState<PredictFuturePurchasesOutput | null>(null);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(true);

  const totalSpend = mockSpendByCategory.reduce((acc, curr) => acc + curr.value, 0);
  const totalQuantity = mockPurchaseHistory.reduce((acc, curr) => acc + curr.quantity, 0);

  useEffect(() => {
    async function getPredictions() {
      setIsLoadingPredictions(true);
      try {
        const result = await predictFuturePurchases({ purchaseHistory: mockPurchaseHistory });
        setPredictions(result);
      } catch (error) {
        console.error("Failed to get predictions:", error);
      } finally {
        setIsLoadingPredictions(false);
      }
    }
    getPredictions();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Buyer Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <span className="text-2xl">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSpend.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all purchases
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items Purchased</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity} tons</div>
            <p className="text-xs text-muted-foreground">
              Total volume of waste acquired
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Monthly Purchase History</CardTitle>
            <CardDescription>Volume of waste purchased per month (in tons).</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockPurchaseHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleString('default', { month: 'short' })} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="var(--color-primary)" name="Quantity (tons)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
             <CardDescription>Breakdown of spending by waste type.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={mockSpendByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                   {mockSpendByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            AI-Powered Future Purchase Predictions
          </CardTitle>
          <CardDescription>
            Based on your purchase history, here are some items you might need soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPredictions ? (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Analyzing your purchase patterns...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {predictions?.predictions.map((prediction, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/50 space-y-3">
                  <h4 className="font-semibold text-lg">{prediction.item}</h4>
                  <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-medium text-primary">Prediction Confidence</span>
                         <span className="text-xs font-bold text-primary">{(prediction.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={prediction.confidence * 100} className="h-2" />
                   </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
