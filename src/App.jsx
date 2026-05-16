import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, Chip, 
  Tabs, Tab, Pagination, Button, Badge, CircularProgress 
} from '@mui/material';
import { NotificationImportant, Event, Assignment, School } from '@mui/icons-material';
import { getTopNNotifications } from './utils/priorityInbox';

const API_BASE = "http://4.2.24.186.213/evaluation-service/notifications";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0); 
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem('viewed_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}?page=${page}&limit=${limit}`;
      if (typeFilter !== 'All' && activeTab === 0) {
        url += `&notification_type=${typeFilter}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, typeFilter, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkAsRead = (id) => {
    const updated = [...viewedIds, id];
    setViewedIds(updated);
    localStorage.setItem('viewed_notifications', JSON.stringify(updated));
  };

  const getCategoryIcon = (type) => {
    if (type === "Placement") return <School color="error" />;
    if (type === "Result") return <Assignment color="primary" />;
    return <Event color="action" />;
  };

  const displayedNotifications = activeTab === 1 
    ? getTopNNotifications(notifications, 10) 
    : notifications;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          AffordMed Campus Hub
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={(e, val) => { setActiveTab(val); setPage(1); }} centered sx={{ mb: 3 }}>
        <Tab label="All Notifications" />
        <Tab icon={<NotificationImportant />} iconPosition="start" label="Priority Inbox" />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          {['All', 'Placement', 'Result', 'Event'].map((category) => (
            <Chip
              key={category}
              label={category}
              color={typeFilter === category ? "primary" : "default"}
              onClick={() => { setTypeFilter(category); setPage(1); }}
            />
          ))}
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={2}>
          {displayedNotifications.map((item) => {
            const isRead = viewedIds.includes(item.ID);
            return (
              <Grid item xs={12} key={item.ID}>
                <Card variant="outlined" sx={{ 
                  borderLeft: isRead ? '4px solid #b0bec5' : '4px solid #1976d2',
                  backgroundColor: isRead ? '#f5f5f5' : '#ffffff'
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Badge color="primary" variant="dot" invisible={isRead}>
                        {getCategoryIcon(item.Type)}
                      </Badge>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" fontWeight={isRead ? "normal" : "bold"}>
                            {item.Message}
                          </Typography>
                          <Chip label={item.Type} size="small" variant="outlined" />
                        </Box>
                        <Typography variant="caption" color="textSecondary">{item.Timestamp}</Typography>
                      </Box>
                    </Box>
                    {!isRead && (
                      <Button size="small" variant="contained" disableElevation onClick={() => handleMarkAsRead(item.ID)}>
                        Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {activeTab === 0 && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={5} page={page} onChange={(e, value) => setPage(value)} color="primary" />
        </Box>
      )}
    </Container>
  );
}

export default App;