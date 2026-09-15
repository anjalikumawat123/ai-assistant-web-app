require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const path = require("path");

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

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
       model: "groq/compound-mini",
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
