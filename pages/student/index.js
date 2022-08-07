import React, { useContext, useEffect } from "react";
import { StudentContext } from "../../components/contexts/studentcontext";
import Welcome from "../../public/assets/SVG/welcome.svg";

function Index() {
  const { setTopbaraction } = useContext(StudentContext);
  useEffect(() => {
    setTopbaraction((prev) => "Welcome");
  }, []);
  return (
    <div className="h-[67%] mt-8 mx-auto opacity-75">
      <Welcome className="h-full mt-8 mx-auto opacity-75" />
      <div className="w-full text-center mt-4">
        <h3 className=" text-3xl font-[Fira-sans]">
          Welcome Aboard, lets get started.
          <span className="block text-lg font-[Inter] ">
            First, select a class from the topbar
          </span>
          <span className="block text-lg font-[Inter] ">
            Then, select a note to read.
          </span>
        </h3>
      </div>
    </div>
  );
}

export default Index;
