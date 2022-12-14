import React, { useContext, useEffect, useState } from "react";
import { StudentContext } from "../../contexts/studentcontext";
import { gql, useQuery } from "@apollo/client";

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

function Class_course() {
  const [action, setAction] = useState("Class");
  const [course_list, setCourse_list] = useState([]);
  const {
    toggle_class_course,
    studentid,
    setClasscoursedata,
    classcoursedata,
    setShelf2,
    setShelf3,
  } = useContext(StudentContext);

  const { data, error, loading } = useQuery(StudentTeacherCourse, {
    variables: { studentId: studentid },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  let teachers;

  if (loading) {
    teachers = <p>loading...</p>;
  }

  if (error) {
    console.log(JSON.stringify(error, null, 2));
  }

  if (data) {
    console.log(data);
    teachers = data.studentteachercourse.map((val, index) => {
      return (
        <div
          key={index}
          onClick={() => {
            setClasscoursedata((prev) => {
              return {
                ...prev,
                courseId: prev.classId !== val.classId ? "" : prev.courseId,
                courseName: prev.classId !== val.classId ? "" : prev.courseName,
                teacherId: val.teacherId,
                classId: val.classId,
                className: val.class.class,
              };
            });
            setAction("Course");
          }}
          className="item cursor-pointer flex bg-[#E3E7ED] hover:bg-accent_bkg_hover w-[95%] mb-4 px-4 h-[3rem] items-center mx-auto rounded-xl"
        >
          <p className="item_text md:text-sm ml-4 text-xl font-semibold">
            {val.class.class}
            <span className="text-xs block font-normal">
              {val.teacher.firstName + " " + val.teacher.lastName}
            </span>
          </p>
        </div>
      );
    });
  }

  useEffect(() => {
    if (data && action === "Course") {
      let val = data.studentteachercourse.filter(
        (val) => val.classId === classcoursedata.classId
      );
      console.log(val);
      val = val[0].courseList;
      setCourse_list(val);
    }
  }, [classcoursedata]);

  const courses = course_list.map((val, index) => {
    return (
      <div
        key={index}
        onClick={() => {
          setClasscoursedata({
            ...classcoursedata,
            courseId: val.id,
            courseName: val.course,
          });
          toggle_class_course(false);
        }}
        className="item cursor-pointer flex bg-[#E3E7ED] hover:bg-accent_bkg_hover w-[95%] mb-4 px-4 h-[3rem] items-center mx-auto rounded-xl"
      >
        <p className="item_text md:text-sm ml-4 text-xl font-semibold">
          {val.course}
        </p>
      </div>
    );
  });

  setShelf2(false);
  setShelf3(false);

  return (
    <div className="nav_displays z-50 fixed overflow-y-auto md:top-[9%] bg-sidenav_bkg_color md:right-[6rem] md:pt-0 md:mt-4 md:h-max md:w-max md:rounded-md md:shadow-lg top-0 h-[90%] w-[100vw]">
      {classcoursedata.working && (
        <div className="w-full absolute z-10 top-1 flex items-center justify-center ">
          <p className="py-2 text-xs px-4 text-center mx-auto shadow-lg bg-accent_color text-main_color">
            {classcoursedata.workingText}Just a moment
          </p>
        </div>
      )}
      <div className="class_course w-full md:w-[20rem] pt-4 md:pt-0 bg-accent_bkg_color md:bg-main_color md:h-[20rem] md:rounded-md items-center h-full">
        <div className="flex md:mt-0 md:hidden">
          <div className="icon_con rounded-full h-10 w-10 cursor-pointer flex justify-center items-center">
            <span className="material-symbols-outlined text-md">
              arrow_back_ios_new
            </span>
          </div>
          <h2 className="class_course_text ml-2 text-3xl text-accent_color font-semibold">
            Select {action}
          </h2>
        </div>

        <div className="class_course_con w-full mt-7 h-full ">
          {action == "Class" && (
            <div className="display bg-sidenav_bkg_color h-full pt-8 md:pt-0">
              <div
                onClick={() =>
                  setClasscoursedata({
                    ...classcoursedata,
                    action: "new_class",
                  })
                }
                className="item cursor-pointer sticky top-4 flex bg-accent_color_2 w-[95%] mb-4 px-4 h-[3rem] items-center mx-auto rounded-xl"
              >
                <span className="material-icons text-accent_color">add</span>
                <p className="item_text md:text-sm ml-4 text-xl font-medium">
                  Add class
                </p>
              </div>
              {teachers}
            </div>
          )}

          {action == "Course" && (
            <div className="display bg-sidenav_bkg_color h-full pt-8 md:pt-0">
              <div
                onClick={() => setAction("Class")}
                className="back_to_class sticky top-2 bg-sidenav_bkg_color flex mb-4 md:ml-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-accent_color">
                  arrow_back_ios_new
                </span>
                <p className="text-sm font-semibold text-accent_color">
                  Change Class
                </p>
              </div>
              <div className="item cursor-pointer sticky top-4 flex bg-accent_color_2 w-[95%] mb-4 px-4 h-[3rem] items-center mx-auto rounded-xl">
                <p className="item_text md:text-sm ml-4 text-xl font-medium">
                  Available courses
                </p>
              </div>
              {courses}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Class_course;
