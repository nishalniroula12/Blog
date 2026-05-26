import express from "express";
import dotenv from "dotenv";
import connectdatabases from "./config/dbs.js";
import categoryroutes from "./route/categoryroutes.js";
import blogroutes from "./route/blogpostroutes.js";
import userroutes from "./route/userroutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
connectdatabases();

app.use("/api", categoryroutes);
app.use("/api", blogroutes);
app.use("/api", userroutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "created successful",
  });
});

const Port = 4000;

app.listen(Port, () => {
  console.log("server is running", Port);
});
