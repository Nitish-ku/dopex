import OpenAI from "openai";
import { sql } from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { useId } from "react";
import axios from 'axios'
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js' 

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ 
                success: false, 
                message: "This feature is only available for premium subscriptions" 
            });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content;
        
        await sql`
            INSERT INTO creations (user_id, prompt, content, type) 
            VALUES (${userId}, ${prompt}, ${content}, 'article')
        `;

        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};






export const generateImage = async ( req, res )=>{

    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;
        

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }


        //using clipdrop api for creating the image
        const formData = new FormData()
        formData.append('prompt', prompt)
        const {data} =  await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {'x-api-key': process.env.CLIPDROP_API_KEY,},
            responseType: 'arraybuffer',
        })


        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;


        const { secure_url } =await cloudinary.uploader.upload(base64Image)

        
        await sql` INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false })`;

        res.json({ success: true, content: secure_url })



    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
        
    }

}







export const removeImageObject = async ( req, res )=>{

    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const  image = req.file;
        const plan = req.plan;
        

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }


        //using cloudinary api for removing the background in image

        const { public_id } = await cloudinary.uploader.upload(image.path)


        const imageUrl = cloudinary.url(public_id, {
          secure: true,
          transformation: [{ effect: `gen_remove:${object}` }], // ✅ No underscore
          resource_type: "image",
        });
        
        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},  ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

        res.json({ success: true, content: imageUrl })

        

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
        
    }

}


export const resumeReview = async ( req, res )=>{

    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;
        

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }


        if (resume.size > 5 * 1024 * 1024) {
            return res.json({success : false, message: "Resume file size exceeds allowed size (5MB)."})
            
        }

        const dataBuffer = fs.readFileSync(resume.path)
        const pdfData = await pdf(dataBuffer)

        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas of improvement. ResumeContent:\n\n${pdfData.text}`


        const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },

        ],
        temperature: 0.7,
        max_tokens: 1000,
        });

        const content = response.choices[0].message.content;

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},  'Review the uploaded resume', ${content}, 'resume-review')`;

        res.json({ success: true, content })

        

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
        
    }

}


export const getBhagavadGitaQuote = async (req, res) => {
    try {
        // First, get the list of chapters
        const chaptersResponse = await axios.get('https://bhagavad-gita3.p.rapidapi.com/v2/chapters/', {
            headers: {
                'x-rapidapi-key': process.env['X-RAPIDAPI-kEY'],
                'x-rapidapi-host': 'bhagavad-gita3.p.rapidapi.com'
            }
        });

        const chapters = chaptersResponse.data;

        // Randomly select a chapter
        const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
        const chapterNumber = randomChapter.chapter_number;
        const versesCount = randomChapter.verses_count;

        // Randomly select a verse number
        const randomVerseNumber = Math.floor(Math.random() * versesCount) + 1;

        // Fetch the randomly selected verse
        const verseResponse = await axios.get(`https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/verses/${randomVerseNumber}/`, {
            headers: {
                'x-rapidapi-key': process.env['X-RAPIDAPI-kEY'],
                'x-rapidapi-host': 'bhagavad-gita3.p.rapidapi.com'
            }
        });

        const verseData = verseResponse.data;

        // Save the quote to the database
        const { userId } = req.auth();
        const prompt = `Chapter ${chapterNumber}, Verse ${randomVerseNumber}`;
        const content = verseData.translations[0].description;
        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'bhagavad-gita')`;

        res.json(verseData);
    } catch (error) {
        console.error('Failed to fetch quote:', error);
        res.status(500).json({ error: 'Failed to fetch quote' });
    }
};

export const getBookInformation = async (req, res) => {
    try {
        const { title } = req.body;
        const { userId } = req.auth();

        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}&key=${process.env.GOOGLE_BOOKS_API}`);

        const bookData = response.data.items[0].volumeInfo;

        const prompt = `Book information for "${title}"`;
        const content = JSON.stringify(bookData);

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'book-information')`;

        res.json({ success: true, bookData });
    } catch (error) {
        console.error('Failed to fetch book information:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch book information' });
    }
};

export const getLyrics = async (req, res) => {
    try {
        const { songTitle, artist } = req.body;
        const { userId } = req.auth();

        console.log(`Searching for lyrics: ${songTitle} by ${artist}`);

        // Step 1: Search Genius for the song
        const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(songTitle)} ${encodeURIComponent(artist)}`;
        const searchResponse = await axios.get(searchUrl, {
            headers: { Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}` },
        });

        const songId = searchResponse.data.response.hits[0]?.result?.id;
        if (!songId) {
            return res.status(404).json({ success: false, message: 'Song not found.' });
        }

        // Step 2: Get song details
        const songResponse = await axios.get(`https://api.genius.com/songs/${songId}`, {
            headers: { Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}` },
        });

        const lyricsUrl = songResponse.data.response.song.url;

        // Step 3: Scrape lyrics page
        const { data: html } = await axios.get(lyricsUrl);
        const cheerio = await import('cheerio');
        const $ = cheerio.load(html);

        // Replace <br> with \n and <p>/<div> with \n\n before extracting text
        $('br').replaceWith('\n');
        $('p, div').each((_, el) => {
            const tagName = $(el)[0].tagName.toLowerCase();
            if (tagName === 'p' || tagName === 'div') {
                $(el).append('\n');
            }
        });

        // Now get the text
        let lyrics = $('div[data-lyrics-container="true"]').text();

        // Clean up excessive newlines
        lyrics = lyrics.replace(/\n{3,}/g, '\n\n').trim();

        const prompt = `Lyrics for "${songTitle}" by ${artist}`;
        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${prompt}, ${lyrics}, 'lyrics')
        `;

        res.json({ success: true, lyrics });
    } catch (error) {
        console.error('Failed to fetch lyrics:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const generateWorkoutQuote = async (req, res) => {
    try {
        const { userId } = req.auth();

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "user", content: `Generate a short, powerful, and motivating workout quote. Random seed: ${Math.random()}` },
            ],
            temperature: 0.9,
            max_tokens: 100,
        });

        const quote = response.choices[0].message.content;

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Workout Motivational Quote', ${quote}, 'workout-quote')`;

        res.json({ success: true, quote });
    } catch (error) {
        console.error('Failed to generate workout quote:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getWordInfo = async (req, res) => {
    try {
        const { word } = req.body;
        const { userId } = req.auth();

        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

        const wordInfo = response.data;

        const prompt = `Meaning and pronunciation for "${word}"`;
        const content = JSON.stringify(wordInfo);

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'word-info')`;

        res.json({ success: true, wordInfo });
    } catch (error) {
        console.error('Failed to fetch word information:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

