import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";

const data = [
    { name: "Tháng 1", revenue: 920000000 },
    { name: "Tháng 2", revenue: 870000000 },
    { name: "Tháng 3", revenue: 1100000000 },
    { name: "Tháng 4", revenue: 0 },
    { name: "Tháng 5", revenue: 0 },
    { name: "Tháng 6", revenue: 0 },
    { name: "Tháng 7", revenue: 0 },
    { name: "Tháng 8", revenue: 0 },
    { name: "Tháng 9", revenue: 0 },
    { name: "Tháng 10", revenue: 0 },
    { name: "Tháng 11", revenue: 0 },
    { name: "Tháng 12", revenue: 0 },
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);

// Pattern SVG for diagonal hatching
const DiagonalHatch = () => (
    <defs>
        <pattern
            id="diagonalHatch"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(45)"
        >
            <line
                x1="0"
                y1="0"
                x2="0"
                y2="5"
                stroke="#ccc"
                strokeWidth="3"
            />
        </pattern>
        <pattern
            id="diagonalHatchBlue"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(45)"
        >
            <line
                x1="0"
                y1="0"
                x2="0"
                y2="5"
                stroke="#C9A85D"
                strokeWidth="3"
            />
        </pattern>
    </defs>
);

function RevenueChart() {

    const activeIndex = 2;
    return (
        <div className="recharts-wrapper">

            <ResponsiveContainer width="100%" height={420} style={{ outline: "none" }}>
                <BarChart data={data ?? []} barCategoryGap="30%" style={{ outline: "none" }}>
                    <DiagonalHatch />

                    <XAxis
                        dataKey="name"
                        axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}   // thêm line
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        dy={10}
                    // padding={{ bottom: 20 }}   // tạo khoảng cách với trục X
                    />

                    <YAxis
                        axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}   // thêm line
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                        domain={[0, 1400000000]}
                        padding={{
                            bottom: 10
                        }}

                    />

                    <Tooltip
                        formatter={(value: any) => [formatCurrency(value), "Doanh thu"]} // đổi label
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                    />

                    <Bar
                        dataKey="revenue"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                        onClick={() => { }}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={index}
                                fill={index === activeIndex ? "url(#diagonalHatchBlue)" : "url(#diagonalHatch)"}
                                fillOpacity={index === activeIndex ? 1 : 0.8}
                                className="transition-all duration-300 hover:fill-opacity-100"
                            />
                        ))}
                        <LabelList
                            dataKey="revenue"
                            position="top"
                            content={(props: any) => {
                                const { x, y, width, value, index } = props;
                                if (index !== activeIndex) return null;
                                const label = `Năng suất cao nhất`;
                                return (
                                    <g>
                                        <rect
                                            x={x + width / 2 - 60}
                                            y={y - 35}
                                            width={120}
                                            height={24}
                                            rx={12}
                                            fill="#1e293b"
                                        />
                                        <text
                                            x={x + width / 2}
                                            y={y - 19}
                                            textAnchor="middle"
                                            fill="#fff"
                                            fontSize={10}
                                            fontWeight={700}
                                        >
                                            {label}
                                        </text>
                                    </g>
                                );
                            }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default RevenueChart;
