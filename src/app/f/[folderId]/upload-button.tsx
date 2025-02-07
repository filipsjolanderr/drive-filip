"use client"

import { toast } from "sonner"
import { UploadButton } from "~/components/utils/uploadthing"
import { useParams } from "next/navigation"

interface UploadButtonComponentProps {
    onUploadComplete: () => void
}

export function UploadButtonComponent({ onUploadComplete }: UploadButtonComponentProps) {
    const params = useParams()
    const currentFolderId = params.folderId as string

    return (
        <UploadButton
            appearance={{
                button: "bg-sidebar-primary text-sidebar-primary-foreground shadow-none w-full",
                container: "pl-2 pr-2",
            }}
            endpoint="driveUploader"
            onClientUploadComplete={() => {
                toast.success("Files uploaded successfully!")
                onUploadComplete()
            }}
            onUploadError={(error: Error) => {
                toast.error(`Error uploading files: ${error.message}`)
            }}
            input={{
                folderId: Number(currentFolderId),
            }}
        />
    )
} 
