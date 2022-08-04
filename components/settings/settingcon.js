import React, { useContext } from "react";
import { StudentContext } from "../contexts/studentcontext";
import Personaldets from "./minicomponents/personaldets";

function Settingcon() {
  const { setTopbaraction, topbaraction } = useContext(StudentContext);

  return (
    <div className=" pt-4 w-[80%] min-h-full mx-auto">
      {topbaraction == "Settings" && (
        <>
          <div
            onClick={() => {
              setTopbaraction("Personal");
            }}
            className="personal bg-main_color h-[3rem] cursor-pointer hover:border-[2px] hover:border-accent_color_2 px-4 rounded-md flex items-center shadow-md"
          >
            <div className="flex justify-between w-full items-center">
              <p className="text text-lg">Personal</p>
              <span className="material-icons text-accent_color ">
                arrow_drop_down
              </span>
            </div>
          </div>
        </>
      )}

      {topbaraction == "Personal" && <Personaldets />}
    </div>
  );
}

export default Settingcon;
