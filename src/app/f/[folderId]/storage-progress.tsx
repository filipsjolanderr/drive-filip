
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { Progress } from "~/components/ui/progress"
import formatFileSize from "~/lib/format-file-size";
import { QUERIES } from "~/server/db/queries";


export default async function StorageProgress() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) return redirect("/sign-in");

    const storageUsed = await QUERIES.getStorageUsed(session.user.id);
    const storageTotal = 2147483648;

    const percentage = (storageUsed / storageTotal) * 100;
    const used = formatFileSize(storageUsed);
    const total = formatFileSize(storageTotal);

    return (
        <div className="space-y-2">
            <Progress value={percentage} />
            <p className="text-xs text-muted-foreground">{used} of {total} used ({percentage.toFixed(2)}%)</p>
        </div>

    );
}
