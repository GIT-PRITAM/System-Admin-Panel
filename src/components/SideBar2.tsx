import { Link } from "react-router-dom";
import {
    DocumentTextIcon,
    CubeIcon,
    UserGroupIcon,
    ChartBarIcon,
    ChevronDownIcon,
    ClipboardDocumentIcon,
    BuildingLibraryIcon,
    MapPinIcon,
    Squares2X2Icon,
    Cog6ToothIcon, // Icon for Admin Panel heading
} from "@heroicons/react/24/outline";
import { useState, FC } from "react";

const Sidebarp: FC = () => {
    const [isUsersOpen, setIsUsersOpen] = useState<boolean>(false);
    const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

    const baseItem =
        "flex items-center gap-4 px-4 py-2 text-lg font-medium rounded transition-colors duration-200";
    const mainItem =
        baseItem + " text-white hover:bg-[#3B82F6] cursor-pointer";
    const subItem =
        baseItem + " text-white text-sm hover:bg-[#3B82F6] ml-12";

    return (
        <aside className="fixed top-0 left-0 h-full bg-[#2563EB] text-white flex flex-col w-64 transition-all duration-300 font-inter">

            {/* Admin Panel Heading */}
            <div className="flex items-center gap-3 px-4 py-4 border-b">
                <Cog6ToothIcon className="h-7 w-7 text-white" />
                <span className="text-xl font-semibold">Admin Panel</span>
            </div>

            <nav className="p-4 space-y-1">

                {/* Dashboard */}
                <Link to="/" className={mainItem}>
                    <Squares2X2Icon className="h-6 w-6" />
                    <span>Dashboard</span>
                </Link>

                {/* Scheme */}
                <Link to="/schemes" className={mainItem}>
                    <DocumentTextIcon className="h-6 w-6" />
                    <span>Schemes</span>
                </Link>

                {/* Geography */}
                <Link to="/geography" className={mainItem}>
                    <MapPinIcon className="h-6 w-6" />
                    <span>Geography</span>
                </Link>

                {/* Assets */}
                <Link to="/assets" className={mainItem}>
                    <CubeIcon className="h-6 w-6" />
                    <span>Assets</span>
                </Link>

                {/* Users */}
                <Link to="/users" className={mainItem}>
                    <UserGroupIcon className="h-6 w-6" />
                    <span>Users</span>
                </Link>

                {/* Short White Divider */}
                <div className="border-t border-white opacity-50 w-56 mx-auto my-2"></div>

                {/* Report Dropdown */}
                <div>
                    <button
                        onClick={() => setIsReportOpen(!isReportOpen)}
                        className={`${mainItem} justify-between w-full`}
                    >
                        <span className="flex items-center gap-4">
                            <ChartBarIcon className="h-6 w-6" />
                            <span>Report</span>
                        </span>
                        <ChevronDownIcon
                            className={`h-5 w-5 transition-transform ${isReportOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {isReportOpen && (
                        <ul className="mt-1 space-y-1 rounded-md overflow-hidden">
                            <li>
                                <Link to="/report/survey" className={subItem}>
                                    <ClipboardDocumentIcon className="h-5 w-5" />
                                    <span>Survey</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/report/block" className={subItem}>
                                    <BuildingLibraryIcon className="h-5 w-5" />
                                    <span>Block</span>
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebarp;
