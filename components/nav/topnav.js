import React, { useContext, useEffect, useState } from "react";
import { StudentContext } from "../contexts/studentcontext";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const StudentInfo = gql`
  query Student($studentId: ID!) {
    student(studentId: $studentId) {
      id
      firstName
      lastName
      image
    }
  }
`;

function Topnav() {
  const {
    toggle_notification,
    toggle_class_course,
    notetitle,
    create,
    setNotetitle,
    toggle_menu,
    topbaraction,
    studentid,
    studentprofile,
    setTopbaraction,
    setStudentname,
  } = useContext(StudentContext);

  const router = useRouter();

  const { data, error, loading } = useQuery(StudentInfo, {
    variables: { studentId: studentid },
  });

  let val = "...";
  if (loading) {
    val = "loading...";
  }

  if (
    data &&
    data.student.firstName !== undefined &&
    data.student.lastName !== undefined
  ) {
    setStudentname(data.student.firstName + " " + data.student.lastName);
    val = data.student.firstName.trim();
  }

  useEffect(() => {
    if (typeof document !== "undefined" && data) {
      document.getElementById(
        "profile_img"
      ).style.backgroundImage = `url(${data.student.image})`;
    }
  }, [studentprofile, data]);

  return (
    <div className="topnav py-2 relative md:w-full z-[60] top-0 flex justify-between h-[10%] items-center w-full shadow-md md:px-8 bg-accent_bkg_color">
      {create && (
        <input
          placeholder="Untitled"
          value={notetitle}
          onChange={(e) => {
            setNotetitle(e.target.value);
          }}
          className="hidden md:flex text-2xl font-medium bg-accent_bkg_color py-2 outline-none"
        />
      )}
      {!create && (
        <h1 className="label hidden md:contents text-2xl font-medium">
          {topbaraction}
        </h1>
      )}
      <div className="right flex justify-between md:w-max w-full md:flex-row-reverse ">
        <div className="profile flex md:flex items-center">
          <div
            onClick={() => {
              setTopbaraction("Personal");
              router.push(`/${studentid}/settings`);
            }}
            id="profile_img"
            className="profile_img rounded-full cursor-pointer bg-no-repeat bg-cover bg-center h-[3rem] md:h-9 md:w-9 ml-4 w-[3rem] bg-main_color shadow-lg border-[1px] border-accent_color"
          ></div>
          <h2 className="hidden md:block greeting font-medium text-base md:text-sm w-max ml-2">
            Hello, {" " + val.length > 8 ? val.substring(0, 8) + "..." : val}!
          </h2>
        </div>

        <div className="icons mr-4 flex justify-between  w-[28%] md:w-max">
          <div
            onClick={() => {
              toggle_class_course();
            }}
            className="flex-row items-center text-center cursor-pointer"
          >
            <span className="material-icons text-accent_bkg_hover hover:text-accent_color rounded-full">
              add_circle
            </span>
            <p className="classes text-xs mt-[-5px] hover:text-accent_color">
              Classes
            </p>
          </div>
          {/* <div
            onClick={() => {
              toggle_notification();
            }}
            className="icon_con rounded-full h-8 w-8 cursor-pointer bg-main_color flex justify-center items-center shadow-md p-[19px]"
          >
            <span className="material-symbols-outlined text-accent_color ">
              notifications
            </span>
          </div> */}
          <div
            onClick={() => toggle_menu()}
            className="icon_con rounded-full h-8 w-8 md:hidden cursor-pointer bg-main_color flex justify-center items-center shadow-md p-[19px]"
          >
            <span className="material-symbols-outlined text-accent_color">
              menu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topnav;
