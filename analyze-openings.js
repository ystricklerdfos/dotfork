// Analyze opening sentences of all reviews
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const reviewsDir = path.join(__dirname, 'reviews');
const reviewFiles = fs.readdirSync(reviewsDir)
    .filter(file => file.endsWith('.html'))
    .sort();

console.log('Opening sentences analysis:\n');

const openings = [];

reviewFiles.forEach(filename => {
    const filePath = path.join(reviewsDir, filename);
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);

    const firstParagraph = $('.review-body p').first().text().trim();
    const firstSentence = firstParagraph.split(/[.!?]/)[0] + '.';
    const first50 = firstSentence.substring(0, 80) + '...';

    openings.push({ filename, opening: firstSentence, preview: first50 });

    console.log(`${filename.replace('.html', '').padEnd(20)} ${first50}`);
});

// Find common patterns
console.log('\n\nCommon patterns:');
const patterns = {
    "There's something deeply": 0,
    "There's something profoundly": 0,
    "There's something": 0,
    "Look,": 0,
    "The first thing": 0,
    "Visiting": 0,
    "Landing on": 0
};

openings.forEach(({ opening }) => {
    for (const pattern in patterns) {
        if (opening.startsWith(pattern)) {
            patterns[pattern]++;
        }
    }
});

for (const [pattern, count] of Object.entries(patterns)) {
    if (count > 0) {
        console.log(`"${pattern}" - ${count} times`);
    }
}
