import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

export default function BhagavadGita() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accent, setAccent] = useState('purple'); // 'purple' | 'cyan' | 'orange'
  const { getToken } = useAuth();

  async function getQuote() {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/ai/bhagavad-gita", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setQuote(data);
      window.dispatchEvent(new CustomEvent('creation-generated'));
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      toast.error('Sorry, something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  const accentClasses = {
    purple: 'from-[#7c3aed] to-[#9b5de5]',
    cyan: 'from-[#06b6d4] to-[#00f5d4]',
    orange: 'from-[#fb923c] to-[#f15bb5]'
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#0b0f14] p-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className={cn(
        'absolute inset-0 -z-10 transition-all duration-700',
        accent === 'purple'
          ? 'bg-gradient-to-br from-[#0f0c2f] via-[#0b0f14] to-[#05030a]'
          : accent === 'cyan'
            ? 'bg-gradient-to-br from-[#00111b] via-[#02121a] to-[#00121a]'
            : 'bg-gradient-to-br from-[#2b0a0f] via-[#10070a] to-[#05030a]'
      )} />

      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative backdrop-blur-sm border border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-black/40 to-white/2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#111827] to-[#0b1220] flex items-center justify-center border border-neutral-800">
              <div className="text-white font-extrabold">dopeX</div>
            </div>
            <div>
              <div className="text-white font-semibold">Bhagavad Gita</div>
              <div className="text-sm text-gray-400">Get a random verse</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">Theme</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setAccent('purple')} className="w-6 h-6 rounded-full shadow-sm ring-1 ring-white/10" style={{ background: 'linear-gradient(135deg,#7c3aed,#9b5de5)' }} aria-label="purple" />
              <button onClick={() => setAccent('cyan')} className="w-6 h-6 rounded-full shadow-sm ring-1 ring-white/10" style={{ background: 'linear-gradient(135deg,#06b6d4,#00f5d4)' }} aria-label="cyan" />
              <button onClick={() => setAccent('orange')} className="w-6 h-6 rounded-full shadow-sm ring-1 ring-white/10" style={{ background: 'linear-gradient(135deg,#fb923c,#f15bb5)' }} aria-label="orange" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/0 to-black/10 flex items-center justify-center">
          {quote && (
            <div className={cn(
                'max-w-[80%] p-3 rounded-2xl text-white',
                `mr-auto bg-gradient-to-br ${accentClasses[accent]} text-white/95`
              )}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{quote.translations[0].description}</div>
              <div className="text-[10px] text-gray-400 mt-2">Chapter {quote.chapter_number}, Verse {quote.verse_number}</div>
            </div>
          )}
          {isLoading && !quote && (
            <div className="max-w-[40%] p-3 rounded-2xl bg-gradient-to-br from-[#111827] to-[#0b1220]">
              <TypingIndicator />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-800 bg-black/30">
          <div className="flex items-center gap-3">
            <button
              onClick={getQuote}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#00f5d4] text-black font-semibold shadow hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate New Quote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#111827] to-[#0b1220] flex items-center justify-center">BG</div>
      <div className="flex items-center gap-1">
        <span className="dot animate-pulse inline-block w-2 h-2 rounded-full bg-gray-400 opacity-80" />
        <span className="dot delay-75 animate-pulse inline-block w-2 h-2 rounded-full bg-gray-400 opacity-80" style={{ animationDelay: '0.15s' }} />
        <span className="dot delay-150 animate-pulse inline-block w-2 h-2 rounded-full bg-gray-400 opacity-80" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
}