"use client"

import React, { useState } from "react"
import { mockFiles, mockFolders } from "../../mockData"
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

// Common interface for both files and folders
interface Item {
  id: string
  name: string
  parent?: string | null
}

function getBreadcrumbs(currentFolderId: string, items: Item[]): Item[] {
  const crumbs: Item[] = []
  let currentId: string | null = currentFolderId

  while (currentId) {
    const currentItem = items.find((item) => item.id === currentId)
    if (!currentItem) break

    crumbs.unshift(currentItem)
    currentId = currentItem.parent ?? null
  }

  return crumbs
}

export default function DriveClone() {
  const [currentFolder, setCurrentFolder] = useState<string>("root")

  // Use only folders for breadcrumbs
  const breadcrumbs = getBreadcrumbs(currentFolder, mockFolders)

  const getCurrentFiles = () => {
    return mockFiles.filter((file) => file.parent === currentFolder)
  }

  const getCurrentFolders = () => {
    return mockFolders.filter((folder) => folder.parent === currentFolder)
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId)
  }

  const handleBreadcrumbClick = (folderId: string) => {
    setCurrentFolder(folderId)
  }

  const handleUpload = () => {
    alert("Upload functionality would be implemented here")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.id}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => handleBreadcrumbClick(item.id)}
                    className={
                      index === breadcrumbs.length - 1
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {item.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center space-x-4">
          <Button onClick={handleUpload}>
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
          <DarkModeToggle />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getCurrentFolders().map((folder) => (
            <FolderRow
              key={folder.id}
              folder={folder}
              handleFolderClick={() => handleFolderClick(folder.id)}
            />
          ))}
          {getCurrentFiles().map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
