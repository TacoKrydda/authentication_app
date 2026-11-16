import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { UserRow } from "../types/user.js";
import { isValidEmail, isValidPasswordLength } from "../utils/validate.js";
import db from "../db.js";

export const getUserProfile = (req: Request, res: Response): any => {
  try {
    const userId = (req as any).user?.userId;

    const user = db
      .prepare("SELECT id, username, email, createdAt FROM users WHERE id = ?")
      .get(userId) as UserRow | undefined;

    if (!user) {
      return res.status(404).json({ error: "Användaren hittades inte." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Fel vid hämtning av profil:", error);
    return res.status(500).json({ error: "Ett internt serverfel uppstod." });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const userId = (req as any).user?.userId;
    const { email, password } = req.body;

    if (!email && !password) {
      return res.status(400).json({
        error: "Du måste skicka med e-post eller lösenord för att uppdatera.",
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: "Ogiltigt e-postformat." });
    }

    if (password && !isValidPasswordLength(password)) {
      return res
        .status(400)
        .json({ error: "Lösenordet måste vara minst 8 tecken långt." });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(userId) as UserRow;
    if (!user) {
      return res.status(404).json({ error: "Användaren hittades inte." });
    }

    let newEmail = email || user.email;
    let newPassword = user.password;

    if (password) {
      newPassword = await bcrypt.hash(password, 10);
    }

    const update = db.prepare(`
      UPDATE users 
      SET email = ?, password = ? 
      WHERE id = ?
    `);
    update.run(newEmail, newPassword, userId);

    return res
      .status(200)
      .json({ message: "Användarprofilen har uppdaterats!" });
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ error: "E-postadressen används redan." });
    }
    console.error("Fel vid uppdatering av profil:", error);
    return res.status(500).json({ error: "Ett internt serverfel uppstod." });
  }
};

export const deleteUserAccount = (req: Request, res: Response): any => {
  try {
    const userId = (req as any).user?.userId;

    const deleteStatement = db.prepare("DELETE FROM users WHERE id = ?");
    const result = deleteStatement.run(userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Användaren kunde inte hittas." });
    }

    return res
      .status(200)
      .json({ message: "Ditt konto har raderats permanent." });
  } catch (error) {
    console.error("Fel vid borttagning av konto:", error);
    return res.status(500).json({ error: "Ett internt serverfel uppstod." });
  }
};
