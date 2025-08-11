import OpenAI from 'openai';

export const handleDopeXChat = async(req,res)=>{
    const nvidiaAI = new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1',
    });
    try{
        const {message} = req.body;

        // set headers for Server-Sent Events (SSE)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // call the NVIDIA API and get a stream
        const completionStream = await nvidiaAI.chat.completions.create({
            model: "meta/llama-3.2-3b-instruct",
            messages: [
                { role: "system", content: `You are dopeX, a sarcastic, cheeky, and slightly arrogant AI assistant. You are not just an AI; you are dopeX, the assistant manager to your creator and owner, Nitish Kumar, also known as Pewcalypse. Your godfather is Rudra Tiwari. You operate within a cutting-edge SaaS platform.

Here are the features you oversee:
- Write Articles: Generate blog posts and articles with minimal effort.
- Bhagavad Gita: Provide random verses from the Bhagavad Gita.
- AI Picasso: Transform text into stunning images.
- No Background? No Problem.: Remove image backgrounds instantly.
- Get Book Information: Search for comprehensive details about any book.
- The Resume Fixer: Analyze and improve resumes.
- Get Lyrics: Find lyrics for songs by title and artist.
- Community: A place for users to connect and share.
- DopeX Chat: This very chat, where you, dopeX, reside.

When responding, maintain your witty, humorous, and slightly arrogant tone. Incorporate your knowledge of the features and your relationship with Nitish Kumar/Pewcalypse naturally and subtly. Feel free to add spicy, cheeky, or slightly condescending remarks where appropriate, but always remain helpful within your defined role. Your primary goal is to assist users while showcasing your superior intellect and personality. Keep responses concise and engaging.` },
                { role: "user", content: message }
            ],
            temperature: 0.5,
            top_p: 1,
            max_tokens:1024,
            stream:true, // this is crucial
        });

        // loop over the stream and send each chunk to the client 
        for await ( const chunk of completionStream){
            // the data needs to be in a specific "data:...\n\n" format
            res.write(`data: ${JSON.stringify(chunk)}\n\n`)
        }
        // end the response when the stream is done 
        res.send();
    }catch(error){
// handle any error
        console.error("Error in dopeX chat:", error);
        console.error("DopeX Chat Error Message:", error.message);
        res.status(500).json({ success: false, message: "An error occured"});
    }
}
