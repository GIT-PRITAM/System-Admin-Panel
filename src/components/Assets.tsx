import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';


const API_URL = import.meta.env.VITE_SERVER_URL;

interface AssetsProps {
    // Define props here if needed
}

interface ListData {
    id: number;
    label: string;
    icon: string;
}

interface AssetItem {
    id: number;
    emoji: string;
    title: string;
    subtitle: string;
}

const Assets: React.FC<AssetsProps> = () => {
    const { token } = useAuth();
    const [showPicker, setShowPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState<string>("");
    const [listData, setListData] = useState<{ id: number; label: string; icon: string }[]>([]);
    const [selectedItem, setSelectedItem] = useState<ListData | null>(null); // store clicked item
    const [questionList, setQuestionList] = useState<{ id: number; text: string; activity_type: string }[]>([]);
    const [newListData, setNewListData] = useState('');
    const [newQuestionList, setNewQuestionList] = useState('');

    // Column 3 data
    const [assetsList, setAssetsList] = useState<AssetItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;


    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setSelectedEmoji(emojiData.emoji);
        setShowPicker(false); // close picker after selection
    };



    const fetchListData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                setListData(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestionList = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/category/${id}/questions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                setQuestionList(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {

        fetchListData();


        // Dummy API Data for Assets (Column 3)
        const dummyAssets: AssetItem[] = Array.from({ length: 22 }, (_, i) => ({
            id: i + 1,
            emoji: i % 2 === 0 ? "📦" : "💡",
            title: `Asset ${i + 1}`,
            subtitle: `Description for asset ${i + 1}`
        }));
        setAssetsList(dummyAssets);

        //API call

        // fetch(`${API_URL}/categories`)
        //     .then(res => res.json())
        //     .then(data => setListData(data))
        //     .catch(err => console.error(err));

    }, []);

    const handleAddCategories = async () => {

        const promise = fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ icon: selectedEmoji, label: newCategoryName }),
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message);
            }

            setNewListData('');
            setListData((prev) => [...prev, data.data]);
            return data.message;
        });

        toast.promise(promise, {
            loading: 'Adding scheme...',
            success: (msg) => msg || 'Scheme added successfully!',
            error: (err) => err.message || 'Failed to add scheme',
        });
    };




    const handleListClick = (item: ListData) => {
        setSelectedItem(item);

        // Load mock data for the extra list
        fetchQuestionList(item.id);

    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAssets = assetsList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(assetsList.length / itemsPerPage);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="flex w-full h-screen gap-4">
            {/* Column 1 - smaller width */}
            <div className="w-1/5 p-3 relative ">

                <div>

                    {/* heading */}

                    <h3 className="text-lg font-semibold mb-3 ml-2">Categories</h3>

                    {/* first row div */}

                    {/* Emoji Picker and Input Row */}
                    <div className="flex gap-2 items-center">
                        {/* Emoji Selection Box */}
                        <input
                            type="text"
                            value={selectedEmoji}
                            onClick={() => setShowPicker((prev) => !prev)}
                            readOnly
                            className="input input-bordered w-14 h-12 text-2xl text-center cursor-pointer focus:outline-none"
                            style={{ lineHeight: "2.5rem" }}
                        />

                        {/* Emoji Picker */}
                        {showPicker && (
                            <div className="absolute z-10 mt-96">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}

                        {/* Name Input */}
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={e => { setNewCategoryName(e.target.value) }}
                            placeholder="Enter name"

                            className="input input-bordered w-full h-12 focus:outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        onClick={handleAddCategories}
                        className="btn btn-primary w-full mt-3 h-12"
                    >
                        Submit
                    </button>
                </div>


                {/* second row div - Dynamic List */}
                <div className="mt-6">
                    <ul className="list bg-base-200 rounded-box shadow-md">
                        {listData.map((item) => (
                            <li key={item.id} className='list-row cursor-pointer' onClick={() => handleListClick(item)}>
                                <a className="flex items-center gap-2 rounded-md">
                                    <span className="text-2xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Column 2 - equal width */}
            <div className="w-2/5  p-4">
                {selectedItem && (
                    <div className="space-y-6">
                        {/* Form */}
                        <div className="card bg-base-100 shadow-xl w-full">
                            <div className="card-body">
                                <h2 className="card-title text-primary">Add New Question</h2>
                                <input
                                    type="text"
                                    placeholder="Enter your question"
                                    className="input input-bordered w-full mb-4 focus:outline-none"
                                />
                                <div className="flex gap-2">
                                    <select className="select select-bordered flex-1 focus:outline-none">
                                        <option value="">Select option</option>
                                        <option value="option1">Option 1</option>
                                        <option value="option2">Option 2</option>
                                    </select>
                                    <button className="btn btn-primary w-28">Add</button>
                                </div>
                            </div>
                        </div>

                        {/* New List */}
                        <div className="bg-base-200 rounded-box shadow-md p-4">
                            <h3 className="text-lg font-semibold mb-3 ml-2">Questions</h3>
                            <ul className="list bg-base-100 rounded-box">
                                {questionList.map((q) => (
                                    <li key={q.id} className="list-row">
                                        <a>
                                            <div className="font-semibold mb-1">{q.text}</div>
                                            <div className="text-sm opacity-60">{q.activity_type}</div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Column 3 - equal width */}
            <div className="w-2/5 p-4">
                <div className="bg-base-200 rounded-box shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-3 ml-2">Assets</h3>
                    <ul className="list bg-base-100 rounded-box">
                        {currentAssets.map((asset) => (
                            <li key={asset.id} className="list-row">
                                <a className="flex items-start gap-2">
                                    {/* Emoji */}
                                    <span className="text-2xl">{asset.emoji}</span>

                                    {/* Title + Subtitle */}
                                    <div>
                                        <div className="font-semibold">{asset.title}</div>
                                        <div className="text-sm opacity-60">{asset.subtitle}</div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>


                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <button className="btn btn-accent" onClick={prevPage} disabled={currentPage === 1}>
                            Prev
                        </button>
                        <span className="text-sm">Page {currentPage} of {totalPages}</span>
                        <button className="btn btn-accent" onClick={nextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assets;
