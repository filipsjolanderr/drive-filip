"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FolderPlusIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useParams } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { SidebarMenuButton } from "~/components/ui/sidebar"
import { createFolder } from "~/server/actions"

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
})

interface NewFolderButtonProps {
    onFolderCreated: () => void
}

export function NewFolderButton({ onFolderCreated }: NewFolderButtonProps) {
    const [open, setOpen] = useState(false)
    const params = useParams()
    const currentFolderId = params.folderId as string

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(formData: FormData) {
        const result = await createFolder(formData.get('name') as string, Number(currentFolderId))
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Folder created successfully")
            onFolderCreated()
        }
        setOpen(false)
        form.reset()
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <SidebarMenuButton>
                    <FolderPlusIcon className="h-4 w-4" size={20} />
                    New Folder
                </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Form {...form}>
                    <form action={onSubmit} className="space-y-2">
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
    )
} 
