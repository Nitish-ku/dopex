import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {useClerk, UserButton, useUser} from '@clerk/clerk-react'

const Navbar = () => {
    const navigate = useNavigate()
    const {user} = useUser(); 
    const {openSignIn} = useClerk();
  return (
    <div className='fixed z-50 w-full backdrop-blur-2xl flex justify-between 
    items-center py-3 px-4 sm:px-20 xl:px-32 bg-[#0b0f14]'>
        <img src={assets.logo} alt='logo' className='w-80 h-auto sm:w-40 cursor-pointer' onClick={()=>navigate('/')}/>

        {
          user ? <UserButton/> 
          : 
          (
            <button onClick={openSignIn} className='flex items-center gap-2 rounded-full text-sm
        cursor-pointer bg-gradient-to-br from-[#7c3aed] to-[#00f5d4] text-black px-10 py-2.5'>Cook with AI <ArrowRight className='w-4 h-4'/></button> 
          )
        }
        
    </div>
  )
}

export default Navbar
