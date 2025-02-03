"use client"

import { Calendar, ChevronDown, FolderPlusIcon, Home, Inbox, PlusIcon, Search, Settings } from "lucide-react"
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
import { UploadButton, UploadDropzone } from "~/components/utils/uploadthing";
import { useRouter } from "next/navigation";
import StorageProgress from "./storage-progress";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner";
import { Suspense, useState } from "react";
import { createFolder } from "~/server/actions";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import UserAndStorage from "./user-and-storage";


// Menu items.
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]


const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
});

interface DriveSidebarProps {
    currentFolderId: number;
    storageUsed: number;
    storageTotal: number;
}

export function DriveSidebar({ currentFolderId, storageUsed, storageTotal }: DriveSidebarProps) {
    const [open, setOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await createFolder(values.name, currentFolderId);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Folder created successfully");
        }
        setOpen(false);
        form.reset();
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    Select Drive
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
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Filip Drive</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                                    <DrawerTrigger asChild>
                                        <SidebarMenuButton>
                                            <PlusIcon className="h-4 w-4" size={20} />
                                            Upload Files
                                        </SidebarMenuButton>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>Upload Files</DrawerTitle>
                                        </DrawerHeader>
                                        <div className="pr-4 pl-4 pb-4">
                                            <UploadDropzone
                                                endpoint="driveUploader"
                                                onClientUploadComplete={() => {
                                                    toast.success("Files uploaded successfully!");
                                                    setDrawerOpen(false);
                                                    navigate.refresh();
                                                }}
                                                onUploadError={(error: Error) => {
                                                    toast.error(`Error uploading files: ${error.message}`);
                                                }}
                                                input={{
                                                    folderId: currentFolderId,
                                                }}
                                            />
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </SidebarMenuItem>
                            <SidebarMenuItem className="flex items-center justify-start">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <SidebarMenuButton>
                                            <FolderPlusIcon className="h-4 w-4" size={20} />
                                            New Folder
                                        </SidebarMenuButton>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="New Folder" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit">Create</Button>
                                            </form>
                                        </Form>
                                    </PopoverContent>
                                </Popover>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-start gap-3">
                        <Suspense fallback={<div className="h-4 bg-muted rounded w-full" />}>
                            <UserAndStorage />
                        </Suspense>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
