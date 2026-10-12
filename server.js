// Small Express server. Restaurants come from public/data/restaurants.json,
// so no database is needed. The same file is also fetched directly by the
// front end if /api is unavailable (e.g. when you use Live Server).
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "public", "data", "restaurants.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/restaurants", (req, res) => {
  try {
    const { town, category, q } = req.query;
    let list = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    if (town) list = list.filter((r) => r.town === town);
    if (category) list = list.filter((r) => r.category === category);
    if (q) {
      const needle = String(q).toLowerCase();
      list = list.filter((r) =>
        JSON.stringify(r).toLowerCase().includes(needle)
      );
    }
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve restaurants" });
  }
});

app.listen(PORT, () => {
  console.log(`Mangan Tamu running at http://localhost:${PORT}`);
});
