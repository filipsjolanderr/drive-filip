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

export default function DriveClone() {
  const [currentFolder, setCurrentFolder] = useState<string>("root")
  const [breadcrumbs, setBreadcrumbs] = useState<FileItem[]>([mockFiles[0]])

  const getCurrentFiles = () => {
    return mockFiles.filter((file) => file.parent === currentFolder)
  }

  const handleFolderClick = (folder: FileItem) => {
    setCurrentFolder(folder.id)
    setBreadcrumbs([...breadcrumbs, folder])
  }

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
    setBreadcrumbs(newBreadcrumbs)
    setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1].id)
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
                  <BreadcrumbLink onClick={() => handleBreadcrumbClick(index)}>{item.name}</BreadcrumbLink>
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
          <DarkModeToggle></DarkModeToggle>
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
                    onClick={() => handleFolderClick(file)}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {file.name}
                  </button>
                ) : (
                  <a href={`#file-${file.id}`} className="flex items-center text-blue-500 hover:underline">
                    <File className="mr-2 h-4 w-4" />
                    {file.name}
                  </a>
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
