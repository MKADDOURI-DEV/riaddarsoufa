'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSite } from '@/context/SiteContext';

export default function BookingBar() {
  const { t, dir } = useSite();
  const router = useRouter();
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [error, setError] = useState('');

  const today = new Date()?.toISOString()?.split('T')?.[0];

  const handleSearch = () => {
    setError('');
    if (!arrival) { setError(t?.booking?.errorArrival); return; }
    if (departure && departure <= arrival) { setError(t?.booking?.errorDates); return; }
    const params = new URLSearchParams({
      arrival,
      departure: departure || '',
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
    });
    router?.push(`/booking?${params?.toString()}`);
  };

  return (
    <div dir={dir} className="w-full max-w-6xl mx-auto px-4">
      <div className="bg-card booking-bar-shadow rounded-2xl p-4 sm:p-6 border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4 items-end">
          {/* Arrival */}
          <div className="lg:col-span-1 space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">
              {t?.booking?.arrival}
            </label>
            <input
              type="date"
              value={arrival}
              min={today}
              onChange={e => setArrival(e?.target?.value)}
              className="form-input font-medium text-foreground"
              aria-label={t?.booking?.arrival}
            />
          </div>

          {/* Departure */}
          <div className="lg:col-span-1 space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">
              {t?.booking?.departure}
            </label>
            <input
              type="date"
              value={departure}
              min={arrival || today}
              onChange={e => setDeparture(e?.target?.value)}
              className="form-input font-medium text-foreground"
              aria-label={t?.booking?.departure}
            />
          </div>

          {/* Adults */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">
              {t?.booking?.adults}
            </label>
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card h-[42px]">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-bold text-lg"
                aria-label="Decrease adults"
              >−</button>
              <span className="flex-1 text-center text-sm font-semibold text-foreground">{adults}</span>
              <button
                onClick={() => setAdults(Math.min(8, adults + 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-bold text-lg"
                aria-label="Increase adults"
              >+</button>
            </div>
          </div>

          {/* Children */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">
              {t?.booking?.children}
            </label>
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card h-[42px]">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-bold text-lg"
                aria-label="Decrease children"
              >−</button>
              <span className="flex-1 text-center text-sm font-semibold text-foreground">{children}</span>
              <button
                onClick={() => setChildren(Math.min(6, children + 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-bold text-lg"
                aria-label="Increase children"
              >+</button>
            </div>
          </div>

          {/* Rooms */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">
              {t?.booking?.rooms}
            </label>
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card h-[42px]">
              <button
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-bold text-lg"
                aria-label="Decrease rooms"
              >−</button>
              <span className="flex-1 text-center text-sm font-semibold text-foreground">{rooms}</span>
              <button
                onClick={() => setRooms(Math.min(4, rooms + 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-bold text-lg"
                aria-label="Increase rooms"
              >+</button>
            </div>
          </div>

          {/* Search Button */}
          <div className="space-y-1">
            <div className="hidden lg:block text-xs text-transparent">.</div>
            <button
              onClick={handleSearch}
              className="btn-primary w-full h-[42px] text-sm font-bold tracking-wide"
            >
              {t?.booking?.search}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-3 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}