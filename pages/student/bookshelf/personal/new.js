import React, { useContext, useEffect } from "react";
import Editor from "../../../../components/bookshelf/minicomponents/editor";
import { StudentContext } from "../../../../components/contexts/studentcontext";
import Note_creator from "../../../../components/bookshelf/minicomponents/note_creator";

function New() {
  const { setNotetype, createtype } = useContext(StudentContext);

  useEffect(() => {
    setNotetype("personal");
  }, []);

  return (
    <div>
      {createtype === "untitled" && <Note_creator />}
      {createtype === "editor" && <Editor />}
    </div>
  );
}

export default New;
