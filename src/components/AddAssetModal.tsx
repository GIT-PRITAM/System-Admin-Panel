import React, { type FormEvent } from "react";

interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (asset: Omit<Asset, "name">) => void;
}

export interface Asset {
    name: string;
    block: string;
    gramPanchayat: string;
    village: string;
    assetType: string;
    landmark: string;
    installationDate: string;
    warrantyPeriod: string;
    agencyName: string;
    agencyEmail: string;
    agencyPhone: string;
    agencyAddress: string;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose, onAdd }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as Omit<Asset, "name">;
        onAdd(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-base-100 rounded-xl shadow-xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <h3
                    className="text-2xl font-bold mb-6 text-primary"
                >
                    Add New Asset
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Work Order Section */}
                        <div className="bg-base-200 rounded-lg p-4 flex-1 h-full">
                            <h4 className="text-lg font-semibold text-base-content mb-4">
                                Work Order Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label text-sm text-base-content">Block</label>
                                    <select
                                        name="block"
                                        className="select select-bordered w-full focus:outline-none"
                                        required
                                    >
                                        <option value="">Select Block</option>
                                        <option value="Block A">Block A</option>
                                        <option value="Block B">Block B</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label text-sm text-base-content">Gram Panchayat</label>
                                    <select
                                        name="gramPanchayat"
                                        className="select select-bordered w-full focus:outline-none"
                                        required
                                    >
                                        <option value="">Select GP</option>
                                        <option value="GP 1">GP 1</option>
                                        <option value="GP 2">GP 2</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label text-sm text-base-content">Village</label>
                                    <select
                                        name="village"
                                        className="select select-bordered w-full focus:outline-none"
                                        required
                                    >
                                        <option value="">Select Village</option>
                                        <option value="Village 1">Village 1</option>
                                        <option value="Village 2">Village 2</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label text-sm text-base-content">Asset Type</label>
                                    <select
                                        name="assetType"
                                        className="select select-bordered w-full focus:outline-none"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Pump">Pump</option>
                                        <option value="Tank">Tank</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label text-sm text-base-content">Landmark</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        placeholder="Landmark"
                                        className="input input-bordered w-full focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="label text-sm text-base-content">Installation Date</label>
                                    <input
                                        type="date"
                                        name="installationDate"
                                        className="input input-bordered w-full focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="label text-sm text-base-content">Warranty Period (in years)</label>
                                    <input
                                        type="number"
                                        name="warrantyPeriod"
                                        placeholder="Warranty Period"
                                        className="input input-bordered w-full focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Agency Section */}
                        <div className="bg-base-200 rounded-lg p-4 flex-1 h-full">
                            <h4 className="text-lg font-semibold text-base-content mb-4">
                                Agency Details
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="label text-sm text-base-content">Agency Name</label>
                                    <input
                                        type="text"
                                        name="agencyName"
                                        placeholder="Agency Name"
                                        className="input input-bordered w-full focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="label text-sm text-base-content">Email</label>
                                    <input
                                        type="email"
                                        name="agencyEmail"
                                        placeholder="Agency Email"
                                        className="input input-bordered w-full focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="label text-sm text-base-content">Phone</label>
                                    <input
                                        type="tel"
                                        name="agencyPhone"
                                        placeholder="Agency Phone"
                                        className="input input-bordered w-full focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="label text-sm text-base-content">Address</label>
                                    <input
                                        type="text"
                                        name="agencyAddress"
                                        placeholder="Agency Address"
                                        className="input input-bordered w-full focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary px-6">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAssetModal;
