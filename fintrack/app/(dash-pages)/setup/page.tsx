"use client";

import { Button } from "@nextui-org/react";
import { confirmSetup } from "@/app/actions";
import { redirect } from "next/navigation";

export default function Setup() {
  const setup = async () => {
    const setupConfirmed = await confirmSetup();

    setupConfirmed ? redirect("/dashboard") : null;
  };

  return (
    <div>
      <p>This is the setup page</p>
      <Button onPress={setup}>Set up</Button>
    </div>
  );
}
