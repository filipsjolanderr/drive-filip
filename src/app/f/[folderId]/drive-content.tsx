"use client";

import React, { useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { FileRow, FolderRow } from "~/app/f/[folderId]/file-row"
import type { folders_table, files_table } from "~/server/db/schema"
import { UploadButton, UploadDropzone } from "../../../components/utils/uploadthing"
import { useRouter } from "next/navigation"
import { createFolder } from "~/server/actions";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FolderPlusIcon } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function DriveContent(props: {
  folders: typeof folders_table.$inferSelect[];
  files: typeof files_table.$inferSelect[];
  parents: typeof folders_table.$inferSelect[];
  currentFolderId: number;
}) {

  const [open, setOpen] = useState(false);

  const navigate = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createFolder(values.name, props.currentFolderId);
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
    <>
      <div className="flex justify-between items-center mb-4">

        <Breadcrumb>
          <BreadcrumbList>
            {props.parents.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/f/${folder.id}`}
                    className={
                      index === props.parents.length - 1
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {folder.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < props.parents.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center space-x-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FolderPlusIcon className="h-4 w-4" size={20} />
                New Folder
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
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.folders.map((folder) => (
            <FolderRow
              key={folder.id}
              folder={folder} />
          ))}
          {props.files.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </TableBody>
      </Table>
      <UploadButton
        endpoint="driveUploader"
        onClientUploadComplete={() => {
          navigate.refresh();
        }}
        input={{
          folderId: props.currentFolderId,
        }}
      />

    </>
  )
}
