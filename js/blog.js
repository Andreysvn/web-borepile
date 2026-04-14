const blogGrid = document.getElementById('blogGrid');
const blogUpdates = document.getElementById('blogUpdates');
const popularPosts = document.getElementById('popularPosts');
const filterButtons = document.querySelectorAll('.filter');
let blogArticles = [];

function createArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('data-aos', 'fade-up');
  card.innerHTML = `
    <img src="${article.image}" alt="${article.title}" loading="lazy" decoding="async">
    <div class="project-info">
      <h3>${article.title}</h3>
      <p>${article.excerpt}</p>
      <a href="${article.link}" class="btn btn-primary">Baca Artikel</a>
    </div>
  `;
  return card;
}

function formatArticleDate(date) {
  if (!date) return '';
  const normalized = date.toString().trim().toLowerCase();
  if (normalized === 'segera' || normalized === 'coming soon' || normalized === 'tbd') return '';
  return `<span class="article-date">${date}</span> `;
}

function formatDateString(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function shouldFetchLastModified(article) {
  if (!article.link || article.link === '#') return false;
  const date = article.date ? article.date.toString().trim().toLowerCase() : '';
  return date === 'segera' || date === 'coming soon' || date === 'tbd' || date === '';
}

function fetchLastModified(article) {
  if (!shouldFetchLastModified(article)) return Promise.resolve(article);
  return fetch(article.link, { method: 'HEAD', cache: 'no-cache' })
    .then(response => {
      const lastModified = response.headers.get('last-modified');
      if (lastModified) {
        const formatted = formatDateString(lastModified);
        if (formatted) {
          article.date = formatted;
          return article;
        }
      }
      if (response.ok) {
        const now = new Date();
        article.date = now.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      return article;
    })
    .catch(() => article);
}

function createUpdateItem(article) {
  const item = document.createElement('li');
  item.innerHTML = `${formatArticleDate(article.date)}${article.link !== '#' ? `<a href="${article.link}">${article.title}</a>` : article.title}`;
  return item;
}

function createPopularItem(article) {
  const item = document.createElement('li');
  item.innerHTML = `${formatArticleDate(article.date)}${article.link !== '#' ? `<a href="${article.link}">${article.title}</a>` : article.title}`;
  return item;
}

function renderArticles(articles) {
  blogGrid.innerHTML = '';
  articles.forEach(article => blogGrid.appendChild(createArticleCard(article)));
}

function renderUpdates(articles) {
  blogUpdates.innerHTML = '';
  articles.forEach(article => blogUpdates.appendChild(createUpdateItem(article)));
}

function renderPopular(articles) {
  popularPosts.innerHTML = '';
  articles.filter(article => article.popular).forEach(article => popularPosts.appendChild(createPopularItem(article)));
}

function applyFilter(category) {
  filterButtons.forEach(button => button.classList.toggle('active', button.dataset.category === category));

  if (category === 'all') {
    renderArticles(blogArticles);
    renderUpdates(blogArticles);
    return;
  }

  const filtered = blogArticles.filter(article => article.categories && article.categories.includes(category));
  renderArticles(filtered);
  renderUpdates(filtered);
}

fetch('blog-data.json')
  .then(response => response.json())
  .then(data => {
    blogArticles = data;
    Promise.all(blogArticles.map(fetchLastModified)).then(updatedArticles => {
      blogArticles = updatedArticles;
      renderArticles(blogArticles);
      renderUpdates(blogArticles);
      renderPopular(blogArticles);

      filterButtons.forEach(button => {
        button.addEventListener('click', () => applyFilter(button.dataset.category));
      });
    });
  })
  .catch(error => {
    console.error('Gagal memuat data blog:', error);
    blogGrid.innerHTML = '<p>Maaf, tidak dapat memuat artikel saat ini.</p>';
    blogUpdates.innerHTML = '<p>Maaf, tidak dapat memuat daftar konten saat ini.</p>';
    popularPosts.innerHTML = '<p>Maaf, tidak dapat memuat artikel populer saat ini.</p>';
  });
