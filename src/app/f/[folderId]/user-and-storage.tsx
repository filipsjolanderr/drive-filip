import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { QUERIES } from "~/server/db/queries";
import StorageProgress from "./storage-progress";

export default async function UserAndStorage() {

    const session = await auth();
    if (!session.userId) return redirect("/sign-in");
    const storageUsed = await QUERIES.getStorageUsed(session.userId);
    const storageTotal = 2147483648;

    return (
        <>
            <UserButton />
            <div className="flex-grow justify-start">
                <StorageProgress
                    storageUsed={storageUsed}
                    storageTotal={storageTotal}
                />
            </div>
        </>
    )
}
