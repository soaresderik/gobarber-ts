import * as React from "react";
import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  isBefore,
  isEqual,
  parseISO
} from "date-fns";
import * as pt from "date-fns/locale/pt";
import { Container, Time } from "./style";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { utcToZonedTime } from "date-fns-tz";
import authService from "../../services/auth.service";

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const Dashboard: React.FC = () => {
  const [schedule, setSchedule] = React.useState([]);
  const [date, setDate] = React.useState(new Date());
  const dateFormatted = React.useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  React.useEffect(() => {
    async function loadSchedule() {
      const response = await authService.get("schedule", {
        params: { date }
      });
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const data = range.map(hour => {
        const checkDate = setSeconds(setMinutes(setHours(date, hour), 0), 0);
        const compareDate = utcToZonedTime(checkDate, timezone).toString();

        return {
          time: `${hour}:00h`,
          past: isBefore(new Date(compareDate), new Date()),
          appointment: response.data.appointments.find((a: any) => {
            return parseISO(a.date).toString() === compareDate;
          })
        };
      });

      setSchedule(data);
    }

    loadSchedule();
  }, [date]);

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
  }
  return (
    <Container>
      <header>
        <button type="button" onClick={handlePrevDay}>
          <MdChevronLeft size={36} color="#fff" />
        </button>
        <strong>{dateFormatted}</strong>
        <button type="button" onClick={handleNextDay}>
          <MdChevronRight size={36} color="#fff" />
        </button>
      </header>

      <ul>
        {schedule.map(time => (
          <Time key={time.time} past={time.past} available={!time.appointment}>
            <strong>{time.time}</strong>
            <span>
              {time.appointment ? time.appointment.user.name : "Em aberto"}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
};

export default Dashboard;
