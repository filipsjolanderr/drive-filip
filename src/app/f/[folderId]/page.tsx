
import { eq } from "drizzle-orm";
import DriveContent from "~/components/drive-content";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

async function getAllParents(folderId: number) {
    const parents = [];
    let currentFolderId: number | null = folderId;
    while (currentFolderId !== null) {
        const folder = await db.selectDistinct().from(folders_table).where(eq(folders_table.id, currentFolderId));

        if (!folder[0]) {
            throw new Error("Parent folder not found");
        }
        parents.push(folder[0]);
        currentFolderId = folder[0]?.parent;
    }
    return parents;
}

export default async function DrivePage(props: {
    params: Promise<{ folderId: string }>
}) {

    const params = await props.params;

    const parsedFolderId = parseInt(params.folderId);
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>;
    }
    const filesPromise = db.select().from(files_table).where(eq(files_table.parent, parsedFolderId));
    const foldersPromise = db.select().from(folders_table).where(eq(folders_table.parent, parsedFolderId));
    const parentsPromise = getAllParents(parsedFolderId);

    const [files, folders, parents] = await Promise.all([filesPromise, foldersPromise, parentsPromise]);

    return (
        <main className="min-h-screen bg-background">
            <DriveContent files={files} folders={folders} parents={parents.toReversed()}  />
        </main>
    );
}
