import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import {
  People,
  EventNote,
  LocalPharmacy,
  Science,
  TrendingUp,
  CheckCircle,
  Schedule,
  Hotel,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      trend: '+12%',
    },
    {
      title: 'Today\'s Appointments',
      value: '45',
      icon: <EventNote sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      trend: '+5%',
    },
    {
      title: 'Occupied Beds',
      value: '52/65',
      icon: <Hotel sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      trend: '80%',
    },
    {
      title: 'Pending Lab Tests',
      value: '23',
      icon: <Science sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      trend: '-8%',
    },
  ];

  const recentActivities = [
    {
      title: 'New patient registered',
      description: 'John Doe - ID: PAT-2025-1234',
      time: '5 minutes ago',
      icon: <People />,
    },
    {
      title: 'Appointment scheduled',
      description: 'Dr. Smith - Cardiology',
      time: '15 minutes ago',
      icon: <EventNote />,
    },
    {
      title: 'Lab result uploaded',
      description: 'Blood Test - Patient ID: PAT-2025-1200',
      time: '30 minutes ago',
      icon: <Science />,
    },
    {
      title: 'Prescription dispensed',
      description: 'Medication for Patient ID: PAT-2025-1150',
      time: '1 hour ago',
      icon: <LocalPharmacy />,
    },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'white', color: 'primary.main' }}>
            {user?.staff?.firstName?.[0] || user?.username?.[0]}
          </Avatar>
          <Box sx={{ color: 'white' }}>
            <Typography variant="h4" fontWeight="bold">
              Welcome back, {user?.staff?.firstName || user?.username}!
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              {user?.role.replace('_', ' ').toUpperCase()}
              {user?.staff?.department && ` - ${user.staff.department}`}
            </Typography>
            <Chip
              label={user?.isActive ? 'Active' : 'Inactive'}
              size="small"
              sx={{ mt: 1, bgcolor: 'white', color: 'primary.main' }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                color: 'white',
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                      <TrendingUp fontSize="small" />
                      <Typography variant="body2">{stat.trend} from last month</Typography>
                    </Stack>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Activities
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {recentActivities.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{activity.icon}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Stats
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle color="success" />
                  <Typography variant="body2">Completed Today</Typography>
                </Stack>
                <Typography variant="h6" fontWeight="bold">
                  32
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Schedule color="warning" />
                  <Typography variant="body2">Pending</Typography>
                </Stack>
                <Typography variant="h6" fontWeight="bold">
                  15
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalPharmacy color="info" />
                  <Typography variant="body2">Prescriptions</Typography>
                </Stack>
                <Typography variant="h6" fontWeight="bold">
                  28
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              System Status
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">Database</Typography>
                  <Chip label="Online" size="small" color="success" />
                </Stack>
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">API Server</Typography>
                  <Chip label="Online" size="small" color="success" />
                </Stack>
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2">Backup Status</Typography>
                  <Chip label="Up to date" size="small" color="success" />
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
