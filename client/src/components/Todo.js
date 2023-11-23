import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const client = axios.create({
  baseURL: "http://localhost:8000/tasks",
});

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [UpdatePost, setUpdatePost] = useState();
  const [UpdateTitle, setUpdateTitle] = useState("");
  const [UpdateBody, setUpdateBody] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      let res = await client.get();
      console.log(res.data);
      setTasks(res.data);
    };
    fetchPost();
  }, []);

  const handleCheck = async (id) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
      await client.put(`/${id}`, {
        completed: !tasks.find((task) => task.id === id).completed,
        title: tasks.find((task) => task.id === id).title,
        description: tasks.find((task) => task.id === id).description,
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const addtasks = async (title, body) => {
    let res = await client.post("", {
      title: title,
      body: body,
    });
    setTasks((tasks) => [res.data, ...tasks]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addtasks(title, body);
    setTitle("");
    setBody("");
  };

  const deletePost = async (id) => {
    await client.delete(`${id}`);
    setTasks(
      tasks.filter((post) => {
        return post.id !== id;
      })
    );
  };

  const updatePost = async (id) => {
    
    try {

      const res = await client.get(`${id}`);
      setUpdatePost(res.data);
      console.log(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching task for update:", error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    
    e.preventDefault();
    await updateTaskBody(UpdateTitle, UpdateBody);
  };

  const updateTaskBody = async (title, body) => {
    try {
      const response = await client.put(`/${UpdatePost.id}`, {
        title,
        description: body,
        completed: UpdatePost.completed,
      });
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === UpdatePost.id
            ? {
                ...task,
                title: response.data.title,
                description: response.data.description,
                completed:response.data.completed,
              }
            : task
        )
      );
      setUpdateTitle("");
      setUpdateBody("");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="">
      <div className=" my-5">
        <div className=" flex justify-between">
          <h1 className=" my-3 text-2xl font-bold">Add New Task</h1>
          <div className=" my-3"></div>
        </div>
        <form className={` `} onSubmit={handleSubmit}>
          <input
            text="text"
            className={` shadow appearance-none border-2 focus:border-[#949191] rounded w-full py-2 px-3 text-gray-700 bg-[#E1DEDE] leading-tight focus:outline-none  
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            required
          />
          <textarea
            text="text"
            className={` shadow appearance-none border-2 focus:border-[#949191] rounded w-full py-2 px-3 text-gray-700 bg-[#E1DEDE] leading-tight focus:outline-none
            }`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="description"
          />
          <div className=" my-2 flex text-center justify-center">
            <button
              className=" my-1 px-2 py-1 font-semibold text-zinc-800 border border-zinc-500  rounded hover:bg-green-300"
              type="submit"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      <div className=" my-10">
        <h1 className=" text-2xl font-bold">All Tasks</h1>
      </div>
      {tasks.map((post) => {
        return (
          <div className="border-b  px-5 py-5 " key={post.id}>
            <div className=" flex gap-2">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                checked={post.completed}
                onChange={() => handleCheck(post.id)}
                className="mt-3 w-5 self-start md:self-auto md:mt-2 md:w-5 cursor-pointer text-green-500 bg-red-500"
              />
              <h1
                className={`font-semibold text-lg ${
                  post.completed && " line-through text-slate-500"
                }`}
              >
                {post.title}
              </h1>
            </div>

            <p className={`pl-8 ${post.completed && "hidden"}`}>
              {post.description}
            </p>

            <div className="pl-8 flex gap-2">
              <button
                className="mt-1 px-2 py-1 font-semibold text-zinc-800 border border-zinc-500 rounded hover:bg-blue-300 "
                onClick={() => updatePost(post.id)}
              >
                <FaEdit />
              </button>
              <button
                className="mt-1 px-2 py-1 font-semibold text-zinc-800 border border-zinc-500 rounded hover:bg-red-300 "
                onClick={() => deletePost(post.id)}
              >
                <MdDelete />
              </button>
            </div>
          </div>
        );
      })}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              {UpdatePost ? (
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <form onSubmit={handleUpdateSubmit}>
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <h3 className="text-xl font-semibold">
                        Update title:
                        <textarea
                          text="text"
                          value={UpdateTitle}
                          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline"
                          onChange={(e) => setUpdateTitle(e.target.value)}
                          placeholder={UpdatePost.title}
                          cols="100"
                          rows="3"
                         required
                        />
                      </h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowModal(false)}
                      >
                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                          ×
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">
                      <p className="text-xl font-semibold">
                        Enter tasks Body:
                        <textarea
                          text="text"
                          value={UpdateBody}
                          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline"
                          onChange={(e) => setUpdateBody(e.target.value)}
                          placeholder={UpdatePost.description}
                          cols="100"
                          rows="10"
                          
                        />
                      </p>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
