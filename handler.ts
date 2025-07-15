import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/", (_, res ) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (_, res) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((_, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);