import React, { useState, useEffect } from 'react';

interface Holiday {
  name: string;
  date: string;
  type: string;
}

const ChevronLeft: React.FC<{ className?: string }> = () => (
  <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
    <path xmlns="http://www.w3.org/2000/svg" d="M0.499999 7.86602C-0.166668 7.48112 -0.166667 6.51888 0.5 6.13397L9.5 0.937821C10.1667 0.552921 11 1.03405 11 1.80385L11 12.1962C11 12.966 10.1667 13.4471 9.5 13.0622L0.499999 7.86602Z" fill="var(--purple-light)"/>
  </svg>
);

const ChevronRight: React.FC<{ className?: string }> = () => (
  <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
    <path xmlns="http://www.w3.org/2000/svg" d="M10.5 7.86602C11.1667 7.48112 11.1667 6.51888 10.5 6.13397L1.5 0.937821C0.833334 0.552921 6.10471e-07 1.03405 5.76822e-07 1.80385L1.2256e-07 12.1962C8.8911e-08 12.966 0.833333 13.4471 1.5 13.0622L10.5 7.86602Z" fill="var(--purple-light)" />
  </svg>
);

interface CalendarProps {
  onDateSelect?: (date: Date | null) => void;
  onTimeSelect?: (time: string | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, onTimeSelect }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`https://api.api-ninjas.com/v1/holidays?country=PL`, {
          headers: { 'X-Api-Key': 'OH+HEf/9IH2zuHR/cMO/8g==ldhBovC6Rpa1TIss' }
        });

        if (response.ok) {
          const data: Holiday[] = await response.json();
          setHolidays(data);
        }
      } catch (error) {
        console.error('Error loading holidays:', error);
      }
    })();
  }, []);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const daysInMonth = lastDayOfMonth.getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isSunday = (day: number): boolean => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.getDay() === 0;
  };

  const isHoliday = (day: number): Holiday | undefined => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find(holiday => holiday.date === dateStr);
  };

  const selectDate = (day: number): void => {
    if (isSunday(day)) return;

    const holiday = isHoliday(day);

    if (holiday?.type === 'NATIONAL_HOLIDAY') return;

    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setSelectedTime(null);

    if (holiday?.type === 'OBSERVANCE') {
      setSelectedHoliday(holiday);
    } else {
      setSelectedHoliday(null);
    }

    if (onDateSelect) {
      onDateSelect(selected);
    }

    if (onTimeSelect) {
      onTimeSelect(null);
    }
  };

  const selectBlockedDate = (day: number): void => {
    const holiday = isHoliday(day);
    if (holiday) {
      setSelectedHoliday(holiday);
      setSelectedDate(null);
      setSelectedTime(null);
      if (onDateSelect) {
        onDateSelect(null);
      }
      if (onTimeSelect) {
        onTimeSelect(null);
      }
    } else if (isSunday(day)) {
      setSelectedHoliday({
        name: "Niedziela",
        date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        type: "SUNDAY"
      });
      setSelectedDate(null);
      if (onDateSelect) {
        onDateSelect(null);
      }
    }
  };

  const isSelected = (day: number): boolean => {
    if (selectedDate) {
      return selectedDate.getDate() === day &&
             selectedDate.getMonth() === currentDate.getMonth() &&
             selectedDate.getFullYear() === currentDate.getFullYear();
    }

    return false;
  };
  const days: React.ReactNode[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const holiday = isHoliday(day);
    const sunday = isSunday(day);
    const nationalHoliday = holiday?.type === 'NATIONAL_HOLIDAY';
    const blocked = sunday || nationalHoliday;

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => {
          if (sunday) {
            return;
          } else if (nationalHoliday) {
            selectBlockedDate(day);
          } else {
            selectDate(day);
          }
        }}
        disabled={sunday}
        className={`
          w-10 h-10 flex items-center justify-center text-base font-medium transition-all duration-200 relative
          border-0 outline-none appearance-none bg-transparent focus:outline-none focus:ring-0 hover:border-0
          ${!sunday && !nationalHoliday ? 'cursor-pointer' : ''}
          ${sunday || nationalHoliday ? 'cursor-not-allowed' : ''}
          ${blocked && !isSelected(day) ? 'bg-gray-100 text-gray-400' : 'text-gray-700'}
          ${sunday && !isSelected(day) ? 'bg-gray-50 text-gray-400' : ''}
          ${isSelected(day) ? 'text-white shadow-md rounded-full' : ''}
        `}
        style={
          isSelected(day)
            ? { backgroundColor: '#761BE4', borderRadius: '50%', outline: 'none' } 
            : { backgroundColor: 'transparent', borderRadius: '50%', outline: 'none', border: '0' }
        }
        title={`It is ${holiday?.name}`}
      >
        {day}
      </button>
    );
  }

  return (
    <>
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:gap-6 lg:h-full pt-4">
        <div className="flex-shrink-0 lg:flex-1">
        <h3 className="text-base text-gray-800 mb-4 lg:mb-2 text-left">Date</h3>
        <div className="flex-shrink-0 lg:flex-1 bg-white p-4 rounded-2xl border-1 shadow-lg" style={{borderColor: 'var(--purple-light)'}}>
          <div className="flex items-center justify-between mb-2 border-0 outline-none ">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="p-2 focus:outline-none focus:ring-0 border-0 outline-none appearance-none bg-transparent"
              style={{ background: 'none', border: 'none', outline: 'none' }}
            >
              <ChevronLeft />
            </button>
            <h2 className="text-base font-medium text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-2 focus:outline-none focus:ring-0 border-0 outline-none appearance-none bg-transparent"
              style={{ background: 'none', border: 'none', outline: 'none' }}
            >
              <ChevronRight/>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, index) => (
              <div key={day} className={`w-10 h-10 flex items-center justify-center text-base font-medium ${index === 6 ? 'text-gray-500' : 'text-gray-500'}`}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
        </div>
      </div>
        <div className="mt-6 lg:mt-0 lg:w-[76px] lg:flex-shrink-0">
          {selectedDate && (!selectedHoliday || selectedHoliday.type !== 'NATIONAL_HOLIDAY') ? (
            <div className="rounded-lg border-0 outline-none flex flex-col lg:h-full">
              <h3 className="text-base font-medium text-gray-800 mb-4 lg:mb-2 text-left">
               Time
              </h3>
              <div className="flex gap-2 flex-wrap lg:flex-col lg:gap-3 lg:justify-start">
                {["09:00", "10:00", "15:00","15:30", "16:00","17:00"].map(time => (
                    <button
                    key={time}
                    type="button"
                    className={`px-3 py-2.5 rounded-lg bg-white text-base font-medium transition focus:outline-none focus:ring-0 focus:border-transparent lg:w-full ${selectedTime !== time ? 'hover:!border-[#761BE4]' : ''}`}
                    style={selectedTime === time ? { backgroundColor: '#fff', borderColor: '#761BE4', borderWidth: '2px', borderStyle: 'solid', color: '#000853', outline: 'none',  } : {color: '#000853', borderColor: 'var(--purple-light)', borderWidth: '1px', borderStyle: 'solid', outline: 'none'}}
                    onClick={() => {
                      setSelectedTime(time);
                      if (onTimeSelect) {
                      onTimeSelect(time);
                      }
                    }}
                    >
                    {time}
                    </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="hidden lg:block lg:w-[76px] lg:h-full"></div>
          )}
        </div>
      </div>
    </div>
      {selectedHoliday && selectedHoliday.type === 'OBSERVANCE' && (
        <div className="mt-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="var(--purple-light)" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
          </svg>
            <p className="text-center text-base font-medium" style={{ color: "#000853" }}>
            {`It is ${selectedHoliday.name}`}
            </p>
        </div>
      )}
    </>
  );
};

export default Calendar;
