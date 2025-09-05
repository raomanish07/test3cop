import React from "react";
import { useSelector } from "react-redux";
import FolderTree from "./components/FolderTree";
import Toolbar from "./components/Toolbar";
import { FolderState } from "./types";

const App: React.FC = () => {
  const folders = useSelector(
    (state: { folders: FolderState }) => state.folders.folders
  );
  return (
    <div>
      <Toolbar />
      <FolderTree folders={folders} />
    </div>
  );
};

export default App;
