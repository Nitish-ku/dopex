import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const GetLyrics = () => {
  const [songTitle, setSongTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const getLyricsInfo = async () => {
    if (!songTitle || !artist) {
      toast.error('Please enter both song title and artist');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        '/api/ai/get-lyrics',
        { songTitle, artist },
        {
          headers: { Authorization: `Bearer ${await getToken()}` }
        }
      );

      if (data.success && data.lyrics) {
        const cleaned = cleanLyrics(data.lyrics);
        setLyrics(cleaned);
        window.dispatchEvent(new CustomEvent('creation-generated'));
      } else {
        toast.error(data.message || 'Lyrics not found');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching lyrics');
    }
    setLoading(false);
  };

  const cleanLyrics = (rawHtml) => {
    let cleaned = rawHtml;

    // 1. Replace <br> with newline, and </p> or </div> with double newlines for separation
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
    cleaned = cleaned.replace(/<\/div>/gi, '\n\n');

    // 2. Remove all HTML tags but keep text
    cleaned = cleaned.replace(/<[^>]+>/g, '');

    // 3. Remove Genius-specific UI text
    cleaned = cleaned.replace(/^Translations.*$/m, '');
    cleaned = cleaned.replace(/^(Español|Português|Deutsch|العربية|Polski|Italiano|Ελληνικά|Français|فارسی|Česky).*$/m, '');
    cleaned = cleaned.replace(/^\s*\[?Produced by.*$/m, '');
    cleaned = cleaned.replace(/^\s*Contributors.*$/m, '');
    cleaned = cleaned.replace(/^\s*Read More.*$/m, '');

    // 4. Remove any intro text before the first [Verse], [Chorus], etc.
    cleaned = cleaned.replace(/^[\s\S]*?(?=\[Verse|\[Chorus|\[Bridge|\[Intro|\[Outro|\n\[)/, '');

    // 5. Collapse more than 2 newlines into exactly 2
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // 6. Trim and normalize lines
    cleaned = cleaned
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    // 7. Ensure a blank line after section headers like [Verse 1]
    cleaned = cleaned.replace(/(\[[^\]]+\])\n(?!\n)/g, '$1\n\n');

    return cleaned.trim();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#0b0f14] p-6">
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative backdrop-blur-sm border border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-black/40 to-white/2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#111827] to-[#0b1220] flex items-center justify-center border border-neutral-800">
              <div className="text-white font-extrabold">LY</div>
            </div>
            <div>
              <div className="text-white font-semibold">Get Lyrics</div>
              <div className="text-sm text-gray-400">Search for lyrics by song title and artist</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/0 to-black/10 flex flex-col items-center justify-center">
          <div className="w-full max-w-lg">
            <input
              type="text"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder="Enter song title"
              className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter artist name"
              className="w-full mt-4 px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={getLyricsInfo}
              disabled={loading}
              className="w-full mt-4 px-4 py-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#00f5d4] text-black font-semibold shadow hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Get Lyrics'}
            </button>
          </div>

          {lyrics && (
            <div className="mt-6 p-6 rounded-2xl bg-gray-800 text-white w-full max-w-lg whitespace-pre-wrap">
              {lyrics}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetLyrics;
