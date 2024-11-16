import path from "path";
import express from "express";
import { readFile } from "fs";

const PORT = process.env.PORT || 3000;
const app = express();
const __dirname = path.resolve();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let dataMap = new Map();
readFile("data.json", "utf8", (err, data) => {
  if (err) {
    console.error("JSON dosyası okunurken hata oluştu:", err);
    return;
  }

  const jsonData = JSON.parse(data);

  for (const key in jsonData) {
    dataMap.set(key, jsonData[key]);
  }

  console.log("Veriler Map'e başarıyla yüklendi!");
});

app.get("/findValue", (req, res) => {
  const key = req.query.key;

  if (dataMap.has(key)) {
    res.json(dataMap.get(key));
  } else {
    res.json({});
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/find-your-cuberoot-31-day", (req, res) => {
  res.render("find");
});

app.get("/find-your-cuberoot-31-day/:date", (req, res) => {
  const date = req.params.date;
  let dateStr = date.match(/.{2}/g).join("-");

  const value = dataMap.get(date);
  if (value) {
    const before = value[0];
    const position = value[1];
    const after = value[2];

    res.render("result", {
      dateStr,
      before,
      position,
      after,
    });
  } else {
    res.status(404).send("Data not found for this birthdate.");
  }
});

app.get("/cuberoot-31", (req, res) => {
  res.render("cuberoot");
});
app.get("/learn-cuberoot-31", (req, res) => {
  res.render("learn");
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Error occurred, server can't start", error);
  }
  console.log(
    "Server is Successfully Running, and App is listening on port " + PORT
  );
});
