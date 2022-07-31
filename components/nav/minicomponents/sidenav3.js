import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { StudentContext } from "../../contexts/studentcontext";
import { gql, useQuery } from "@apollo/client";

const Note = gql`
  query Personal_notes($studentId: ID!) {
    personal_notes(studentId: $studentId) {
      id
      topic
    }
  }
`;

const SchoolNotes = gql`
  query Notes(
    $authorId: ID!
    $courseId: ID!
    $classId: ID!
    $noteType: String!
    $available: Boolean!
  ) {
    notes(
      authorId: $authorId
      courseId: $courseId
      classId: $classId
      noteType: $noteType
      available: $available
    ) {
      id
      topic
    }
  }
`;

function Sidenav3() {
  const router = useRouter();
  const {
    setShelf3,
    notetype,
    setCreate,
    setSidebartype,
    setCreatetype,
    teacherid,
    classcoursedata,
    setCreatednoteid,
    setClass_course,
    studentid,
  } = useContext(StudentContext);

  // let notes = [];

  const [notes, setNotes] = useState([]);
  let data;
  let error;
  let loading;

  const {
    data: p_data,
    error: p_error,
    loading: p_loading,
  } = useQuery(Note, {
    variables: {
      studentId: studentid,
    },
  });
  if (notetype === "personal") {
    data = p_data;
    error = p_error;
    loading = p_loading;
  }

  const {
    data: s_data,
    error: s_error,
    loading: s_loading,
  } = useQuery(SchoolNotes, {
    variables: {
      authorId: classcoursedata.teacherId,
      courseId: classcoursedata.courseId,
      classId: classcoursedata.classId,
      noteType: notetype,
      available: true,
    },
  });
  if (notetype === "school") {
    data = s_data;
    error = s_error;
    loading = s_loading;
  }

  useEffect(() => {
    if (notetype === "school") {
      if (classcoursedata.teacherId === "" || classcoursedata.courseId === "") {
        setNotes([
          {
            id: "123",
            topic:
              "Please select a teacher and course to display notes from them.",
          },
        ]);
      } else {
        if (loading) {
          setNotes([{ topic: "loading...", id: "..." }]);
        }
        if (error) {
          console.log(JSON.stringify(error, null, 2));
        }
        if (data && data.notes.length > 0) {
          setNotes(data.notes);
        } else if (data && data.notes.length <= 0) {
          if (notetype === "personal") {
            setNotes([
              {
                id: "123",
                topic:
                  "Uhh... you dont have any note here, why dont you create one.",
              },
            ]);
          } else if (notetype === "school") {
            setNotes([
              {
                id: "123",
                topic: "Uhh... no notes has been shared yet.",
              },
            ]);
          }
        }
      }
    }

    if (notetype === "personal") {
      if (loading) {
        setNotes([{ topic: "loading...", id: "..." }]);
      }
      if (error) {
        console.log(JSON.stringify(error, null, 2));
      }
      if (data && data.personal_notes.length > 0) {
        setNotes(data.personal_notes);
      } else if (data && data.personal_notes.length <= 0) {
        setNotes([
          {
            id: "123",
            topic:
              "Uhh... you dont have any note here, why dont you create one.",
          },
        ]);
      }
    }
  }, [data]);

  let selected_notes;

  selected_notes = notes.map((val, index) => {
    return (
      <p
        key={index}
        onClick={() => read_note(val.id)}
        className="text hover:text-accent_color cursor-pointer py-2"
      >
        {val.topic}
      </p>
    );
  });

  const new_note = () => {
    if (notetype === "personal") {
      setSidebartype("");
      setCreate(true);
      setCreatetype("untitled");
      return router.push("/student/bookshelf/personal/new");
    }
  };

  const read_note = (id) => {
    setCreate(false);
    if (
      classcoursedata.classId !== "" &&
      classcoursedata.courseId !== "" &&
      data &&
      data.notes &&
      data.notes.length === 0
    )
      return new_note();
    if (notetype === "school") {
      if (classcoursedata.classId !== "" && classcoursedata.courseId !== "") {
        setCreatednoteid(id);
        router.push("/student/bookshelf/" + notetype + "/" + id);
      } else {
        setClass_course(true);
      }
    } else if (notetype === "personal") {
      setCreatednoteid(id);
      router.push("/student/bookshelf/" + notetype + "/" + id);
    }
  };

  return (
    <div className="w-[15%]  overflow-y-auto fixed ml-[20%] z-[61] h-[100%] bg-main_color shadow-lg">
      <div
        onClick={() => setShelf3(false)}
        className="icon_con bg-main_color mt-4 w-full sticky top-1 cursor-pointer text-right"
      >
        <span className="material-icons text-sm text-accent_color">
          arrow_back_ios
        </span>
      </div>
      {notetype === "personal" && (
        <div
          onClick={() => {
            new_note();
          }}
          className="new_con flex sticky bg-main_color top-5 text-sm items-center py-2 px-2 mt-11 cursor-pointer hover:text-accent_color"
        >
          <span className="material-icons text-accent_color">edit</span>
          <p className="text ml-3 font-semibold">Create</p>
        </div>
      )}
      {notetype == "personal" && (
        <h3 className="text-xs font-semibold mt-5 ml-2 text-accent_color">
          NOTES
        </h3>
      )}
      {notetype == "school" && (
        <h3 className="text-xs font-semibold mt-5 ml-2 text-accent_color">
          TOPICS
        </h3>
      )}
      {notetype === "school" &&
        classcoursedata.classId !== "" &&
        classcoursedata.courseId !== "" && (
          <>
            {data && data.notes && data.notes.length === 0 && (
              <div className="items mx-3 mt-1 h-[50%] text-xs flex items-center text-accent_bkg_dark_color text-center">
                <div className="flex-row">
                  <span className="material-icons text-6xl font-semibold text-accent_bkg_dark_color">
                    sentiment_very_dissatisfied
                  </span>
                  {selected_notes}
                </div>
              </div>
            )}
            {data && data.notes.length > 0 && (
              <div className="items mx-3 mt-1 text-sm">{selected_notes}</div>
            )}
          </>
        )}
      {notetype === "personal" && (
        <>
          {data && data.personal_notes && data.personal_notes.length === 0 && (
            <div className="items mx-3 mt-1 h-[50%] text-xs flex items-center text-accent_bkg_dark_color text-center">
              <div className="flex-row">
                <span className="material-icons text-6xl font-semibold text-accent_bkg_dark_color">
                  sentiment_very_dissatisfied
                </span>
                {selected_notes}
              </div>
            </div>
          )}
          {data && data.personal_notes.length > 0 && (
            <div className="items mx-3 mt-1 text-sm">{selected_notes}</div>
          )}
        </>
      )}
      {notetype === "school" &&
        (classcoursedata.classId === "" || classcoursedata.courseId === "") && (
          <div className="items mx-3 mt-1 h-[70%] text-xs flex items-center text-accent_bkg_dark_color text-center">
            <div className="flex-row">
              <span className="material-icons text-6xl font-semibold text-accent_bkg_dark_color">
                hourglass_empty
              </span>
              {selected_notes}
            </div>
          </div>
        )}
    </div>
  );
}

export default Sidenav3;
