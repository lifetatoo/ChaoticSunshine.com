const { esc } = require('./devotional-content.cjs');
const cfg = require('./settings.json');
const posts = require('./devotions/devotions.json');
const guides = require('./content-library/products.json');
const teaching = require('./teaching-illustrations.json');
const shares = require('./assets/26-share-cards/manifest.json');

const root = (cfg.siteKit?.publicBaseUrl || cfg.publicBaseUrl || 'https://chaoticsunshine.com').replace(/\/$/, '');
const canonicalFor = slug => root + (slug === 'index' ? '/' : slug === 'start' ? (cfg.siteKit?.startRoute || '/start') : '/' + slug);
const home = canonicalFor('index');
const organizationId = home + '#organization';
const websiteId = home + '#website';
const authorId = home + '#amy-grace';
const logo = '25-brand-icons/favicon-teal-v2-512.png';
exports.logo = logo;
const ref = id => ({ '@id': id });

const collections = {
  freebies: ['Free Guides', guides],
  'soul-snacks': ['Soul Snacks', posts],
  'scripture-index': ['Scripture Index', posts],
  'teaching-shelf': ['Teaching Shelf', teaching.items.map(item => ({ ...item, slug: 'teaching-' + item.slug }))],
  'identity-belonging': ['Identity and belonging', posts],
  'prayer-trust': ['Prayer and trust', posts],
  'rest-rootedness': ['Rest and rootedness', posts]
};
for(const topic of require('./reader-topics.json'))collections['for-'+topic.id]=[topic.meaning,posts.filter(post=>post.readerTopic===topic.id)];

const plain = value => String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function linkedItems(body, entries) {
  const lookup = new Map(entries.map(entry => [entry.slug, entry]));
  const items = new Map();
  for (const match of body.matchAll(/href="\/?(?:\.\/)?([a-z\d-]+)(?:\.html)?(?:#[^"]*)?"/g)) {
    const entry = lookup.get(match[1]);
    if (entry) items.set(entry.slug, entry);
  }
  return [...items.values()].map((entry, index) => ({
    '@type': 'ListItem', position: index + 1, name: entry.title, url: canonicalFor(entry.slug)
  }));
}

function trail(slug, title) {
  if (slug === 'index' || slug === '404') return [];
  const group = posts.some(post => post.slug === slug) ? 'soul-snacks'
    : guides.some(guide => guide.slug === slug) ? 'freebies'
    : teaching.items.some(item => 'teaching-' + item.slug === slug) ? 'teaching-shelf' : '';
  const crumbs = [['index', 'Home']];
  if (group) crumbs.push([group, collections[group][0]]);
  crumbs.push([slug, collections[slug]?.[0] || title.replace(/\s*\|.*$/, '')]);
  return crumbs;
}

exports.breadcrumbs = (slug, title, href) => {
  const crumbs = trail(slug, title);
  if (!crumbs.length) return '';
  return `<nav class="site-crumbs wrap" aria-label="Breadcrumb"><ol>${crumbs.map(([route, label], index) =>
    `<li>${index === crumbs.length - 1 ? `<span aria-current="page">${esc(label)}</span>`
      : `<a href="${href(route === 'index' ? '/' : '/' + route)}">${esc(label)}</a>`}</li>`).join('')}</ol></nav>`;
};

