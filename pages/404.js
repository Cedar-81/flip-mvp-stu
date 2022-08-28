import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { StudentContext } from "../components/contexts/studentcontext";

function Error() {
  const router = useRouter();
  const { studentid } = useContext(StudentContext);
  useEffect(() => {
    router.push(`/${studentid}/bookshelf`);
  }, []);
  return <div className=" bg-accent_bkg_color h-full ">404 page</div>;
}

export default Error;
