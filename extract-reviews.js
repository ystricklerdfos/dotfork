// Script to extract review metadata from HTML files and create all-reviews.json
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const reviewsDir = path.join(__dirname, 'reviews');
const outputFile = path.join(__dirname, 'all-reviews.json');

// Get all HTML files in reviews directory
const reviewFiles = fs.readdirSync(reviewsDir)
    .filter(file => file.endsWith('.html'))
    .sort();

console.log(`Found ${reviewFiles.length} review files`);

const allReviews = [];

reviewFiles.forEach(filename => {
    const filePath = path.join(reviewsDir, filename);
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);

    // Extract review data from HTML structure
    const name = $('.review-title').text().trim();
    const metaText = $('.review-meta').text().trim();
    const url = $('.review-url a').attr('href')?.replace('https://', '') || '';
    const rating = parseFloat($('.rating').text().trim());
    const verdict = $('.verdict-box').text().trim().replace('VERDICT:', '').trim();

    // Parse meta text to extract category, reviewer, and date
    // Format: "Category | Reviewed by Name | Date"
    const metaParts = metaText.split('|').map(s => s.trim());
    const category = metaParts[0] || '';
    const reviewer = metaParts[1]?.replace('Reviewed by ', '') || '';
    const date = metaParts[2] || '';

    // Check if it has Best New Website badge
    const isBNW = $('.bnw-badge').length > 0 || rating >= 8.5;

    // Extract review text (all paragraphs in review-body)
    const reviewText = $('.review-body p')
        .map((i, el) => $(el).text().trim())
        .get()
        .join('\n\n');

    const review = {
        site: {
            name: name,
            url: url
        },
        category: category,
        reviewer: reviewer,
        date: date,
        rating: rating,
        isBNW: isBNW,
        reviewText: reviewText,
        verdict: verdict,
        filename: filename.replace('.html', '')
    };

    allReviews.push(review);
    console.log(`✓ Extracted: ${name} (${rating})`);
});

// Sort by rating (highest to lowest)
allReviews.sort((a, b) => b.rating - a.rating);

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(allReviews, null, 2));
console.log(`\n✓ Generated ${outputFile} with ${allReviews.length} reviews`);
console.log(`\nRating distribution:`);
console.log(`  Best New Websites (8.5+): ${allReviews.filter(r => r.rating >= 8.5).length}`);
console.log(`  Good to Excellent (7.0-8.4): ${allReviews.filter(r => r.rating >= 7.0 && r.rating < 8.5).length}`);
console.log(`  Fair (6.0-6.9): ${allReviews.filter(r => r.rating >= 6.0 && r.rating < 7.0).length}`);
console.log(`  Below Fair (<6.0): ${allReviews.filter(r => r.rating < 6.0).length}`);
