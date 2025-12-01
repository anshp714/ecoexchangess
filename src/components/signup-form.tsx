
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentLocale } from '@/locales/client';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import type { UserRole } from "@/context/UserContext";

export function SignupForm() {
    const router = useRouter();
    const locale = useCurrentLocale();
    const { toast } = useToast();
    const { signup } = useUser();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('seller');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newUser = await signup(name, email, password, role);
            if (newUser) {
                toast({
                    title: "Account Created",
                    description: "You have successfully signed up.",
                });
                
                // Redirect based on role
                let dashboardUrl = `/${locale}/dashboard`;
                if (newUser.role === 'seller') {
                    dashboardUrl = `/${locale}/dashboard/seller`;
                } else if (newUser.role === 'logistics') {
                    dashboardUrl = `/${locale}/dashboard/logistics`;
                }
                router.push(dashboardUrl);
            }
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Signup Failed",
                description: error.message || "An unexpected error occurred.",
            });
            setIsLoading(false);
        }
    }

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold font-headline">Create an Account</CardTitle>
        <CardDescription>Join our community of sustainable partners</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label>I am a...</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seller" id="role-seller" />
                <Label htmlFor="role-seller">Seller</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buyer" id="role-buyer" />
                <Label htmlFor="role-buyer">Buyer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="logistics" id="role-logistics" />
                <Label htmlFor="role-logistics">Logistics Partner</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</> : 'Create Account'}
          </Button>
          <div className="text-sm text-muted-foreground">
            Already have an account? <Link href={`/${locale}/login`} className="text-primary hover:underline">Log in</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
