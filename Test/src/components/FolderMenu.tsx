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

  const [addError, setAddError] = useState("");
  const handleAddFolder = () => {
    const name = prompt("Enter folder name:");
    if (!name) return setShowMenu(false);
    const siblingNames = siblings.map((f) => f.name.toLowerCase());
    const allNames = [
      ...backendFolderNames.map((n) => n.toLowerCase()),
      ...siblingNames,
    ];
    if (allNames.includes(name.toLowerCase())) {
      setAddError("Duplicate folder cannot be created");
      setTimeout(() => {
        setAddError("");
        setShowMenu(false);
      }, 2000);
      return;
    }
    dispatch(addFolder({ parentId: folderId, name }));
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (!isSystem && systemFolderId) {
      dispatch(deleteFolder({ folderId, systemFolderId }));
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
          {addError && (
            <span style={{ color: "red", fontSize: 12, paddingLeft: 8 }}>
              {addError}
            </span>
          )}
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
          {!isSystem && (
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
          )}
        </div>
      )}
    </div>
  );
};
export default FolderMenu;
