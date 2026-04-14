const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'visitor-counts.json');

app.set('trust proxy', true);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowAny = allowedOrigins.includes('*');

  if (origin && (allowAny || allowedOrigins.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', allowAny ? '*' : origin);
    if (!allowAny) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

function loadCounts() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (error) {
    return {};
  }
}

function saveCounts(counts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(counts, null, 2), 'utf8');
}

app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

app.get('/api/visitor-today', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const lastVisit = req.cookies?.apb_last_visit;
  const counts = loadCounts();

  if (!counts[today]) {
    counts[today] = 0;
  }

  if (lastVisit !== today) {
    counts[today] += 1;
    saveCounts(counts);
  }

  const useSecureCookie = req.secure || req.headers['x-forwarded-proto'] === 'https';

  res.cookie('apb_last_visit', today, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'None',
    secure: useSecureCookie,
    path: '/',
  });

  res.json({ count: counts[today] });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
