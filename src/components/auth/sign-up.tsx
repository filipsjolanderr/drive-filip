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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { signIn, signUp } from "~/lib/auth-client";
import { SiGithub } from '@icons-pack/react-simple-icons'
import Image from "next/image";
import { Loader2, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="first-name">First name</Label>
                        <Input
                            id="first-name"
                            placeholder="Max"
                            required
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input
                            id="last-name"
                            placeholder="Robinson"
                            required
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                        />
                    </div>
                </div>
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
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
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
                <div className="space-y-1">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={showPasswordConfirmation ? "text" : "password"}
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            autoComplete="new-password"
                            placeholder="Confirm Password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        >
                            {showPasswordConfirmation ? (
                                <Eye className="h-4 w-4" />
                            ) : (
                                <EyeOff className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="image">Profile Image (optional)</Label>
                    <div className="flex items-end gap-4">
                        {imagePreview && (
                            <div className="relative w-16 h-16 rounded overflow-hidden">
                                <Image
                                    src={imagePreview}
                                    alt="Profile preview"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-2 w-full">
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full"
                            />
                            {imagePreview && (
                                <X
                                    className="cursor-pointer hover:text-muted-foreground"
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview(null);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <div className="flex flex-col w-full gap-2">
                    <Button
                        className="w-full"
                        disabled={loading}
                        onClick={async () => {
                            await signUp.email({
                                email,
                                password,
                                name: `${firstName} ${lastName}`,
                                image: image ? await convertImageToBase64(image) : "",
                                callbackURL: "/drive",
                                fetchOptions: {
                                    onResponse: () => setLoading(false),
                                    onRequest: () => setLoading(true),
                                    onError: (ctx: any) => {
                                        toast.error(ctx.error.message);
                                    },
                                    onSuccess: async () => router.push("/drive"),

                                },
                            });
                        }}
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            "Create an account"
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

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
