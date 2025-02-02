import formatFileSize from "~/lib/format-file-size";
import { Progress } from "~/components/ui/progress"
import { QUERIES } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function StorageProgress() {
    const session = await auth();
    if (!session.userId) return redirect("/sign-in");
    const storageUsed = await QUERIES.getStorageUsed(session.userId);
    const storageTotal = 2147483648;
    const storageUsedPercentage = (storageUsed / storageTotal) * 100;

    return (
            <div className="flex flex-col gap-1">
                <Progress value={storageUsedPercentage} />
                <div className="text-xs text-gray-500">
                    {formatFileSize(storageUsed)} / {formatFileSize(storageTotal)}
                </div>
            </div>
    )
}
