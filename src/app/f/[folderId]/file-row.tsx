import type { Folder, File } from "~/lib/mockData"
import { TableRow, TableCell } from "~/components/ui/table"
import { Folder as FolderIcon, FileIcon, Trash2Icon } from "lucide-react";
import { files_table, folders_table } from "~/server/db/schema";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile } from "~/server/actions";

export function FileRow(props: { file: (typeof files_table.$inferSelect) }) {

    const { file } = props
    return (
        <TableRow key={file.id}>
            <TableCell className="font-medium">
                <a href={file.url} target="_blank">
                    <div className="flex items-center text-blue-500 hover:underline">
                        <FileIcon className="mr-2 h-4 w-4" />
                        {file.name}
                    </div>
                </a>
            </TableCell>
            <TableCell>file</TableCell>
            <TableCell>{file.size}</TableCell>
            <TableCell className="text-right">
                <Button variant="ghost" onClick={() => deleteFile(file.id)}>
                    <Trash2Icon className="h-4 w-4" size={20} />
                </Button>
            </TableCell>

        </TableRow>
    )
}

export function FolderRow(props: { folder: (typeof folders_table.$inferSelect) }) {
    const { folder } = props
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
            <TableCell />
            <TableCell />
            <TableCell />

        </TableRow>
    )
}
