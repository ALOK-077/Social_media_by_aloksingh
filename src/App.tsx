import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Navbar } from "./components/Navbar";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";

function App() {
  return (
    <div>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage/>}/>
          <Route path="/post/:id" element={<PostPage/>}/>
           <Route path="/community/create" element={<CreateCommunityPage/>}/>
           <Route path="/communities" element={<CommunitiesPage/>}/>
           <Route path="/community/:id" element={<CommunityPage/>}/>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
