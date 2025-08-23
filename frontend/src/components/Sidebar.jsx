import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { BookText, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users, BookOpen, Mic, Dumbbell } from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom';


const navItems = [
    {to: '/ai', lable: 'Dashboard', Icon: House},
    {to: '/ai/write-article', lable: 'Write Article', Icon: SquarePen},
    {to: '/ai/bhagavad-gita', lable: 'Bhagavad Gita', Icon: BookText},
    
    {to: '/ai/generate-images', lable: 'Generate Images', Icon: Image},
    {to: '/ai/get-book-information', lable: 'Get Book Information', Icon: BookOpen},
    {to: '/ai/get-word-info', lable: 'Word Info', Icon: BookOpen},
    {to: '/ai/review-resume', lable: 'Review Resume', Icon: FileText},
    {to: '/ai/get-lyrics', lable: 'Get Lyrics', Icon: Mic},
    {to: '/ai/generate-workout-quote', lable: 'Workout Quote', Icon: Dumbbell},
    {to: '/ai/community', lable: 'Community', Icon: Users},
]

const Sidebar = ({sidebar, setSidebar}) => {

    const {user} = useUser();
    const {signOut, openUserProfile} = useClerk();



  return (
    <div className={`w-60 bg-[#0b0f14] border-r border-gray-800 flex flex-col justify-between items-center max-sm:absolute top-[60px] bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}> 
    <div className='my-7 w-full'>
        <img src={user.imageUrl} alt="User avatar" className='w-13 rounded-full mx-auto'/>
        <h1 className='mt-1 text-center text-white'>{user.fullName}</h1>

        <div className='px-6 mt-5 text-sm text-gray-300 font-medium'>
            {navItems.map(({to, lable, Icon})=>(
                <NavLink key={to} to={to} end={to === '/ai'} onClick={()=> setSidebar(false)} className={({isActive})=> `px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white':''}`}>
                    {({isActive})=>(
                        <>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`}/>
                        {lable}
                        </>
                    )}

                </NavLink>
            ))}
        </div>

    </div>

    <div className='w-full border-t border-gray-800 p-4 px-7 flex items-center justify-between'>
        <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>

            <img src={user.imageUrl} alt="" className='w-8 rounded-full' />
            <div>
                <h1 className='text-sm font-medium  text-gray-400'>{user.fullName}</h1>
                <p className='text-xs text-gray-400'>
                    <Protect plan='premium' fallback='Free'>
                        Premium
                    </Protect> Plan
                </p>
            </div>

        </div>

        <LogOut onClick={signOut} className='w-4.5 text-gray-500 hover:text-gray-300 transition cursor-pointer'/>
        


    </div>

    </div>
  )
}

export default Sidebar