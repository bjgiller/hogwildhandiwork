const fs = require('fs');

const text = fs.readFileSync(__dirname + '/plan-text.txt', 'utf8');
const pages = text.split('\f');

const results = [];
pages.forEach((pageText, idx) => {
  const pageNum = idx + 1; // pdftotext pages are 1-indexed, form-feed-delimited
  const re = /disc golf/gi;
  let m;
  while ((m = re.exec(pageText)) !== null) {
    const start = Math.max(0, m.index - 150);
    const end = Math.min(pageText.length, m.index + 150);
    let snippet = pageText.slice(start, end).replace(/\s+/g, ' ').trim();
    results.push({ page: pageNum, snippet });
  }
});

console.log(`Total mentions: ${results.length}`);
console.log(`Pages with mentions: ${new Set(results.map(r => r.page)).size}`);
fs.writeFileSync(__dirname + '/disc-golf-mentions.json', JSON.stringify(results, null, 2));
results.forEach(r => {
  console.log(`\n--- page ${r.page} ---`);
  console.log(r.snippet);
});
