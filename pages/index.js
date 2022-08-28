import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Signin from "../components/auth/signin";
import Welcome from "../public/assets/SVG/welcome.svg";
import { StudentContext } from "../components/contexts/studentcontext";

function Home() {
  const router = useRouter();
  const { studentid } = useContext(StudentContext);
  useEffect(() => {
    router.push(`/${studentid}`);
  }, []);
  return (
    <div className=" bg-accent_bkg_color h-full ">
      <Welcome className="h-[67%] mt-8 mx-auto opacity-75" />
    </div>
  );
}

export default Home;
