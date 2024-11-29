import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import Home from "../pages/Home";
// import YourTrees from "../pages/YourTrees";
import App from "../components/App/App";
import TreePage from "../pages/TreePage";

const AppRouter = () => {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/item/:id" element={<TreePage />} />

        {/* <Route path="/your-trees" element={<YourTrees />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
