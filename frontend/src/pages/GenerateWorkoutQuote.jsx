import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const GenerateWorkoutQuote = () => {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();

    const generateQuote = async () => {
        setQuote(null); // Clear previous quote
        setLoading(true);
        try {
            const { data } = await axios.post('/api/ai/generate-workout-quote', {}, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setQuote(data.quote);
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
                            <div className="text-white font-extrabold">WQ</div>
                        </div>
                        <div>
                            <div className="text-white font-semibold">Workout Quote</div>
                            <div className="text-sm text-gray-400">Generate a motivational workout quote</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/0 to-black/10 flex flex-col items-center justify-center">
                    <div className="w-full max-w-lg">
                        <button
                            onClick={generateQuote}
                            disabled={loading}
                            className="w-full mt-4 px-4 py-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#00f5d4] text-black font-semibold shadow hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Generating...' : 'Generate Quote'}
                        </button>
                    </div>

                    {quote && (
                        <div className="mt-6 p-6 rounded-2xl bg-gray-800 text-white w-full max-w-lg whitespace-pre-wrap">
                            {quote}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateWorkoutQuote;
