'use client';
import { ReservationCardProps } from '@/utils/type';
import React, { useState, useEffect } from 'react';

const TIME = [12, 13, 14, 15, 16];

export default function ReservationCard({ onTimeSelected }: ReservationCardProps) {
  const [time, setTime] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };
  useEffect(() => {
    onTimeSelected(time);
  }, [time]);

  return (
    <div className="w-52 p-4 bg-gray-200 rounded-xl flex flex-col gap-1 justify-center items-center">
      {TIME.map((hour, index) => (
        <label key={index}>
          <input type="radio" name="setTime" value={hour} onChange={handleChange} />
          {`${hour}:00~${hour + 1}:00`}
        </label>
      ))}
    </div>
  );
}
