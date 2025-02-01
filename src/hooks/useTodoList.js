import { useEffect, useState } from "react";

export default function useTodoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    const loadedTasks = savedTasks ? JSON.parse(savedTasks) : [];
    // Ajouter l'ordre si pas présent
    return loadedTasks.map((task, index) => ({
      ...task,
      order: task.order ?? (-task.createdAt || -(task.id || Date.now())),
    }));
  });
  const [archivedTasks, setArchivedTasks] = useState(() => {
    const savedArchivedTasks = localStorage.getItem("archivedTasks");
    return savedArchivedTasks ? JSON.parse(savedArchivedTasks) : [];
  });
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks));
  }, [archivedTasks]);

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
      createdAt: Date.now(),
      order: -Date.now(), // Utiliser un nombre négatif pour que les plus récents soient en haut
    };

    setTasks((prev) => [newTask, ...prev]); // Ajouter au début du tableau
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
      if (taskToUnarchive) {
        setArchivedTasks((prev) => prev.filter((task) => task.id !== taskId));
        setTasks((prev) => [...prev, taskToUnarchive]);
      }
    }
  };

  const deleteCompletedTasks = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const reorderTasks = (startIndex, endIndex) => {
    const result = Array.from(tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Mettre à jour l'ordre des tâches
    const updatedTasks = result.map((task, index) => ({
      ...task,
      order: index,
    }));

    setTasks(updatedTasks);
  };

  const getFilteredTasks = (taskList) => {
    let filteredTasks = [...taskList];

    if (searchTerm) {
      filteredTasks = filteredTasks.filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Trier par ordre personnalisé
    filteredTasks.sort((a, b) => a.order - b.order);

    switch (filter) {
      case "active":
        return filteredTasks.filter((task) => !task.completed);
      case "completed":
        return filteredTasks.filter((task) => task.completed);
      default:
        return filteredTasks;
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
    reorderTasks,
  };
}
