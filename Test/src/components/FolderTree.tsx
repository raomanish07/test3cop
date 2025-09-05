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
  const [renameError, setRenameError] = useState("");

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
      setRenameError("Duplicate folder cannot be created");
      return;
    }
    dispatch(renameFolder({ folderId, newName: name }));
    setRenameValue("");
    setRenameError("");
  };

  return (
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{ cursor: "pointer", marginRight: 8 }}
                onClick={() => handleExpand(folder.id)}
              >
                {isExpanded ? "▼" : "▶"}
              </span>
              <span style={{ marginRight: 8 }}>
                <span role="img" aria-label="folder">
                  📁
                </span>
              </span>
              {isRenaming ? (
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <input
                    type="text"
                    value={renameValue}
                    autoFocus
                    onChange={(e) => {
                      setRenameValue(e.target.value);
                      setRenameError("");
                    }}
                    onBlur={() =>
                      handleRename(
                        folder.id,
                        renameValue || folder.name,
                        siblings
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleRename(
                          folder.id,
                          renameValue || folder.name,
                          siblings
                        );
                    }}
                    style={{ marginRight: 8 }}
                  />
                  {renameError && (
                    <span style={{ color: "red", fontSize: 12 }}>
                      {renameError}
                    </span>
                  )}
                </span>
              ) : (
                <span>{folder.name}</span>
              )}
              <FolderMenu
                folderId={folder.id}
                isSystem={!!folder.isSystem}
                onStartRename={() => {
                  setRenameValue(folder.name);
                  setRenameError("");
                  dispatch(setRenamingFolder({ folderId: folder.id }));
                }}
                systemFolderId={systemFolderId}
                siblings={siblings}
                backendFolderNames={backendFolderNames}
              />
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
