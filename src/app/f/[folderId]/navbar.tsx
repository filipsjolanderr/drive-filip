import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "~/components/ui/navigation-menu"
import AccountStatus from "~/app/f/[folderId]/account-status";
import { DarkModeToggle } from "~/components/dark-mode-toggle";

export function Navbar() {
    return (
        <div className="flex justify-between items-center mb-4">
            <div></div>
            <NavigationMenu>
                <NavigationMenuList className="flex items-center space-x-4">
                    <NavigationMenuItem>
                        <AccountStatus />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <DarkModeToggle />
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
