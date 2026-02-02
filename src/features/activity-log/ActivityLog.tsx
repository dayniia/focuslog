import React from 'react';
import { useStore } from '../../store/useStore';
import { Card, Button } from '../../components/ui';
import { Trash2, Calendar as CalendarIcon } from 'lucide-react';
import './ActivityLog.css';

export const ActivityLog: React.FC = () => {
    const { activities, deleteActivity, items } = useStore();

    const groupedActivities = activities.reduce((acc, curr) => {
        const date = curr.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(curr);
        return acc;
    }, {} as Record<string, typeof activities>);

    const sortedDates = Object.keys(groupedActivities).sort().reverse();

    const getItemTitle = (id?: string) => {
        if (!id) return null;
        return items.find(i => i.id === id)?.title;
    };

    return (
        <div className="activity-log-page">
            <header className="page-header">
                <div>
                    <h1>Activity Log</h1>
                    <p>Consistency is key to mastery</p>
                </div>
            </header>

            <div className="timeline">
                {sortedDates.map(date => (
                    <div key={date} className="timeline-day">
                        <div className="timeline-date">
                            <div className="date-badge">
                                <span className="day-name">{new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                                <span className="day-num">{new Date(date).getDate()}</span>
                            </div>
                        </div>

                        <div className="timeline-content">
                            {groupedActivities[date].reverse().map(activity => (
                                <Card key={activity.id} className="activity-log-card">
                                    <div className="activity-log-header">
                                        <div className="activity-meta">
                                            <span className="activity-time">
                                                {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {activity.learningItemId && (
                                                <span className="activity-item-link">
                                                    • {getItemTitle(activity.learningItemId)}
                                                </span>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="sm" className="delete-log-btn" onClick={() => deleteActivity(activity.id)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                    <p className="activity-log-text">{activity.text}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                {activities.length === 0 && (
                    <div className="empty-log-state">
                        <CalendarIcon size={48} />
                        <h3>No activities logged yet</h3>
                        <p>Log your daily progress from the dashboard to see your timeline grow.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
