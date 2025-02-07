import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { auth } from "~/lib/auth";
import { MUTATIONS, QUERIES } from "~/server/db/queries";


const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    driveUploader: f({
        blob: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "1GB",
            maxFileCount: 100,
        },
    })
        .input(
            z.object({
                folderId: z.number(),
            }),
        )
        // Set permissions and file types for this FileRoute
        .middleware(async ({ input }) => {
            // This code runs on your server before upload
            const session = await auth.api.getSession({
                headers: await headers()
            })



            // If you throw, the user will not be able to upload
            if (!session?.user.id) throw new UploadThingError("Unauthorized");



            const folder = await QUERIES.getFolderById(input.folderId);

            if (!folder) throw new UploadThingError("Folder not found");

            if (folder.ownerId !== session.user.id)
                throw new UploadThingError("Unauthorized");



            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id, parentId: input.folderId };


        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);

            await MUTATIONS.createFile({
                file: {
                    name: file.name,
                    size: file.size,
                    url: file.url,
                    key: file.key,
                    extension: file.type,
                    parent: metadata.parentId,
                },
                userId: metadata.userId,
            });

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
