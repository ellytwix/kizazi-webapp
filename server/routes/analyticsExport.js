import express from 'express';

const router = express.Router();

router.get('/export/csv', (req, res) => {
  const csvData = `Date,Platform,Posts,Engagement,Reach,Followers
2025-01-15,Instagram,5,248,1234,2450
2025-01-16,Facebook,3,156,892,2455
2025-01-17,X,7,89,567,2460`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"');
  res.send(csvData);
});

router.get('/export/json', (req, res) => {
  const jsonData = {
    exportDate: new Date().toISOString(),
    summary: { totalPosts: 21, totalEngagement: 850 },
    dailyStats: [
      { date: '2025-01-15', platform: 'Instagram', posts: 5, engagement: 248 }
    ]
  };
  res.json(jsonData);
});

export default router;
