"use client";

import { LogOutIcon } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

export function SignOutButton() {
    return (
        <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => {
                authClient.signOut()
                redirect("/sign-in")
            }}
        >
            <LogOutIcon className="h-4 w-4 mr-2" />

            Sign Out
        </Button>
    );
} 
