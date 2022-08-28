import React, { useContext, useEffect } from "react";
import { StudentContext } from "../contexts/studentcontext";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import Bookshelfeditbutton from "./minicomponents/bookshelfeditbutton";
import Editor from "./minicomponents/editor";
import { useRouter } from "next/router";

const School_Note = gql`
  query Note($noteId: ID!) {
    note(id: $noteId) {
      id
      topic
      classId
      courseId
      content
      authorId
      updatedAt
    }
  }
`;

const Personal_Note = gql`
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

let data;
let error;
let loading;

function Displaynote() {
  const {
    savenote,
    setCreate,
    creatednoteid,
    notedata,
    setNotedata,
    notetype,
    classcoursedata,
    studentid,
  } = useContext(StudentContext);

  const router = useRouter();

  useEffect(() => {
    if (
      notetype === "" ||
      (notetype === "school" &&
        (classcoursedata.classId === "" || classcoursedata.courseId === ""))
    ) {
      router.push(`/${studentid}/bookshelf`);
    }
  }, []);

  const {
    data: s_data,
    error: s_error,
    loading: s_loading,
  } = useQuery(School_Note, {
    variables: {
      noteId: creatednoteid,
    },
  });
  if (notetype === "school") {
    data = s_data;
    loading = s_loading;
    error = s_error;
  }

  const {
    data: p_data,
    error: p_error,
    loading: p_loading,
  } = useQuery(Personal_Note, {
    variables: {
      personalNoteId: creatednoteid,
    },
  });
  if (notetype === "personal") {
    data = p_data;
    loading = p_loading;
    error = p_error;
  }

  let val = "...";
  if (loading) {
    val = "...";
  }
  if (error) {
    console.log(JSON.stringify(error, null, 2));
  }
  if (data) {
    if (notetype === "school") val = data.note;
    if (notetype === "personal") val = data.personal_note;
  }

  if (!notedata.updateNote) setCreate(false);

  return (
    <>
      {!notedata.updateNote && (
        <>
          <div className="note_container m-2 w-[8.5in] mx-auto bg-accent_bkg_color shadow-xl rounded-xl p-4 min-h-full">
            <p className="date text-sm text-accent_color font-medium">
              {moment(new Date(+val?.updatedAt)).format("LL")}
            </p>
            <div className="content mt-4">
              <h2 className="note_heading text-2xl font-medium">
                {val?.topic}
              </h2>
              <div
                className="note_content mt-5"
                dangerouslySetInnerHTML={{ __html: val?.content }}
              ></div>
            </div>
          </div>
          {notetype === "personal" && <Bookshelfeditbutton />}
          <div className="h-[6rem]"></div>
        </>
      )}
      {notedata.updateNote && <Editor />}
    </>
  );
}

export default Displaynote;
