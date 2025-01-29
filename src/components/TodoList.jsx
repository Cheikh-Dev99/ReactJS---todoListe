import { useState } from "react";
import add from "../assets/ajouter.png";
import useTodoList from "../hooks/useTodoList";
import TodoItem from "./TodoItem";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Input from "../ui/Input";
import RadioButton from "../ui/RadioButton";
import SectionTitle from "../ui/SectionTitle";

export default function TodoList() {
  const [newTask, setNewTask] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const {
    tasks,
    archivedTasks,
    filter,
    alert,
    addTask,
    toggleComplete,
    deleteTask,
    editTask,
    archiveTask,
    deleteCompletedTasks,
    setFilter,
  } = useTodoList();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(newTask);
    setNewTask("");
  };

  return (
    <div className="container mx-auto max-w-3xl p-8 bg-white rounded-lg shadow-lg my-20">
      <h1 className="text-2xl font-bold text-center mb-6 py-3 shadow-md">
        Ma liste de tâches <br /> (To Do List)
      </h1>

      <Alert show={alert.show} message={alert.message} />

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-4 items-center flex-1">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="Nouvelle tâche"
              className="flex-1"
            />
            <Button rounded onClick={handleSubmit}>
              <img src={add} alt="ajouter logo" className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="danger"
              onClick={deleteCompletedTasks}
              className="w-full sm:w-auto"
            >
              Supp. tâches terminés
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowArchived(!showArchived)}
              className="w-full sm:w-auto"
            >
              {showArchived ? "Tâches principales" : "Tâches archivées"}
            </Button>
          </div>
        </div>
      </div>

      <form className="flex items-center gap-4 my-4">
        <RadioButton
          id="checkbox-tous"
          name="statut"
          checked={filter === "all"}
          onChange={() => setFilter("all")}
          label="Tous"
        />
        <RadioButton
          id="checkbox-actives"
          name="statut"
          checked={filter === "active"}
          onChange={() => setFilter("active")}
          label="Actives"
        />
        <RadioButton
          id="checkbox-termines"
          name="statut"
          checked={filter === "completed"}
          onChange={() => setFilter("completed")}
          label="Terminées"
        />
      </form>

      <div className={`my-4 ${showArchived ? "hidden" : ""}`}>
        <SectionTitle>Tâches principales</SectionTitle>
        <ul>
          {tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onComplete={toggleComplete}
              onDelete={deleteTask}
              onEdit={editTask}
              onArchive={archiveTask}
            />
          ))}
        </ul>
      </div>

      <div className={`my-4 ${!showArchived ? "hidden" : ""}`}>
        <SectionTitle>Tâches archivées</SectionTitle>
        <ul>
          {archivedTasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onComplete={toggleComplete}
              onDelete={deleteTask}
              onEdit={editTask}
              onArchive={archiveTask}
              isArchived
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
