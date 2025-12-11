import { useRef, useEffect, memo } from 'react';

interface SeatGridProps {
    totalSeats: number;
    bookedSeats: number[];
    onSelectionChange: (selectedSeats: number[]) => void;
    selectedSeats: number[]; // Controlled state from parent
}

export const SeatGrid = memo(({ totalSeats, bookedSeats, onSelectionChange, selectedSeats }: SeatGridProps) => {
    const seatRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    // Sync DOM with prop changes (if external reset happens)
    useEffect(() => {
        Object.entries(seatRefs.current).forEach(([key, btn]) => {
            if (!btn) return;
            const seatNum = parseInt(key);
            if (selectedSeats.includes(seatNum)) {
                btn.classList.add('bg-indigo-600', 'text-white', 'ring-2', 'ring-indigo-600');
                btn.classList.remove('bg-white', 'text-gray-900', 'hover:bg-gray-50');
            } else if (!bookedSeats.includes(seatNum)) {
                btn.classList.remove('bg-indigo-600', 'text-white', 'ring-2', 'ring-indigo-600');
                btn.classList.add('bg-white', 'text-gray-900', 'hover:bg-gray-50');
            }
        });
    }, [selectedSeats, bookedSeats]);

    const handleSeatClick = (seatNum: number) => {
        if (bookedSeats.includes(seatNum)) return;

        // We toggle visually immediately for responsiveness, but source of truth is parent
        const btn = seatRefs.current[seatNum];
        if (btn) {
            const isSelected = btn.classList.contains('bg-indigo-600');
            if (isSelected) {
                // Deselect
                btn.classList.remove('bg-indigo-600', 'text-white', 'ring-2', 'ring-indigo-600');
                btn.classList.add('bg-white', 'text-gray-900', 'hover:bg-gray-50');
                onSelectionChange(selectedSeats.filter(s => s !== seatNum));
            } else {
                // Select
                btn.classList.add('bg-indigo-600', 'text-white', 'ring-2', 'ring-indigo-600');
                btn.classList.remove('bg-white', 'text-gray-900', 'hover:bg-gray-50');
                onSelectionChange([...selectedSeats, seatNum]);
            }
        }
    };

    return (
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 p-4 bg-gray-100 rounded-xl justify-items-center">
            {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seatNum) => {
                const isBooked = bookedSeats.includes(seatNum);

                return (
                    <button
                        key={seatNum}
                        ref={(el) => { seatRefs.current[seatNum] = el; }}
                        disabled={isBooked}
                        onClick={() => handleSeatClick(seatNum)}
                        className={`
              w-10 h-10 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isBooked
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                            }
            `}
                        aria-label={`Seat ${seatNum} ${isBooked ? 'booked' : 'available'}`}
                    >
                        {seatNum}
                    </button>
                );
            })}
        </div>
    );
});

SeatGrid.displayName = 'SeatGrid';
