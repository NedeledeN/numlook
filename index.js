import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Pour __dirname dans ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
//   ROUTE RACINE
// =========================
app.get("/", (req, res) => {
  // Option 1 : texte simple
  res.send("Bienvenue sur Numlook API !");
  
  // Option 2 : servir un fichier HTML (décommente si tu as index.html)
  // res.sendFile(path.join(__dirname, "index.html"));
});

// =========================
//   ENDPOINT /search
// =========================
app.get("/search", async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).json({ error: "Numéro manquant" });
  }

  try {
    const API_KEY = process.env.NUMVERIFY_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Clé API Numverify manquante" });
    }

    const url = `http://apilayer.net/api/validate?access_key=${API_KEY}&number=${phone}&country_code=&format=1`;

    const apiRes = await fetch(url);
    const data = await apiRes.json();

    console.log("Réponse numverify :", data);

    if (data.error) {
      return res.status(400).json({
        error: "Erreur API Numverify",
        info: data.error
      });
    }

    const result = {
      valid: data.valid ?? null,
      number: data.international_format ?? null,
      local_format: data.local_format ?? null,
      country: data.country_name ?? null,
      country_code: data.country_code ?? null,
      location: data.location ?? null,
      carrier: data.carrier ?? null,
      line_type: data.line_type ?? null
    };

    res.json(result);

  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ error: "Erreur interne au serveur" });
  }
});

// =========================
//   LANCER LE SERVEUR
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend lancé sur port ${PORT}`);
});
