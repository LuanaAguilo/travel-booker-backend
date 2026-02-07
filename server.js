const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const DB_PATH = path.join(__dirname, "db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.get("/experiences", (req, res) => {
  const db = readDB();
  res.json(db.experiences);
});

app.post("/experiences", (req, res) => {
  const db = readDB();

  const newExperience = {
    id: uuidv4(),
    title: req.body.title,
    city: req.body.city,
    date: req.body.date,
    price: req.body.price,
    spotsTotal: req.body.spotsTotal,
    spotsLeft: req.body.spotsTotal,
    description: req.body.description,
  };

  db.experiences.push(newExperience);
  writeDB(db);

  res.status(201).json(newExperience);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
