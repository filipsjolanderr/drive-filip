import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { redirect } from "next/navigation";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface AuthSettingsProps {
    onClose?: () => void;
}

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function AuthSettings({ onClose }: AuthSettingsProps) {
    const session = authClient.useSession();
    const [sessions, setSessions] = useState<{
        id: string;
        deviceName: string;
        ip: string;
        expiresAt: string;
    }[]>([]);

    const form = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        const fetchSessions = async () => {
            const activeSessions = await authClient.multiSession.listDeviceSessions()
            setSessions(activeSessions?.data?.map((session: any) => ({
                id: session.session.id,
                deviceName: session.session.userAgent,
                ip: session.session.ipAddress,
                expiresAt: session.session.expiresAt
            })) ?? []);
        };
        fetchSessions();
    }, []);

    const handleDeleteAccount = async () => {
        await authClient.deleteUser();
        onClose?.();
        redirect("/");
    };

    const handlePasswordChange = async (data: PasswordFormData) => {
        try {
            await authClient.changePassword({
                newPassword: data.newPassword,
                currentPassword: data.currentPassword
            })
            form.reset();
            toast.success("Password updated successfully");

        } catch (error) {
            toast.error("Failed to update password");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage src={session?.data?.user?.image ?? ''} alt={session?.data?.user?.name ?? ''} />
                    <AvatarFallback>{session?.data?.user?.name?.[0] ?? '?'}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-medium">{session?.data?.user?.name}</h3>

                    <p className="text-sm text-muted-foreground">{session?.data?.user?.email}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-medium">Password</h4>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Change Password</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                                Enter your new password below.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(handlePasswordChange)} className="space-y-4">
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Current Password"
                                        {...form.register("currentPassword")}
                                    />
                                    {form.formState.errors.currentPassword && (
                                        <p className="text-sm text-destructive">
                                            {form.formState.errors.currentPassword.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="New Password"
                                        {...form.register("newPassword")}
                                    />
                                    {form.formState.errors.newPassword && (
                                        <p className="text-sm text-destructive">
                                            {form.formState.errors.newPassword.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        {...form.register("confirmPassword")}
                                    />
                                    {form.formState.errors.confirmPassword && (
                                        <p className="text-sm text-destructive">
                                            {form.formState.errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-medium">Active Sessions</h4>

                {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="text-sm font-medium">{session.deviceName}</p>
                            <p className="text-sm text-muted-foreground">IP: {session.ip}</p>
                            <p className="text-sm text-muted-foreground">
                                Expires at: {new Date(session.expiresAt).toLocaleString()}
                            </p>
                        </div>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => authClient.multiSession.revoke({
                                sessionToken: session.id
                            })}
                        >
                            Revoke

                        </Button>

                    </div>
                ))}
            </div>

            <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-destructive mb-4">Danger Zone</h4>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount}>
                                Delete Account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
