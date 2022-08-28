import React, { useContext, useEffect } from "react";
import Notifications from "./nav/minicomponents/notifications";
import Sidenav from "./nav/sidenav";
import Topnav from "./nav/topnav";
import { StudentContext } from "./contexts/studentcontext";
import Class_course from "./nav/minicomponents/class_course";
import Sidenav2 from "./nav/minicomponents/sidenav2";
import Sidenav3 from "./nav/minicomponents/sidenav3";
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

console.log("layout");

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
    setStudentid,
    toggle_menu,
  } = useContext(StudentContext);
  const { auth, setIsAuth, isAuth, authType, setAuth } =
    useContext(AuthContext);

  const { data, error, loading, refetch } = useQuery(Auth, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  refetch();

  useEffect(() => {
    if (data) {
      if (data && !router.pathname.includes("/auth")) {
        if (JSON.parse(data.auth).status === "authorized") {
          setStudentid(JSON.parse(data.auth).id);
          if (!isAuth) setIsAuth(true);
          return;
        } else if (JSON.parse(data.auth).status === "unauthorized") {
          setStudentid(JSON.parse(data.auth).id);
          if (isAuth) setIsAuth(false);
          router.push("/auth/signin");
          return;
        }
      }
    }
  }, [data]);

  return (
    <div className="flex w-[100%] max-w-[100%] h-[100vh] ">
      {isAuth && (
        <div className="contents border-2">
          {/* <div className="sidebar_displays md:none z-40 w-max top-0 h-full absolute bg-main_color">
            {sidebartype == "bar2" && <Sidebar2 />}
            {sidebartype == "bar3" && <Sidebar3 />}
            {sidebar && <Sidebar />}
          </div> */}
          <div className="md:contents md:static absolute md:w-[12rem] md:mt-0 md:h-full w-full border-2 border-accent_color mt-[10%] h-[90%]">
            {/* smaller screens */}
            <div className="md:hidden block h-full">
              {sidebar && <Sidenav />}
              {shelf2 && <Sidenav2 />}
              {shelf3 && <Sidenav3 />}
            </div>
            {/* medium screens and above */}
            <div className="md:flex hidden h-full">
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
          {isAuth && (
            <>
              {notification && <Notifications />}
              {class_course && <Class_course />}
              {classcoursedata.action === "new_class" && <Newclass />}
              {notedata.deleteNote && <Note_deletor />}
            </>
          )}

          <div className=" bg-accent_bkg_color relative h-full overflow-y-auto w-full md:static md:top-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
