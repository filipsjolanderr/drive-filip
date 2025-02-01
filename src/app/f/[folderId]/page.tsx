import { z } from "zod";
import DriveContent from "~/app/f/[folderId]/drive-content";
import { QUERIES } from "~/server/db/queries";

export default async function DrivePage(props: {
    params: Promise<{ folderId: string }>
}) {
    const params = await props.params;

    const { data, success } = z
        .object({
            folderId: z.coerce.number(),
        })
        .safeParse(params);

    if (!success) return <div>Invalid folder ID</div>;

    const parsedFolderId = data.folderId;
    const [folders, files, parents] = await Promise.all([
        QUERIES.getFolders(parsedFolderId),
        QUERIES.getFiles(parsedFolderId),
        QUERIES.getAllParentsForFolder(parsedFolderId),
    ]);

    return (
        <DriveContent
            files={files}
            folders={folders}
            parents={parents}
            currentFolderId={parsedFolderId}
        />
    );
}
