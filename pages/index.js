import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Signin from "../components/auth/signin";

function Home() {
  const router = useRouter();
  // useEffect(() => {
  //   router.push("/student/bookshelf");
  // }, []);
  return (
    <div className=" bg-accent_bkg_color h-full ">
      <Signin />
    </div>
  );
}

export default Home;
