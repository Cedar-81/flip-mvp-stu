import React, { useContext, useEffect } from "react";
import { StudentContext } from "../../components/contexts/studentcontext";
import Settingcon from "../../components/settings/settingcon";

function Settings() {
  const { setTopbaraction } = useContext(StudentContext);

  useEffect(() => {
    setTopbaraction("Settings");
  }, []);

  return (
    <div className="w-full h-full">
      <Settingcon />
    </div>
  );
}

export default Settings;
