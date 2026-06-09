require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/ask", async (req, res) => {
  try {
    const message = req.body.message;

    const chatCompletion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
       model: "llama-3.1-8b-instant",
      });

    res.json({
      reply:
        chatCompletion.choices[0].message.content,
    });

  }catch (error) {
  console.error(error);

  res.status(500).json({
    reply: error.message
  });
}
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});