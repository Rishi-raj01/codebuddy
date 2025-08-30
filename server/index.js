import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config()




//Setting up Express
const app = express()
app.use(cors())
app.use(express.json())


// const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//Setting up the routes
//get Route
app.get('/', (req, res)=>{
    res.status(200).send({
        message:'Hello, this works fine'
    })
})


app.post("/", async (req, res) => {
    try {
    // const prompt = req.body.prompt;
    const prompt="write a function to reverse a string in python";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).send({
        bot: text,
    });
    } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
}
});







//Listen
app.listen(3000, ()=>{
    console.log("Server is running on Port http://localhost:3000")
})