import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { copyToClipboard } from "../utils/copyToClipboard";
interface IProps {
    label: string,
    value: string | undefined | null,
    isCopyable?: boolean
    classNameLabel?: string
    classNameValue?: string
    className?: string
}
function ItemRow({ label, value, className, isCopyable, classNameLabel = "text-xs text-gray-500", classNameValue = "text-gray-900 font-semibold" }: IProps) {
    return (
        <div className={className}>
            <h3 className={classNameLabel}>{label}</h3>
            <div className="flex items-center gap-1">
                <p className={classNameValue}>{value ? value : "---"}</p>
                {(isCopyable && value) && (
                    <button type="button" className="hover:text-blue-700 text-gray-500 transition-colors" onClick={() => copyToClipboard(value)}>
                        <ClipboardDocumentIcon className="w-4 h-4 cursor-pointer mb-0.5" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default ItemRow;