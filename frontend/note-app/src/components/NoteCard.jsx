import { MdOutlinePushPin } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Tooltip } from "flowbite-react";
import moment from "moment";

function NoteCard({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out dark:bg-gray-600 dark:hover:shadow-lg dark:hover:shadow-black/30">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium dark:text-slate-100">{title}</h6>
          <span className="text-xs text-slate-500 dark:text-slate-200">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        <Tooltip content="Click to pin note" placement="top">
          <MdOutlinePushPin
            className={`icon-btn ${
              isPinned
                ? "text-red-600 dark:text-red-500"
                : "text-slate-700 dark:text-yellow-500"
            }`}
            onClick={onPinNote}
          />
        </Tooltip>
      </div>
      <p className="text-xs text-slate-600 mt-2 dark:text-slate-200">
        {content?.slice(0, 60)}
      </p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500  dark:text-slate-300 dark:bg-slate-500 rounded p-1 bg-slate-200">
          {tags.map((item) => `#${item}`)}
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Edit note" placement="top">
            <IoMdCreate
              className="icon-btn hover:text-green-600"
              onClick={onEdit}
            />
          </Tooltip>
          <Tooltip content="Delete note" placement="top">
            <MdDelete
              className="icon-btn hover:text-red-500"
              onClick={onDelete}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
