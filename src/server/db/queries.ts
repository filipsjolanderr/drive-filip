import "server-only"; 

import { db } from "~/server/db";
import {
    files_table,
    folders_table,
    user_table,
} from "~/server/db/schema";

import { eq, isNull, and, sum } from "drizzle-orm";

export  const QUERIES = {
    getFolders: async function (folderId: number) {
        return db
            .select()
            .from(folders_table)
            .where(eq(folders_table.parent, folderId))
            .orderBy(folders_table.id);
    },
    getFiles: async function (folderId: number) {
        return db
            .select()
            .from(files_table)
            .where(eq(files_table.parent, folderId))
            .orderBy(files_table.id);
    },
    getAllParentsForFolder: async function (folderId: number) {
        const parents = [];
        let currentId: number | null = folderId;
        while (currentId !== null) {
            const folder = await db
                .select()
                .from(folders_table)
                .where(eq(folders_table.id, currentId))
                .limit(1);

            if (!folder[0]) {
                throw new Error("Parent folder not found");
            }
            parents.unshift(folder[0]);
            currentId = folder[0].parent;
        }
        return parents;
    },
    getFolderById: async function (folderId: number) {
        const folder = await db
            .select()
            .from(folders_table)
            .where(eq(folders_table.id, folderId))
            .limit(1);
        return folder[0];
    },

    getRootFolderForUser: async function (userId: string) {
        const folder = await db
            .select()
            .from(folders_table)
            .where(
                and(eq(folders_table.ownerId, userId), isNull(folders_table.parent)),
            )
            .limit(1);
        return folder[0];
    },

    getStorageUsed: async function (userId: string) {
        const storageUsed = await db
            .select({ size: sum(files_table.size) })
            .from(files_table)
            .where(eq(files_table.ownerId, userId));
        return Number(storageUsed[0]?.size ?? 0);
    },

    getEmailByUserId: async function (userId: string) {
        const email = await db
            .select()
            .from(user_table)
            .where(eq(user_table.id, userId));
        return email[0]?.email;
    },
};

export const MUTATIONS = {
    createFile: async function (input: {
        file: {
            name: string;
            size: number;
            url: string;
            key: string;
            extension: string;
            parent: number;
        };
        userId: string;
    }) {
        const result = await db
            .insert(files_table)
            .values({
                ...input.file,
                ownerId: input.userId,
            })
            .returning();
        return result[0];
    },

    onboardUser: async function (userId: string) {
        const [rootFolder] = await db
            .insert(folders_table)
            .values({
                name: "Root",
                parent: null,
                ownerId: userId,
            })
            .returning();

        if (!rootFolder) {
            throw new Error("Root folder not found");
        }

        await db.insert(folders_table).values([
            {
                name: "Trash",
                parent: rootFolder.id,
                ownerId: userId,

            },
            {
                name: "Shared",
                parent: rootFolder.id,
                ownerId: userId,
            },
            {
                name: "Documents",
                parent: rootFolder.id,
                ownerId: userId,
            },
        ]);

        return rootFolder.id;
    },
};
