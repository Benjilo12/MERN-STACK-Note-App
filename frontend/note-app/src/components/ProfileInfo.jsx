import { getInitials } from "../utils/helper";
import { useDarkMode } from "../context/ThemeContext";

function ProfileInfo({ userInfo, onLogout }) {
  const { darkMode, setDarkMode } = useDarkMode();

  const initials = getInitials(userInfo?.fullName ?? "B");
  const fullName = userInfo?.fullName ?? "Benjamin";

  return (
    <div className="flex items-center gap-3 pr-20">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="px-3 py-2 bg-gray-200 rounded-md transition-all dark:text-gray-100 dark:bg-gray-900"
      >
        {darkMode ? "🌙 dark mode" : "☀️ light mode"}
      </button>

      {/* Profile Circle */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 dark:bg-gray-900 dark:text-white">
        <h1>{initials}</h1>
      </div>

      {/* Profile Info */}
      <div>
        <p className="text-sm font-medium">{fullName}</p>
        <button
          className="text-sm text-slate-700 underline cursor-pointer font-medium dark:text-white"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileInfo;
