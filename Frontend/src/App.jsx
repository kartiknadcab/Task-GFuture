import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import PrivateRoute from "./components/PrivateRoute";
import { getMe } from "./api/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await getMe();
          setUser(data);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <Routes>
      {/* <Route element={<Layout user={user} logout={logout} />}> */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/register" element={<Register login={login} />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute user={user} loading={loading} />}
        >
          <Route index element={<Dashboard user={user} />} />
        </Route>
        <Route
          path="/projects/:id"
          element={<PrivateRoute user={user} loading={loading} />}
        >
          <Route index element={<ProjectDetails user={user} />} />
        </Route>
        <Route
          path="/tasks/:id"
          element={<PrivateRoute user={user} loading={loading} />}
        >
          <Route index element={<TaskDetails user={user} />} />
        </Route>
      {/* </Route> */}
    </Routes>
  );
}

export default App;
