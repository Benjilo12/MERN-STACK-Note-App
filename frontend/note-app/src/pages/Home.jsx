import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import { IoMdAdd } from "react-icons/io";
import AddEditNotes from "./AddEditNotes";
import axiosInstance from "../utils/axiosinstance";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Toast from "../components/Toast";
import EmptyCard from "../components/EmptyCard";

function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMSg] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails });
  };

  const showToastMessage = async (message, type) => {
    setShowToastMSg({
      isShown: true,
      message,
      type,
    });
  };
  const handleCloseToast = async () => {
    setShowToastMSg({
      isShown: false,
      message: "",
    });
  };

  // Fetch user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      console.log("User Info API Response:", response);

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      } else {
        console.warn("User not found in response.");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error.response?.status === 401) {
        console.log("Unauthorized. Redirecting...");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Fetch all notes
  const getAllNotes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/get-all-notes");
      console.log("Notes API Response:", response);

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      } else {
        console.warn("No notes found in response.");
        setAllNotes([]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("An unexpected error occurred while fetching notes.");
    } finally {
      setLoading(false);
    }
  };

  //Delete Notes
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);

      //if data fetch successful
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        // Refresh the notes list on the page
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError("An unexpected error occurred please try again.");
      }
    }
  };

  //search for a note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(
        `/update-note-pinned/${noteId}`,
        {
          isPinned: !noteId.isPinned,
        }
      );

      //if data fetch successful
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        // Refresh the notes list on the page
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <div className="min-h-screen w-full dark:bg-gray-900">
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-4">
        {loading ? (
          <p className="text-white text-center mt-10">Loading notes...</p>
        ) : error ? (
          <p className="text-red-500 text-center mt-10">{error}</p>
        ) : allNotes.length === 0 ? (
          <EmptyCard
            imgSrc={isSearch ? "/note-remove.svg" : "./add-note.svg"}
            message={
              isSearch
                ? "Oops! No notes found matching your search"
                : `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminder. Lets get started `
            }
          />
        ) : (
          <div className="flex flex-wrap gap-4 mt-8 w-full">
            {allNotes.map((item) => (
              <div
                key={item._id || Math.random()}
                className="w-full sm:w-[calc(33.333%-1rem)]"
              >
                <NoteCard
                  title={item.title || "No Title"}
                  date={item.createdOn}
                  content={item.content || ""}
                  tags={item.tags || []}
                  isPinned={item.isPinned}
                  onEdit={() => {
                    handleEdit(item);
                  }}
                  onDelete={() => {
                    deleteNote(item);
                  }}
                  onPinNote={() => {
                    updateIsPinned(item);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <IoMdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Add/Edit Note"
        className="w-[40%] max-h-3/4 bg-white rounded mx-auto mt-14 p-5  dark:bg-gray-600"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
}

export default Home;
