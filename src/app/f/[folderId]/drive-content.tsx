"use client";

import React from "react"
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
import { SidebarTrigger } from "~/components/ui/sidebar";


export default function DriveContent(props: {
  folders: typeof folders_table.$inferSelect[];
  files: typeof files_table.$inferSelect[];
  parents: typeof folders_table.$inferSelect[];
  currentFolderId: number;
}) {

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
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
    </>
  )
}
