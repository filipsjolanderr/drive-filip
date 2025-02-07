# Drive Filip

##TODO

- [x] fix folder deletion
- [x] fix folder creation
- [x] fix access control
- [ ] fix file view
- [x] fix toasts
- [ ] fix gray out
- [ ] ppr
- [ ] change to better auth

## Fun follow ups

### Folder deletions

Make sure you fetch all of the folders that have it as a parent, and their children too
### Folder creations
Make a server action that takes a name and parentId, and creates a folder with that name and parentId (don't forget to set the ownerId).
### Access control
Check if user is owner before showing the folder page.
### Make a "file view" page
You get the idea. Maybe check out my last tutorial?
### Toasts!
### Gray out a row while it's being deleted


import { auth } from "~/lib/auth";
import { redirect } from "next/navigation";
import StorageProgress from "./storage-progress";
import { authClient } from "~/lib/auth-client";


export default async function UserAndStorage() {

    const {
        data: session,
        isPending, //loading state
        error //error object
    } = authClient.useSession() 
    if (!session?.user?.id) return redirect("/sign-in");
    const storageUsed = await QUERIES.getStorageUsed(session.user.id);
    const storageTotal = 2147483648;


    return (
        <>
            <p>{session.user.email}</p>
            <div className="flex-grow justify-start">
                <StorageProgress
                    storageUsed={storageUsed}
                    storageTotal={storageTotal}
                />
            </div>
        </>
    )
}
