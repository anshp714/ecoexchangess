
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentLocale } from '@/locales/client';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

export function LoginForm() {
    const router = useRouter();
    const locale = useCurrentLocale();
    const { toast } = useToast();
    const { login } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const loggedInUser = await login(email, password);
            if (loggedInUser) {
                toast({
                    title: "Logged In",
                    description: `Welcome back, ${loggedInUser.name}!`,
                });
                // Redirect based on role
                let dashboardUrl = `/${locale}/dashboard`;
                if (loggedInUser.role === 'seller') {
                    dashboardUrl = `/${locale}/dashboard/seller`;
                } else if (loggedInUser.role === 'logistics') {
                    dashboardUrl = `/${locale}/dashboard/logistics`;
                }
                router.push(dashboardUrl);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Invalid email or password.",
                });
                setIsLoading(false);
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "An unexpected error occurred.",
            });
            setIsLoading(false);
        }
    }

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold font-headline">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
             {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging In...</> : 'Log In'}
          </Button>
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account? <Link href={`/${locale}/signup`} className="text-primary hover:underline">Sign up</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
