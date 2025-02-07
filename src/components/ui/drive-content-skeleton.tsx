import { Skeleton } from "~/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

export function DriveContentSkeleton() {
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8" /> {/* Sidebar trigger skeleton */}
                    <Skeleton className="h-6 w-48" /> {/* Breadcrumb skeleton */}
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
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">
                                <div className="flex items-center">
                                    <Skeleton className="mr-2 h-4 w-4" /> {/* File/Folder icon */}
                                    <Skeleton className="h-4 w-[200px]" /> {/* Name */}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-16" /> {/* Type */}
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-12" /> {/* Size */}
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-32" /> {/* Date */}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Skeleton className="h-8 w-8" /> {/* Edit button */}
                                    <Skeleton className="h-8 w-8" /> {/* Delete button */}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
} 
