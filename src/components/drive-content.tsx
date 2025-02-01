import React from "react"
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Upload } from "lucide-react"
import { DarkModeToggle } from "./dark-mode-toggle"
import { FileRow, FolderRow } from "~/app/file-row"
import type { folders_table, files_table } from "~/server/db/schema"
import Link from "next/link"

// Common interface for both files and folders

function getBreadcrumbs(currentFolderId: number, folders: typeof folders_table.$inferSelect[]): typeof folders_table.$inferSelect[] {
  const crumbs: typeof folders_table.$inferSelect[] = []
  let currentId: number | null = currentFolderId

  while (currentId) {
    const currentFolder = folders.find((folder) => folder.id === currentId)
    if (!currentFolder) break

    crumbs.unshift(currentFolder)
    currentId = currentFolder.parent ?? null
  }

  return crumbs
}

export default function DriveContent(props: {
  folders: typeof folders_table.$inferSelect[];
  files: typeof files_table.$inferSelect[];
  parents: typeof folders_table.$inferSelect[];
}) {

  return (
    <div className="container mx-auto p-4">
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
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
          <DarkModeToggle />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.folders.map((folder) => (
            <FolderRow
              key={folder.id}
              folder={folder}            />
          ))}
          {props.files.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
