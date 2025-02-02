import "server-only";

import { db } from "~/server/db";
import {
    files_table,
    folders_table,
} from "~/server/db/schema";
import { eq, isNull, and, sum } from "drizzle-orm";

export const QUERIES = {
    getFolders: function (folderId: number) {
        return db
            .select()
            .from(folders_table)
            .where(eq(folders_table.parent, folderId))
            .orderBy(folders_table.id);
    },
    getFiles: function (folderId: number) {
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
                .selectDistinct()
                .from(folders_table)
                .where(eq(folders_table.id, currentId));

            if (!folder[0]) {
                throw new Error("Parent folder not found");
            }
            parents.unshift(folder[0]);
            currentId = folder[0]?.parent;
        }
        return parents;
    },
    getFolderById: async function (folderId: number) {
        const folder = await db
            .select()
            .from(folders_table)
            .where(eq(folders_table.id, folderId));
        return folder[0];
    },

    getRootFolderForUser: async function (userId: string) {
        const folder = await db
            .select()
            .from(folders_table)
            .where(
                and(eq(folders_table.ownerId, userId), isNull(folders_table.parent)),
            );
        return folder[0];
    },

    getStorageUsed: async function (userId: string) {
        const storageUsed = await db.select({ size: sum(files_table.size) }).from(files_table).where( eq(files_table.ownerId, userId));
        if (!storageUsed[0]) return 0;
        return Number(storageUsed[0].size);
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
        return await db.insert(files_table).values({
            ...input.file,
            ownerId: input.userId,
        });
    },

    onboardUser: async function (userId: string) {
        const rootFolder = await db
            .insert(folders_table)
            .values({
                name: "Root",
                parent: null,
                ownerId: userId,
            })
            .$returningId();

        const rootFolderId = rootFolder[0]!.id;

        await db.insert(folders_table).values([
            {
                name: "Trash",
                parent: rootFolderId,
                ownerId: userId,
            },
            {
                name: "Shared",
                parent: rootFolderId,
                ownerId: userId,
            },
            {
                name: "Documents",
                parent: rootFolderId,
                ownerId: userId,
            },
        ]);

        return rootFolderId;
    },
};
