import React from "react";
import {
    ClipboardDocumentIcon,
    CubeIcon,
    DocumentCheckIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import {
    ArcElement,
    Chart as ChartJS,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    type ChartOptions,
    type ChartData,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface StatCardProps {
    title: string;
    value: string | number;
    color: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, Icon, iconColor }) => (
    <div className={`p-4 rounded-xl shadow text-white ${color}`}>
        <div className="flex items-center gap-4">
            <div className="bg-base-100 rounded-full p-1.5">
                <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
            <div className="ml-4">
                <p className="text-sm text-center font-semibold">{title}</p>
                <h2 className="text-3xl mt-2 font-bold">{value}</h2>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const chartTextColor = isDark ? "#ffffff" : "#000000";

    // Bar chart data
    const barData: ChartData<"bar"> = {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
        datasets: [
            {
                label: "Work Completed",
                data: [12, 19, 10, 15, 22, 30, 25, 28, 20, 18, 24, 26],
                backgroundColor: "#1D4ED8",
                borderRadius: 6,
            },
            {
                label: "Work Pending",
                data: [5, 8, 6, 4, 7, 10, 8, 6, 5, 7, 6, 5],
                backgroundColor: "#e32417",
                borderRadius: 6,
            },
        ],
    };

    const barOptions: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: { color: chartTextColor },
            },
        },
        scales: {
            x: {
                ticks: { color: chartTextColor },
                grid: { display: false },
            },
            y: {
                ticks: { color: chartTextColor },
                grid: { color: chartTextColor },
            },
        },
    };

    // Strongly typed Doughnut chart data
    const doughnutData: ChartData<"doughnut"> = {
        labels: ["Completed", "In Progress", "Pending"],
        datasets: [
            {
                label: "Scheme Status",
                data: [60, 30, 10],
                backgroundColor: ["#1D4ED8", "#FFED29", "#e32417"],
                borderWidth: 0,
            },
        ],
    };

    const doughnutOptions: ChartOptions<"doughnut"> = {
        cutout: "70%",
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className="p-6 w-full min-h-screen text-base-content space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>

            </div>

            {/* Scheme Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    title="Total Schemes"
                    value="224"
                    color="bg-indigo-800"
                    Icon={ClipboardDocumentIcon}
                    iconColor="text-indigo-800"
                />

                <StatCard
                    title="Works Orders Issued"
                    value="128"
                    color="bg-indigo-800"
                    Icon={CubeIcon}
                    iconColor="text-indigo-800"
                />
                <StatCard
                    title="Assets Registered"
                    value="435"
                    color="bg-indigo-800"
                    Icon={CubeIcon}
                    iconColor="text-indigo-800"
                />
                <StatCard
                    title="Good Condition Assets"
                    value="400"
                    color="bg-[#00d184]"
                    Icon={DocumentCheckIcon}
                    iconColor="text-[#00d184]"
                />
                <StatCard
                    title="Bad Condition Assets"
                    value="15"
                    color="bg-[#f44336]"
                    Icon={ExclamationCircleIcon}
                    iconColor="text-[#f44336]"
                />
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Scheme Progress */}
                <div className="bg-base-100 p-4 rounded-xl shadow text-center relative">
                    <h2 className="font-semibold mb-4">Scheme Progress</h2>
                    <div className="w-48 mx-auto relative">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                        <div className="absolute top-[55%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                            41%
                            <div className="text-sm font-normal">Scheme Ended</div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 gap-6 text-sm">
                        <div className="flex items-center gap-1 dark:text-white"><span className="w-3 h-3 rounded-full bg-blue-700"></span> Completed</div>
                        <div className="flex items-center gap-1 dark:text-white"><span className="w-3 h-3 rounded-full bg-[#FFED29]"></span> In Progress</div>
                        <div className="flex items-center gap-1 dark:text-white"><span className="w-3 h-3 rounded-full bg-[#e32417]"></span> Pending</div>
                    </div>
                </div>

                {/* Work History */}
                <div className="bg-base-100 p-4 rounded-xl shadow">
                    <h2 className="font-semibold mb-4 dark:text-white">Work History</h2>
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>

            {/* Bottom Row */}
            {/* ... rest of the component stays same */}
        </div>
    );
};

export default Dashboard;

