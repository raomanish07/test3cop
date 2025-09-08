import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Folder, FolderState } from "../types";
import FolderMenu from "./FolderMenu";
import FileList from "./FileList";
import {
  toggleExpandFolder,
  setRenamingFolder,
  renameFolder,
} from "../store/folderSlice";

interface Props {
  folders: Folder[];
  systemFolderId?: string;
  backendFolderNames: string[];
}

const FolderTree: React.FC<Props> = ({
  folders,
  systemFolderId,
  backendFolderNames,
}) => {
  const dispatch = useDispatch();
  const expandedFolders = useSelector(
    (state: { folders: FolderState }) => state.folders.expandedFolders
  );
  const renamingFolderId = useSelector(
    (state: { folders: FolderState }) => state.folders.ui.renamingFolderId
  );
  const [renameValue, setRenameValue] = useState("");
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [creatingRoot, setCreatingRoot] = useState(false);
  const [newRootName, setNewRootName] = useState("");

  const handleExpand = (folderId: string) => {
    dispatch(toggleExpandFolder({ folderId }));
  };

  const handleRename = (folderId: string, name: string, siblings: Folder[]) => {
    const siblingNames = siblings
      .filter((f) => f.id !== folderId)
      .map((f) => f.name.toLowerCase());
    const allNames = [
      ...backendFolderNames.map((n) => n.toLowerCase()),
      ...siblingNames,
    ];
    if (allNames.includes(name.toLowerCase())) {
      setShowDuplicateModal(true);
      return;
    }
    dispatch(renameFolder({ folderId, newName: name }));
    setRenameValue("");
  };

  // Root folder name validation
  const handleCreateRoot = () => {
    const rootNames = folders.map(f => f.name.toLowerCase());
    const allNames = [...backendFolderNames.map(n => n.toLowerCase()), ...rootNames];
    if (allNames.includes(newRootName.trim().toLowerCase())) {
      setShowDuplicateModal(true);
      return;
    }
    dispatch({ type: 'folders/addFolder', payload: { parentId: null, name: newRootName.trim() } });
    setNewRootName("");
    setCreatingRoot(false);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        {creatingRoot ? (
          <span style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={newRootName}
              autoFocus
              onChange={e => setNewRootName(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <button style={{ marginRight: 4 }} onClick={handleCreateRoot}>Save</button>
            <button onClick={() => { setCreatingRoot(false); setNewRootName(""); }}>Cancel</button>
          </span>
        ) : (
          <button onClick={() => setCreatingRoot(true)}>Create Root Folder</button>
        )}
      </div>
      <ul style={{ listStyle: "none", paddingLeft: 20 }}>
        {folders.map((folder) => {
        const isExpanded = expandedFolders.includes(folder.id);
        const isRenaming = renamingFolderId === folder.id;
        const siblings = folders;
        return (
          <li
            key={folder.id}
            style={{
              border: "1px solid #ccc",
              margin: 8,
              borderRadius: 6,
              padding: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 8 }}>
                  <span role="img" aria-label="folder">
                    📁
                  </span>
                </span>
                {isRenaming ? (
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={renameValue}
                      autoFocus
                      onChange={(e) => {
                        setRenameValue(e.target.value);
                      }}
                      style={{ marginRight: 8 }}
                    />
                    <button
                      style={{ marginRight: 4 }}
                      onClick={() =>
                        handleRename(
                          folder.id,
                          renameValue || folder.name,
                          siblings
                        )
                      }
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setRenameValue("");
                        dispatch(setRenamingFolder({ folderId: undefined }));
                      }}
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <span>{folder.name}</span>
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
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 8,
                        }}
                      >
                        <button onClick={() => setShowDuplicateModal(false)}>
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <FolderMenu
                  folderId={folder.id}
                  isSystem={!!folder.isSystem}
                  onStartRename={() => {
                    setRenameValue(folder.name);
                    dispatch(setRenamingFolder({ folderId: folder.id }));
                  }}
                  systemFolderId={systemFolderId}
                  siblings={siblings}
                  backendFolderNames={backendFolderNames}
                />
              </div>
              <span
                style={{ cursor: "pointer", marginLeft: 8 }}
                onClick={() => handleExpand(folder.id)}
              >
                {isExpanded ? "▼" : "▶"}
              </span>
            </div>
            {isExpanded && (
              <div
                style={{
                  border: "1px solid #eee",
                  marginTop: 8,
                  borderRadius: 4,
                  padding: 8,
                }}
              >
                <FileList documents={folder.documents} folderId={folder.id} />
                {folder.children && folder.children.length > 0 && (
                  <FolderTree
                    folders={folder.children}
                    systemFolderId={systemFolderId}
                    backendFolderNames={backendFolderNames}
                  />
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default FolderTree;
