import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveChanges, cancelChanges, addFolder } from "../store/folderSlice";

interface ToolbarProps {
  folders: import("../types").Folder[];
  backendFolderNames: string[];
}

const Toolbar: React.FC<ToolbarProps> = ({ folders, backendFolderNames }) => {
  const dispatch = useDispatch();
  const [creatingRoot, setCreatingRoot] = useState(false);
  const [newRootName, setNewRootName] = useState("");
  const [showRootDuplicateModal, setShowRootDuplicateModal] = useState(false);

  const handleCreateRoot = () => {
    const rootNames = folders.map((f) => f.name.toLowerCase());
    const allNames = [
      ...backendFolderNames.map((n) => n.toLowerCase()),
      ...rootNames,
    ];
    if (allNames.includes(newRootName.trim().toLowerCase())) {
      setShowRootDuplicateModal(true);
      return;
    }
    dispatch(addFolder({ parentId: null, name: newRootName.trim() }));
    setNewRootName("");
    setCreatingRoot(false);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={() => dispatch(saveChanges())}>Save</button>
      <button onClick={() => dispatch(cancelChanges())}>Cancel</button>
      <button style={{ marginLeft: 8 }} onClick={() => setCreatingRoot(true)}>
        Create Root Folder
      </button>
      {creatingRoot && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              minWidth: 300,
            }}
          >
            <h3>Create Root Folder</h3>
            <input
              type="text"
              value={newRootName}
              autoFocus
              onChange={(e) => setNewRootName(e.target.value)}
              style={{ marginBottom: 12, width: "100%" }}
            />
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                onClick={() => {
                  setCreatingRoot(false);
                  setNewRootName("");
                }}
              >
                Cancel
              </button>
              <button onClick={handleCreateRoot}>Save</button>
            </div>
          </div>
        </div>
      )}
      {showRootDuplicateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              minWidth: 300,
            }}
          >
            <h3>Duplicate Folder Name</h3>
            <p>Duplicate folder cannot be created at root level.</p>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button onClick={() => setShowRootDuplicateModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
