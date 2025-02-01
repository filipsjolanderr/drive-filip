
import DriveContent from "~/app/f/[folderId]/drive-content";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

export default async function HomePage() {
  const files = await db.select().from(files_table);
  const folders = await db.select().from(folders_table);

  return (
    <main className="min-h-screen bg-background">
      <p>test</p>
    </main>
  );
}
