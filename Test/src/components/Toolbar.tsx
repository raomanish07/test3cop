import React from "react";
import { useDispatch } from "react-redux";
import { saveChanges, cancelChanges } from "../store/folderSlice";

const Toolbar: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <button onClick={() => dispatch(saveChanges())}>Save</button>
      <button onClick={() => dispatch(cancelChanges())}>Cancel</button>
    </div>
  );
};

export default Toolbar;
