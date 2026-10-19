import express from "express";
import URL from "../models/urlModel.js";

const router = express.Router();

router.get("/history", async (req, res) => {
  try {
    const data = await URL.find().select({
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(`Error getting URLs`, err);
    res.status(500).json({
      success: false,
      message: "Error getting URLs",
      error: err.message,
    });
  }
});

router.get("/:shortURL", async (req, res) => {
  try {
    const shortURL = await URL.findOne({ shortURL: req.params.shortURL });
    if (!shortURL)
      return res
        .status(404)
        .json({ success: false, message: "short URL not found" });

    shortURL.clicks += 1;
    await shortURL.save();

    res.redirect(shortURL.fullURL);
  } catch (err) {
    console.error(`Error redirecting URL`, err);
    res.status(500).json({
      success: false,
      message: "Error redirecting URL",
      error: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { fullURL } = req.body;
    if (!fullURL)
      return res
        .status(400)
        .json({ success: false, message: "URL is required" });

    const data = await URL.create({
      fullURL,
    });

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error(`Error creating shortURL`, err);
    res.status(500).json({
      success: false,
      message: "Error creating shortURL",
      error: err.message,
    });
  }
});

router.post("/:shortURL", async (req, res) => {
  try {
    const shortURL = await URL.findOne({ shortURL: req.params.shortURL });
    if (!shortURL)
      return res
        .status(404)
        .json({ success: false, message: "short URL not found" });

    shortURL.clicks = 0;
    await shortURL.save();

    const data = await URL.find().select({
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    res.status(200).json({ success: true, data: data });
  } catch (err) {
    console.error(`Error clearing counter`, err);
    res.status(500).json({
      success: false,
      message: "Error clearing counter",
      error: err.message,
    });
  }
});

router.delete("/:shortURL", async (req, res) => {
  try {
    const shortURL = await URL.findOne({ shortURL: req.params.shortURL });

    if (!shortURL)
      return res
        .status(404)
        .json({ success: false, message: "short URL not found" });

    await shortURL.deleteOne();

    const data = await URL.find().select({
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    res.status(200).json({ success: true, data: data });
  } catch (err) {
    console.error(`Error clearing counter`, err);
    res.status(500).json({
      success: false,
      message: "Error clearing counter",
      error: err.message,
    });
  }
});

export default router;
