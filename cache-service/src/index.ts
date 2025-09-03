import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import postsRouter from "./routes/posts";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// TODO: fix - this allows all origins
app.use(cors());

app.use(express.json());

app.use("/cache", postsRouter);

app.listen(port, () => {
  console.log(`Node service running on http://localhost:${port}`);
});

