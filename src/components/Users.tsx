import React, { useState } from "react";
import { UsersIcon, PlusIcon } from "@heroicons/react/24/solid";
import AddUserModal from "./AddUserModal";

interface UserData {
    name: string;
    role: string;
    contact: string;
}

const Users: React.FC = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);

    // Added ADMIN as the first role
    const roles = [
        "ADMIN",
        "DEO",
        "ENGINEER",
        "BLOCK_INC",
        "ZP_MEMBER",
        "GP_INC",
        "SURVEYOR",
        "USER",
    ];

    // State for all users by role
    const [tabContent, setTabContent] = useState<UserData[][]>(
        roles.map((role) => [
            { name: `${role} 1`, role, contact: "1234567890" },
            { name: `${role} 2`, role, contact: "9876543210" },
        ])
    );

    const handleAddUser = (data: { name: string; phone: string; role: string }) => {
        const roleIndex = roles.findIndex((r) => r === data.role);
        if (roleIndex === -1) return;

        const newUser: UserData = {
            name: data.name,
            role: data.role,
            contact: data.phone,
        };

        setTabContent((prev) =>
            prev.map((users, idx) =>
                idx === roleIndex ? [newUser, ...users] : users
            )
        );

        setModalOpen(false);
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
            <div className="p-1 flex w-full h-screen gap-2">
                <div className="w-3/5 p-4">
                    {/* Tabs */}
                    <div role="tablist" className="tabs tabs-lift">
                        {roles.map((role, index) => (
                            <a
                                key={index}
                                role="tab"
                                className={`tab ${activeTab === index + 1 ? "tab-active" : ""}`}
                                onClick={() => setActiveTab(index + 1)}
                            >
                                {role}
                            </a>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-base-100 p-4 shadow">
                        <table className="table w-full">
                            <thead className="text-primary">
                                <tr>
                                    <th>Name</th>
                                    <th>Contact No.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tabContent[activeTab - 1].map((user, idx) => (
                                    <tr key={idx}>
                                        <td>{user.name}</td>
                                        <td>{user.contact}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
