import React, { useContext } from "react";
import { StudentContext } from "../../contexts/studentcontext";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const Personal_Notes = gql`
  query Personal_notes($studentId: ID!) {
    personal_notes(studentId: $studentId) {
      id
      topic
    }
  }
`;

const DeleteNote = gql`
  mutation DeleteStudentNote($input: deleteStudentNoteInput) {
    deleteStudentNote(input: $input)
  }
`;

function Note_deletor() {
  const { studentid, notedata, setNotedata } = useContext(StudentContext);

  const router = useRouter();

  const [deleteStudentNote, { data, loading, error }] = useMutation(
    DeleteNote,
    {
      refetchQueries: [
        {
          query: Personal_Notes,
          variables: {
            studentId: studentid,
          },
        },
        "Personal_Notes",
      ],
    }
  );

  if (loading) console.log("Creating...");
  if (error) console.log("error", JSON.stringify(error, null, 2));

  const inputVal = {
    id: notedata.deleteNoteId,
  };

  const delete_note = () => {
    deleteStudentNote({ variables: { input: inputVal } });
    setNotedata({
      ...notedata,
      deleteNote: false,
      deletNoteId: "",
    });
    router.push("/student/bookshelf");
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 z-50 bg-dark_color">
      <div className="w-[20rem] relative min-h-[11rem] h-max mt-[13%] bg-accent_bkg_color pt-[1rem] rounded-lg shadow-lg px-[1rem] mx-auto my-auto ">
        <div
          onClick={() => {
            setNotedata({ ...notedata, deleteNote: false, deleteNoteId: "" });
          }}
          className="cancel absolute right-5 cursor-pointer"
        >
          <span className="material-icons text-accent_color text-base">
            close
          </span>
        </div>
        <p className="text-xl text-center mx-auto font-medium max-w-full text-accent_color overflow-hidden">
          Delete Alert!!!
        </p>
        <p className="text-sm text-left mt-3">
          Hey, if you delete this note it would be gone forever
        </p>
        <div className="w-full flex justify-end">
          <button
            onClick={() => delete_note()}
            className="bg-accent_color cursor-pointer hover:shadow-md text-main_color px-4 relative mt-5 mb-5 py-1 rounded-md text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note_deletor;
