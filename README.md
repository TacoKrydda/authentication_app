# Authentication Backend (Node.js + Express + TypeScript)

Detta är en robust och typsäker backend för användarautentisering byggd med **TypeScript**, **Express** och **SQLite**. Projektet är strukturerat efter professionell branschstandard (MVC-arkitektur) med fokus på hög säkerhet och strikt typning.

## 🚀 Funktioner

- **Registrering & Inloggning**: Säker hantering av användarkonton.
- **Lösenordskryptering**: Envägshashning med `bcryptjs` (10 salt rounds).
- **JWT-autentisering**: Tidsbegränsade sessioner (1 timme) med JSON Web Tokens.
- **Skyddade Routes**: Middleware som verifierar JWT innan känslig data exponeras.
- **CRUD för Användare**: Möjlighet att hämta profil, uppdatera uppgifter (e-post/lösenord) samt radera konto permanent.
- **Datavalidering**: Server-side validering av e-postformat (RegEx) och lösenordslängd (minst 8 tecken).
- **Strikt Typning**: Centraliserade gränssnitt (`interfaces`) för databasmodeller.

---

## 📁 Projektstruktur

```text
authentication/
├── src/
│   ├── controllers/       # Affärslogik (authController, userController)
│   ├── middleware/        # Säkerhetsfilter (authMiddleware)
│   ├── routes/            # Endpoints/Sökvägar (authRoutes, userRoutes)
│   ├── types/             # Centraliserade TypeScript-interfaces (user.ts)
│   ├── utils/             # Hjälpfunktioner/Validering (validate.ts)
│   ├── api.ts             # Samlingsfil (Router-hub) för alla API-rutter
│   ├── db.ts              # Databasanslutning (db.ts)
│   └── index.ts           # Serverns startfil och middleware-konfiguration
├── data/                  # Skapas automatiskt (innehåller database.db)
├── .env                   # Miljövariabler (hemliga nycklar och portar)
├── package.json           # Hantering av dependencies och script
└── tsconfig.json          # TypeScript-konfiguration
```

---

## 🛠️ Installation och Förberedelser

### 1. Klona eller ladda ner projektet
Se till att du befinner dig i projektets rotmapp i din terminal.

### 2. Installera alla dependencies
Kör följande kommando för att installera både produktionspaket och utvecklingsverktyg för TypeScript:
```bash
npm install
```

### 3. Konfigurera miljövariabler (`.env`)
Skapa en fil med namnet `.env` direkt i projektets rotmapp och lägg till följande variabler:
```env
PORT=3000
JWT_SECRET=byt_ut_detta_till_ditt_super_hemliga_losenord_123!
```

---

## ⚙️ Utveckling och Körning

Projektet använder `tsx` för att köra TypeScript-filer direkt utan manuell kompilering, samt övervaka filändringar för automatiska omstarter.

### Starta servern i utvecklingsläge
Kör kommandot nedan för att starta servern med automatisk omstart vid sparande:
```bash
npm run dev
```
Servern kommer att starta på `http://localhost:3000` (eller den port du angav i `.env`). Databasmappen och `.db`-filen skapas automatiskt vid första uppstart om de saknas.

---

## 🛰️ API Endpoints

Alla anrop görs med `Content-Type: application/json`.


| Metod | Endpoint | Beskrivning | Autentisering | Body (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Registrera ny användare | Nej | `username`, `email`, `password` |
| **POST** | `/api/auth/login` | Logga in och få JWT-token | Nej | `username`, `password` |
| **GET** | `/api/users/profile` | Hämta inloggad användares profil | **Ja (Bearer Token)** | Ingen |
| **PUT** | `/api/users/profile` | Uppdatera e-post eller lösenord | **Ja (Bearer Token)** | `email` och/eller `password` |
| **DELETE** | `/api/users/profile` | Radera kontot permanent | **Ja (Bearer Token)** | Ingen |

### Exempel på Autentisering i HTTP Headers:
För att komma åt de skyddade rutterma (`/api/users/*`) måste JWT-token skickas med i anropets header:
```text
Authorization: Bearer <DITT_JWT_TOKEN_HÄR>
```

---

## 📦 Använda Teknologier

- **Runtime**: [Node.js](https://nodejs.org) (v20+)
- **Språk**: [TypeScript](https://typescriptlang.org)
- **Server**: [Express](https://expressjs.com)
- **Databas**: [better-sqlite3](https://github.com)
- **Kryptering**: [bcryptjs](https://github.com)
- **Token**: [jsonwebtoken](https://github.com)
- **Verktyg**: [tsx](https://github.com) (för watch-mode och TypeScript-exekvering)
