import React from "react";
import blesssd from "blessed";
import { render } from "react-blessed";
import Today from "./components/Today";
import Box from "./Box";

const App = () => {
  return (
    <>
      <Today top={0} left={0} width="50%" height="35%" updateInterval={5000} />
      <Box
        label="Recent Commits"
        top={0}
        left="50%"
        width="50%"
        height="50%"
      ></Box>
      <Box label="Time Log" top="35%" left={0} width="25%" height="65%"></Box>
      <Box label="Pomodoro" top="35%" left="25%" width="25%" height="65%"></Box>
      <Box label="GitHub" top="50%" left="50%" width="50%" height="50%"></Box>
    </>
  );
};

const screen = blesssd.screen({
  autoPadding: true,
  smartCSR: "Develop Dashboard",
});

screen.key(["escape", "q", "C-c"], () => process.exit(0));

render(<App />, screen);
