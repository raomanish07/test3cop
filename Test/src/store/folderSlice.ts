import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FolderState, Folder } from "../types";

const initialState: FolderState = {
  folders: [],
  selectedFolderId: null,
  pendingChanges: [],
  selectedFiles: [],
  selectedFilesSourceFolder: null,
  expandedFolders: [],
  ui: { showModal: false },
};

const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    addFolder(
      state,
      action: PayloadAction<{ parentId: string; name: string }>
    ) {
      // Find parent folder and add new folder
      const findFolder = (folders: Folder[], id: string): Folder | null => {
        for (const folder of folders) {
          if (folder.id === id) return folder;
          const found = findFolder(folder.children, id);
          if (found) return found;
        }
        return null;
      };
      const parent = findFolder(state.folders, action.payload.parentId);
      if (parent) {
        parent.children.push({
          id: "custom_" + Date.now(),
          name: action.payload.name,
          parentId: parent.id,
          children: [],
          documents: [],
          isSystem: false,
          isExpanded: true,
        });
      }
    },
    renameFolder(
      state,
      action: PayloadAction<{ folderId: string; newName: string }>
    ) {
      const findFolder = (folders: Folder[], id: string): Folder | null => {
        for (const folder of folders) {
          if (folder.id === id) return folder;
          const found = findFolder(folder.children, id);
          if (found) return found;
        }
        return null;
      };
      const folder = findFolder(state.folders, action.payload.folderId);
      if (folder) {
        folder.name = action.payload.newName;
      }
      state.ui.renamingFolderId = undefined;
    },
    setRenamingFolder(state, action: PayloadAction<{ folderId: string }>) {
      state.ui.renamingFolderId = action.payload.folderId;
    },
    deleteFolder(
      state,
      action: PayloadAction<{ folderId: string; systemFolderId: string }>
    ) {
      // Recursively delete folder and move docs to system folder
      const removeFolder = (folders: Folder[], id: string): Folder | null => {
        for (let i = 0; i < folders.length; i++) {
          if (folders[i].id === id) {
            const [removed] = folders.splice(i, 1);
            return removed;
          }
          const found = removeFolder(folders[i].children, id);
          if (found) return found;
        }
        return null;
      };
      const systemFolder = (() => {
        const findFolder = (folders: Folder[], id: string): Folder | null => {
          for (const folder of folders) {
            if (folder.id === id) return folder;
            const found = findFolder(folder.children, id);
            if (found) return found;
          }
          return null;
        };
        return findFolder(state.folders, action.payload.systemFolderId);
      })();
      const removed = removeFolder(state.folders, action.payload.folderId);
      if (removed && systemFolder) {
        systemFolder.documents = [
          ...systemFolder.documents,
          ...removed.documents,
        ];
      }
    },
    toggleExpandFolder(state, action: PayloadAction<{ folderId: string }>) {
      if (state.expandedFolders.includes(action.payload.folderId)) {
        state.expandedFolders = state.expandedFolders.filter(
          (id) => id !== action.payload.folderId
        );
      } else {
        state.expandedFolders.push(action.payload.folderId);
      }
    },
    selectFiles(
      state,
      action: PayloadAction<{ fileIds: string[]; sourceFolderId: string }>
    ) {
      state.selectedFiles = action.payload.fileIds;
      state.selectedFilesSourceFolder = action.payload.sourceFolderId;
    },
    moveSelectedFiles(
      state,
      action: PayloadAction<{ targetFolderId: string }>
    ) {
      const { targetFolderId } = action.payload;
      const sourceFolderId = state.selectedFilesSourceFolder;
      if (!sourceFolderId || !state.selectedFiles.length) return;
      // Find source and target folders
      const findFolder = (folders: Folder[], id: string): Folder | null => {
        for (const folder of folders) {
          if (folder.id === id) return folder;
          const found = findFolder(folder.children, id);
          if (found) return found;
        }
        return null;
      };
      const sourceFolder = findFolder(state.folders, sourceFolderId);
      const targetFolder = findFolder(state.folders, targetFolderId);
      if (sourceFolder && targetFolder) {
        // Move files
        const movingDocs = sourceFolder.documents.filter((doc) =>
          state.selectedFiles.includes(doc.id)
        );
        sourceFolder.documents = sourceFolder.documents.filter(
          (doc) => !state.selectedFiles.includes(doc.id)
        );
        targetFolder.documents = [...targetFolder.documents, ...movingDocs];
        // Clear selection
        state.selectedFiles = [];
        state.selectedFilesSourceFolder = null;
      }
    },
    assignFile(
      state,
      action: PayloadAction<{ fileId: string; folderId: string }>
    ) {
      // Implementation for assigning file
    },
    saveChanges(state) {
      // Implementation for saving changes
    },
    cancelChanges(state) {
      // Implementation for canceling changes
    },
    setModal(
      state,
      action: PayloadAction<{
        showModal: boolean;
        modalType?: string;
        modalFolderId?: string;
      }>
    ) {
      state.ui = { ...state.ui, ...action.payload };
    },
  },
});

export const {
  addFolder,
  renameFolder,
  setRenamingFolder,
  deleteFolder,
  toggleExpandFolder,
  selectFiles,
  moveSelectedFiles,
  assignFile,
  saveChanges,
  cancelChanges,
  setModal,
} = folderSlice.actions;
export default folderSlice.reducer;
