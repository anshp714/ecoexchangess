
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Route, Clock, Package, Weight, AlertCircle, Phone, Star, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Job = {
    id: string;
    from: string;
    to: string;
    distance: number;
    deliveryTime: string;
    deliveryWindow: string;
    type: string;
    packageSize: string;
    weight: number;
    instructions: string;
    earning: number;
    incentive: number;
};

export function JobDetailsDialog({ job, children }: { job: Job, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleAccept = () => {
        toast({
            title: 'Job Accepted!',
            description: `You have accepted job #${job.id}. It has been moved to "My Deliveries".`
        });
        setIsOpen(false);
    }
    
    const handleDecline = () => {
        setIsOpen(false);
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-start">
            Job Details: #{job.id} <Badge>{job.type}</Badge>
          </DialogTitle>
          <DialogDescription>
            Review the job details below before accepting.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Route Information</h4>
                    <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> <strong>From:</strong> {job.from}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> <strong>To:</strong> {job.to}</div>
                    </div>
                </div>
                 <Separator />
                <div>
                     <h4 className="font-semibold mb-2">Package Details</h4>
                    <div className="text-sm space-y-2">
                        <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /> <strong>Size:</strong> {job.packageSize}</div>
                        <div className="flex items-center gap-2"><Weight className="h-4 w-4 text-muted-foreground" /> <strong>Weight:</strong> {job.weight} tons</div>
                        {job.instructions && <div className="flex items-start gap-2 text-amber-700"><AlertCircle className="h-4 w-4 mt-0.5" /> <div><strong>Instructions:</strong> {job.instructions}</div></div>}
                    </div>
                </div>
                <Separator />
                <div>
                     <h4 className="font-semibold mb-2">Contact (Masked)</h4>
                    <div className="text-sm space-y-2">
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <strong>Seller:</strong> +91-XXXX-XXX-123</div>
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <strong>Buyer:</strong> +91-XXXX-XXX-456</div>
                    </div>
                </div>
            </div>
             <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-muted-foreground" />
                    {/* Placeholder for map preview */}
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Earnings</h4>
                    <div className="flex justify-between items-center text-lg">
                        <span>Delivery Fee</span>
                        <span className="font-bold text-primary">₹{job.earning.toLocaleString()}</span>
                    </div>
                    {job.incentive > 0 && (
                        <div className="flex justify-between items-center text-sm text-green-600 mt-1">
                            <span>Peak Hour Bonus</span>
                            <span className="font-bold">+ ₹{job.incentive.toLocaleString()}</span>
                        </div>
                    )}
                    <Separator className="my-2"/>
                     <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total Payout</span>
                        <span>₹{(job.earning + job.incentive).toLocaleString()}</span>
                    </div>
                </div>
             </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleDecline}><X className="mr-2 h-4 w-4" /> Decline</Button>
          <Button onClick={handleAccept}>Accept Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

