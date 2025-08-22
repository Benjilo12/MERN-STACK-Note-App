import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-slate-900 bg-slate-300 px-3 py-1 rounded"
            >
              #{tag}{" "}
              <button
                onClick={() => {
                  handleRemoveTag(tag);
                }}
                className="cursor-pointer"
              >
                <IoMdClose className="cursor-pointer" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none dark:placeholder:text-gray-400 dark:text-gray-300 dark:bg-gray-700"
          placeholder="Add tags"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border cursor-pointer border-blue-600 hover:bg-blue-700"
          onClick={addNewTag}
        >
          <IoMdAdd className="text-2xl text-blue-700 hover:text-white dark:bg-blue-700 dark:text-gray-50 dark:hover:bg-blue-800" />
        </button>
      </div>
    </div>
  );
}

export default TagInput;
