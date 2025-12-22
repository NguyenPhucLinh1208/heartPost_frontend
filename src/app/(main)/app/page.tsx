"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, addMonths, subMonths, isEqual, startOfDay, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Plus, ChevronLeft, ChevronRight, CalendarPlus, X, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { eventService } from '@/services/eventService';
import { Event as EventType, EventCreate } from '@/types/event';

// --- Type for processed events ---
interface FormattedEvent {
    id: string;
    time: string;
    title: string;
    isGlobal: boolean;
}
type EventsMap = {
    [dateKey: string]: FormattedEvent[];
};

// --- Reusable Components ---
const NeoInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input className="w-full p-3 border-2 border-foreground bg-background shadow-neo-sm focus:shadow-neo focus:outline-none transition-shadow duration-200 font-sans" {...props} />;
const NeoButton = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode, className?: string }) => (
    <motion.button
      whileHover={{ boxShadow: '6px 6px 0px #1C1C1C', transform: 'translate(-2px, -2px)' }}
      whileTap={{ boxShadow: '2px 2px 0px #1C1C1C', transform: 'translate(2px, 2px)' }}
      transition={{ duration: 0.15 }}
      className={`w-full flex items-center justify-center gap-2 border-2 border-foreground bg-accent text-foreground font-bold py-3 px-8 shadow-neo disabled:opacity-50 ${className}`}
      {...props}
    >{children}</motion.button>
);

// --- Widgets ---
const ClockWidget = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);
    return (
        <div className="border-2 border-foreground bg-background p-6 shadow-neo w-full h-full flex flex-col justify-center items-center">
            <div className="relative w-48 h-48 md:w-52 md:h-52 border-4 border-foreground rounded-full flex items-center justify-center shadow-neo">
                <div className="absolute w-full h-full"> 
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-1 bg-foreground"></div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-4 w-1 bg-foreground"></div>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 h-1 w-4 bg-foreground"></div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 h-1 w-4 bg-foreground"></div>
                </div>
                <div className="absolute w-1.5 h-1/4 bg-foreground bottom-1/2 rounded-full" style={{ transform: `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg)`, transformOrigin: 'bottom' }}/>
                <div className="absolute w-1 h-1/3 bg-foreground bottom-1/2 rounded-full" style={{ transform: `rotate(${time.getMinutes() * 6 + time.getSeconds() * 0.1}deg)`, transformOrigin: 'bottom' }}/>
                <div className="absolute w-0.5 h-2/5 bg-accent bottom-1/2 rounded-full" style={{ transform: `rotate(${time.getSeconds() * 6}deg)`, transformOrigin: 'bottom' }}/>
                <div className="absolute w-3 h-3 bg-foreground rounded-full border-2 border-background"></div>
            </div>
        </div>
    );
};

