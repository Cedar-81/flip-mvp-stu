import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Signin from "../components/auth/signin";
import Welcome from "../public/assets/SVG/welcome.svg";

function Home() {
  const router = useRouter();
  // useEffect(() => {
  //   router.push("/student/bookshelf");
  // }, []);
  return (
    <div className=" bg-accent_bkg_color h-full ">
      <Welcome />
    </div>
  );
}

export default Home;
