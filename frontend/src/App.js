import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Auth from "./components/Auth";
import Events from "./components/Events";
import Resources from "./components/Resources";
import About from "./components/About";
import Feedback from "./components/Feedback";  // ✅ Added Feedback page
import Footer from "./components/Footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleRegister = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {isAuthenticated && <Navbar />}  {/* ✅ Show Navbar only after login */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth onRegister={handleRegister} />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/feedback" element={<Feedback />} />  {/* ✅ Feedback Route */}
      </Routes>
      {isAuthenticated && <Footer />}  {/* ✅ Show Footer only after login */}
    </Router>
  );
}

export default App;
