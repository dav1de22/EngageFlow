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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  useTheme
} from '@mui/material';
import { RadioButtonUnchecked, CheckCircle } from '@mui/icons-material';

const TaskList = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    isCompleted: false
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
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
  };

  // Handle task click to open edit dialog
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline.split('T')[0],
      isCompleted: task.isCompleted
    });
    setIsEditDialogOpen(true);
  };

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'isCompleted' ? checked : value
    }));
  };

  // Handle task update
  const handleTaskUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError('');

    const updatedTask = {
      taskId: selectedTask.taskId,
      ...editFormData
    };

    try {
      const response = await axios.put(
        `https://localhost:7173/api/Tasks/${selectedTask.taskId}`,
        updatedTask
      );
      
      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.taskId === selectedTask.taskId ? response.data : task
        )
      );
      setCompletedTasks(
        tasks.filter(task => 
          task.taskId === selectedTask.taskId 
            ? editFormData.isCompleted 
            : task.isCompleted
        ).length
      );
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating task:', error);
      setUpdateError('Failed to update task. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedTask(null);
    setEditFormData({
      title: '',
      description: '',
      deadline: '',
      isCompleted: false
    });
    setUpdateError('');
  };

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
      {/* Dashboard Header */}
      <Paper 
        elevation={3}
        sx={{
          mb: 4,
          p: 3,
          background: theme.palette.taskHeader.background,
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

      {/* Task List */}
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
                boxShadow: 3,
                cursor: 'pointer'
              }
            }}
            onClick={() => handleTaskClick(task)}
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

      {/* Edit Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleTaskUpdate}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {updateError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {updateError}
                </Alert>
              )}
              
              <TextField
                name="title"
                label="Title"
                value={editFormData.title}
                onChange={handleFormChange}
                fullWidth
                required
              />

              <TextField
                name="description"
                label="Description"
                value={editFormData.description}
                onChange={handleFormChange}
                multiline
                rows={4}
                fullWidth
                required
              />

              <TextField
                name="deadline"
                label="Deadline"
                type="date"
                value={editFormData.deadline}
                onChange={handleFormChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    name="isCompleted"
                    checked={editFormData.isCompleted}
                    onChange={handleFormChange}
                    color="primary"
                  />
                }
                label={editFormData.isCompleted ? "Completed" : "Pending"}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={updateLoading}
            >
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TaskList;