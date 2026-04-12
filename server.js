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
