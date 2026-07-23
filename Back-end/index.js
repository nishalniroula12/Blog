import "dotenv/config.js"

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectdatabases from "./config/dbs.js";
import categoryroutes from "./route/categoryroutes.js";
import blogroutes from "./route/blogpostroutes.js";
import userroutes from "./route/userroutes.js";


const app = express();

app.use(
  cors({
    origin: "https://blog-six-tau-68.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

connectdatabases();

app.use("/api", categoryroutes);
app.use("/api", blogroutes);
app.use("/api", userroutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server running successfully",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});