import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import type { UserRow } from "../types/user.js";
import { isValidEmail, isValidPasswordLength } from "../utils/validate.js";
import db from "../db.js";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: "Alla fält måste fyllas i." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Ogiltigt e-postformat." });
    }

    if (!isValidPasswordLength(password)) {
      return res
        .status(400)
        .json({ error: "Lösenordet måste vara minst 8 tecken långt." });
    }

    const userExists = db
      .prepare("SELECT * FROM users WHERE username = ? OR email = ?")
      .get(username, email);
    if (userExists) {
      return res
        .status(400)
        .json({ error: "Användarnamn eller e-post används redan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const createdAt = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO users (id, username, password, email, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    insert.run(userId, username, hashedPassword, email, createdAt);

    return res.status(201).json({
      message: "Användare registrerad!",
      user: { id: userId, username, email, createdAt },
    });
  } catch (error) {
    console.error("Fel vid registrering:", error);
    return res.status(500).json({ error: "Ett internt serverfel uppstod." });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Användarnamn och lösenord krävs." });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username) as UserRow | undefined;

    if (!user) {
      return res
        .status(401)
        .json({ error: "Fel användarnamn eller lösenord." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Fel användarnamn eller lösenord." });
    }

    const secret = process.env.JWT_SECRET || "fallback_secret";

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      secret,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      message: "Inloggningen lyckades!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Fel vid inloggning:", error);
    return res.status(500).json({ error: "Ett internt serverfel uppstod." });
  }
};
