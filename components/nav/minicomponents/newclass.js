import React, { useContext, useState } from "react";
import { StudentContext } from "../../contexts/studentcontext";
import { gql, useMutation } from "@apollo/client";

const AddClass = gql`
  mutation AddStudentTeacherCourse($input: addSTUInput) {
    addStudentTeacherCourse(input: $input) {
      id
      studentId
    }
  }
`;

const StudentTeacherCourse = gql`
  query Studentteachercourse($studentId: ID!) {
    studentteachercourse(studentId: $studentId) {
      id
      studentId
      classId
      teacherId
      verified
      teacher {
        firstName
        lastName
      }
      courseList {
        id
        course
      }
      class {
        id
        class
      }
    }
  }
`;

function Newclass() {
  const { setClasscoursedata, classcoursedata, studentid } =
    useContext(StudentContext);
  const [classcode, setClasscode] = useState("");

  const [add_class, { data, loading, error }] = useMutation(AddClass, {
    refetchQueries: [
      { query: StudentTeacherCourse, variables: { studentId: studentid } },
      "studentteachercourse",
    ],
  });

  if (loading) console.log("Creating...");
  if (error) console.log(JSON.stringify(error, null, 2));

  const inputVal = {
    classCode: classcode,
    studentId: studentid,
  };

  const add = async () => {
    setClasscoursedata({
      ...classcoursedata,
      action: "",
      working: true,
      workingText: "Adding...",
    });
    try {
      await add_class({ variables: { input: inputVal } });
    } catch (e) {
      setClasscoursedata(
        {
          ...classcoursedata,
          action: "",
          working: true,
          workingText: "Invalid class code",
        },
        2000
      );
    }
    setTimeout(() => {
      setClasscoursedata({
        ...classcoursedata,
        action: "",
        working: false,
      });
    });
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 z-50 bg-dark_color">
      <div className="w-[20rem] relative min-h-[11rem] h-max mt-[13%] bg-accent_bkg_color pt-[1rem] rounded-lg shadow-lg px-[1rem] mx-auto my-auto ">
        <div
          onClick={() => setClasscoursedata({ ...classcoursedata, action: "" })}
          className="cancel absolute right-5 cursor-pointer"
        >
          <span className="material-icons text-accent_color text-base">
            close
          </span>
        </div>
        <p className="text-xl text-center mx-auto max-w-full overflow-hidden">
          Add Class
        </p>
        <input
          type={"text"}
          onChange={(e) => setClasscode(e.target.value)}
          className="w-full h-10 px-2 mt-[1.2rem] focus:shadow-lg focus:bg-main_color rounded-md outline-none"
          placeholder="Enter class code"
        />
        <div className="w-full flex justify-end">
          <button
            onClick={() => add()}
            className="bg-accent_color cursor-pointer hover:shadow-md text-main_color px-4 relative mt-5 mb-5 py-1 rounded-md text-base"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default Newclass;
