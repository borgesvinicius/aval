import express from "express";
const app = express();
app.use(express.json());

app.listen(8080, () => console.log("server nice on g"));
