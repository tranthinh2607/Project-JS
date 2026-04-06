import dayjs, { Dayjs } from "dayjs";

export const CUSTOM_RANGE_PICKER: { label: string; value: [Dayjs, Dayjs] }[] = [
    {
        label: "Hôm nay",
        value: [dayjs().startOf("day"), dayjs().endOf("day")],
    },
    {
        label: "Hôm qua",
        value: [
            dayjs().subtract(1, "day").startOf("day"),
            dayjs().subtract(1, "day").endOf("day"),
        ],
    },
    {
        label: "7 ngày gần đây",
        value: [dayjs().subtract(6, "day").startOf("day"), dayjs().endOf("day")],
    },
    {
        label: "30 ngày gần đây",
        value: [dayjs().subtract(29, "day").startOf("day"), dayjs().endOf("day")],
    },
    {
        label: "Tuần này",
        value: [dayjs().startOf("week"), dayjs().endOf("week")],
    },
    {
        label: "Tuần trước",
        value: [
            dayjs().subtract(1, "week").startOf("week"),
            dayjs().subtract(1, "week").endOf("week"),
        ],
    },
    {
        label: "Tháng này",
        value: [dayjs().startOf("month"), dayjs().endOf("month")],
    },
    {
        label: "Tháng trước",
        value: [
            dayjs().subtract(1, "month").startOf("month"),
            dayjs().subtract(1, "month").endOf("month"),
        ],
    },
]