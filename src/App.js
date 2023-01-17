import React from "react";
import Mint from "./components/Mint";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 h-screen w-screen flex flex-col items-center">
      <Navbar />
      <Mint />
    </div>
  );
}

export default App;
