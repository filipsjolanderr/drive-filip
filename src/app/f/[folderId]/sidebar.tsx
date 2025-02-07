"use client"

import { Calendar, ChevronDown, FolderPlusIcon, Home, Inbox, LogOutIcon, PlusIcon, Search, Settings } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "~/components/ui/sidebar"
import { UploadButtonComponent } from "./upload-button"
import { redirect, useRouter } from "next/navigation";
import StorageProgress from "./storage-progress";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { Suspense, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { authClient } from "~/lib/auth-client";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { DarkModeToggle } from "~/app/f/[folderId]/dark-mode-toggle";
import { UserButton } from "~/components/auth/user-button";
import { NewFolderButton } from "./new-folder-button"
import { ProgressSkeleton } from "~/components/ui/progress-skeleton";

export function DriveSidebar({ progressComponent }: { progressComponent: React.ReactNode }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useRouter();

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    My Drive
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>My Drive</span>
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Upload Files</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <UploadButtonComponent
                                    onUploadComplete={() => {
                                        setDrawerOpen(false);
                                        navigate.refresh();
                                    }}
                                />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Create</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="flex items-center justify-start">
                                <NewFolderButton onFolderCreated={() => navigate.refresh()} />
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <DarkModeToggle />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-start gap-3">
                        <UserButton />
                        {progressComponent}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
