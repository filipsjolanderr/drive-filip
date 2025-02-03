// Server Component
import { auth } from "@clerk/nextjs/server";
import { QUERIES } from "~/server/db/queries";
import { DriveSidebar } from "./sidebar";
import { Suspense } from "react";

export async function DriveSidebarWrapper({ currentFolderId }: { currentFolderId: number }) {
    const session = await auth();

    if (!session.userId) return null;

    const [storageUsed, storageTotal] = await Promise.all([
        QUERIES.getStorageUsed(session.userId),
        2147483648
    ]);

    return (
        <DriveSidebar
            currentFolderId={currentFolderId}
            storageUsed={storageUsed}
            storageTotal={storageTotal}
        />
    );
} 
