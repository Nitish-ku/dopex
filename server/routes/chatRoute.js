import express from 'express';
import { auth } from '../middlewares/auth.js';
import { handleDopeXChat } from '../controllers/chatController.js';



const chatRouter = express.Router();


chatRouter.post('/chat', handleDopeXChat);


export default chatRouter

