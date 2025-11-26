const express = require("express");
const db = require("./db");
const app = express();
app.use(express.json());
app.get("/", (req, res) => res.send("Admin Service running"));
app.listen(3004, () => console.log("🛠 Admin Service running on port 3004"));
