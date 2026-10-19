import mongoose from "mongoose";
import shortid from "shortid";

const urlSchema = new mongoose.Schema(
  {
    fullURL: {
      type: String,
      unique: true,
      required: true,
    },
    shortURL: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const URL = new mongoose.model("URL", urlSchema);
export default URL;
