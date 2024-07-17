import Header from "./components/Header";
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Drone from "./pages/Drone";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import Test from "./pages/Test";
function App() {
  const auth = useAuth();
  return(
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        {auth?.isLoggedIn && auth.user && (
          // this is a protected route
          <Route path="/drone" element={<Drone />}/>
        )}
        <Route path="/test" element={<Test />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </main>
  );  
}

export default App;
