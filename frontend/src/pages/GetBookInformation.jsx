import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const GetBookInformation = () => {
    const [title, setTitle] = useState('');
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();

    const getBookInfo = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/ai/get-book-information', { title }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setBookData(data.bookData);
                window.dispatchEvent(new CustomEvent('creation-generated'));
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-[#0b0f14] p-6">
            <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative backdrop-blur-sm border border-gray-800 flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-black/40 to-white/2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#111827] to-[#0b1220] flex items-center justify-center border border-neutral-800">
                            <div className="text-white font-extrabold">dopeX</div>
                        </div>
                        <div>
                            <div className="text-white font-semibold">Get Book Information</div>
                            <div className="text-sm text-gray-400">Search for a book by title</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/0 to-black/10 flex flex-col items-center justify-center">
                    <div className="w-full max-w-lg">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a book title"
                            className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={getBookInfo}
                            disabled={loading}
                            className="w-full mt-4 px-4 py-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#00f5d4] text-black font-semibold shadow hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Searching...' : 'Get Book Info'}
                        </button>
                    </div>

                    {bookData && (
                        <div className="mt-6 p-6 rounded-2xl bg-gray-800 text-white w-full max-w-lg">
                            <h3 className="text-2xl font-bold">{bookData.title}</h3>
                            <p className="text-lg mt-2">{bookData.subtitle}</p>
                            <div className="flex items-center mt-4">
                                <img src={bookData.imageLinks?.thumbnail} alt={bookData.title} className="w-24 h-36 mr-4" />
                                <div>
                                    <p><strong>Authors:</strong> {bookData.authors?.join(', ')}</p>
                                    <p><strong>Publisher:</strong> {bookData.publisher}</p>
                                    <p><strong>Published Date:</strong> {bookData.publishedDate}</p>
                                    <p><strong>Page Count:</strong> {bookData.pageCount}</p>
                                </div>
                            </div>
                            <p className="mt-4">{bookData.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GetBookInformation;
