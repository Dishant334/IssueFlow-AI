import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../configs/api";
import { useParams } from "react-router-dom";
import { Plus,Pencil,Trash2, CheckSquare, Loader, CheckCircle } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";


const DashboardMyTasks = ({openForm,onClose,setOpenForm}) => {
  const [data, setData] = useState([]);
  const [loading,setLoading]=useState(false)

  const token = window.localStorage.getItem("token");
  const { workspaceid, projectId } = useParams();
  function onClose(){
    setIsEditing('')
    setOpenForm(false)
    setSingleTask('')
  }



  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await api.get(
        `/api/workspace/${workspaceid}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.tasks);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something Went Wrong");
    }finally{
      setLoading(false)
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
      `/api/workspace/${workspaceid}/tasks/${draggableId}/move`,
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
  const renderColumn = (title, tasks, status,logo) =>{ 
    const Icon=logo
    return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="w-75 shrink-0  rounded-2xl p-4 flex flex-col max-h-[80vh] shadow-sm transition-all duration-200 hover:-translate-y-0.5 bg-slate-800 border border-slate-700 "
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-300">{title}</p>
              <p className="text-xs text-slate-500">
                {tasks.length} tasks
              </p>
            </div>

            <button className="p-2 rounded-lg hover:bg-gray-100 transition">
              <Icon size={16} className='text-slate-100'/>
            </button>
          </div>
          
          {/* Tasks */}
          { loading ? <div className="flex justify-center ">
            <div className="size-14 rounded-full border-6 border-slate-400 border-t-blue-500 animate-spin"></div>
          </div> :
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
                      onClick={()=>setSingleTask(task._id)}
                      className="relative group bg-slate-900 hover:bg-slate-800 rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                    >
                      <p className="font-medium text-sm text-slate-100">
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold">
                            {task.assignedTo?.name?.charAt(0) || "U"}
                          </div>
                          <p className="text-xs text-slate-100">
                            {task.assignedTo?.name || "Unassigned"}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            task.priority === "high"
                              ? "bg-red-500/10 text-red-400"
                              : task.priority === "medium"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-green-500/10 text-green-400"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                   
                    </div>
                  )}
                </Draggable>
              ))
            )}
          </div>
      }
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )};

  return (
    <div>
      <div className='m-4'>
        <p className='font-semibold text-3xl text-slate-100'>My Tasks</p>
        <p className='text-sm text-slate-400 mt-1 max-w-md'>Manage and track your tasks</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex items-start gap-6 justify-evenly overflow-x-auto px-2 pb-4 scroll-smooth ">
          {renderColumn("TODO", todo, "todo",CheckSquare)}
          {renderColumn("IN PROGRESS", inProgress, "in_progress",Loader)}
          {renderColumn("DONE", done, "done",CheckCircle)}

    
        </div>
      </DragDropContext>
    </div>
  );
};

export default DashboardMyTasks;