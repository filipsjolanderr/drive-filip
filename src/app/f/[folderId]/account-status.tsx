import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AccountStatus() {
    const session = await auth();

    if (!session.userId) {
        return redirect("/sign-in");
    }

    return <div>
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
    </div>
}
