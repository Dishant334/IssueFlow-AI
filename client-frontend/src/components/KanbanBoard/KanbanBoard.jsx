import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../configs/api";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, CheckSquare, Loader, CheckCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddTaskForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";
import SingleTaskModal from "./SingleTaskModal";

const KanbanBoard = ({ openForm, setOpenForm }) => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState("");
  const [singleTask, setSingleTask] = useState("");

  const token = window.localStorage.getItem("token");
  const { workspaceid, projectId } = useParams();

  function onClose() {
    setIsEditing("");
    setOpenForm(false);
    setSingleTask("");
  }

  const deleteTask = async (taskId) => {
    const confirm = window.confirm("Are you sure to delete this task?");
    if (!confirm) return;

    try {
      const response = await api.delete(
        `/api/workspace/${workspaceid}/projects/${projectId}/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response?.data?.message || "Task deleted successfully");
      await fetchTasks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(
        `/api/workspace/${workspaceid}/projects/${projectId}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.tasks);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something Went Wrong");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId, workspaceid]);

  // DRAG LOGIC
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const destStatus = destination.droppableId;

    const columnTasks = data
      .filter((t) => t.status === destStatus)
      .sort((a, b) => a.position - b.position);

    const prev = columnTasks[destination.index - 1];
    const next = columnTasks[destination.index];

    let newPosition;

    if (!prev && !next) newPosition = 1000;
    else if (!prev) newPosition = next.position / 2;
    else if (!next) newPosition = prev.position + 1000;
    else newPosition = (prev.position + next.position) / 2;

    if (isNaN(newPosition)) {
      toast.error("Invalid position");
      return;
    }

    const oldData = data;

    const updatedData = data.map((task) =>
      task._id === draggableId
        ? { ...task, status: destStatus, position: newPosition }
        : task
    );

    setData(updatedData);

    try {
      await api.patch(
        `/api/workspace/${workspaceid}/projects/${projectId}/tasks/${draggableId}/move`,
        { status: destStatus, position: newPosition },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      toast.error("Move failed");
      setData(oldData);
    }
  };

  // GROUPING
  const todo = data.filter((m) => m.status === "todo");
  const inProgress = data.filter((m) => m.status === "in_progress");
  const done = data.filter((m) => m.status === "done");

  // COLUMN
  const renderColumn = (title, tasks, status, Icon, color) => {
    return (
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-80 shrink-0 bg-slate-800/70 backdrop-blur rounded-2xl p-4 flex flex-col max-h-[80vh] border border-slate-700 shadow-md"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <Icon size={16} className={color} />
                  {title}
                </p>
                <p className="text-xs text-slate-400">{tasks.length} tasks</p>
              </div>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-3 overflow-y-hidden pr-1">
              {tasks.length === 0 ? (
                <p className="text-sm text-slate-400 text-center mt-6">
                  No tasks 🚀
                </p>
              ) : (
                tasks.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setSingleTask(task._id)}
                        className="relative group bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                      >
                        <p className="font-medium text-white">
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                              {task.assignedTo?.name?.charAt(0) || "U"}
                            </div>
                            <p className="text-xs text-slate-300">
                              {task.assignedTo?.name || "Unassigned"}
                            </p>
                          </div>

                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              task.priority === "high"
                                ? "bg-red-500/20 text-red-400"
                                : task.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditing(task._id);
                            }}
                            className="hover:bg-slate-700 p-1 rounded"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task._id);
                            }}
                            className="hover:bg-red-500/20 p-1 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
            </div>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-slate-900">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Kanban Board
        </h1>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex items-start gap-6 overflow-x-hidden  pb-4">
          {renderColumn("TODO", todo, "todo", CheckSquare, "text-blue-400")}
          {renderColumn("IN PROGRESS", inProgress, "in_progress", Loader, "text-yellow-400")}
          {renderColumn("DONE", done, "done", CheckCircle, "text-green-400")}

          {openForm && (
            <AddTaskForm onClose={onClose} fetchTasks={fetchTasks} />
          )}
          {isEditing && (
            <EditTaskForm
              onClose={onClose}
              fetchTasks={fetchTasks}
              taskId={isEditing}
            />
          )}
          {singleTask && (
            <SingleTaskModal onClose={onClose} taskId={singleTask} />
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;