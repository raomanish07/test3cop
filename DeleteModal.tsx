import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal, deleteFolder } from "../store/folderSlice";
import { FolderState } from "../types";

interface Props {
  systemFolderId: string;
}

const DeleteModal: React.FC<Props> = ({ systemFolderId }) => {
  const dispatch = useDispatch();
  const ui = useSelector((state: { folders: FolderState }) => state.folders.ui);
  const show = ui.showModal && ui.modalType === "delete";
  const folderId = ui.modalFolderId;

  if (!show || !folderId) return null;

  const handleDelete = () => {
    dispatch(deleteFolder({ folderId, systemFolderId }));
    dispatch(
      setModal({
        showModal: false,
        modalType: undefined,
        modalFolderId: undefined,
      })
    );
  };

  const handleCancel = () => {
    dispatch(
      setModal({
        showModal: false,
        modalType: undefined,
        modalFolderId: undefined,
      })
    );
  };

  return (
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
        <h3>Delete Folder</h3>
        <p>
          Are you sure you want to delete this folder? All files will be moved
          to the system folder.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={handleCancel}>Cancel</button>
          <button
            onClick={handleDelete}
            style={{
              color: "white",
              background: "red",
              border: "none",
              padding: "6px 16px",
              borderRadius: 4,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
