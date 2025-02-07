"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { SidebarMenuButton } from "../../../components/ui/sidebar"
import { useState } from "react"

export function DarkModeToggle() {
    const { setTheme, theme } = useTheme()
    const [themeLabel, setThemeLabel] = useState("system")

    React.useEffect(() => {
        setThemeLabel(theme === "system" ? "System Theme" : theme === "light" ? "Light Theme" : "Dark Theme")
    }, [theme])



    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    {themeLabel}
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light Theme
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark Theme

                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System Theme
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
