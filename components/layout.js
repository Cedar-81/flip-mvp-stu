import React, { useContext, useEffect } from "react";
import Notifications from "./nav/minicomponents/notifications";
import Sidenav from "./nav/sidenav";
import Topnav from "./nav/topnav";
import { StudentContext } from "./contexts/studentcontext";
import Class_course from "./nav/minicomponents/class_course";
import Sidenav2 from "./nav/minicomponents/sidenav2";
import Sidenav3 from "./nav/minicomponents/sidenav3";
import Sidebar from "./nav/minicomponents/sidebar";
import Sidebar2 from "./nav/minicomponents/sidebar2";
import Sidebar3 from "./nav/minicomponents/sidebar3";
import Newclass from "./nav/minicomponents/newclass";
import Note_deletor from "./bookshelf/minicomponents/note_deletor";
import { AuthContext } from "./contexts/authcontext";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const Auth = gql`
  query Query {
    auth
  }
`;

function Layout({ children }) {
  const router = useRouter();
  const {
    notification,
    class_course,
    shelf2,
    shelf3,
    sidebar,
    sidebartype,
    classcoursedata,
    notedata,
    toggle_menu,
  } = useContext(StudentContext);
  const { auth, setIsAuth, isAuth, authType, setAuth } =
    useContext(AuthContext);
  console.log(isAuth);

  const { data, error, loading, refetch } = useQuery(Auth, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });
  console.log(data);

  if (data && !router.pathname.includes("/auth")) {
    if (data.auth === "authorized") {
      setIsAuth(true);
    } else if (data.auth === "unauthorized") {
      refetch();
      setIsAuth(false);
      router.push("/auth/signin");
    }
  } else if (!router.pathname.includes("/auth")) {
    setIsAuth(false);
  }
  useEffect(() => {
    console.log("here");
    if (router.pathname == "/auth/signup") {
      router.push("/auth/signup");
      return;
    } else if (router.pathname == "/auth/verification") {
      setIsAuth(false);
      router.push("/auth/verification");
      return;
    } else if (router.pathname == "/auth/signin") {
      setIsAuth(false);
      router.push("/auth/signin");
      return;
    } else if (router.pathname.includes("/student") && data) {
      console.log(data.auth, router.pathname);
      if (data.auth === "authorized") {
        setIsAuth(true);
        return;
      } else if (data.auth === "unauthorized") {
        router.push("/auth/signin");
        return;
      }
    }
  }, [data]);

  return (
    <div className="flex w-[100%] max-w-[100%] h-[100vh] ">
      {isAuth && (
        <div className="contents border-2">
          <div className="sidebar_displays md:none z-40 w-max top-0 h-full absolute bg-main_color">
            {sidebartype == "bar2" && <Sidebar2 />}
            {sidebartype == "bar3" && <Sidebar3 />}
            {sidebar && <Sidebar />}
          </div>
          <div className="md:contents hidden">
            <div className="flex">
              <Sidenav />
              {shelf2 && <Sidenav2 />}
              {shelf3 && <Sidenav3 />}
            </div>
          </div>
        </div>
      )}
      <div className="w-[100vw] md:w-[95%] overflow-y-hidden">
        {isAuth && <Topnav />}
        <div className=" h-full pb-4">
          {notification && <Notifications />}
          {class_course && <Class_course />}
          {classcoursedata.action === "new_class" && <Newclass />}
          {notedata.deleteNote && <Note_deletor />}
          <div className=" bg-accent_bkg_color relative h-full overflow-y-auto w-full md:static md:top-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
