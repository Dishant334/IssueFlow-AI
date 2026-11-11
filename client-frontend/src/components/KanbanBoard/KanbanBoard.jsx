import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../configs/api";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, Calendar, User, Inbox, Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddTaskForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";
import SingleTaskModal from "./SingleTaskModal";
import { priorityStyle, columnStyle, avatarColor } from "./taskStyles";

const KanbanBoard = ({ openForm, setOpenForm }) => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState("");
  const [singleTask, setSingleTask] = useState("");
  const [addStatus, setAddStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const token = window.localStorage.getItem("token");
  const { workspaceid, projectId } = useParams();

  function onClose() {
    setIsEditing("");
    setOpenForm(false);
    setSingleTask("");
    setAddStatus("");
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
    } finally {
      setLoading(false);
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

    // leave out the dragged task itself, so prev/next are its real neighbours
    const columnTasks = data
      .filter((t) => t.status === destStatus && t._id !== draggableId)
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
      const response = await api.patch(
        `/api/workspace/${workspaceid}/projects/${projectId}/tasks/${draggableId}/move`,
        { status: destStatus, position: newPosition },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.rebalanced) fetchTasks();
    } catch {
      toast.error("Move failed");
      setData(oldData);
    }
  };

  // GROUPING (sorted by position, so a dropped card stays where it was dropped)
  const byPosition = (a, b) => a.position - b.position;
  const todo = data.filter((m) => m.status === "todo").sort(byPosition);
  const inProgress = data.filter((m) => m.status === "in_progress").sort(byPosition);
  const done = data.filter((m) => m.status === "done").sort(byPosition);

  const percent = data.length ? Math.round((done.length / data.length) * 100) : 0;

  // CARD
  const renderCard = (task, index) => {
    const priority = priorityStyle[task.priority] || priorityStyle.medium;
    const column = columnStyle[task.status] || columnStyle.todo;
    const assignee = task.assignedTo?.name;

    return (
      <Draggable key={task._id} draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={
              snapshot.isDropAnimating
                ? { ...provided.draggableProps.style, transitionDuration: "0.18s" }
                : provided.draggableProps.style
            }
            onClick={() => setSingleTask(task._id)}
            className={`group select-none rounded-2xl border p-4 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              snapshot.isDragging
                ? "cursor-grabbing rotate-2 scale-[1.03] border-blue-400/60 bg-slate-800 shadow-2xl shadow-black/60 ring-1 ring-blue-400/40"
                : "cursor-grab border-slate-700/60 bg-slate-800/90 shadow-sm transition-colors hover:border-slate-600 hover:bg-slate-800"
            }`}
          >
            {/* Top row: status chip + actions */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${column.chip}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${column.chipDot}`} />
                {column.chipLabel}
              </span>

              <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(task._id);
                  }}
                  aria-label="Edit task"
                  title="Edit task"
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task._id);
                  }}
                  aria-label="Delete task"
                  title="Delete task"
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-500/15 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <p className="mt-3 text-[15px] font-semibold leading-snug text-slate-100">
              {task.title}
            </p>

            {task.description && (
              <p className="mt-1 line-clamp-1 text-sm text-slate-400">
                {task.description}
              </p>
            )}

            {/* Assignee */}
            <div className="mt-3.5 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">Assignee :</p>
              <div className="flex min-w-0 items-center gap-2">
                {assignee && (
                  <p className="truncate text-xs text-slate-300">{assignee}</p>
                )}
                {assignee ? (
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(assignee)}`}
                  >
                    {assignee.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <p className="text-xs">Unassigned</p>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-slate-600">
                      <User size={13} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date + priority */}
            <div className="mt-3 flex items-center justify-between">
              <span
                title="Created on"
                className="flex items-center gap-1.5 text-sm text-slate-400"
              >
                <Calendar size={14} />
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${priority.pill}`}
              >
                {priority.label}
              </span>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  // COLUMN
  const renderColumn = (title, tasks, status) => {
    const column = columnStyle[status];

    return (
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div className="flex max-h-[80vh] min-h-[60vh] min-w-72 flex-1 basis-0 flex-col rounded-3xl border border-slate-800 bg-slate-800/30 p-4">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
                <p className="text-base font-semibold text-slate-100">{title}</p>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-semibold text-white">
                  {tasks.length}
                </span>
              </div>
              <button
                onClick={() => {
                  setAddStatus(status);
                  setOpenForm(true);
                }}
                title={`Add task to ${title}`}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Tasks */}
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex min-h-28 flex-1 flex-col gap-3 overflow-y-auto rounded-2xl [scrollbar-color:var(--color-slate-700)_transparent] [scrollbar-width:thin] transition-colors ${
                snapshot.isDraggingOver ? `ring-1 ring-inset ${column.over}` : ""
              }`}
            >
              {loading ? (
                [0, 1].map((i) => (
                  <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-800/70" />
                ))
              ) : tasks.length === 0 && !snapshot.isDraggingOver ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700/70 py-10 text-center">
                  <Inbox size={20} className="text-slate-600" />
                  <p className="text-xs text-slate-500">Drop tasks here</p>
                </div>
              ) : (
                tasks.map((task, index) => renderCard(task, index))
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className="bg-slate-900 pb-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Board</h1>
          <p className="mt-1 text-sm text-slate-400">
            {data.length} tasks · {percent}% complete
          </p>
        </div>

        <div className="w-48">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex items-stretch gap-4 overflow-x-auto pb-4">
          {renderColumn("To do", todo, "todo")}
          {renderColumn("In Progress", inProgress, "in_progress")}
          {renderColumn("Done", done, "done")}

          {openForm && (
            <AddTaskForm
              onClose={onClose}
              fetchTasks={fetchTasks}
              defaultStatus={addStatus}
            />
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
