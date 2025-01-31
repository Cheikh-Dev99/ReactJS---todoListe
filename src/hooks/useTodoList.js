import { useEffect, useState } from "react";

export default function useTodoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const showAlert = (message) => {
    setAlert({ show: true, message });
    setTimeout(() => setAlert({ show: false, message: "" }), 3000);
  };

  const addTask = (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      showAlert("Erreur : Veuillez saisir une tâche valide.");
      return;
    }

    const taskExists = tasks.some(
      (task) => task.text.toLowerCase() === trimmedText.toLowerCase()
    );

    if (taskExists) {
      showAlert("Erreur : Cette tâche existe déjà.");
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
    const trimmedText = newText.trim();
    if (!trimmedText) {
      showAlert("Erreur : Veuillez saisir un texte valide pour la tâche.");
      return;
    }

    const taskExists = tasks.some(
      (task) =>
        task.text.toLowerCase() === trimmedText.toLowerCase() &&
        task.id !== taskId
    );

    if (taskExists) {
      showAlert("Erreur : Cette tâche existe déjà.");
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, text: trimmedText } : task
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
    let filteredTasks = taskList;
    if (searchTerm) {
      filteredTasks = filteredTasks.filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (filter) {
      case "active":
        return filteredTasks.filter((task) => !task.completed);
      case "completed":
        return filteredTasks.filter((task) => task.completed);
      default:
        return filteredTasks.sort((a, b) => b.id - a.id);
    }
  };

  const tasksToRender = tasks.length > 0 ? getFilteredTasks(tasks) : [];
  const archivedTasksToRender =
    archivedTasks.length > 0 ? getFilteredTasks(archivedTasks) : [];

  return {
    tasks: tasksToRender,
    archivedTasks: archivedTasksToRender,
    filter,
    alert,
    addTask,
    toggleComplete,
    deleteTask,
    editTask,
    archiveTask,
    deleteCompletedTasks,
    setFilter,
    searchTerm,
    setSearchTerm,
  };
}
