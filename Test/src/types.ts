export interface Document {
  id: string;
  name: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  children: Folder[];
  documents: Document[];
  isSystem?: boolean;
  isExpanded?: boolean;
}

export interface FolderState {
  folders: Folder[];
  selectedFolderId: string | null;
  pendingChanges: any[];
  selectedFiles: string[];
  selectedFilesSourceFolder: string | null;
  expandedFolders: string[];
  ui: {
    showModal: boolean;
    modalType?: "add" | "rename";
    modalFolderId?: string;
    renamingFolderId?: string;
  };
}
