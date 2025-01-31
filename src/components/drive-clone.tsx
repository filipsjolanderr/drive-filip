"use client"

import React, { useState } from "react"
import { type FileItem, mockFiles } from "../../mockData"
import { Button } from "~/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Folder, File, Upload } from "lucide-react"
import { DarkModeToggle } from "./dark-mode-toggle"

function getBreadcrumbs(currentFolderId: string, files: FileItem[]): FileItem[] {
  const crumbs: FileItem[] = []
  let currentId: string | null = currentFolderId

  while (currentId) {
    const currentItem = files.find((file) => file.id === currentId)
    if (!currentItem) break

    crumbs.unshift(currentItem)
    currentId = currentItem.parent ?? null
  }

  return crumbs
}

export default function DriveClone() {
  const [currentFolder, setCurrentFolder] = useState<string>("root")
  const breadcrumbs = getBreadcrumbs(currentFolder, mockFiles)

  const getCurrentFiles = () => {
    return mockFiles.filter((file) => file.parent === currentFolder)
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
                    className={index === breadcrumbs.length - 1 ? "text-foreground" : "text-muted-foreground"}
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
          {getCurrentFiles().map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">
                {file.type === "folder" ? (
                  <button
                    className="flex items-center text-blue-500 hover:underline"
                    onClick={() => handleFolderClick(file.id)}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {file.name}
                  </button>
                ) : (
                  <div className="flex items-center">
                    <File className="mr-2 h-4 w-4" />
                    {file.name}
                  </div>
                )}
              </TableCell>
              <TableCell>{file.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
