import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { ThemeProvider } from "./context/ThemeContext";

//another way
const routes = (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} /> {/* Home route shows Login */}
      <Route path="/dashboard" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </Router>
);

function App() {
  return (
    <div className="">
      <ThemeProvider>{routes}</ThemeProvider>
    </div>
  );
}

export default App;
