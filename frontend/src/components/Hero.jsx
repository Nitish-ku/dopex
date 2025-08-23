import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Gem } from 'lucide-react'
import { useClerk, useUser } from '@clerk/clerk-react'

const Hero = () => {
    const navigate = useNavigate()
    const { user } = useUser();
    const { openSignIn } = useClerk();

    const handleSayHiClick = () => {
        if (user) {
            navigate('/chat');
        } else {
            openSignIn();
        }
    };

  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center 
    bg-[#0b0f14] min-h-screen pt-14'>
        <div className='text-center mb-6'>
            <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold 
            mx-auto leading-[1.2] text-white'>Craft Content 10x Faster<br/> with 
            <span className='text-white'> AI Tools </span></h1>
            <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto 
            max-sm:text-xs text-gray-300'>Fuel your creativity with AI-powered tools built to write, 
            design, and ideate so you can create faster, better, and bolder.</p>
        </div>
        <div className='flex flex-col sm:flex-row justify-center gap-4 text-sm max-sm:text-xs'>
            <button onClick={()=> navigate('/ai')} className='w-full sm:w-auto bg-gradient-to-br from-[#7c3aed] to-[#00f5d4] text-black px-6 py-3 rounded-lg hover:scale-102 
            active:scale-95 transition cursor-pointer sm:px-10'>Start Creating Now</button>
            <button onClick={handleSayHiClick} className='w-full sm:w-auto bg-gradient-to-br from-[#111827] to-[#0b1220] text-white px-6 py-3 rounded-lg border border-gray-800 
            hover:scale-102 
            active:scale-95 transition cursor-pointer sm:px-10'>Say Hi to dopeX</button>
        </div>
        <div className='flex items-center gap-4 mt-8 mx-auto text-gray-300'>
            <Gem className='w-4 h-4'/> dopeX isn’t mainstream yet. That’s your advantage
        </div>
    </div>
  )
}

export default Hero
