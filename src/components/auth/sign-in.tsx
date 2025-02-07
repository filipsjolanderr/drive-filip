"use client";

import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,

    CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signIn } from "~/lib/auth-client";
import { Key, Loader2, Eye, EyeOff } from "lucide-react";
import { SiGithub } from '@icons-pack/react-simple-icons'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);



    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/forget-password"
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            placeholder="Password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <Eye className="h-4 w-4" />
                            ) : (
                                <EyeOff className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        onClick={() => setRememberMe(!rememberMe)}
                    />
                    <Label htmlFor="remember">Remember me</Label>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <div className="flex flex-col w-full gap-2">
                    <Button
                        className="w-full"
                        disabled={loading}
                        onClick={async () => {
                            await signIn.email(
                                {
                                    email,
                                    password,
                                    callbackURL: "/drive",
                                    rememberMe,
                                },
                                {
                                    onRequest: () => setLoading(true),
                                    onResponse: () => setLoading(false),
                                    onError: (ctx: any) => {
                                        toast.error(ctx.error.message);
                                    },
                                }
                            );
                        }}

                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={async () => {
                            await signIn.social({
                                provider: "github",
                                callbackURL: "/drive",
                            });
                        }}
                    >
                        <SiGithub />
                        <span>Continue with GitHub</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
