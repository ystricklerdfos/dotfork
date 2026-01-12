// Script to make DOTFORK logo clickable on all pages
const fs = require('fs');
const path = require('path');

// Main pages (relative to root)
const mainPages = ['archive.html', 'about.html', 'generator.html', 'deals.html', 'my-reviews.html'];

// Update main pages
mainPages.forEach(file => {
    const filepath = path.join(__dirname, file);
    if (!fs.existsSync(filepath)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
    }

    let html = fs.readFileSync(filepath, 'utf8');

    // Skip if already clickable
    if (html.includes('<div class="logo"><a href=')) {
        console.log(`⏭️  Skipped (already clickable): ${file}`);
        return;
    }

    // Replace non-clickable logo with clickable version
    html = html.replace(
        /<div class="logo">DOTFORK<\/div>/g,
        '<div class="logo"><a href="index.html">DOTFORK</a></div>'
    );

    fs.writeFileSync(filepath, html);
    console.log(`✓ Updated: ${file}`);
});

// Update review pages (relative path is ../index.html)
const reviewsDir = path.join(__dirname, 'reviews');
if (fs.existsSync(reviewsDir)) {
    const reviewFiles = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.html'));

    reviewFiles.forEach(file => {
        const filepath = path.join(reviewsDir, file);
        let html = fs.readFileSync(filepath, 'utf8');

        // Skip if already clickable
        if (html.includes('<div class="logo"><a href=')) {
            console.log(`⏭️  Skipped (already clickable): reviews/${file}`);
            return;
        }

        // Replace non-clickable logo with clickable version (uses ../index.html for subdirectory)
        html = html.replace(
            /<div class="logo">DOTFORK<\/div>/g,
            '<div class="logo"><a href="../index.html">DOTFORK</a></div>'
        );

        fs.writeFileSync(filepath, html);
        console.log(`✓ Updated: reviews/${file}`);
    });
}

// Update deal pages (relative path is ../index.html)
const dealsDir = path.join(__dirname, 'deals');
if (fs.existsSync(dealsDir)) {
    const dealFiles = fs.readdirSync(dealsDir).filter(f => f.endsWith('.html'));

    dealFiles.forEach(file => {
        const filepath = path.join(dealsDir, file);
        let html = fs.readFileSync(filepath, 'utf8');

        // Skip if already clickable
        if (html.includes('<div class="logo"><a href=')) {
            console.log(`⏭️  Skipped (already clickable): deals/${file}`);
            return;
        }

        // Replace non-clickable logo with clickable version
        html = html.replace(
            /<div class="logo">DOTFORK<\/div>/g,
            '<div class="logo"><a href="../index.html">DOTFORK</a></div>'
        );

        fs.writeFileSync(filepath, html);
        console.log(`✓ Updated: deals/${file}`);
    });
}

console.log('\n✓ Done! Logo is now clickable on all pages.');
