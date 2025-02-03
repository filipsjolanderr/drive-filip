"use client"

import { Progress } from "~/components/ui/progress"

interface StorageProgressProps {
    storageUsed: number;
    storageTotal: number;
}

export default function StorageProgress({ storageUsed, storageTotal }: StorageProgressProps) {
    const percentage = (storageUsed / storageTotal) * 100;
    const usedGB = (storageUsed / 1024 / 1024 / 1024).toFixed(1);
    const totalGB = (storageTotal / 1024 / 1024 / 1024).toFixed(1);

    return (
        <div className="space-y-2">
            <Progress value={percentage} />
            <p className="text-sm text-muted-foreground">
                {usedGB} GB of {totalGB} GB used
            </p>
        </div>
    );
}
