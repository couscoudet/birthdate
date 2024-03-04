import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT);
console.log(
  `application start on port ${process.env.PORT}, available at http:localhost:${process.env.PORT}`
);
