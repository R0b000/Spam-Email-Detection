# Spam-Email-Detection

Bachlor Project — a full-stack email client that classifies outgoing emails as
**SPAM** or **HAM** using a Python machine-learning model.

## Project Structure

```
Spam-Email-Detection/
├── Python.Service/          # All Python ML code, datasets and trained models
│   ├── detect.py            #   Live classification script (spawned by the Node server)
│   ├── spam.py              #   Training script (trains + saves the models)
│   ├── mail_data.csv        #   Training dataset
│   └── *.joblib             #   Trained TF-IDF vectorizers + Random Forest classifiers
├── client/                  # React + Vite + TypeScript front-end (TSX)
│   ├── src/                 #   .tsx / .ts source (all UI converted from JSX to TSX)
│   └── package.json
└── server/                  # Node/Express REST API (JavaScript)
    ├── index.js
    ├── routes/routes.js
    ├── controller/
    │   ├── email-controller.js   # All API logic (auth, emails, spam detection)
    │   └── spam.js               # Bridge that spawns Python.Service/detect.py
    ├── database/db.js
    ├── models/
    └── package.json
```

## Getting Started

### 1. Python Service

The machine-learning scripts live in `Python.Service/`. They depend on
`scikit-learn` and `joblib`:

```bash
pip install scikit-learn joblib
```

- `detect.py` is invoked at runtime by the Node server (via `child_process`).
- `spam.py` re-trains the models from `mail_data.csv` and writes the `.joblib`
  files that `detect.py` loads.

### 2. Server

```bash
cd server
npm install
npm run dev          # starts on http://localhost:3001
```

Requires a MongoDB connection string. The credentials are read from
`server/.env` (`DB_USERNAME`, `DB_PASSWORD`).

### 3. Client

```bash
cd client
npm install
npm run dev          # Vite dev server
npm run build        # Type-check (tsc) + production build
```

The client is written in TypeScript (`.tsx` / `.ts`).

