import React, { useState } from 'react'
import Markdown from 'react-markdown';




const CreationItem = ({ item }) => {

    const [expanded, setExpanded] = useState(false);


  return (
    <div onClick={()=> setExpanded(!expanded)} className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'>
        <div className='flex justify-between items-center gap-4'>

            <div >
                <h2>{ item.prompt }</h2>
                <p className='text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
            </div>

            <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full'>{item.type}</button>

        </div>
        {
            expanded && (
                <div>
                    {item.type === 'image'  ? (
                        <div>
                            <img src={item.content} alt="image" className='mt-3 w-full max-w-md' />
                        </div>
                    ): item.type === 'word-info' ? (
                        <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
                            <div className='reset-tw'>
                                {(() => {
                                    try {
                                        const wordInfo = JSON.parse(item.content);
                                        if (!wordInfo || wordInfo.length === 0) return <p>No information available.</p>;

                                        const firstEntry = wordInfo[0];
                                        return (
                                            <div>
                                                <p className="font-bold text-lg">{firstEntry.word}</p>
                                                {firstEntry.phonetics && firstEntry.phonetics.length > 0 && (
                                                    <p className="text-gray-500">Pronunciation: {firstEntry.phonetics[0].text}</p>
                                                )}
                                                {firstEntry.meanings && firstEntry.meanings.map((meaning, idx) => (
                                                    <div key={idx} className="mt-2">
                                                        <p className="font-semibold">Part of Speech: {meaning.partOfSpeech}</p>
                                                        {meaning.definitions && meaning.definitions.map((def, defIdx) => (
                                                            <p key={defIdx}>- {def.definition}</p>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } catch (e) {
                                        console.error("Failed to parse word info JSON:", e);
                                        return <p>Error displaying word information.</p>;
                                    }
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
                            <div className='reset-tw'>
                                <Markdown>
                                {item.content}
                                </Markdown>
                                
                            </div>

                        </div>
                    )}

                </div>
            )
        }

    </div>
  )
}

export default CreationItem