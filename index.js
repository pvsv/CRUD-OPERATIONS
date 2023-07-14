const express = require("express");
const app = express();
const path = require("path");
const bp = require("body-parser");
const bep = bp.urlencoded({ extended: false });
const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const cors = require("cors");

app.use(cors());
app.use(express.json());

client.connect();
console.log("C0nnected..........");
const db = client.db("dbname");
const col = db.collection("colle");

app.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/", async (req, res) => {
  try {
    console.log("Get request");
    const fr = await col.find({}).toArray();
    res.json(fr);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occured");
  }
});
app.post("/", bep, async (req, res) => {
  let x = { fname: req.body.fname, lname: req.body.lname };
  res.send();
  const ir = await col.insertOne(x);
  console.log(ir);
});

app.put("/", async (req, res) => {
  try {
    const { fname, newfname } = req.body;
    const result = await col.updateOne(
      { fname },
      { $set: { fname: newfname } }
    );
    if ((result, matchedCount === 0)) {
      res.status(404).send("First name not found");
    } else {
      res.send(`Document Updated: ${fname} -> ${newfname}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error occurred`);
  }
});

app.delete("/", async (req, res) => {
  try {
    const { fname } = req.body;
    const result = await col.deleteOne({ fname });
    if (result.deleteCount === 0) {
      res.status(404).send(`First name not found`);
    } else {
      res.send(`Deleted document with firstname:${fname}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error occured`);
  }
});
app.listen(3000, () => {
  console.log(`server runs on https://127.0.0.1:3000`);
});
