import { useState } from "react";

export default function useTodoList() {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState({ show: false, message: "" });

  const showAlert = (message) => {
    setAlert({ show: true, message });
    setTimeout(() => setAlert({ show: false, message: "" }), 3000);
  };

  const addTask = (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      showAlert("Veuillez saisir une tâche.");
      return;
    }

    const taskExists = tasks.some(
      (task) =>
        task.text.toLowerCase() === trimmedText.toLowerCase() && !task.completed
    );

    if (taskExists) {
      showAlert("Cette tâche existe déjà.");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const toggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const editTask = (taskId, newText) => {
    if (!newText.trim()) {
      showAlert("Veuillez saisir une tâche.");
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, text: newText.trim() } : task
      )
    );
  };

  const archiveTask = (taskId) => {
    const taskToArchive = tasks.find((task) => task.id === taskId);
    if (taskToArchive) {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setArchivedTasks((prev) => [...prev, taskToArchive]);
    } else {
      const taskToUnarchive = archivedTasks.find((task) => task.id === taskId);
      setArchivedTasks((prev) => prev.filter((task) => task.id !== taskId));
      setTasks((prev) => [...prev, taskToUnarchive]);
    }
  };

  const deleteCompletedTasks = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const getFilteredTasks = (taskList) => {
    switch (filter) {
      case "active":
        return taskList.filter((task) => !task.completed);
      case "completed":
        return taskList.filter((task) => task.completed);
      default:
        return taskList;
    }
  };

  return {
    tasks: getFilteredTasks(tasks),
    archivedTasks: getFilteredTasks(archivedTasks),
    filter,
    alert,
    addTask,
    toggleComplete,
    deleteTask,
    editTask,
    archiveTask,
    deleteCompletedTasks,
    setFilter,
  };
}
