import React from 'react'
import {PricingTable} from '@clerk/clerk-react'
import { dark } from "@clerk/themes";

const Plan = () => {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30'>
        <div className='text-center'>
            <h2 className='text-white text-[42px] font-semibold'>Power Your Creativity</h2>
            <p className='text-gray-300 max-w-lg mx-auto'>Start free. Scale when you’re ready. 
                dopeX grows with your content, not against it.</p>
        </div>

        <div className='mt-14 max-sm:mx-8'>
            <PricingTable appearance={{ baseTheme: dark }} />
        </div>
    </div>
  )
}

export default Plan