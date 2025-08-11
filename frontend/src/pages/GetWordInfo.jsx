import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const GetWordInfo = () => {
    const [word, setWord] = useState('');
    const [wordInfo, setWordInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();

    const getInfo = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/ai/get-word-info', { word }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setWordInfo(data.wordInfo);
                window.dispatchEvent(new CustomEvent('creation-generated'));
            } else {
                toast.error(data.message);
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
                            <div className="text-white font-extrabold">WI</div>
                        </div>
                        <div>
                            <div className="text-white font-semibold">Word Info</div>
                            <div className="text-sm text-gray-400">Get meaning and pronunciation of a word</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/0 to-black/10 flex flex-col items-center justify-center">
                    <div className="w-full max-w-lg">
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            placeholder="Enter a word"
                            className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={getInfo}
                            disabled={loading}
                            className="w-full mt-4 px-4 py-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#00f5d4] text-black font-semibold shadow hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Searching...' : 'Get Info'}
                        </button>
                    </div>

                    {wordInfo && wordInfo.length > 0 && (
                        <div className="mt-6 p-6 rounded-2xl bg-gray-800 text-white w-full max-w-lg">
                            <h3 className="text-2xl font-bold">{wordInfo[0].word}</h3>
                            {wordInfo[0].phonetics && wordInfo[0].phonetics.length > 0 && (
                                <p className="text-lg mt-2">Pronunciation: {wordInfo[0].phonetics[0].text}</p>
                            )}
                            {wordInfo[0].meanings && wordInfo[0].meanings.length > 0 && (
                                <div>
                                    {wordInfo[0].meanings.map((meaning, index) => (
                                        <div key={index} className="mt-4">
                                            <p><strong>Part of Speech:</strong> {meaning.partOfSpeech}</p>
                                            {meaning.definitions && meaning.definitions.length > 0 && (
                                                <ul className="list-disc list-inside ml-4">
                                                    {meaning.definitions.map((def, defIndex) => (
                                                        <li key={defIndex}>{def.definition}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GetWordInfo;
