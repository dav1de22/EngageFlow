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
  Alert
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Event, Description } from '@mui/icons-material';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('https://localhost:7173/api/Tasks')
      .then(response => {
        setTasks(response.data);
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
      <Typography variant="h4" gutterBottom sx={{ 
        mb: 4, 
        fontWeight: 'bold',
        color: 'primary.main'
      }}>
        Task List
      </Typography>

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
                {task.isCompleted ? (
                  <CheckCircle color="success" />
                ) : (
                  <RadioButtonUnchecked color="action" />
                )}
                
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

                  <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                    <Description fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Event fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
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