import React, { useState } from "react";
import { UsersIcon, PlusIcon } from "@heroicons/react/24/solid";
import AddUserModal from "./AddUserModal";

const Users: React.FC = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);

    const tabContent = [
        ["User 1", "User 2", "User 3"],
        ["Member A", "Member B", "Member C"],
        ["Engineer X", "Engineer Y", "Engineer Z"],
        ["Manager P", "Manager Q", "Manager R"],
        ["Admin AA", "Admin BB", "Admin CC"],
    ];

    const handleAddUser = (data: { name: string; phone: string; role: string }) => {
        console.log("User Added:", data);
        // TODO: integrate API or state update here
    };

    return (
        <>
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center justify-center">
                    <UsersIcon className="size-6 mr-4" />
                    <span className="text-2xl font-bold">Users</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="btn btn-primary rounded"
                        onClick={() => setModalOpen(true)}
                    >
                        <PlusIcon className="size-6" />
                        Add
                    </button>
                </div>
            </div>
            <div className="divider" />
            <div className="p-4 flex w-full h-screen gap-4">
                <div className="w-3/5 p-4">
                    {/* Tabs */}
                    <div role="tablist" className="tabs tabs-lift">
                        {["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"].map((tab, index) => (
                            <a
                                key={index}
                                role="tab"
                                className={`tab ${activeTab === index + 1 ? "tab-active" : ""}`}
                                onClick={() => setActiveTab(index + 1)}
                            >
                                {tab}
                            </a>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-base-100 p-4 shadow">
                        <ul className="list-disc pl-5">
                            {tabContent[activeTab - 1].map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="w-2/5 p-4 bg-base-100"></div>
            </div>

            {/* Modal */}
            <AddUserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddUser}
            />
        </>
    );
};

export default Users;
