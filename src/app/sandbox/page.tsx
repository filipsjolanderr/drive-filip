import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mockData";
import { folders_table, files_table } from "~/server/db/schema";


export default function SandboxPage() {
    return (
        <div className="flex flex-col gap-4">
            Seed function
            <form action={async () => {
                "use server";



                const folderInsert = await db.insert(folders_table).values(mockFolders.map((folder, index) => ({
                    id: index + 1,
                    name: folder.name,
                    ownerId: "1",
                    parent: index !== 0 ? 1 : null,
                })),
                );
                const fileInsert = await db.insert(files_table).values(mockFiles.map((file, index) => ({
                    id: index + 1,
                    name: file.name,
                    ownerId: "1",
                    size: 5000,
                    url: file.url,
                    parent: index % 3,
                })),
                );

                console.log(folderInsert);
                console.log(fileInsert);
            }}>
                <button type="submit">Seed</button>
            </form>
        </div>
    );
}
