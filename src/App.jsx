import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

async function getTasks() {
  const data = await axios.get("http://localhost:3000/tasks") 
  return data;
}
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState();

  const {data, isLoading} = useQuery({
    queryKey: ["Tasks"],
    queryFn: getTasks
  })

  useEffect(() => {
    console.log(data)
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if(newTask.trim() === '') {
      alert("Inout Field is empty")
      return;
    }
    const updatedTasks = [...tasks, newTask];
    console.log( "added tasks " + updatedTasks);
    
    setTasks(updatedTasks);
    setNewTask('');
  };

  
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    console.log( "delete tasks "+updatedTasks);
    setTasks(updatedTasks);
  };
  
  const startEditing = (task, index) => {
    setEditingTask(index);
    setEditedTask(task);
  };

  const saveEditedTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingTask] = editedTask;
    console.log( "updated tasks " + updatedTasks);
    setTasks(updatedTasks);
    setEditingTask(null);
    setEditedTask('');
  };

  return (
    <div className='w-[100vw] h-[95vh]'>
      <div className='w-full h-[5vh] flex items-center justify-center mx-auto text-4xl font-bold border-b-2'>
        <h1>To-Do List</h1>
      </div>

      
      <div className='h-[10vh] w-full flex justify-center items-center'>
        <div className=' w-[41vw] flex justify-between   items-center'>
          <input
            type="text"
            value={newTask}
            className='border-2 px-4 py-2 mr-0 w-[30vw]'
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
          />
          <button className='bg-black text-white px-4 py-3 shadow-md rounded-md ' onClick={addTask}>Add Task</button>
        </div>
        
      </div>
      

      <div className='flex justify-center bg-gray-200'>
        <ul className='w-[80vw] min-h-[90vh] p-5'>
          
          {tasks.map((task, index) => (
            <li key={index} 
              className='py-2 '
            >
              
              {editingTask === index ? (
                <div className='flex justify-between mx-4 items-center rounded-md border-2'>
                  <input
                    type="text"
                    value={editedTask}
                    className='px-4 py-1 w-[40vw]' 
                    onChange={(e) => setEditedTask(e.target.value)}
                  />
                  <button className='bg-green-300 hover:bg-green-500 px-4 py-1.5 text-lg ml-0 mr-2 rounded-md' onClick={saveEditedTask}>Save</button>
                </div>
              ) : (
                <div className='flex justify-between mx-4 items-center'>
                  <span className='text-xl'>{task}</span>
                  <div>
                    <button className='bg-green-300 hover:bg-green-500 px-4 py-1.5 text-lg mx-2 rounded-md' onClick={() => startEditing(task, index)}>Edit</button>
                    <button className='bg-red-300 hover:bg-red-500 px-4 py-1.5 text-lg mx-2 rounded-md' onClick={() => deleteTask(index)}>Delete</button>
                  </div>
                  
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

};

export default App;
