import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/navBar";
import TextSentiment from "./pages/textSentiment.jsx";
import ProductSentiment from "./pages/productSentiment.jsx";
import SocialSentiment from "./pages/socialSentiment.jsx";
import UserProfile from "./pages/userProfile.jsx";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="pt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/textSentiment" replace />} />
          <Route path="/textSentiment" element={<TextSentiment />} />
          <Route path="/productSentiment" element={<ProductSentiment />} />
          <Route path="/socialSentiment" element={<SocialSentiment />} />
          <Route path="/userProfile" element={<UserProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
