import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Document, FolderState } from "../types";
import { selectFiles } from "../store/folderSlice";

interface Props {
  documents: Document[];
  folderId: string;
}

const FileList: React.FC<Props> = ({ documents, folderId }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selectFiles({ fileIds: selected, sourceFolderId: folderId }));
  }, [selected, folderId, dispatch]);

  const handleCheck = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 4,
        padding: 8,
        marginTop: 4,
      }}
    >
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {documents.map((doc) => (
          <li
            key={doc.id}
            style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
          >
            <input
              type="checkbox"
              checked={selected.includes(doc.id)}
              onChange={() => handleCheck(doc.id)}
              style={{ marginRight: 8 }}
            />
            <span style={{ marginRight: 8 }} role="img" aria-label="pdf">
              📄
            </span>
            <span>{doc.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
