import React, { createContext, useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

const StudentContext = createContext();

function Studentcontextprovider({ children }) {
  const [notification, setNotification] = useState(false);
  const [class_course, setClass_course] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [topbaraction, setTopbaraction] = useState("Welcome");
  const [sidebarcon, setSidebarcon] = useState(false);
  const [sidebartype, setSidebartype] = useState("");
  const [shelf2, setShelf2] = useState(false);
  const [shelf3, setShelf3] = useState(false);
  const [updatenotechecker, setUpdatenotechecker] = useState(false);
  const [savenote, setSavenote] = useState(false);
  const [bookshelfbuttons, setBookshelfbuttons] = useState({
    toggle_components: false,
    show_editor: false,
  });
  const [classcoursedata, setClasscoursedata] = useState({
    teacherId: "",
    courseId: "",
    classId: "",
    action: "",
    className: "",
    courseName: "",
    working: false,
    workingText: "",
  });
  const [notedata, setNotedata] = useState({
    updateNote: false,
    updateContent: "",
    ready: false,
    deleteNoteId: "",
    deleteNote: false,
  });
  const [createtype, setCreatetype] = useState("");
  const [notetype, setNotetype] = useState("");
  const [create, setCreate] = useState(false);
  const [notecontent, setNotecontent] = useState("");
  const [notetitle, setNotetitle] = useState("Untitled");
  const [editablecontent, setEditablecontent] = useState("");
  const [creatednoteid, setCreatednoteid] = useState("");
  const [studentid, setStudentid] = useState("cl657q2fi0030d0ks9nuqo631");
  const [studentprofile, setStudentprofile] = useState({
    firstname: "",
    lastname: "",
    address: "",
    email: "",
    tel: "",
    country: "",
    state: "",
    image: "",
    postal_code: "",
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  function toggle_notification() {
    setClass_course(false);
    setSidebar(false);
    setNotification(!notification);
  }

  function toggle_class_course() {
    setNotification(false);
    setSidebar(false);
    setClass_course(!class_course);
  }

  function toggle_menu() {
    setSidebarcon(!sidebarcon);
    setSidebar(!sidebar);
    setNotification(false);
    setClass_course(false);
  }

  const value = {
    notification,
    toggle_notification,
    class_course,
    toggle_class_course,
    sidebar,
    toggle_menu,
    shelf2,
    shelf3,
    setShelf2,
    setShelf3,
    notetype,
    setNotetype,
    create,
    setCreate,
    notecontent,
    setNotecontent,
    editablecontent,
    setEditablecontent,
    savenote,
    setSavenote,
    notetitle,
    setNotetitle,
    sidebartype,
    setSidebartype,
    topbaraction,
    setTopbaraction,
    studentprofile,
    setStudentprofile,
    classcoursedata,
    setClasscoursedata,
    setClass_course,
    studentid,
    setStudentid,
    createtype,
    setCreatetype,
    creatednoteid,
    setCreatednoteid,
    bookshelfbuttons,
    setBookshelfbuttons,
    notedata,
    setNotedata,
    updatenotechecker,
    setUpdatenotechecker,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export { Studentcontextprovider, StudentContext };
