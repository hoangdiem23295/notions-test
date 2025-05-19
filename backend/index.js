const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const NOTION_API = "https://api.notion.com/v1/databases";
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_TOKEN = process.env.NOTION_TOKEN;

app.get("/api/notion", async (req, res) => {
  try {
    const response = await axios.post(
      `${NOTION_API}/${DATABASE_ID}/query`,
      {},
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Notion data" });
  }
});

app.post("/api/notion/sorted", async (req, res) => {
  const { sorts = [] } = req.body;

  try {
    const response = await axios.post(
      `${NOTION_API}/${DATABASE_ID}/query`,
      { sorts },
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error in POST /api/notion/sorted:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch sorted Notion data" });
  }
});

app.post("/api/notion/filtered", async (req, res) => {
  const { filter = {}, sorts = [] } = req.body;

  try {
    const response = await axios.post(
      `${NOTION_API}/${DATABASE_ID}/query`,
      {
        filter,
        sorts,
      },
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error in POST /api/notion/filtered:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch filtered Notion data" });
  }
});

app.listen(3001, () => {
  console.log("Backend server running at http://localhost:3001");
});
