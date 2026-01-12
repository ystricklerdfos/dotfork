// Script to build archive.html from all generated reviews
const fs = require('fs');
const path = require('path');

// Read all reviews from JSON file
const reviewsFile = path.join(__dirname, 'all-reviews.json');

if (!fs.existsSync(reviewsFile)) {
    console.error('all-reviews.json not found. Run generate-reviews.js first.');
    process.exit(1);
}

const allReviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));

// Group reviews by category
const reviewsByCategory = {};
allReviews.forEach(review => {
    if (!reviewsByCategory[review.category]) {
        reviewsByCategory[review.category] = [];
    }
    reviewsByCategory[review.category].push(review);
});

// Sort categories alphabetically
const sortedCategories = Object.keys(reviewsByCategory).sort();

// Generate HTML
let html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>Review Archive - DOTFORK</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body>

<!-- Header -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="header">
        <div class="logo">DOTFORK</div>
        <div class="tagline">The Most Trusted Voice in Dot-Com Criticism</div>
    </td>
</tr>
</table>

<!-- Navigation -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="nav">
        <a href="index.html">Home</a>
        <a href="archive.html">Reviews</a>
        <a href="generator.html">Generator</a>
        <a href="about.html">About</a>
    </td>
</tr>
</table>

<!-- Main Content -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="container">

        <h1>Review Archive</h1>
        <p style="margin-bottom: 30px; color: #666;">
            ${allReviews.length} brutally honest reviews of modern websites. Sorted by category.
        </p>

`;

// Generate category sections
sortedCategories.forEach(category => {
    const reviews = reviewsByCategory[category];
    // Sort reviews by rating (highest to lowest)
    reviews.sort((a, b) => b.rating - a.rating);

    html += `        <h3>${category}</h3>\n`;
    html += `        <div style="margin-bottom: 40px;">\n`;

    reviews.forEach(review => {
        const filename = review.site.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-');
        const isBNW = review.rating >= 8.5;

        html += `            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e5e5;">
                <div style="margin-bottom: 8px;">
                    <a href="reviews/${filename}.html" style="font-size: 18px; font-weight: 700;">${review.site.name}</a>
                    <span class="rating-small">${review.rating.toFixed(1)}</span>${isBNW ? ' <span class="bnw-badge">Best New Website</span>' : ''}
                </div>
                <div style="font-size: 12px; color: #999;">
                    ${review.site.url} | Reviewed by ${review.reviewer}
                </div>
            </div>
`;
    });

    html += `        </div>\n\n`;
});

html += `    </td>
</tr>
</table>

<!-- Footer -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="footer">
        &copy; 1999-2026 DOTFORK. All rights reserved.<br>
        Last updated: January 11, 2026
    </td>
</tr>
</table>

</body>
</html>`;

// Write archive.html
fs.writeFileSync(path.join(__dirname, 'archive.html'), html);
console.log(`✓ Generated archive.html with ${allReviews.length} reviews across ${sortedCategories.length} categories`);
