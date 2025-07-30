import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sql } from './configs/db.js'; 
import {clerkMiddleware, requireAuth} from '@clerk/express';

const app = express();

dotenv.config();

app.use(clerkMiddleware());

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is Live!!!!!!!!!!');
} );

app.use(requireAuth());

const PORT = process.env.PORT || 3000;

const initDB = async() => {
   try{
    await sql `
        CREATE TABLE IF NOT EXISTS creations(
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            prompt TEXT NOT NULL,
            content TEXT NOT NULL,
            type TEXT NOT NULL,
            publish BOOLEAN DEFAULT FALSE,
            likes TEXT[] DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    `;

    console.log("Database initialized");
   } catch (error){
        console.error("Database error: ", error);
        process.exit(1); // stop the server
   }
};

// start server
const startServer = async()=>{
    await initDB();
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
};

startServer();
