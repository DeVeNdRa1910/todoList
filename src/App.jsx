import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("taskObject")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("taskObject", JSON.stringify(tasks));
    } else {
      localStorage.removeItem("taskObject");
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") {
      alert("Input Field is empty");
      return;
    }

    const taskObj = {
      id: Date.now(),
      isComplete: false,
      task: newTask,
    };

    const updatedTask = [...tasks, taskObj];
    setTasks(updatedTask);
    setNewTask("");
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((item) => item.id !== id);
    setTasks(updatedTasks);
  };

  const startEditing = (id, task) => {
    let index = tasks.findIndex((item) => item.id === id);
    setEditingTask(index);
    const taskObj = {
      id,
      isComplete: tasks[index].isComplete,
      task: task,
    };
    setEditedTask(taskObj);
  };

  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map((item) =>
      item.id === id ? { ...item, isComplete: !item.isComplete } : item
    );
    setTasks(updatedTasks);
  };

  const saveEditedTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingTask] = editedTask;
    setTasks(updatedTasks);
    setEditingTask(null);
    setEditedTask(null);
  };

  return (
    <>
      <div className="w-[100vw] min-h-[100vh] bg-black text-white">
        <div className="w-full h-[8vh] flex items-center justify-center shadow-md shadow-orange-500">
          <h1 className="text-5xl font-bold text-orange-500">TO DO List</h1>
        </div>
        
        <div className="h-[20vh] w-[70vw] flex items-center justify-center mx-auto">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter Task"
              className="w-[50vw] bg-transparent py-2 px-6 text-2xl border-b-2 border-gray-400"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={addTask} className="bg-orange-500 text-2xl px-6 py-2 rounded-lg ml-3" >Add</button>
          </div>
        </div>

        <div className="w-[70vw] mx-auto pb-[10vh]">
          {tasks.map((item, index) => {
            return (
              <div key={item.id}>
                {editingTask === index ? (
                  <div key={item.id} className="h-[8vh] mb-3 px-4 rounded-lg flex items-center shadow-lg shadow-orange-500 justify-around">
                    <input
                      type="text"
                      value={editedTask.task}
                      className="w-[50vw] bg-transparent py-1 px-6 text-xl border-b-2 border-gray-400"
                      onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })
                      }
                    />
                    <button onClick={saveEditedTask} className="bg-black hover:shadow-lg hover:shadow-green-500 text-2xl text-green px-6 py-2 rounded-lg mr-4 transition-all" > <TfiSave /> </button>
                  </div>
                ) : (
                  <div key={item.id} className="h-[8vh] mb-3 px-4 rounded-lg flex items-center shadow-lg shadow-orange-500">
                    <input
                      type="checkbox"
                      className="h-5 w-5 bg-orange-500 rounded-md "
                      checked={item.isComplete}
                      onChange={() => toggleCompletion(item.id)}
                    />
                    <p className={`w-[50vw] ml-10 text-xl ${item.isComplete ? `text-orange-500` : `text-white`}`}>{item.task}</p>
                    <button className="bg-black hover:shadow-lg hover:shadow-green-500 text-2xl text-green px-6 py-2  rounded-lg mr-4 transition-all" onClick={() => startEditing(item.id, item.task)}> <FaEdit /> </button>
                    <button className="bg-black hover:shadow-lg hover:shadow-red-500 text-red text-2xl px-6 py-2  rounded-lg transition-all" onClick={() => deleteTask(item.id)}> <RiDeleteBin6Fill /> </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

};

export default App;
