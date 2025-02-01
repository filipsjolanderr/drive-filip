
import { eq } from "drizzle-orm";
import DriveContent from "~/components/drive-content";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

export default async function DrivePage(props: {
    params: Promise<{ folderId: string }>
}) {

    const params = await props.params;

    const parsedFolderId = parseInt(params.folderId);
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>;
    }
    const files = await db.select().from(files_table).where(eq(files_table.parent, parsedFolderId));
    const folders = await db.select().from(folders_table).where(eq(folders_table.parent, parsedFolderId));

    return (
        <main className="min-h-screen bg-background">
            <DriveContent files={files} folders={folders} />
        </main>
    );
}
