import React from "react";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: { name: string; phone: string; role: string }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = React.useState({
        name: "",
        phone: "",
        role: "ADMIN",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-primary">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="label">
                            <span className="label-text mb-1">Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            className="input input-bordered w-full focus:outline-none"
                            required
                        />
                    </div>

                    {/* Phone No */}
                    <div>
                        <label className="label">
                            <span className="label-text">Phone No</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="input input-bordered w-full focus:outline-none"
                            required
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div>
                        <label className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="select select-bordered w-full focus:outline-none"
                            required
                        >
                            {[
                                "ADMIN",
                                "DEO",
                                "ENGINEER",
                                "BLOCK_INC",
                                "ZP_MEMBER",
                                "GP_INC",
                                "SURVEYOR",
                                "USER",
                            ].map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
