import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    // Fetch tasks from the backend API
    useEffect(() => {
        axios.get('http://localhost:5000/api/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
    }, []);

    return (
        <div>
            <h1>Task List</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.taskId}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                        <p>Status: {task.isCompleted ? 'Completed' : 'Pending'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
