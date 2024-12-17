const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/chuck", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      error: "You need a query to continue",
    });
  }

  try {
    const response = await axios.get(
      `https://api.chucknorris.io/jokes/search?query=${query}`
    );

    if (response.data.total === 0) {
      return res.status(404).json({
        error: "Doesnt match jokes with this word.",
      });
    }
    const joke = response.data.result[0].value;

    const wordsCount = joke.split(/\s+/).filter(Boolean).length;

    res.json({
      joke: joke,
      words: wordsCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error to get a joke",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running in: port ${PORT}`);
});
