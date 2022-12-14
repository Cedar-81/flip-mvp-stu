import React, { useContext } from "react";
import { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import { StudentContext } from "../../contexts/studentcontext";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const load_quill = () => {
  if (typeof document !== "undefined") {
    const Quill = require("quill");
    return Quill;
  }
};

const UpdateStudentNote = gql`
  mutation UpdateStudentNote($input: updateStudentNoteInput) {
    updateStudentNote(input: $input) {
      id
      topic
    }
  }
`;

const Note = gql`
  query Personal_note($personalNoteId: ID!) {
    personal_note(id: $personalNoteId) {
      id
      topic
      category
      content
      authorId
      updatedAt
    }
  }
`;

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
  ["image", "blockquote", "code-block", "link", "video"],
  ["clean"],
];

const SAVE_INTERVAL_MS = 3000;

function Editor({ edit_content }) {
  const router = useRouter();
  const {
    setNotecontent,
    setEditablecontent,
    setCreate,
    notecontent,
    notetitle,
    creatednoteid,
    editablecontent,
    notetype,
    studentid,
    classcoursedata,
    notedata,
    setNotedata,
    setSavenote,
    savenote,
    updatenotechecker,
    setUpdatenotechecker,
  } = useContext(StudentContext);
  const [quill, setQuill] = useState();
  const [ready, setReady] = useState(false);
  const [textChange, setTextChange] = useState(false);

  useEffect(() => setCreate(true));

  let refectch = {};

  useEffect(() => {
    if (notetype === "school") {
      router.push(`/${studentid}/bookshelf`);
    }
  }, []);

  if (notedata.updateNote) {
    refectch = {
      refetchQueries: [
        { query: Note, variables: { personalNoteId: router.query.id } },
        "Note",
      ],
    };
  }

  const [updateStudentNote, { data, loading, error }] = useMutation(
    UpdateStudentNote,
    refectch
  );

  if (loading) console.log("Creating...");
  if (error) console.log(JSON.stringify(error, null, 2));

  const inputVal = {
    id: creatednoteid,
    authorId: studentid,
    topic: notetitle,
    category: notetype,
    content: notecontent,
    editableContent: JSON.stringify(editablecontent),
  };

  const save_note = async () => {
    setSavenote(true);
    setTextChange("Saving...Just a moment");
    await updateStudentNote({ variables: { input: inputVal } });
    setSavenote(false);
    setUpdatenotechecker(false);
    setNotedata({
      ...notedata,
      updateNote: false,
      updateContent: "",
      ready: false,
    });
    router.push(`/${studentid}/bookshelf/` + notetype + "/" + creatednoteid);
  };

  useEffect(() => {
    if (updatenotechecker) {
      save_note();
    }
  }, []);

  useEffect(() => {
    if (quill !== undefined && notedata.updateNote) {
      quill.root.innerHTML = notedata.updateContent;
      quill.enable();
    }
  }, [notedata.ready, quill]);

  if (quill !== undefined) {
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source == "user") {
        setEditablecontent(quill.getContents());
        setNotecontent(quill.root.innerHTML);
      }
    });
    if (notedata.ready === false) {
      setNotedata({
        ...notedata,
        ready: true,
      });
    }
  }

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    if (typeof document !== "undefined") {
      let Quill = load_quill();
      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      });
      setQuill(q);
      if (notedata.updateNote) {
        q.disable();
        q.setText("Loading...");
      }
    }
  }, []);
  return (
    <>
      {savenote && (
        <div className="w-full flex items-center justify-center border-2">
          <p className="fixed py-2 text-xs px-4 z-[55] text-center mx-auto shadow-lg bg-accent_color text-main_color top-[17%]">
            Saving... Just a moment
          </p>
        </div>
      )}
      <div className="container" ref={wrapperRef}></div>
      <button
        onClick={save_note}
        className="fixed right-9 bottom-8 w-[6rem] h-[2.5rem] rounded-md bg-accent_color text-main_color cursor-pointer border-2"
      >
        Done
      </button>
    </>
  );
}

export default Editor;
