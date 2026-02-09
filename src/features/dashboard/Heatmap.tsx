import React, { useMemo } from 'react';
import './Heatmap.css';

interface HeatmapProps {
    activities: { date: string }[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ activities }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Generate dates for the last 12 weeks
    const heatmapData = useMemo(() => {
        const data = [];
        const today = new Date();
        const startDay = new Date(today);
        startDay.setDate(today.getDate() - (12 * 7) + (7 - today.getDay() + 1) % 7); // Start of week 12 weeks ago

        for (let i = 0; i < 12 * 7; i++) {
            const date = new Date(startDay);
            date.setDate(startDay.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            const count = activities.filter(a => a.date === dateString).length;
            data.push({ date: dateString, count });
        }
        return data;
    }, [activities]);

    const weeks = [];
    for (let i = 0; i < 12; i++) {
        weeks.push(heatmapData.slice(i * 7, (i + 1) * 7));
    }

    return (
        <div className="heatmap-container">
            <div className="heatmap-labels">
                {days.map(day => <span key={day} className="day-label">{day}</span>)}
            </div>
            <div className="heatmap-grid">
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="heatmap-week">
                        {week.map((day, dayIdx) => (
                            <div
                                key={dayIdx}
                                className={`heatmap-day level-${Math.min(day.count, 4)}`}
                                title={`${day.date}: ${day.count} activities`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
