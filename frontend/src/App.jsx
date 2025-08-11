import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'

import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import GetBookInformation from './pages/GetBookInformation'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import DopeXChat from './pages/DopeXChat'
import BhagavadGita from './pages/BhagavadGita'
import GetLyrics from './pages/GetLyrics'
import GenerateWorkoutQuote from './pages/GenerateWorkoutQuote'
import GetWordInfo from './pages/GetWordInfo'



const App = () => {

  return (
    <div>
    <Toaster />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/chat' element={<DopeXChat />} />
        <Route path='/ai' element={<Layout />}>
        <Route index element={<Dashboard/>}/>
        <Route path='write-article' element={<WriteArticle/>}/>
        <Route path='bhagavad-gita' element={<BhagavadGita />} />
        <Route path='generate-images' element={<GenerateImages/>}/>
        <Route path='remove-background' element={<RemoveBackground/>}/>
        <Route path='get-book-information' element={<GetBookInformation/>}/>
        <Route path='review-resume' element={<ReviewResume/>}/>
        <Route path='community' element={<Community/>}/>
        <Route path='get-lyrics' element={<GetLyrics/>}/>
        <Route path='generate-workout-quote' element={<GenerateWorkoutQuote/>}/>
        <Route path='get-word-info' element={<GetWordInfo/>}/>

        </Route>
      </Routes>
    </div>

    
  )
}

export default App