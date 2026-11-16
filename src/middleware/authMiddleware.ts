import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Åtkomst nekad. Token saknas." });
  }

  try {
    const secret = process.env.JWT_SECRET || "fallback_secret";

    const decoded = jwt.verify(token, secret);

    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error("JWT-verifiering misslyckades:", error);
    return res.status(401).json({ error: "Ogiltig eller utgången token." });
  }
};
