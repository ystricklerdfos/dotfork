import { put } from '@vercel/blob';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const review = req.body;

        if (!review || !review.title || !review.reviewText) {
            return res.status(400).json({ error: 'Invalid review data' });
        }

        // Create HTML for the review
        const paragraphs = review.reviewText.split('\n\n')
            .filter(p => p.trim().length > 0)
            .map(p => `            <p>\n            ${p.trim()}\n            </p>`)
            .join('\n\n');

        const bnwBadge = review.isBNW ? '\n            <span class="bnw-badge">Best New Website</span>' : '';

        const html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>${review.title} Review - DOTFORK</title>
    <link rel="stylesheet" type="text/css" href="../styles.css">
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
        <a href="../index.html">Home</a>
        <a href="../archive.html">Reviews</a>
        <a href="../generator.html">Generator</a>
        <a href="../about.html">About</a>
    </td>
</tr>
</table>

<!-- Main Content -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="container">

        <div class="review-header">
            <h1 class="review-title">${review.title}</h1>
            <div class="review-meta">
                ${review.category} | Reviewed by ${review.reviewer} | ${review.date}
            </div>
            <div class="review-url">
                <a href="https://${review.domain || review.url}" target="_blank">${review.domain || review.url}</a>
            </div>
            <div class="rating">${review.rating.toFixed(1)}</div>${bnwBadge}
        </div>

        <div class="review-body">
${paragraphs}
        </div>

        <div class="verdict-box">
            <strong>VERDICT:</strong> ${review.verdict}
        </div>

    </td>
</tr>
</table>

<!-- Footer -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="footer">
        &copy; 1999-2026 DOTFORK. All rights reserved.<br>
        Last updated: ${review.date}
    </td>
</tr>
</table>

</body>
</html>
`;

        // For now, just return success with the generated HTML
        // In production, you'd save this to a database or file storage
        res.json({
            success: true,
            filename: review.filename,
            message: `Review for ${review.title} would be saved as reviews/${review.filename}.html`,
            // Return the review data so it can be stored client-side
            reviewData: {
                site: { name: review.title, url: review.domain || review.url },
                category: review.category,
                reviewer: review.reviewer,
                date: review.date,
                rating: review.rating,
                isBNW: review.isBNW,
                reviewText: review.reviewText,
                verdict: review.verdict,
                filename: review.filename
            }
        });

    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({
            error: 'Failed to save review',
            message: error.message
        });
    }
}
