import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../configs/api";
import { useParams } from "react-router-dom";
import { Plus,Pencil,Trash2 } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import AddTaskForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";

const KanbanBoard = ({openForm,onClose,setOpenForm}) => {
  const [data, setData] = useState([]);
  const [isEditing,setIsEditing]=useState('')
  const token = window.localStorage.getItem("token");
  const { workspaceid, projectId } = useParams();
  function onClose(){
    setIsEditing('')
    setOpenForm(false)

  }
  const deleteTask=async(taskId)=>{
    const confirm=window.confirm('Are you sure to delete this task')
    if(!confirm) return
    try{
      const response=await api.delete(`/api/workspace/${workspaceid}/projects/${projectId}/tasks/${taskId}`,{headers:{Authorization:`Bearer ${token}`}})
      toast.success(response?.data?.message || 'Task deleted successfully')
      await fetchTasks()
    }catch(err){
      toast.error(err?.response?.data?.message || 'Something went wrong') 
    }
  }


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
  ) return;

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

  //Safety check
  if (isNaN(newPosition)) {
    toast.error("Invalid position");
    return;
  }

  //Save old state (for rollback)
  const oldData = data;

  //Optimistic UI update
  const updatedData = data.map((task) => {
    if (task._id === draggableId) {
      return {
        ...task,
        status: destStatus,
        position: newPosition,
      };
    }
    return task;
  });

  setData(updatedData);

  // API call (background)
  try {
    await api.patch(
      `/api/workspace/${workspaceid}/projects/${projectId}/tasks/${draggableId}/move`,
      {
        status: destStatus,
        position: newPosition,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (err) {
    toast.error("Move failed");

    //rollback UI
    setData(oldData);
  }
};

  //GROUPING
  const todo = data.filter((m) => m.status === "todo");
  const inProgress = data.filter((m) => m.status === "in_progress");
  const done = data.filter((m) => m.status === "done");

  //COLUMN
  const renderColumn = (title, tasks, status) => (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="w-75 shrink-0 bg-gray-100 rounded-2xl p-4 flex flex-col max-h-[80vh] shadow-sm transition-all duration-200 hover:-translate-y-0.5"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">{title}</p>
              <p className="text-xs text-gray-400">
                {tasks.length} tasks
              </p>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-200 transition">
              <Plus size={16} />
            </button>
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mt-6">
                No tasks
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
                      className="relative group bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                    >
                      <p className="font-medium text-gray-800">
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                            {task.assignedTo?.name?.charAt(0) || "U"}
                          </div>
                          <p className="text-xs text-gray-600">
                            {task.assignedTo?.name || "Unassigned"}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-600"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={()=>setIsEditing(task._id)}  className="cursor-pointer hover:bg-green-400 p-0.5 rounded-md"><Pencil size={20}/></button>
                        <button onClick={()=>deleteTask(task._id)} className="cursor-pointer hover:bg-red-400 p-0.5 rounded-md"><Trash2 size={20}/></button>
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Kanban Board
        </h1>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex items-start justify-evenly gap-6 overflow-x-auto px-2 pb-4 scroll-smooth">
          {renderColumn("TODO", todo, "todo")}
          {renderColumn("IN PROGRESS", inProgress, "in_progress")}
          {renderColumn("DONE", done, "done")}

          {openForm && <AddTaskForm onClose={onClose} fetchTasks={fetchTasks}/>}
          {isEditing && <EditTaskForm onClose={onClose} fetchTasks={fetchTasks} taskId={isEditing}/>}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;