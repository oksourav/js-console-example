import React, { useState } from "react";
import figlet from "figlet";
import useInterval from "@use-it/interval";
import weather from "weather-js";
import util from "util";
import useDeepCompareEffect from "use-deep-compare-effect";
import chalk from "chalk";
import gradient from "gradient-string";
import Box from "../Box";

const findWeather = util.promisify(weather.find);

const FONTS = [
  "Straight",
  "ANSI Shadow",
  "Shimrod",
  "doom",
  "Big",
  "Ogre",
  "Small",
  "Standard",
  "Bigfig",
  "Mini",
  "Small Script",
  "Small Shadow",
];

const useRequest = (promise, optins, interval = null) => {
  const [state, setState] = useState({
    status: "loading",
    error: null,
    data: null,
  });
  const request = React.useCallback(
    async (optins) => {
      setState({
        status: "loading",
        error: null,
        data: null,
      });
      let data;
      try {
        data = await promise(optins);
        setState({ status: "complete", error: null, data });
      } catch (error) {
        setState({ status: "error", error, data: null });
      }
    },
    [promise]
  );

  useDeepCompareEffect(() => {
    request(optins);
  }, [optins, request]);
  useInterval(() => {
    request(optins);
  }, interval);
  return state;
};

const Today = ({
  updateInterval = 900000,
  search = "Pune, In",
  degreeType = "F",
  top,
  left,
  width,
  height,
}) => {
  const boxProps = { top, left, width, height };
  const [fontIndex, setFontIndex] = useState(0);
  const [now, setNow] = useState(new Date());
  const weather = useRequest(
    findWeather,
    { search, degreeType },
    updateInterval
  );
  const formattedWeather = ([results]) => {
    const { location, current, forecast } = results;
    const degreeType = location.degreetype;
    const temperature = `${current.temperature}°${degreeType}`;
    const conditions = current.skytext;
    const low = `${forecast[1].low}°${degreeType}`;
    const high = `${forecast[1].high}°${degreeType}`;
    return `${chalk.yellow(temperature)} and ${chalk.green(
      conditions
    )} (${chalk.blue(low)} -> ${chalk.red(high)})`;
  };

  useInterval(() => {
    setNow(new Date());
    setFontIndex(fontIndex + 1);
  }, 60000); // 1 minutes

  const date = now.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = figlet.textSync(
    now.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    {
      font: FONTS[fontIndex % FONTS.length],
    }
  );
  return (
    <Box label="Today" {...boxProps}>
      <text right={0}>{chalk.blue(date)}</text>
      <text top="center" left="center">
        {gradient.atlas.multiline(time)}
      </text>
      <text top="100%-3" left={1}>
        {weather.status === "loading"
          ? "loading..."
          : weather.error
          ? `Error ${weather.error}`
          : formattedWeather(weather.data)}
      </text>
    </Box>
  );
};

export default Today;
