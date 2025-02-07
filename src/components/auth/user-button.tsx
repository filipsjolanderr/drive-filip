import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { AuthSettings } from "./auth-settings"
import { authClient } from "~/lib/auth-client"
import { useState } from "react"
import { redirect } from "next/navigation"
import { LogOut, Settings } from "lucide-react"

function UserButton() {
    const session = authClient.useSession()
    const [showSettings, setShowSettings] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={session?.data?.user?.image ?? ''} alt={session?.data?.user?.name ?? ''} />
                            <AvatarFallback>{session?.data?.user?.name?.[0] ?? '?'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                        authClient.signOut()
                        redirect("/sign-in")
                    }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setShowSettings(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Account Settings</DialogTitle>
                    </DialogHeader>
                    <AuthSettings onClose={() => setShowSettings(false)} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export { UserButton }
