// DOTFORK AI-Powered Review Generator

// Use relative URL for Vercel serverless function
const API_URL = '/api/generate-review';
const SAVE_URL = '/api/save-review';

// Store for user-generated reviews (persisted to localStorage)
const USER_REVIEWS_KEY = 'dotfork_user_reviews';

function extractDomain(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return url;
    }
}

function getUserReviews() {
    try {
        const stored = localStorage.getItem(USER_REVIEWS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveUserReview(review) {
    try {
        const reviews = getUserReviews();
        // Check if review already exists (by filename)
        const existingIndex = reviews.findIndex(r => r.filename === review.filename);
        if (existingIndex >= 0) {
            reviews[existingIndex] = review;
        } else {
            reviews.unshift(review); // Add to beginning
        }
        localStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(reviews));
        return true;
    } catch (e) {
        console.error('Failed to save review:', e);
        return false;
    }
}

document.getElementById('reviewForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const urlInput = document.getElementById('websiteUrl').value.trim();
    const nameInput = document.getElementById('websiteName').value.trim();
    const reviewerInput = document.getElementById('reviewerSelect').value.trim();
    const submitButton = e.target.querySelector('button[type="submit"]');
    const statusMessage = document.getElementById('statusMessage');

    if (!urlInput) {
        alert('Please enter a website URL');
        return;
    }

    // Disable button and show loading message
    submitButton.disabled = true;
    submitButton.textContent = 'ANALYZING...';
    statusMessage.style.display = 'block';
    document.getElementById('reviewOutput').style.display = 'none';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: urlInput,
                name: nameInput,
                reviewer: reviewerInput
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to generate review');
        }

        const review = await response.json();

        // Display the review
        const domain = extractDomain(urlInput);

        document.getElementById('outputTitle').textContent = review.title;
        document.getElementById('outputMeta').textContent = review.category + ' | Reviewed by ' + review.reviewer + ' | ' + review.date;
        document.getElementById('outputUrl').textContent = domain;
        document.getElementById('outputUrl').href = urlInput.startsWith('http') ? urlInput : 'https://' + urlInput;
        document.getElementById('outputRating').textContent = review.rating.toFixed(1);

        if (review.isBNW) {
            document.getElementById('outputBadge').innerHTML = '<span class="bnw-badge">Best New Website</span>';
        } else {
            document.getElementById('outputBadge').innerHTML = '';
        }

        // Create info box
        const infoBoxHTML = `
            <div style="background-color: #f5f5f5; padding: 20px; margin: 25px 0; border-left: 3px solid #ff3530;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 12px; color: #999;">Site Information</div>
                <div style="margin-bottom: 8px;"><strong>URL:</strong> <a href="${urlInput.startsWith('http') ? urlInput : 'https://' + urlInput}" target="_blank" style="color: #ff3530;">${domain}</a></div>
                <div style="margin-bottom: 8px;"><strong>Founded:</strong> ${review.founded}</div>
                <div style="margin-bottom: 8px;"><strong>Score:</strong> ${review.rating.toFixed(1)}</div>
                <div><strong>Type:</strong> ${review.pithyCategory}</div>
            </div>
        `;
        document.getElementById('outputInfoBox').innerHTML = infoBoxHTML;

        let bodyHTML = '';
        review.paragraphs.forEach(p => {
            bodyHTML += '<p>' + p + '</p>';
        });
        document.getElementById('outputBody').innerHTML = bodyHTML;

        document.getElementById('outputVerdict').innerHTML = '<strong>VERDICT:</strong> ' + review.verdict;

        // Save to user's local collection
        const reviewData = {
            site: { name: review.title, url: domain },
            category: review.category,
            reviewer: review.reviewer,
            date: review.date,
            rating: review.rating,
            isBNW: review.isBNW,
            reviewText: review.reviewText,
            verdict: review.verdict,
            filename: review.filename,
            userGenerated: true
        };

        if (saveUserReview(reviewData)) {
            // Show save confirmation with submit option
            const saveNotice = document.createElement('div');
            saveNotice.style.cssText = 'background-color: #333; color: white; padding: 15px 20px; margin-top: 20px; font-size: 13px; text-align: center;';
            saveNotice.innerHTML = `
                <div style="margin-bottom: 10px;">Review saved to your collection!</div>
                <a href="my-reviews.html" style="display: inline-block; background: white; color: #333; padding: 8px 16px; text-decoration: none; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 10px;">View My Reviews</a>
                <a href="community.html" style="display: inline-block; background: #ff3530; color: white; padding: 8px 16px; text-decoration: none; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Submit to Community</a>
            `;
            document.getElementById('outputVerdict').after(saveNotice);
        }

        document.getElementById('reviewOutput').style.display = 'block';
        document.getElementById('reviewOutput').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error:', error);
        alert('Error generating review: ' + error.message);
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = 'GENERATE REVIEW';
        statusMessage.style.display = 'none';
    }
});
