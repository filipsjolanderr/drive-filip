import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mockData";
import { folders_table, files_table } from "~/server/db/schema";
import { auth } from "~/lib/auth";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { headers } from "next/headers";

export default async function Sandbox() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user?.id) {
        throw new Error("User not found");

    }

    const folders = await db
        .select()
        .from(folders_table)
        .where(eq(folders_table.ownerId, session.user.id));


    console.log(folders);

    return (
        <div>
            <form
                action={async () => {
                    "use server";
                    const session = await auth.api.getSession({
                        headers: await headers()
                    });
                    if (!session?.user?.id) {
                        throw new Error("User not found");
                    }


                    const rootFolder = await db
                        .insert(folders_table)
                        .values({
                            name: "root",
                            ownerId: session.user.id,
                            parent: null,
                        })
                        .returning();


                    const insertableFolders = mockFolders.map((folder) => ({
                        name: folder.name,
                        ownerId: session.user.id,
                        parent: rootFolder[0]!.id,
                    }));
                    await db.insert(folders_table).values(insertableFolders);

                }}
            >
                <button type="submit">Create folders</button>
            </form>
        </div>
    );
}
