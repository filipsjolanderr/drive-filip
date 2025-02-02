"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { toast } from "sonner";

const utApi = new UTApi();

export async function deleteFile(key: string) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    try {
        const [file] = await db
            .select()
            .from(files_table)
            .where(
                and(eq(files_table.key, key), eq(files_table.ownerId, session.userId)),
            );

        if (!file) {
            return { error: "File not found" };
        }

        await utApi.deleteFiles(key);
        await db.delete(files_table)
            .where(and(eq(files_table.key, key), eq(files_table.ownerId, session.userId)));

        const c = await cookies();
        c.set("force-refresh", JSON.stringify(Math.random()));

        return { success: true, message: "File deleted successfully" };
    } catch (error) {
        return { error: "Failed to delete file" };
    }
}

export async function createFolder(name: string, parentId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    const newFolder = await db.insert(folders_table).values({
        name,
        parent: parentId,
        ownerId: session.userId,
    });

    console.log(newFolder);

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

export async function renameFolder(folderId: number, newName: string) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    const [folder] = await db.select().from(folders_table).where(and(eq(folders_table.id, folderId), eq(folders_table.ownerId, session.userId)));

    if (!folder) {
        return { error: "Folder not found" };
    }

    const dbUpdateResult = await db.update(folders_table).set({
        name: newName,
    }).where(and(eq(folders_table.id, folderId), eq(folders_table.ownerId, session.userId)));

    console.log(dbUpdateResult);

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

export async function renameFile(key: string, newName: string) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    const [file] = await db.select().from(files_table).where(eq(files_table.key, key));

    if (!file) {
        return { error: "File not found" };
    }

    const dbUpdateResult = await db.update(files_table).set({
        name: newName,
    }).where(eq(files_table.key, key));

    const utapiResult = await utApi.renameFiles({
        fileKey: key,
        newName: newName,
    });

    console.log(utapiResult);

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));


    console.log(dbUpdateResult);

    return { success: true };
}

export async function deleteFolder(folderId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    // Verify user owns the folder
    const [folder] = await db.select().from(folders_table).where(
        and(eq(folders_table.id, folderId), eq(folders_table.ownerId, session.userId))
    );

    if (!folder) {
        return { error: "Folder not found or unauthorized" };
    }

    // Get all subfolder IDs recursively (including the folder itself) that are owned by the user
    const [result] = await db.execute(sql`
        WITH RECURSIVE subfolders AS (
            SELECT id 
            FROM ${folders_table} 
            WHERE id = ${folderId} AND owner_id = ${session.userId}
            UNION ALL
            SELECT f.id 
            FROM ${folders_table} f
            INNER JOIN subfolders s ON f.parent = s.id
            WHERE f.owner_id = ${session.userId}
        )
        SELECT id FROM subfolders
    `);

    // Extract IDs from query result
    // Handle result properly
    let allFolderIds: number[] = [];
    if (Array.isArray(result)) {
        allFolderIds = result.map((row: { id: number }) => row.id);
        console.log("All subfolder IDs: ", allFolderIds);
    } else {
        console.error('Unexpected result format:', result);
    }

    // Get all files in these folders
    const filesToDelete = await db.select().from(files_table)
        .where(inArray(files_table.parent, allFolderIds));

    console.log("Files to delete: ", filesToDelete);

    // Delete files from storage
    if (filesToDelete.length > 0) {
        const fileKeys = filesToDelete.map(file => file.key);
        await utApi.deleteFiles(fileKeys);
    }

    // Delete folders from database
    await db.delete(folders_table).where(inArray(folders_table.id, allFolderIds));

    // Delete files from database
    await db.delete(files_table).where(inArray(files_table.parent, allFolderIds));

    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}
