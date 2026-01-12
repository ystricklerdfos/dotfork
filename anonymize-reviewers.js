// Script to anonymize reviewer names by swapping first letters
const fs = require('fs');
const path = require('path');

// Original name -> Silly anonymized name (swap first letters)
const nameMap = {
    // Original reviewers
    "Marcus Thorne": "Tarcus Mhorne",
    "Diana Castellano": "Ciana Dastellano",
    "Jamie Kowalski": "Kamie Jowalski",
    "Sam Chen": "Cam Shen",
    "Alex Reeves": "Rex Aleeves",
    "Ben Thompson": "Ten Bhompson",
    "Jia Tolentino": "Tia Jolentino",
    "Kara Swisher": "Sara Kwisher",
    "David Foster Wallace": "Wavid Foster Dallace",
    "Lester Bangs": "Bester Langs",
    "Richard Meltzer": "Michard Reltzer",
    "Nick Sylvester": "Sick Nylvester",
    "Brent DiCrescenzo": "Drent BiCrescenzo",
    "Ryan Schreiber": "Shyan Rreiber",
    "Mark Richardson": "Rark Michardson",
    "Ryan Dombal": "Dyan Rombal",
    "Jessica Hopper": "Hessica Jopper",
    "Simon Reynolds": "Rimon Seynolds",
    "Ann Powers": "Pann Aowers",
    "Greil Marcus": "Mreil Garcus",
    "Robert Christgau": "Crobert Rhristgau",
    "Ellen Willis": "Wellen Ellis",
    "Phoebe Bridgers": "Bhoebe Pridgers",
    "Frank Ocean": "Orank Fcean",
    "Ezra Koenig": "Kezra Eoenig",
    "Questlove": "Luestqove",
    "Kim Gordon": "Gim Kordon",
    "Thurston Moore": "Murston Thoore",
    "Carrie Brownstein": "Barrie Crownstein",
    "St. Vincent": "Vt. Sincent",
    // Jann Wenner
    "Jann Wenner": "Wann Jenner",
    // Deal reviewers
    "Matt Levine": "Latt Mevine",
    "Byrne Hobart": "Hyrne Bobart"
};

// Process all HTML files in reviews directory
const reviewsDir = path.join(__dirname, 'reviews');
const dealsDir = path.join(__dirname, 'deals');

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return 0;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    let count = 0;

    files.forEach(filename => {
        const filepath = path.join(dir, filename);
        let html = fs.readFileSync(filepath, 'utf8');
        let modified = false;

        for (const [original, anonymized] of Object.entries(nameMap)) {
            if (html.includes(original)) {
                html = html.split(original).join(anonymized);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filepath, html);
            console.log(`✓ Updated: ${filename}`);
            count++;
        }
    });

    return count;
}

// Also update index.html, archive.html, deals.html, about.html
function processFile(filepath) {
    if (!fs.existsSync(filepath)) return false;

    let html = fs.readFileSync(filepath, 'utf8');
    let modified = false;

    for (const [original, anonymized] of Object.entries(nameMap)) {
        if (html.includes(original)) {
            html = html.split(original).join(anonymized);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filepath, html);
        console.log(`✓ Updated: ${path.basename(filepath)}`);
        return true;
    }
    return false;
}

console.log('Anonymizing reviewer names...\n');

const reviewCount = processDirectory(reviewsDir);
const dealCount = processDirectory(dealsDir);

processFile(path.join(__dirname, 'index.html'));
processFile(path.join(__dirname, 'archive.html'));
processFile(path.join(__dirname, 'deals.html'));
processFile(path.join(__dirname, 'about.html'));
processFile(path.join(__dirname, 'generator.html'));

console.log(`\n✓ Done! Updated ${reviewCount} reviews and ${dealCount} deals.`);
console.log('\nName changes:');
Object.entries(nameMap).forEach(([orig, anon]) => {
    console.log(`  ${orig} → ${anon}`);
});
