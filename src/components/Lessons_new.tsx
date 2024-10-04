import LessonInfo from "./LessonInfo.tsx";
import Lesson from "../models/Lesson.ts";
import { DateTime } from "luxon";
import HourTime from "../models/HourTime.ts";
import Hour from "../models/Hour.ts";

interface Props {
  teacherModeEnabled: boolean;
  currentTime: DateTime;
  hourTimes: HourTime[];
  hours: Hour[];
  firstHourIndex: number;
  lastHourIndex: number;
}

function Lessons(props: Props) {
  let currentHourIndex: number = -1;
  let currentHourIsNull = false;
  let isBreak = false;

  const numberOfNextHours = 10;

  for (let i = props.firstHourIndex; i <= props.lastHourIndex; i++) {
    if (props.currentTime > props.hourTimes[i].end) {
      continue;
    }

    if (props.currentTime < props.hourTimes[i].start) {
      if (i > props.firstHourIndex) {
        isBreak = true;
      } else {
        currentHourIsNull = true;
      }
      currentHourIndex = i - 1;
    } else {
      currentHourIndex = i;
    }

    break;
  }

  let LessonInfos = [];
  for (
    let index = currentHourIndex;
    index <
    Math.min(props.hours.length, currentHourIndex + numberOfNextHours + 1);
    index++
  ) {
    let lesson: Lesson | null = null;

    if (index !== currentHourIndex) {
      isBreak = false;
      lesson = props.hours[index].selectedLesson;
    } else if (!currentHourIsNull && index !== -1) {
      lesson = props.hours[index].selectedLesson;
    }
    LessonInfos.push(
      <LessonInfo
        teacherModeEnabled={props.teacherModeEnabled}
        isBreak={isBreak}
        lesson={lesson}
      />
    );
    if (index === -1) {
      break;
    }
  }
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ fontSize: "calc(1rem + 2vw)" }}
    >
      <div>
        {LessonInfos}
      </div>
    </div>
  );
}

export default Lessons;
