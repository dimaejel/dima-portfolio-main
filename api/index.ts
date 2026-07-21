import express from "express";
import { supabase } from "../server/src/supabase.js";

const app = express();

app.get("/api/skills", async (_req, res) => {
  try {
    const { data, error } = await supabase.from("skills").select("*");

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default app;
