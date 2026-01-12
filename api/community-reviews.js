const { put, list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Check if Blob is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('BLOB_READ_WRITE_TOKEN not configured');
        return res.status(500).json({
            error: 'Storage not configured',
            message: 'Please add BLOB_READ_WRITE_TOKEN to environment variables'
        });
    }

    // GET - Retrieve all community reviews
    if (req.method === 'GET') {
        try {
            // List all blobs in the community-reviews folder
            const { blobs } = await list({
                prefix: 'community-reviews/',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });

            // Fetch each review's content
            const reviews = [];
            for (const blob of blobs) {
                try {
                    const response = await fetch(blob.url);
                    const review = await response.json();
                    reviews.push(review);
                } catch (e) {
                    console.error('Error fetching blob:', blob.pathname, e);
                }
            }

            // Sort by submission date (newest first)
            reviews.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

            return res.status(200).json({
                success: true,
                count: reviews.length,
                reviews
            });
        } catch (error) {
            console.error('Error listing reviews:', error);
            return res.status(500).json({
                error: 'Failed to retrieve reviews',
                message: error.message
            });
        }
    }

    // POST - Submit a new community review
    if (req.method === 'POST') {
        try {
            const review = req.body;

            if (!review || !review.site?.name || !review.reviewText) {
                return res.status(400).json({ error: 'Invalid review data' });
            }

            // Generate a unique ID for this review
            const reviewId = `${review.filename || review.site.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

            // Add metadata
            const reviewData = {
                ...review,
                id: reviewId,
                submittedAt: new Date().toISOString(),
                communitySubmission: true
            };

            // Store in Vercel Blob
            const blob = await put(
                `community-reviews/${reviewId}.json`,
                JSON.stringify(reviewData),
                {
                    contentType: 'application/json',
                    access: 'public',
                    token: process.env.BLOB_READ_WRITE_TOKEN
                }
            );

            return res.status(200).json({
                success: true,
                id: reviewId,
                url: blob.url,
                message: 'Review submitted to community archive!'
            });
        } catch (error) {
            console.error('Error saving review:', error);
            return res.status(500).json({
                error: 'Failed to save review',
                message: error.message
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
