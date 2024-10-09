import LessonInfo from "./LessonInfo.tsx";
import Lesson from "../models/Lesson.ts";
import { DateTime } from "luxon";
import HourTime from "../models/HourTime.ts";
import Hour from "../models/Hour.ts";
import { ReactElement, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Overflow from "react-overflow-indicator";

interface Props {
    teacherModeEnabled: boolean;
    currentTime: DateTime;
    hourTimes: HourTime[];
    hours: Hour[];
    firstHourIndex: number;
    lastHourIndex: number;
}

interface LessonInfoProps {
    lesson: Lesson | null;
    isBreak: boolean;
}

function generateFilteredLessonInfos(
    lessonInfoProps: LessonInfoProps[],
    isFirstSelectedLesson: boolean,
    teacherModeEnabled: boolean,
    shownHoursCount: number
) {
    // This is necessary to display "volno" after all lessons in case the last lesson is not null (not "volno").
    if (lessonInfoProps[lessonInfoProps.length - 1].lesson !== null) {
        lessonInfoProps.push({ lesson: null, isBreak: false });
    }
    for (let index = lessonInfoProps.length - 1; index > 0; index--) {
        if (lessonInfoProps[index].lesson === null) {
            if (lessonInfoProps[index - 1].lesson === null) {
                lessonInfoProps.splice(index, 1);
            } else if (lessonInfoProps[index - 1].isBreak) {
                lessonInfoProps.splice(index - 1, 1);
            }
        }
    }
    let lessonInfos: ReactElement[] = [];
    for (
        let index = 0;
        index < Math.min(lessonInfoProps.length, shownHoursCount);
        index++
    ) {
        lessonInfos.push(
            <LessonInfo
                teacherModeEnabled={teacherModeEnabled}
                lesson={lessonInfoProps[index].lesson}
                isBreak={lessonInfoProps[index].isBreak}
                isLongBreak={
                    lessonInfoProps[index].lesson === null &&
                    index !== lessonInfoProps.length - 1 &&
                    (index !== 0 || !isFirstSelectedLesson)
                }
                key={index * 2}
            />
        );
        lessonInfos.push(<hr key={index * 2 + 1} />);
    }
    lessonInfos.pop();
    return lessonInfos;
}

function Lessons(props: Props) {
    let currentHourIndex = -1;
    let isBreak = false;

    const [shownHoursCount] = useLocalStorage<number>("shownHoursCount", 2);

    for (let i = props.firstHourIndex; i <= props.lastHourIndex; i++) {
        if (props.currentTime > props.hourTimes[i].end) {
            continue;
        }

        currentHourIndex = i;
        if (props.currentTime < props.hourTimes[i].start) {
            if (i > props.firstHourIndex) {
                isBreak = true;
            }
            currentHourIndex--;
        }

        break;
    }

    let lessonInfoProps: LessonInfoProps[] = [];
    for (let index = currentHourIndex; index < props.hours.length; index++) {
        let lesson: Lesson | null = null;

        if (index !== -1) {
            lesson = props.hours[index].selectedLesson;
        }

        lessonInfoProps.push({ lesson, isBreak });

        if (index === -1) {
            break;
        }

        isBreak = false;
    }

    const [canScroll, setCanScroll] = useState(false);

    return (
        <div
            className="flex-column justify-content-center align-items-center scrollbox"
            // style={{
            //     fontSize: "calc(1rem + 2vw)",
            //     maxHeight: "calc(35vh - 6vw)",
            //     overflow: "auto",
            //     // backgroundRepeat: "no-repeat",
            //     // backgroundSize: "100% 40px, 100% 40px, 100% 14px, 100% 14px",
            //     // backgroundAttachment: "local, local, scroll, scroll",
            //     // background: "linear-gradient(var(--bs-body-bg) 30%, rgba(255,255,255,0)), linear-gradient(rgba(255,255,255,0), var(--bs-body-bg) 70%) 0 100%, radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), rgba(0,0,0,0)), radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%",
            // }}
            // a @ts-expect-error this is necessary because with style object it didn't work
            // STYLE=" font-size: calc(1rem + 2vw);
            //         max-height: calc(35vh - 6vw);
            //         overflow: auto;
            //         // background: linear-gradient(var(--bs-body-bg) 30%, rgba(255,255,255,0)), linear-gradient(rgba(255,255,255,0), var(--bs-body-bg) 70%) 0 100%, radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), rgba(0,0,0,0)), radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;
            //         background: linear-gradient(var(--bs-body-bg) 30%, rgba(255,255,255,0)), linear-gradient(rgba(255,255,255,0), var(--bs-body-bg) 70%) 0 100%, radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), rgba(0,0,0,0)), radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;
            //         background-repeat: no-repeat;
            //         // background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
            //         background-size: 100% 80px, 100% 80px, 100% 40px, 100% 40px;
            //         background-attachment: local, local, scroll, scroll;"
        >
            <div className="overflow-y-auto">
                {generateFilteredLessonInfos(
                    lessonInfoProps,
                    currentHourIndex < props.firstHourIndex,
                    props.teacherModeEnabled,
                    shownHoursCount
                )}
            </div>
        </div>
    );
}

export default Lessons;
