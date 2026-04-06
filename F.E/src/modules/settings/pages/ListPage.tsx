import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface MenuItem {
    id: string;
    label: string;
    path?: string;
}

interface MenuColumn {
    id: string;
    title: string;
    items: MenuItem[];
}

const menuData: MenuColumn[] = [
    {
        id: "product-settings",
        title: "Linh kiện & Phụ tùng",
        items: [
            { id: "product-categories", label: "Thiết lập danh mục", path: "/settings/categories" },
        ],
    },
    {
        id: "vehicle-settings",
        title: "Phương tiện",
        items: [
            { id: "vehicle-types", label: "Quản lý loại xe", path: "/settings/vehicle-types" },
        ],
    },
    {
        id: "system-settings",
        title: "Hệ thống",
        items: [
            { id: "system-configs", label: "Thiết lập hệ thống", path: "/settings/system-configs" },
        ],
    },
];

function ListPage() {
    const moduleName = "Thiết lập";
    document.title = moduleName;

    return (
        <div className="flex flex-col gap-3">
            <h2 className="title-module">{moduleName}</h2>
            <div className="grid grid-cols-4 gap-6">
                {menuData.map((column) => (
                    <div key={column.id} className="flex flex-col gap-2">
                        <h3 className="!text-sm text-gray-800 font-medium">
                            {column.title}
                        </h3>
                        <div className="flex flex-col gap-1">
                            {column.items.map((item) => (
                                <Link to={item.path || "/building"} key={item.id} className="text-sm flex items-end gap-4 !text-gray-500 group">
                                    <span className="text-sm group-hover:text-primary">{item.label}</span>
                                    <ArrowUpRightIcon className="w-3 h-3 mb-0.5 text-gray-500 group-hover:text-primary" />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListPage;