exports.data = (slug, title, body) => {
  const post = posts.find(entry => entry.slug === slug);
  const guide = guides.find(entry => entry.slug === slug);
  const lesson = teaching.items.find(entry => 'teaching-' + entry.slug === slug);
  const collection = collections[slug];
  const share = shares[slug];
  const description = share?.description || post?.description || plain(body).slice(0, 165);
  const canonical = canonicalFor(slug);
  const image = share && { '@type': 'ImageObject', url: root + '/assets/' + share.file, width: 1200, height: 630 };
  const organization = {
    '@type': 'Organization', '@id': organizationId, name: 'Chaotic Sunshine', url: home,
    logo: { '@type': 'ImageObject', url: root + '/assets/' + logo, width: 512, height: 512 }
  };
  const website = {
    '@type': 'WebSite', '@id': websiteId, name: 'Chaotic Sunshine', url: home,
    publisher: ref(organizationId), inLanguage: 'en-US'
  };
  const author = { '@type': 'Person', '@id': authorId, name: 'Amy Grace', url: canonicalFor('about') };
  const pageId = canonical + '#webpage';
  const page = {
    '@type': collection ? 'CollectionPage' : slug === 'about' ? 'AboutPage' : 'WebPage',
    '@id': pageId, url: canonical, name: title, description, inLanguage: 'en-US', isPartOf: ref(websiteId)
  };
  if (image) page.primaryImageOfPage = image;
  const graph = [organization, website, author, page];
  const crumbs = trail(slug, title);
  if (crumbs.length) {
    const id = canonical + '#breadcrumb';
    page.breadcrumb = ref(id);
    graph.push({
      '@type': 'BreadcrumbList', '@id': id,
      itemListElement: crumbs.map(([route, name], i) => ({ '@type': 'ListItem', position: i + 1, name, item: canonicalFor(route) }))
    });
  }
  if (collection) {
    const items = linkedItems(body, collection[1]);
    if (items.length) {
      const id = canonical + '#collection';
      page.mainEntity = ref(id);
      graph.push({ '@type': 'ItemList', '@id': id, name: collection[0], numberOfItems: items.length, itemListElement: items });
    }
  }
  if (post) {
    const id = canonical + '#devotion';
    page.mainEntity = ref(id);
    const article = {
      '@type': 'BlogPosting', '@id': id, url: canonical, mainEntityOfPage: ref(pageId),
      headline: post.title, description, author: ref(authorId), publisher: ref(organizationId),
      image, inLanguage: 'en-US', isAccessibleForFree: true, articleSection: post.movementName,
      citation: post.reading, isBasedOn: { '@type': 'Book', name: 'Beloved, Really', author: ref(authorId) }
    };
    for (const key of ['datePublished', 'dateModified']) if (post[key]) article[key] = post[key];
    graph.push(article);
  }
  if (guide || lesson) {
    const id = canonical + '#resource';
    page.mainEntity = ref(id);
    const resource = {
      '@type': 'LearningResource', '@id': id, url: canonical, mainEntityOfPage: ref(pageId),
      name: (guide || lesson).title, description, creator: ref(authorId), publisher: ref(organizationId),
      image, inLanguage: 'en-US', learningResourceType: guide ? 'Bible study guide' : 'Teaching illustration'
    };
    if (guide?.isFree || lesson) resource.isAccessibleForFree = true;
    const pdfs = [...new Set([...body.matchAll(/href="(\/?(?:guides|assets\/22-teaching-illustrations)\/[^"]+\.pdf)"/gi)].map(match => match[1]))];
    if (pdfs.length) resource.encoding = pdfs.map(file => ({
      '@type': 'MediaObject', contentUrl: new URL(file, home).href, encodingFormat: 'application/pdf'
    }));
    graph.push(resource);
  }
  if (slug === 'about') page.mainEntity = ref(authorId);
  return { slug, title, description, canonical, article: Boolean(post), schema: { '@context': 'https://schema.org', '@graph': graph } };
};

exports.head = d => d.slug === '404'
  ? '<meta name="robots" content="noindex, follow">'
  : `${d.slug==='welcome'?'<meta name="robots" content="noindex, follow">':''}<meta name="description" content="${esc(d.description)}"><link rel="canonical" href="${esc(d.canonical)}"><meta property="og:type" content="${d.article ? 'article' : 'website'}"><meta property="og:title" content="${esc(d.title)}"><meta property="og:description" content="${esc(d.description)}"><meta property="og:url" content="${esc(d.canonical)}"><script type="application/ld+json">${JSON.stringify(d.schema).replaceAll('<','\\u003c')}</script>`;
