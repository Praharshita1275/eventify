// components/LogoutButton.js
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear JWT token or session data
    localStorage.removeItem("token"); 
    // Redirect to Login Page
    navigate("/login");
  };

  return (
    <button 
      onClick={handleLogout} 
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
