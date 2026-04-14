const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'visitor-counts.json');

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

// Content Security Policy for allowed external resources
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://s10.histats.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://s10.histats.com; img-src 'self' data: https://www.google-analytics.com https://stats.g.doubleclick.net https://sstatic1.histats.com https://www.googletagmanager.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src https://www.google.com https://www.googletagmanager.com;");
  next();
});

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

  res.cookie('apb_last_visit', today, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
  });

  res.json({ count: counts[today] });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
