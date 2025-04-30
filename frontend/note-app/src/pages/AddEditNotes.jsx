import { useState } from "react";
import TagInput from "../components/TagInput";
import { IoMdClose } from "react-icons/io";
import axiosInstance from "../utils/axiosinstance";

function AddEditNotes({
  noteData,
  type,
  getAllNotes,
  onClose,
  showToastMessage,
}) {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || "");
  const [error, setError] = useState(null);

  //  Add a new note to the database
  const addNewNote = async () => {
    try {
      // Send a POST request to the backend with the new note data
      const response = await axiosInstance.post("/add-note", {
        title, // title of the note
        content, // content/body of the note
        tags, // tags associated with the note
      });

      //if data fetch successful
      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        // Refresh the notes list on the page
        getAllNotes();
        // Close the modal after adding the note
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit Note
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title, // title of the note
        content, // content/body of the note
        tags, // tags associated with the note
      });

      //if data fetch successful
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        // Refresh the notes list on the page
        getAllNotes();
        // Close the modal after adding the note
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("please enter the title");
      return;
    }

    if (!content) {
      setError("please enter the content");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  return (
    <div className="relative ">
      <button
        className="w-10 h-10  items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500 dark:text-white"
        onClick={onClose}
      >
        <IoMdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label dark:text-gray-100">Title</label>
        <input
          type="text"
          className="text-1xl text-slate-950 outline-none dark:placeholder:text-gray-300 dark:text-gray-400 dark:bg-gray-700 py-2 px-2"
          placeholder="Go to Gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label dark:text-gray-100">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded dark:bg-gray-700 dark:placeholder:text-gray-400 dark:text-gray-400"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>
      <div className="mt-3">
        <label className="input-label dark:text-gray-100">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
}

export default AddEditNotes;
