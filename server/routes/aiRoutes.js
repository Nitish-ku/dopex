import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateArticle, generateImage, generateWorkoutQuote, getBhagavadGitaQuote, getBookInformation, getLyrics, getWordInfo, resumeReview } from '../controllers/aiController.js';
import { upload } from '../configs/multer.js';


const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle)

aiRouter.post('/generate-image', auth, generateImage)

aiRouter.post('/get-book-information', auth, getBookInformation)
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview)
aiRouter.get('/bhagavad-gita', auth, getBhagavadGitaQuote)
aiRouter.post('/get-lyrics', auth, getLyrics)
aiRouter.post('/generate-workout-quote', auth, generateWorkoutQuote)
aiRouter.post('/get-word-info', auth, getWordInfo)


export default aiRouter
