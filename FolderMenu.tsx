import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setModal,
  moveSelectedFiles,
  addFolder,
  deleteFolder,
} from "../store/folderSlice";
import { FolderState } from "../types";

interface Props {
  folderId: string;
  isSystem?: boolean;
  onStartRename?: () => void;
  systemFolderId?: string;
  siblings: import("../types").Folder[];
  backendFolderNames: string[];
}

const FolderMenu: React.FC<Props> = ({
  folderId,
  isSystem,
  onStartRename,
  systemFolderId,
  siblings,
  backendFolderNames,
}) => {
  const dispatch = useDispatch();
  const selectedFiles = useSelector(
    (state: { folders: FolderState }) => state.folders.selectedFiles
  );
  const selectedFilesSourceFolder = useSelector(
    (state: { folders: FolderState }) => state.folders.selectedFilesSourceFolder
  );
  const [showMenu, setShowMenu] = useState(false);

  const handleMoveHere = () => {
    if (
      selectedFiles.length > 0 &&
      selectedFilesSourceFolder &&
      selectedFilesSourceFolder !== folderId
    ) {
      dispatch(moveSelectedFiles({ targetFolderId: folderId }));
    }
    setShowMenu(false);
  };

  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const handleAddFolder = () => {
    setAddingFolder(true);
    setShowMenu(false);
  };
  const handleSaveAddFolder = () => {
    const siblingNames = siblings.map((f) => f.name.toLowerCase());
    const allNames = [
      ...backendFolderNames.map((n) => n.toLowerCase()),
      ...siblingNames,
    ];
    if (allNames.includes(newFolderName.trim().toLowerCase())) {
      setShowDuplicateModal(true);
      return;
    }
    dispatch(addFolder({ parentId: folderId, name: newFolderName.trim() }));
    setNewFolderName("");
    setAddingFolder(false);
  };

  const handleDelete = () => {
    if (!isSystem && systemFolderId) {
      dispatch(
        setModal({
          showModal: true,
          modalType: "delete",
          modalFolderId: folderId,
        })
      );
    }
    setShowMenu(false);
  };

  return (
    <div style={{ position: "relative", marginLeft: 8 }}>
      <button
        onClick={() => setShowMenu((v) => !v)}
        style={{ border: "none", background: "none", cursor: "pointer" }}
      >
        ⋮
      </button>
      {showMenu && (
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 10,
            minWidth: 120,
          }}
        >
          <button
            style={{
              display: "block",
              width: "100%",
              border: "none",
              background: "none",
              padding: 8,
              textAlign: "left",
            }}
            onClick={handleAddFolder}
          >
            Add Folder
          </button>
          <button
            style={{
              display: "block",
              width: "100%",
              border: "none",
              background: "none",
              padding: 8,
              textAlign: "left",
            }}
            onClick={() => {
              if (onStartRename) onStartRename();
              setShowMenu(false);
            }}
          >
            Rename
          </button>
          <button
            style={{
              display: "block",
              width: "100%",
              border: "none",
              background: "none",
              padding: 8,
              textAlign: "left",
            }}
            onClick={handleMoveHere}
            disabled={
              selectedFiles.length === 0 ||
              selectedFilesSourceFolder === folderId
            }
          >
            Move Here
          </button>
          {!isSystem ? (
            <button
              style={{
                display: "block",
                width: "100%",
                border: "none",
                background: "none",
                padding: 8,
                textAlign: "left",
                color: "red",
              }}
              onClick={handleDelete}
            >
              Delete
            </button>
          ) : null}
        </div>
      )}
      {addingFolder && (
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
            <h3>Add Folder</h3>
            <input
              type="text"
              value={newFolderName}
              autoFocus
              onChange={(e) => setNewFolderName(e.target.value)}
              style={{ marginBottom: 12, width: "100%" }}
            />
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                onClick={() => {
                  setAddingFolder(false);
                  setNewFolderName("");
                }}
              >
                Cancel
              </button>
              <button onClick={handleSaveAddFolder}>Save</button>
            </div>
          </div>
        </div>
      )}
      {showDuplicateModal && (
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
            <p>Duplicate folder cannot be created at this level.</p>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setAddingFolder(true);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FolderMenu;
