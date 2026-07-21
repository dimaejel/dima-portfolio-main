import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  try {
    const { default: app } = await import("../server/src/index.ts");

    return app(req, res);
  } catch (error) {
    console.error("SERVER LOAD ERROR:", error);

    return res.status(500).json({
      error: "Server failed to load",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}