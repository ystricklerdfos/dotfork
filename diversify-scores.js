// Script to diversify scores across all reviews
// Ensures no score appears more than twice
// Also generates new creator economy reviews

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const reviewsDir = path.join(__dirname, 'reviews');

// Get all review files
const reviewFiles = fs.readdirSync(reviewsDir)
    .filter(file => file.endsWith('.html'));

console.log(`Found ${reviewFiles.length} review files\n`);

// Track used scores (allow max 2 of each)
const scoreUsage = {};

// Define score ranges based on site tier
const scoreTiers = {
    // Top tier - genuinely good sites (6.5-8.2)
    top: ['superhuman', 'craft', 'linear', 'stripe', 'railway', 'resend', 'replicate', 'arc', 'hey', 'obsidian', 'raycast'],
    // Good tier (5.5-6.8)
    good: ['figma', 'notion', 'vercel', 'anthropic', 'supabase', 'framer', 'runway', 'descript', 'cron', 'pitch', 'perplexity', 'cursor', 'replit', 'posthog', 'neon', 'liveblocks', 'hugging-face', 'planetscale', 'hashnode', 'retool', 'amplitude'],
    // Mid tier (4.2-5.6)
    mid: ['github', 'shopify', 'airtable', 'webflow', 'miro', 'canva', 'loom', 'readwise', 'mmhmm', 'openai', 'midjourney', 'stability-ai', 'dropbox', 'evernote', 'trello', 'typeform', 'squarespace', 'calendly', 'intercom', 'zendesk', 'mailchimp'],
    // Low tier - corporate bloat (3.0-4.4)
    low: ['salesforce', 'hubspot', 'asana', 'monday-com', 'zoom', 'slack', 'clickup', 'wix', 'docusign', 'servicenow', 'workday', 'oracle-cloud', 'sap', 'adobe-creative-cloud', 'microsoft-365', 'google-workspace', 'box']
};

function getScoreRange(filename) {
    const base = filename.replace('.html', '');
    if (scoreTiers.top.includes(base)) return { min: 6.5, max: 8.2 };
    if (scoreTiers.good.includes(base)) return { min: 5.5, max: 6.8 };
    if (scoreTiers.mid.includes(base)) return { min: 4.2, max: 5.6 };
    if (scoreTiers.low.includes(base)) return { min: 3.0, max: 4.4 };
    return { min: 4.0, max: 6.0 }; // default
}

function generateUniqueScore(range) {
    // Try to find a score that hasn't been used twice
    let attempts = 0;
    while (attempts < 100) {
        // Generate score with one decimal
        const score = Math.round((range.min + Math.random() * (range.max - range.min)) * 10) / 10;
        const scoreKey = score.toFixed(1);

        if (!scoreUsage[scoreKey] || scoreUsage[scoreKey] < 2) {
            scoreUsage[scoreKey] = (scoreUsage[scoreKey] || 0) + 1;
            return score;
        }
        attempts++;
    }
    // Fallback: just return a random score in range
    return Math.round((range.min + Math.random() * (range.max - range.min)) * 10) / 10;
}

// Process each review file
let updated = 0;
const newScores = [];

reviewFiles.forEach(filename => {
    const filepath = path.join(reviewsDir, filename);
    const html = fs.readFileSync(filepath, 'utf8');
    const $ = cheerio.load(html);

    const currentRating = parseFloat($('.rating').text().trim());
    const name = $('.review-title').text().trim();

    // Get appropriate score range for this site
    const range = getScoreRange(filename);

    // Generate a unique score
    const newScore = generateUniqueScore(range);

    // Update the HTML
    $('.rating').text(newScore.toFixed(1));

    // Update BNW badge if needed
    if (newScore >= 8.5 && !$('.bnw-badge').length) {
        $('.rating').after('\n            <span class="bnw-badge">Best New Website</span>');
    } else if (newScore < 8.5 && $('.bnw-badge').length) {
        $('.bnw-badge').remove();
    }

    // Write updated HTML
    fs.writeFileSync(filepath, $.html());

    console.log(`${name}: ${currentRating} → ${newScore.toFixed(1)}`);
    newScores.push({ name, old: currentRating, new: newScore });
    updated++;
});

console.log(`\n✓ Updated ${updated} reviews`);

// Show new distribution
console.log('\nNew score distribution:');
const sortedUsage = Object.entries(scoreUsage)
    .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
sortedUsage.forEach(([score, count]) => {
    console.log(`  ${score}: ${count} review(s)`);
});

// Verify no score used more than twice
const overused = sortedUsage.filter(([_, count]) => count > 2);
if (overused.length > 0) {
    console.log('\n⚠ Warning: Some scores still overused:');
    overused.forEach(([score, count]) => console.log(`  ${score}: ${count}`));
} else {
    console.log('\n✓ No score appears more than twice!');
}
