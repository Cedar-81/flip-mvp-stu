import React, { useContext, useEffect } from "react";
import { StudentContext } from "../../contexts/studentcontext";
import { gql, useMutation } from "@apollo/client";

const AddTeacherNote = gql`
  mutation AddStudentNote($input: addStudentNoteInput) {
    addStudentNote(input: $input) {
      id
    }
  }
`;

const Personal_notes = gql`
  query Personal_notes($studentId: ID!) {
    personal_notes(studentId: $studentId) {
      id
      topic
    }
  }
`;

function Note_creator() {
  const {
    notetitle,
    setNotetitle,
    setCreatetype,
    studentid,
    classcoursedata,
    notetype,
    setCreatednoteid,
    setCreate,
  } = useContext(StudentContext);

  useEffect(() => {
    setNotetitle("Untitled");
  }, []);

  useEffect(() => {
    if (notetitle.trim().length === 0) {
      setNotetitle("Untitled");
    }
  }, [notetitle]);

  const [addTeacherNote, { data, loading, error }] = useMutation(
    AddTeacherNote,
    {
      update(_, result) {
        setCreatednoteid(result.data.addStudentNote.id);
      },
      refetchQueries: [
        {
          query: Personal_notes,
          variables: {
            studentId: studentid,
          },
        },
        "Personal_notess",
      ],
    }
  );

  if (loading) console.log("Creating...");
  if (error) console.log(error);

  const inputVal = {
    authorId: studentid,
    topic: notetitle,
    category: notetype,
    content: "",
    editableContent: "",
  };

  const create = () => {
    console.log("here again");
    setCreatetype("editor");
    addTeacherNote({ variables: { input: inputVal } });
    console.log("data", data);
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 z-[68] bg-dark_color ">
      <div className="w-[20rem] relative min-h-[11rem] h-max mt-[13%] bg-accent_bkg_color pt-[1rem] rounded-lg shadow-lg px-[1rem] mx-auto my-auto ">
        <div
          onClick={() => {
            setCreate(false);
            setCreatetype("");
          }}
          className="cancel absolute right-5 cursor-pointer"
        >
          <span className="material-icons text-accent_color text-base">
            close
          </span>
        </div>
        <p className="text-xl text-center mx-auto max-w-full overflow-hidden">
          {notetitle}
        </p>
        <input
          type={"text"}
          onChange={(e) => setNotetitle(e.target.value)}
          className="w-full h-10 px-2 mt-[1.2rem] focus:shadow-lg focus:bg-main_color rounded-md outline-none"
          placeholder="Enter topic/title"
        />
        <div className="w-full flex justify-end">
          <button
            onClick={() => create()}
            className="bg-accent_color cursor-pointer hover:shadow-md text-main_color px-4 relative mt-5 mb-5 py-1 rounded-md text-base"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note_creator;
