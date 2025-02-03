import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Alert
} from '@mui/material';

const EditTaskDialog = ({ task, open, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    deadline: task?.deadline?.split('T')[0] || '',
    isCompleted: task?.isCompleted || false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isCompleted' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const updatedTask = {
      taskId: task.taskId,
      ...formData
    };

    try {
      const response = await axios.put(
        `https://localhost:7173/api/Tasks/${task.taskId}`,
        updatedTask
      );
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              required
            />

            <TextField
              name="deadline"
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
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
                  checked={formData.isCompleted}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={formData.isCompleted ? "Completed" : "Pending"}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTaskDialog;