import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  List, 
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { RadioButtonUnchecked } from '@mui/icons-material';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios.get('https://localhost:7173/api/Tasks')
      .then(response => {
        setTasks(response.data);
        setCompletedTasks(response.data.filter(task => task.isCompleted).length);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper 
        elevation={3}
        sx={{
          mb: 4,
          p: 3,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              mb: 1
            }}
          >
            Task Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total Tasks
              </Typography>
              <Typography variant="h6">
                {tasks.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Completed
              </Typography>
              <Typography variant="h6">
                {completedTasks}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Pending
              </Typography>
              <Typography variant="h6">
                {tasks.length - completedTasks}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box 
          sx={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none'
          }}
        />
      </Paper>

      <List sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2 
      }}>
        {tasks.map(task => (
          <Card 
            key={task.taskId} 
            elevation={1}
            sx={{
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease-in-out',
                boxShadow: 3
              }
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <RadioButtonUnchecked color="action" />
                <Box flexGrow={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" component="div">
                      {task.title}
                    </Typography>
                    <Chip 
                      label={task.isCompleted ? 'Completed' : 'Pending'}
                      color={task.isCompleted ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;