const EventPanelWidget = ({ selectedDate, events, onAddEvent, onDeleteEvent }: { selectedDate: Date, events: EventsMap, onAddEvent: () => void, onDeleteEvent: (id: string) => void }) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dayEvents = events[dateKey] || [];
    return (
        <div className="border-2 border-foreground bg-background p-6 shadow-neo w-full">
            <div className="flex justify-between items-center mb-4 border-b-2 border-foreground pb-3">
                <h3 className="font-display font-extrabold text-xl">Sự kiện ngày {format(selectedDate, 'dd/MM')}</h3>
                <motion.button onClick={onAddEvent} whileHover={{ boxShadow: '4px 4px 0px #1C1C1C', y: -2 }} whileTap={{ boxShadow: '1px 1px 0px #1C1C1C', y: 0 }} className="p-2 border-2 border-foreground bg-accent text-background shadow-neo-sm"><Plus size={20} /></motion.button>
            </div>
            {dayEvents.length > 0 ? (
                <ul className="space-y-4">
                    {dayEvents.map((event) => (
                        <li key={event.id} className="group flex items-start gap-4 p-3 bg-background shadow-neo-sm border-2 border-foreground">
                            <div className={`font-bold text-lg ${event.isGlobal ? 'text-yellow-500' : 'text-accent'}`}>{event.time}</div>
                            <div className="flex-1 border-l-2 border-foreground/50 pl-4">{event.title}</div>
                            {!event.isGlobal && (
                                <motion.button onClick={() => onDeleteEvent(event.id)} whileHover={{ scale: 1.1 }} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity">
                                    <Trash2 size={18} />
                                </motion.button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-foreground/60 py-6 flex flex-col items-center gap-3">
                    <CalendarPlus size={40} className="opacity-50"/>
                    <p className="font-bold">Chưa có sự kiện</p>
                    <p className="text-sm">Hãy nhấn dấu `+` để thêm lời nhắc.</p>
                </div>
            )}
        </div>
    );
};

const CalendarWidget = ({ selectedDate, onDateSelect, events, currentMonth, setCurrentMonth }: { selectedDate: Date, onDateSelect: (day: Date) => void, events: EventsMap, currentMonth: Date, setCurrentMonth: (date: Date) => void }) => {
    const firstDayOfMonth = currentMonth;
    const lastDayOfMonth = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
    const startingDayIndex = getDay(firstDayOfMonth) === 0 ? 6 : getDay(firstDayOfMonth) - 1;
    const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    return (
        <div className="border-2 border-foreground bg-background p-6 shadow-neo w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-display font-extrabold text-3xl">{format(currentMonth, 'MMMM yyyy', { locale: vi })}</h2>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 border-2 border-foreground shadow-neo-sm hover:shadow-neo transition-shadow"><ChevronLeft /></button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 border-2 border-foreground shadow-neo-sm hover:shadow-neo transition-shadow"><ChevronRight /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {daysOfWeek.map(day => <div key={day} className="font-bold text-sm pb-2 text-foreground/60">{day}</div>)}
                {Array.from({ length: startingDayIndex }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {daysInMonth.map(day => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const isSelected = isEqual(startOfDay(day), startOfDay(selectedDate));
                    return (
                        <motion.div 
                            key={day.toString()} 
                            onClick={() => onDateSelect(day)}
                            whileHover={{ boxShadow: '4px 4px 0px #1C1C1C', y: -2, zIndex: 10 }}
                            className={`relative group border-2 ${isSelected ? 'border-accent' : 'border-foreground'} bg-background shadow-neo-sm p-2 flex flex-col items-center justify-center aspect-square cursor-pointer`}
                        >
                            <span className={`text-lg ${isToday(day) && !isSelected ? 'font-extrabold text-accent' : ''} ${isSelected ? 'font-extrabold text-background bg-accent w-full rounded-sm' : ''}`}>{format(day, 'd')}</span>
                            {events[dayKey] && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${events[dayKey].some(e => e.isGlobal) ? 'bg-yellow-500' : 'bg-accent'}`}></div>}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

const AddEventModal = ({ isOpen, onClose, date, onEventAdded }: { isOpen: boolean, onClose: () => void, date: Date, onEventAdded: () => void }) => {
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('09:00');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title) {
            setError('Vui lòng nhập tiêu đề sự kiện.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const eventDate = format(date, 'yyyy-MM-dd');
            const eventDateTime = `${eventDate}T${time}:00`;
            const payload: EventCreate = { title, event_date: eventDateTime };
            await eventService.createEvent(token!, payload);
            onEventAdded();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Không thể tạo sự kiện.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="relative w-full max-w-lg bg-background border-2 border-foreground shadow-neo p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-display font-extrabold text-2xl">Thêm sự kiện cho ngày {format(date, 'dd/MM/yyyy')}</h2>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1 }} className="p-1"><X /></motion.button>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="font-bold mb-2 block">Tiêu đề sự kiện</label>
                                <NeoInput type="text" placeholder="VD: Sinh nhật bạn A" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div>
                                <label className="font-bold mb-2 block">Thời gian</label>
                                <NeoInput type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={onClose} className="w-full py-3 border-2 border-foreground font-bold hover:bg-foreground/10 transition-colors">Hủy</button>
                                <NeoButton type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : 'Lưu Sự Kiện'}</NeoButton>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Main Dashboard Page ---
export default function DashboardPage() {
    const { token, user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
    const [events, setEvents] = useState<EventsMap>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const processEvents = (eventData: EventType[]): EventsMap => {
        const eventMap: EventsMap = {};
        for (const event of eventData) {
            const date = parseISO(event.event_date);
            const dateKey = format(date, 'yyyy-MM-dd');
            if (!eventMap[dateKey]) {
                eventMap[dateKey] = [];
            }
            eventMap[dateKey].push({
                id: event.id,
                time: event.user_id ? format(date, 'HH:mm') : 'Cả ngày',
                title: event.title,
                isGlobal: !event.user_id,
            });
        }
        return eventMap;
    };

    const fetchEvents = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const year = currentMonth.getFullYear();
            const eventData = await eventService.getEvents(token, year);
            const processed = processEvents(eventData);
            setEvents(processed);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token, currentMonth]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleDeleteEvent = async (eventId: string) => {
        if (!token) return;
        try {
            await eventService.deleteEvent(token, eventId);
            fetchEvents(); // Refresh events after deleting
        } catch (error) {
            console.error("Failed to delete event:", error);
            // You might want to show a notification to the user here
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <>
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="p-8 md:p-12">
                <motion.h1 variants={itemVariants} className="font-display font-extrabold text-4xl mb-8">Chào mừng trở lại, {user?.full_name || user?.username}!</motion.h1>
                {isLoading ? (
                    <p>Đang tải lịch...</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <motion.div variants={itemVariants} className="lg:col-span-2">
                            <CalendarWidget selectedDate={selectedDate} onDateSelect={setSelectedDate} events={events} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
                        </motion.div>
                        <motion.div variants={itemVariants} className="flex flex-col gap-8">
                            <ClockWidget />
                            <EventPanelWidget selectedDate={selectedDate} events={events} onAddEvent={() => setIsModalOpen(true)} onDeleteEvent={handleDeleteEvent} />
                        </motion.div>
                    </div>
                )}
            </motion.div>

            <AddEventModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                date={selectedDate} 
                onEventAdded={fetchEvents}
            />
        </>
    );
}