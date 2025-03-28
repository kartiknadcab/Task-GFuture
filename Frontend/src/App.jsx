import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import { getMe } from "./api/api";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setUserExist } from "./redux/dataSlice";

function App() {
  const dispatch = useDispatch();
  const { userExist ,refresh} = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await getMe();
          dispatch(setUserData({ userData: data }));
          if (data) {
            dispatch(setUserExist({ userExist: true }));
          }
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch ,refresh]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={userExist ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/projects/:id"
        element={
          userExist ? <ProjectDetails /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/tasks/:id"
        element={userExist ? <TaskDetails /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
