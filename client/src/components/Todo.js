import { useEffect, useState } from "react";
import axios from "axios";

const clinet = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/posts",
});

export default function Todo({ darkMode }) {
  const [posts, setPosts] = useState([]);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [UpdatePost, setUpdatePost] = useState();
  const [UpdateTitle, setUpdateTitle] = useState("");
  const [UpdateBody, setUpdateBody] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      let res = await clinet.get(`?_limit=10`);
      console.log(res.data);
      setPosts(res.data);
    };
    fetchPost();
  }, []);

  const addPosts = async (title, body) => {
    let res = await clinet.post("", {
      title: title,
      body: body,
    });
    setPosts((posts) => [res.data, ...posts]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPosts(title, body);
  };

  const deletePost = async (id) => {
    await clinet.delete(`${id}`);
    setPosts(
      posts.filter((post) => {
        return post.id !== id;
      })
    );
  };

  const updatePost = async (id) => {
    const res = await clinet.get(`/${id}`);
    console.log(res.data);
    setUpdatePost(res.data);
    setShowModal(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    UpdateTitleBody(UpdateTitle, UpdateBody);
  };

  const UpdateTitleBody = async (UpdateTitle, UpdateBody) => {
    let res = await clinet.put(`/${UpdatePost.id}`, {
      title: UpdateTitle,
      body: UpdateBody,
    });
    setPosts((posts) =>
      posts.map((post) =>
        post.id === UpdatePost.id
          ? { ...post, title: res.data.title, body: res.data.body }
          : post
      )
    );

    setUpdateTitle("");
    setUpdateBody("");
    setShowModal(false);
  };

  return (
    <div className="container mx-auto">
      <div className=" my-5">
        <div className=" flex justify-between">
          <h1 className=" my-3 text-2xl font-semibold">Create a new post</h1>
          <div className=" my-3"></div>
        </div>
        <form
          className={` bg-white shadow-md rounded  ${darkMode && "dark"}`}
          onSubmit={handleSubmit}
        >
          <input
            text="text"
            className={` shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline  ${
              darkMode && "dark"
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            required
          />
          <textarea
            text="text"
            className={` shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline  ${
              darkMode && "dark"
            }`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="body"
            required
          />
          <div className=" my-4 flex text-center justify-center">
            <button
              className=" my-1 px-2 py-1 font-semibold text-white bg-green-500 rounded-2xl hover:bg-green-700"
              type="submit"
            >
              Add Post
            </button>
          </div>
        </form>
      </div>

      <div className=" my-10">
        <h1 className=" font-semibold text-4xl text-center text-red-500">
          Posts
        </h1>
      </div>
      {posts.map((post) => {
        return (
          <div className=" border px-5 py-5 drop-shadow-lg" key={post.id}>
            <div className=" flex gap-2">
              <h1 className=" font-semibold text-xl">{post.id}.</h1>
              <h1 className=" font-semibold text-xl">{post.title}</h1>
            </div>

            <p className="">{post.body}</p>
            <div className=" flex gap-2">
              <button
                className="mt-1 px-2 py-1 font-semibold text-white bg-blue-500 rounded-2xl hover:bg-blue-700 "
                onClick={() => updatePost(post.id)}
              >
                Update
              </button>
              <button
                className="mt-1 px-2 py-1 font-semibold text-white bg-red-500 rounded-2xl hover:bg-red-700 "
                onClick={() => deletePost(post.id)}
              >
                Delete
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
                        Enter Posts Body:
                        <textarea
                          text="text"
                          value={UpdateBody}
                          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline"
                          onChange={(e) => setUpdateBody(e.target.value)}
                          placeholder={UpdatePost.body}
                          cols="100"
                          rows="10"
                          required
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
