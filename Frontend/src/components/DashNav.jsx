import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/dataSlice";
import { ChevronDown, User, LogOut } from "lucide-react"; // Importing Lucide icons

const DashNav = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUserData({ userData: {} }));
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/dashboard">
          Dashboard
        </a>

        <div className="ms-auto">
          <div className="dropdown">
            <button
              className="btn d-flex align-items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="profile-avatar">
                {userData?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="d-none d-md-block ms-2">{userData?.name}</span>
              <ChevronDown size={18} className="ms-2" />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu show profile-dropdown position-absolute end-0">
                <div className="profile-header">
                  <h6 className="m-0">{userData?.name}</h6>
                  <small className="text-muted">{userData?.email}</small>
                </div>
                <div className="dropdown-divider"></div>
                <div
                  className="profile-menu-item"
                  onClick={() => {
                    console.log("View Profile");
                    setIsDropdownOpen(false);
                  }}
                >
                  <User size={18} className="me-2" />
                  Profile
                </div>
                <div className="profile-menu-item logout-item" onClick={handleLogout}>
                  <LogOut size={18} className="me-2" />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashNav;
