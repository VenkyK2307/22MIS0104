import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const API_URL = "http://4.2.24.186.213/evaluation-service/notifications";

app.get('/api/notifications', async (req, res) => {
  try {
    const { page = 1, limit = 5, notification_type } = req.query;
    let targetUrl = `${API_URL}?page=${page}&limit=${limit}`;
    if (notification_type && notification_type !== 'All') {
      targetUrl += `&notification_type=${notification_type}`;
    }

    const response = await fetch(targetUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed fetching backend data gateway stream" });
  }
});

app.listen(5000, () => console.log('Proxy running on port 5000'));