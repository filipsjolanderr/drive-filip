import { Suspense } from "react"
import { SidebarProvider } from "~/components/ui/sidebar"
import { DriveSidebar } from "./sidebar"
import StorageProgress from "./storage-progress"
import { DriveContentSkeleton } from "~/components/ui/drive-content-skeleton"
import { ProgressSkeleton } from "~/components/ui/progress-skeleton"

export const experimental_ppr = true

export default function DriveLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DriveSidebar
                progressComponent={
                    <Suspense fallback={<ProgressSkeleton />}>
                        <StorageProgress />
                    </Suspense>
                }
            />
            <div className="p-4 w-full">
                {children}
            </div>
        </SidebarProvider>
    )
}
