import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  IconButton,
  InputAdornment,
  useTheme
} from '@mui/material';
import { 
  RadioButtonUnchecked, 
  CheckCircle, 
  Search as SearchIcon,
  Clear as ClearIcon 
} from '@mui/icons-material';

// Animation variants for tasks
const taskVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3 
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { 
      duration: 0.2 
    }
  }
};

const TaskList = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
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
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7173/api/Tasks');
      setTasks(response.data);
      setCompletedTasks(response.data.filter(task => task.isCompleted).length);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(task => 
        statusFilter === 'completed' ? task.isCompleted : !task.isCompleted
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1;
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, sortBy]);

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

  // Filter controls component
  const FilterControls = () => (
    <Box sx={{ 
      mb: 3,
      display: 'flex',
      gap: 2,
      flexWrap: 'wrap'
    }}>
      <TextField
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchQuery('')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ flexGrow: 1 }}
      />

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Status"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort by"
        >
          <MenuItem value="deadline">Deadline</MenuItem>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

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
      {/* Dashboard Header with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3}
          sx={{
            mb: 4,
            p: 3,
            background: theme.palette.primary.main,
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
      </motion.div>

      {/* Filter Controls */}
      <FilterControls />

      {/* Animated Task List */}
      <List sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2 
      }}>
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.taskId}
              variants={taskVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <Card 
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
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {task.isCompleted ? (
                        <CheckCircle color="success" />
                      ) : (
                        <RadioButtonUnchecked color="action" />
                      )}
                    </motion.div>
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
            </motion.div>
          ))}
        </AnimatePresence>
      </List>

      {/* Edit Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
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