import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { StudentContext } from "../contexts/studentcontext";

function Sidenav() {
  const router = useRouter();
  const {
    setShelf2,
    setCreate,
    setTopbaraction,
    setClass_course,
    classcoursedata,
    studentname,
    studentid,
    toggle_shelf2,
  } = useContext(StudentContext);

  const show_shelf = () => {
    setTopbaraction((prev) => "Notes");
    toggle_shelf2();
    if (router.query.id === undefined) {
      router.push(`/${studentid}/bookshelf`);
    }
  };

  return (
    <div className="md:w-[12rem] md:block w-[60%] bg-sidenav_bkg_color shadow-md relative z-[67] top-0 h-[100%]">
      <div className=" absolute bottom-2 right-2 px-2">
        <Image src="/assets/logo.png" width={67} height={28} />
      </div>
      <div
        onClick={() => {
          setClass_course((prev) => !prev);
        }}
        className="details cursor-pointer mt-8 grid grid-cols-2 gap-0 bg-accent_bkg_hover px-2 rounded-lg mx-1 h-[5rem] "
      >
        <div
          onClick={() => {
            setClass_course((prev) => !prev);
            router.push(`/${studentid}/settings`);
          }}
          className="initials border-2 w-[3rem] my-auto flex justify-center items-center text-lg font-semibold text-main_color bg-accent_color rounded-md h-[3rem]"
        >
          {studentname !== undefined && studentname.trim().length > 0
            ? studentname.split(" ")[0][0].toUpperCase() +
              studentname
                .split(" ")
                [studentname.split(" ").length - 1][0].toUpperCase()
            : "..."}
        </div>
        <div className="det_txt ml-[-1.7rem] my-auto">
          <p className="text-xs text-[#F7F7F7]">
            Class:{" "}
            <span className="font-medium">
              {classcoursedata.className != "" &&
              classcoursedata.className.length > 7
                ? classcoursedata.className.substring(0, 7) + "..."
                : classcoursedata.className}
              {classcoursedata.className === "" && "Select Cl..."}
            </span>
          </p>
          <p className="text-xs mt-1 text-[#F7F7F7]">
            Course:{" "}
            <span className="font-medium">
              {classcoursedata.courseName != "" &&
              classcoursedata.courseName.length > 7
                ? classcoursedata.courseName.substring(0, 7) + "..."
                : classcoursedata.courseName}
              {classcoursedata.courseName.trim().length === 0 && "Select C..."}
            </span>
          </p>
        </div>
      </div>
      <div className="icons w-full flex-row mt-[1rem]">
        <div
          onClick={show_shelf}
          className="icon_con flex mx-1 px-4 rounded-md items-center text-center py-2 hover:text-dark_color text-dark_color_2 cursor-pointer mt-4 hover:bg-accent_bkg_hover"
        >
          <span className="material-symbols-outlined text-[30px]">
            summarize
          </span>
          <p className="text-base font-medium ml-4">Notes</p>
        </div>
        <div
          onClick={() => {
            setTopbaraction("Settings");
            setCreate(false);
            router.push(`/${studentid}/settings`);
          }}
          className="icon_con flex mx-1 px-4 rounded-md items-center text-center py-2 hover:text-dark_color text-dark_color_2 cursor-pointer mt-2 hover:bg-accent_bkg_hover"
        >
          <span className="material-symbols-outlined text-[30px]">
            settings
          </span>
          <p className="text-base font-medium ml-4">Settings</p>
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
