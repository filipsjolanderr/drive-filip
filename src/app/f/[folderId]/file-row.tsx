import { TableRow, TableCell } from "~/components/ui/table"
import { Folder as FolderIcon, FileIcon, Trash2Icon, PencilIcon } from "lucide-react";
import { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolder, renameFile, renameFolder } from "~/server/actions";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { toast } from "sonner";
import formatFileSize from "~/lib/format-file-size";

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
});

export function FileRow(props: { file: (typeof files_table.$inferSelect) }) {
    const { file } = props
    const [open, setOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: file.name,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await renameFile(file.key, values.name);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast("File renamed successfully");
        }
        setOpen(false);
        form.reset({ name: values.name });
    }

    const handleDelete = async () => {
        const result = await deleteFile(file.key);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("File deleted successfully");
        }
        setShowDeleteDialog(false);
    };


    return (
        <TableRow key={file.id}>
            <TableCell className="font-medium">
                <a href={file.url} target="_blank">
                    <div className="flex items-center hover:underline">
                        <FileIcon className="mr-2 h-4 w-4" />
                        {file.name}
                    </div>
                </a>
            </TableCell>
            <TableCell>{file.extension.charAt(0).toUpperCase() + file.extension.slice(1)}</TableCell>
            <TableCell>{formatFileSize(file.size)}</TableCell>
            <TableCell>{file.createdAt.toLocaleTimeString() + " " + file.createdAt.toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost">
                            <PencilIcon className="h-4 w-4" />
                        </Button>
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
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Rename</Button>
                            </form>
                        </Form>
                    </PopoverContent>
                </Popover>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                        <Button variant="ghost">
                            <Trash2Icon className="h-4 w-4" size={20} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete file "{file.name}"</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{file.name}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    )
}

export function FolderRow(props: { folder: (typeof folders_table.$inferSelect) }) {
    const { folder } = props
    const [open, setOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: folder.name,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await renameFolder(folder.id, values.name);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Folder renamed successfully");
        }
        setOpen(false);
        form.reset({ name: values.name });
    }

    const handleDelete = async () => {
        const result = await deleteFolder(folder.id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Folder deleted successfully");
        }
        setShowDeleteDialog(false);
    };

    return (
        <TableRow key={folder.id}>
            <TableCell className="font-medium">
                <Link
                    className="flex items-center"
                    href={`/f/${folder.id}`}
                >
                    <FolderIcon className="mr-2 h-4 w-4" />
                    {folder.name}
                </Link>
            </TableCell>
            <TableCell>Folder</TableCell>
            <TableCell />
            <TableCell>{folder.createdAt.toLocaleTimeString() + " " + folder.createdAt.toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost">
                            <PencilIcon className="h-4 w-4" />
                        </Button>
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
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Rename</Button>
                            </form>
                        </Form>
                    </PopoverContent>
                </Popover>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                        <Button variant="ghost">
                            <Trash2Icon className="h-4 w-4" size={20} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete folder "{folder.name}"</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{folder.name}"? This action cannot be undone and will delete all files and folders inside this folder.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    )
}
