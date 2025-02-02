import formatFileSize from "~/lib/format-file-size";
import { Progress } from "~/components/ui/progress"


export default function StorageProgress(props: { storageUsed: number, storageTotal: number }) {
    const storageUsed = props.storageUsed;
    const storageTotal = props.storageTotal;
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
