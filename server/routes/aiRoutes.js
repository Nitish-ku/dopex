import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateArticle, generateBlogTitle, generateImage, generateWorkoutQuote, getBhagavadGitaQuote, getBookInformation, getLyrics, removeImageBackground, resumeReview } from '../controllers/aiController.js';
import { upload } from '../configs/multer.js';


const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle)
aiRouter.post('/generate-blog-title', auth, generateBlogTitle)
aiRouter.post('/generate-image', auth, generateImage)
aiRouter.post('/remove-image-background', upload.single('image'), auth, removeImageBackground)
aiRouter.post('/get-book-information', auth, getBookInformation)
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview)
aiRouter.get('/bhagavad-gita', auth, getBhagavadGitaQuote)
aiRouter.post('/get-lyrics', auth, getLyrics)
aiRouter.post('/generate-workout-quote', auth, generateWorkoutQuote)


export default aiRouter
