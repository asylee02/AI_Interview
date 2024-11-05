import React, { useEffect, useRef, useState } from 'react';
import useCalendar from '@/hooks/useCalendar';
import ReservationCard from './ReservationCard';

export default function Calendar() {
  // 제출 버튼하고 상태관리 끝내면 될듯
  const { monthDates, currentMonth } = useCalendar();
  const [isOpen, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const Outside = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (Outside.current && !Outside.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date | null) => {
    if (date !== null) {
      const options = { day: 'numeric' } as const;
      return date.toLocaleDateString('ko', options);
    }
  };

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];
  let currentDay = 0;

  // 주 단위로 나누어서 weeks 배열에 추가
  monthDates.forEach((date, index) => {
    const dayOfWeek = date.getDay();

    // 현재 요일이 다음 주로 넘어갈 때
    if (dayOfWeek < currentDay) {
      while (currentDay < 6) {
        currentWeek.push(null);
        currentDay++;
      }
      weeks.push(currentWeek);
      currentWeek = [];
      currentDay = 0;
    }

    // 공백 날짜 삽입
    while (currentDay < dayOfWeek) {
      currentWeek.push(null);
      currentDay++;
    }

    currentWeek.push(date);
    currentDay = (dayOfWeek + 1) % 7;

    // 주의 마지막 날짜 처리
    if (currentWeek.length === 7 || index === monthDates.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
      currentDay = 0;
    }
  });

  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleTimeSelected = (time: string) => {
    console.log('🚀 ~ handleTimeSelected ~ time:', time);
    setSelectedTime(time);
  };

  return (
    <>
      <div className="m-4 p-4 bg-gray-100 rounded-xl max-w-[50rem] w-4/5 text-center">
        <h2 className="text-lg font-semibold mb-4">{currentMonth + 1 + '월'}</h2>
        <table className="border-collapse w-full">
          <thead>
            <tr>
              {WEEKDAYS.map((weekday) => (
                <th key={weekday} className="border-gray-300 border p-2">
                  {weekday}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((date, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={`border-gray-300 border p-2 text-gray-700 ${dayIndex % 6 === 0 ? 'text-red-400' : ''}`}
                    onClick={dayIndex % 6 === 0 ? () => alert('휴무입니다.') : () => handleOpen()}>
                    {formatDate(date)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isOpen ? <ReservationCard onTimeSelected={handleTimeSelected} /> : null}
      <div ref={Outside}></div>
    </>
  );
}
