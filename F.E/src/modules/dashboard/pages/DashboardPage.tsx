import { ArrowUpIcon, ChartBarIcon, ChevronRightIcon, CubeIcon, ShoppingBagIcon, CogIcon, UserIcon, CheckCircleIcon, ClipboardDocumentListIcon, UsersIcon } from "@heroicons/react/24/outline";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/plugin/quarterOfYear";
import { useState } from "react";
import { Select, Steps, Empty } from "antd";
import { RevenueChart } from "../components";
import { formatVND } from "../../../core/utils/formatVND";
import { useDashboardQuery } from "../useQuery";

type ActivityType = "task" | "system" | "project";

const ACTIVITY_CONFIG: Record<ActivityType, { icon: React.ReactNode; color: string; bgColor: string }> = {
    task: {
        icon: <CheckCircleIcon className="w-4 h-4" />,
        color: "text-green-600",
        bgColor: "bg-green-100",
    },
    system: {
        icon: <CogIcon className="w-4 h-4" />,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
    },
    project: {
        icon: <ClipboardDocumentListIcon className="w-4 h-4" />,
        color: "text-primary",
        bgColor: "bg-primary/10",
    },
};

type DateRange = [Dayjs, Dayjs];

type DatePreset = {
    label: string;
    value: string;
    range: DateRange;
};

const DATE_PRESETS: DatePreset[] = [
    {
        label: "Hôm nay",
        value: "today",
        range: [dayjs().startOf("day"), dayjs().endOf("day")],
    },
    {
        label: "7 ngày trước",
        value: "7days",
        range: [dayjs().subtract(7, "day"), dayjs()],
    },
    {
        label: "Tháng này",
        value: "thisMonth",
        range: [dayjs().startOf("month"), dayjs().endOf("month")],
    },
];

function DashboardPage() {
    const [range, setRange] = useState<DateRange | null>(DATE_PRESETS[0].range);
    const [activityFilter, setActivityFilter] = useState<string>("all");

    const handleChange = (value: string) => {
        const preset = DATE_PRESETS.find((i) => i.value === value);
        if (preset) {
            setRange(preset.range);
        }
    };

    const activityFilterOptions = [
        { label: "Tất cả", value: "all" },
        { label: "Công việc", value: "task" },
        { label: "Dự án", value: "project" },
        { label: "Hệ thống", value: "system" },
    ];

    // Hook fetching data
    const queryParams = {
        startDate: range ? range[0].toISOString() : undefined,
        endDate: range ? range[1].toISOString() : undefined,
    };
    const { data: dashboardData, isLoading } = useDashboardQuery.useGetStatistics(queryParams);

    const stats = {
        active_projects: dashboardData?.data?.active_projects ?? dashboardData?.active_projects ?? 0,
        tasks_completed: dashboardData?.data?.tasks_completed ?? dashboardData?.tasks_completed ?? 0,
        total_members: dashboardData?.data?.total_members ?? dashboardData?.total_members ?? 0,
    };

    // Hoạt động mới nhất để sau
    const activities: any[] = [];

    const cardFilter = [
        {
            title: "Dự án đang chạy",
            key: 1,
            value: stats.active_projects,
            icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
        },
        {
            title: "Công việc hoàn thành",
            key: 2,
            value: stats.tasks_completed,
            icon: <CheckCircleIcon className="w-5 h-5" />,
        },
        {
            title: "Tổng thành viên",
            key: 3,
            value: stats.total_members,
            icon: <UsersIcon className="w-5 h-5" />,
        },
    ];

    return (
        <div className="flex-1 w-full h-full grid grid-cols-12 gap-6 relative p-2">
            <div className="col-span-9 flex flex-col gap-6 pb-10">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                            Bảng điều khiển TaskFlow
                        </h3>
                        <p className="text-sm text-gray-500">Chào mừng trở lại! Dưới đây là tóm tắt công việc của bạn.</p>
                    </div>
                    {/* <Select
                        placeholder="Chọn thời gian"
                        style={{ width: 140 }}
                        value={DATE_PRESETS.find((i) => i?.range === range)?.value}
                        options={DATE_PRESETS.map((i) => ({
                            label: i.label,
                            value: i.value,
                        }))}
                        onChange={handleChange}
                        className="custom-select"
                    /> */}
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-3 gap-6">
                    {cardFilter.map((item) => (
                        <div
                            key={item.key}
                            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-500">{item.title}</p>
                                    <h2 className="text-3xl font-extrabold text-gray-800">{item.value}</h2>
                                </div>
                                <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors text-primary">
                                    {item.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Performance Chart */}
                {/* <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-primary" />
                            <span>Hiệu suất công việc theo thời gian</span>
                        </h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <div className="w-3 h-3 rounded-full bg-primary/20"></div> Trung bình
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <div className="w-3 h-3 rounded-full bg-primary"></div> Thực tế
                            </span>
                        </div>
                    </div>
                    <RevenueChart />
                </div> */}
            </div>

            {/* Right Sidebar */}
            <div className="col-span-3">
                <div className="flex flex-col gap-6 sticky top-[75px]">
                    {/* Summary Card */}
                    {/* <div className="bg-gradient-to-br from-primary/90 to-primary text-white rounded-xl p-6 shadow-lg shadow-primary/20">
                        <p className="text-primary-foreground/80 text-sm font-medium opacity-80">Doanh thu dự án (Mock)</p>
                        <h2 className="text-2xl font-black mt-1 mb-4">{formatVND(1132432000)}</h2>
                        <div className="flex items-center gap-2 text-xs bg-white/20 w-fit px-2 py-1 rounded-full">
                            <ArrowUpIcon className="w-3 h-3" />
                            <span>+12.5% so với tháng trước</span>
                        </div>
                    </div> */}

                    {/* Activity History */}
                    {/* <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Hoạt động mới nhất</h3>
                            <div className="p-1 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                                <CogIcon className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="relative">
                            {activities.length > 0 ? (
                                <Steps
                                    items={activities.map((item: any) => {
                                        const config = ACTIVITY_CONFIG[item.type as ActivityType] || ACTIVITY_CONFIG.system;
                                        return {
                                            icon: <></>,
                                            title: (
                                                <div className="flex items-start gap-3 -ml-11">
                                                    <div className={`p-2 rounded-lg ${config.bgColor} ${config.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                                        {config.icon}
                                                    </div>
                                                    <div className="flex flex-col mb-4">
                                                        <div className="flex justify-between items-center w-full">
                                                            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">{item.title}</span>
                                                            <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                                                        </div>
                                                        <span className="text-sm text-gray-600 leading-tight mt-1 line-clamp-2">{item.description}</span>
                                                    </div>
                                                </div>
                                            ),
                                            description: '',
                                            status: "process",
                                        };
                                    })}
                                    size="small"
                                    direction="vertical"
                                    current={1}
                                    className="custom-steps"
                                />
                            ) : (
                                <div className="py-4 opacity-70">
                                    <Empty description="Không có hoạt động nào trong khoảng thời gian này" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                </div>
                            )}
                            <button className="w-full mt-2 py-2 text-sm text-primary font-bold hover:bg-primary/5 rounded-lg transition-all flex items-center justify-center gap-1 group">
                                Xem tất cả lịch sử
                                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
