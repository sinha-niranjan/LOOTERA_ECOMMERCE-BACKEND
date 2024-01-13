import express from "express";
const app = express();
const port = 4000;
app.get("/product", (req, res) => {
    res.send("dfjsdfjs");
});
app.listen(port, () => {
    console.log(`Express is working on http://localhost:${port}`);
});
