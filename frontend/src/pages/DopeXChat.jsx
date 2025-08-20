import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { useAuth } from '@clerk/clerk-react';
import { Toaster, toast } from 'react-hot-toast';

export default function DopeXChat() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'dopeX', text: 'Say hi to DopeX — I gotchu.', time: 'now' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [accent, setAccent] = useState('purple'); // 'purple' | 'cyan' | 'orange'
  const containerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const { getToken } = useAuth();

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  async function sendMessage() {
    if (!input.trim() || isTyping) return;

    const messageText = input.trim();
    const userMsg = { id: Date.now(), from: 'user', text: messageText, time: new Date().toISOString() };
    const assistantMsgPlaceholder = { id: Date.now() + 1, from: 'dopeX', text: '', time: new Date().toISOString() };

    setMessages(prev => [...prev, userMsg, assistantMsgPlaceholder]);
    setInput('');
    setIsTyping(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getToken()}`
        },
        body: JSON.stringify({ message: messageText }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok || !response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
          const jsonStr = line.replace('data: ', '');
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices[0]?.delta?.content || '';

            setMessages(prev => {
              const newMessages = [...prev];
              const lastMsg = newMessages[newMessages.length - 1];
              if (lastMsg.from === 'dopeX') {
                lastMsg.text += content;
              }
              return newMessages;
            });

          } catch (e) {
            console.error('Failed to parse stream chunk:', jsonStr);
          }
        }
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Sorry, something went wrong.');
      setMessages(prev => prev.slice(0, -2));
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const accentClasses = {
    purple: 'from-[#7c3aed] to-[#9b5de5]',
    cyan: 'from-[#06b6d4] to-[#00f5d4]',
    orange: 'from-[#fb923c] to-[#f15bb5]'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] p-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className={cn(
        'absolute inset-0 -z-10 transition-all duration-700',
        accent === 'purple'
          ? 'bg-gradient-to-br from-[#0f0c2f] via-[#0b0f14] to-[#05030a]'
          : accent === 'cyan'
            ? 'bg-gradient-to-br from-[#00111b] via-[#02121a] to-[#00121a]'
            : 'bg-gradient-to-br from-[#2b0a0f] via-[#10070a] to-[#05030a]'
      )} />

      <div className="w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative backdrop-blur-sm border border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-black/40 to-white/2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#111827] to-[#0b1220] flex items-center justify-center border border-neutral-800">
              <div className="text-white font-extrabold">dopeX</div>
            </div>
            <div>
              <div className="text-white font-semibold">Say hi to DopeX</div>
              <div className="text-sm text-gray-400">Your DeFi AI companion</div>
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

        <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/0 to-black/10">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={cn(
                'max-w-[80%] p-3 rounded-2xl',
                msg.from === 'user'
                  ? 'ml-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 text-white'
                  : `mr-auto bg-gradient-to-br ${accentClasses[accent]} text-white/95`
              )}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
              <div className="text-[10px] text-gray-400 mt-2">{msg.from === 'user' ? 'You' : 'dopeX'}</div>
            </div>
          ))}

          {isTyping && messages[messages.length - 1]?.text === '' && (
            <div className="max-w-[40%] p-3 rounded-2xl bg-gradient-to-br from-[#111827] to-[#0b1220]">
              <TypingIndicator />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-800 bg-black/30">
          <div className="flex items-center gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask DopeX anything..."
              className="flex-1 min-h-[48px] max-h-[140px] resize-none bg-transparent text-white placeholder:text-gray-500 p-3 rounded-xl border border-gray-800 focus:ring-2 focus:ring-offset-0 focus:ring-white/10 outline-none"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#00f5d4] text-black font-semibold shadow hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
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
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#111827] to-[#0b1220] flex items-center justify-center">DX</div>
      <div className="flex items-center gap-1">
        <span className="dot animate-pulse inline-block w-2 h-2 rounded-full bg-gray-400 opacity-80" />
        <span className="dot delay-75 animate-pulse inline-block w-2 h-2 rounded-full bg-gray-400 opacity-80" style={{ animationDelay: '0.15s' }} />
        <span className="dot delay-150 animate-pulse inline-block w-2 h-2 rounded-full bg-gray-400 opacity-80" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
}