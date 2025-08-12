import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-300 mt-20">
    <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-700 pb-6">
        <div className="md:max-w-96">
            <img className="h-9" src={assets.logo} alt='logo'/>
            <p className="mt-6 text-sm">
                
  dopeX is your all-in-one AI tools <br /> designed to supercharge content creation, resume reviews, and productivity. 
  Built for creators and professionals who want to streamline their workflow and save time with smart automation.
</p>

        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20">
            
            <div>
                <h2 className="font-semibold text-white mb-5">Follow my Medium blog</h2>
                <div className="text-sm space-y-2">
                    <p>Read my weekly articles on Medium.</p>
                    <div className="flex items-center gap-2 pt-4">
                        <a href="https://medium.com/@nitish-ku" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-[#7c3aed] to-[#00f5d4] w-36 h-9 text-black rounded cursor-pointer flex items-center justify-center">Read on Medium</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 © Pewcalypse. All Right Reserved.
    </p>
</footer>
    </div>
  )
}

export default Footer