import type { Folder, File } from "~/lib/mockData"
import { TableRow, TableCell } from "~/components/ui/table"
import { Folder as FolderIcon, FileIcon, Trash2Icon } from "lucide-react";

export function FileRow(props: { file: File }) {

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
            <TableCell>{file.type}</TableCell>
            <TableCell>{file.size}</TableCell>
        </TableRow>
    )
}

export function FolderRow(props: { folder: Folder, handleFolderClick: () => void }) {
    const { folder, handleFolderClick } = props
    return (
        <TableRow key={folder.id}>
            <TableCell className="font-medium">
                <button
                    className="flex items-center"
                    onClick={() => handleFolderClick()}
                >
                    <FolderIcon className="mr-2 h-4 w-4" />
                    {folder.name}
                </button>
            </TableCell>
            <TableCell>{folder.type}</TableCell>
            <TableCell>
            </TableCell>

        </TableRow>
    )
}
