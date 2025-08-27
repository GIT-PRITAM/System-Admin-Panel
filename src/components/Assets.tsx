import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/solid';


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
    const [selectedEmoji, setSelectedEmoji] = useState<string>("😊");
    // const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState<string>("");
    const [listData, setListData] = useState<{ id: number; label: string; icon: string }[]>([]);
    const [selectedItem, setSelectedItem] = useState<ListData | null>(null); // store clicked item
    const [questionList, setQuestionList] = useState<{ id: number; text: string; activity_type: string }[]>([]);
    // const [newListData, setNewListData] = useState('');
    const [newQuestionList, setNewQuestionList] = useState<{ question: string; activity_type: string }>({
        question: '',
        activity_type: ''
    });
    // const [modalOpen, setModalOpen] = useState(false);


    // Column 3 data
    const [assetsList, setAssetsList] = useState<AssetItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;


    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setSelectedEmoji(emojiData.emoji);
        setShowPicker(false); // close picker after selection
    };


    // category list fetch
    const fetchListData = async () => {
        try {

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

        }
    };

    //question list fetch
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

        }
    };

    //add category list
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


            setListData((prev) => [...prev, data.data]);
            return data.message;
        });

        toast.promise(promise, {
            loading: 'Adding List...',
            success: (msg) => msg || 'List added successfully!',
            error: (err) => err.message || 'Failed to add List',
        });
    };


    //add question list
    const handleAddQuestions = async () => {

        if (!selectedItem) {
            toast.error('No category selected');
            return;
        }
        const promise = fetch(`${API_URL}/category/${selectedItem.id}/questions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ text: newQuestionList.question, type: newQuestionList.activity_type }),
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message);
            }

            setQuestionList((prev) => [...prev, data.data]);
            return data.message;
        });

        toast.promise(promise, {
            loading: 'Adding Question...',
            success: (msg) => msg || 'Question added successfully!',
            error: (err) => err.message || 'Failed to add Question',
        });
    };


    //emoji selection
    const handleListClick = (item: ListData) => {
        setSelectedItem(item);

        // Load mock data for the extra list
        fetchQuestionList(item.id);

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
                                <div className='flex justify-between'>

                                    <h2 className="card-title text-primary">Add New Question</h2>
                                    <h2 className='card-title text-base-content'>{selectedItem.label}</h2>
                                </div>
                                <div className='relative w-full mb-4'>
                                    <input
                                        type="text"
                                        value={newQuestionList.question}
                                        onChange={e => { setNewQuestionList(prev => ({ ...prev, question: e.target.value })) }}
                                        placeholder="Type your question"
                                        className="input input-bordered w-full mb-4 focus:outline-none pr-10"
                                    />
                                    {questionList && (
                                        <button
                                            type="button"
                                            onClick={() => setNewQuestionList({ question: '', activity_type: '' })}
                                            className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                ✕
                                            </span>
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <select className="select select-bordered flex-1 focus:outline-none"
                                        value={newQuestionList.activity_type}
                                        onChange={e => { setNewQuestionList(prev => ({ ...prev, activity_type: e.target.value })) }}
                                    >
                                        <option value="SURVEY">SURVEY</option>
                                        <option value="INSPECTION">INSPECTION</option>
                                        <option value="VERIFICATION">VERIFICATION</option>

                                    </select>
                                    <button className="btn btn-primary w-28" onClick={handleAddQuestions}>Add</button>
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
                    <div className='flex justify-between mb-3'>
                        <h3 className="text-lg font-semibold ml-2">Assets</h3>
                        <button
                            className="btn btn-primary rounded flex items-center gap-2"
                            onClick={() => { }}
                        >
                            <PlusIcon className="size-6" />
                            Add
                        </button>
                    </div>

                    <ul className="list bg-base-100 rounded-box">
                        {currentAssets.map((asset) => (
                            <li key={asset.id} className="list-row">
                                <a className="flex items-start gap-2">
                                    <span className="text-2xl">{asset.emoji}</span>
                                    <div>
                                        <div className="font-semibold">{asset.title}</div>
                                        <div className="text-sm opacity-60">{asset.subtitle}</div>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>

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

                {/* Modal */}
                {/* {modalOpen && (
                    <AddAssetModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                    />
                )} */}
            </div>



        </div>
    );
};

export default Assets;
