import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import publicRoutes from "./routes/publicRoutes.js";

const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", publicRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*any", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

connectDB();
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
