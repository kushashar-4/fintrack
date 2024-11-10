"use client";

import { Button } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchData, checkForSetup } from "../../actions";

export default function Dashboard() {
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    // const getData = async () => {
    //   const data = await fetchData("profiles");
    //   if (data != null) {
    //     setIsSetup(data[0].isSetup);
    //   }
    // };
    // const checkSetup = () => {
    //   if (!isSetup) {
    //     return redirect("/setup");
    //   }
    // };
    // getData();
    // checkSetup();
    checkForSetup();
  }, []);
  return (
    <div className="flex flex-col align-center gap-6">
      <p>This is the dashboard page</p>
    </div>
  );
}
