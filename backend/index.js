
require('dotenv').config(); // You can import it as a module if you want using package.json
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
const app = express();

const port = 8080;

app.use(bodyParser.json());

app.use(cors());



const configuration = new Configuration({
    organization: process.env.OPENAI_ORG, // Assuming you have this in your .env
    apiKey: process.env.OPENAI_API_KEY // Your API key variable
});



const openai = new OpenAIApi(configuration);


app.post("/",async (req,res) => {

    const {chats} = req.body;
    
    const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are SofianosGPT. You can write emails and letters",
            },
            ...chats,

        ],

    });

    res.json({
        output: result.data.choices[0].message
    });
});




app.listen(port, () => {
    console.log(`Listening on port ${port}`);

})