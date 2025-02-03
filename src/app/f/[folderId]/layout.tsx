import { DriveSidebar } from "./sidebar";
import { SidebarProvider } from "~/components/ui/sidebar"
import { Suspense } from "react";
import { DriveSidebarWrapper } from "./sidebar-wrapper";
import { DriveContentSkeleton } from "./drive-content-skeleton";

export const experimental_ppr = true

export default async function DriveLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ folderId: string }> | { folderId: string }
}) {
    const resolvedParams = await params;
    const folderId = parseInt(resolvedParams.folderId);

    return (
        <SidebarProvider>
            <DriveSidebarWrapper currentFolderId={folderId} />
            <div className="p-4 w-full">
                <Suspense fallback={<DriveContentSkeleton />}>
                    {children}
                </Suspense>
            </div>
        </SidebarProvider>
    );
}
