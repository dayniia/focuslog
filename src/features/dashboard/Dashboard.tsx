import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, Button, ProgressBar } from '../../components/ui';
import { Flame, CheckCircle, Book, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const { items, activities, getStreak, addActivity } = useStore();
    const [logText, setLogText] = useState('');

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const activeItems = items.filter(i => i.status === 'In progress');
    const completedItems = items.filter(i => i.status === 'Completed');
    const streak = getStreak();

    const chartData = useMemo(() => {
        // Last 7 days activity count
        const days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return days.map(date => ({
            date: date.split('-').slice(1).join('/'), // MM/DD
            count: activities.filter(a => a.date === date).length
        }));
    }, [activities]);

    const mostRecentItem = activeItems.sort((a, b) => b.createdAt - a.createdAt)[0];

    const handleQuickLog = (e: React.FormEvent) => {
        e.preventDefault();
        if (!logText.trim()) return;

        addActivity({
            date: new Date().toISOString().split('T')[0],
            text: logText,
            learningItemId: mostRecentItem?.id
        });
        setLogText('');
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>{greeting}, Learner</h1>
                <p>You've maintained a <strong>{streak} day streak</strong>. Keep it up!</p>
            </header>

            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-icon"><Book size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Active Items</span>
                        <span className="stat-value">{activeItems.length}</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon"><CheckCircle size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{completedItems.length}</span>
                    </div>
                </Card>
                <Card className="stat-card highlight">
                    <div className="stat-icon"><Flame size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Current Streak</span>
                        <span className="stat-value">{streak} days</span>
                    </div>
                </Card>
            </div>

            <div className="dashboard-grid">
                <div className="main-col">
                    <Card className="chart-card">
                        <h3>Consistency Overview</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }}
                                        itemStyle={{ color: 'var(--accent)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="var(--accent)"
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="quick-log-card">
                        <h3>Quick Log</h3>
                        <form onSubmit={handleQuickLog}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="What did you study today?"
                                    value={logText}
                                    onChange={(e) => setLogText(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={!logText.trim()}>Log Activity</Button>
                        </form>
                    </Card>
                </div>

                <div className="side-col">
                    {mostRecentItem && (
                        <Card className="focus-card">
                            <h3>Current Focus</h3>
                            <div className="focus-item">
                                <span className="category-tag">{mostRecentItem.category}</span>
                                <h4>{mostRecentItem.title}</h4>
                                <div className="focus-progress">
                                    <div className="progress-text">
                                        <span>Progress</span>
                                        <span>{mostRecentItem.progress}%</span>
                                    </div>
                                    <ProgressBar progress={mostRecentItem.progress} />
                                </div>
                                <Button variant="secondary" className="full-width" onClick={() => window.location.href = '/items'}>
                                    Continue <ChevronRight size={16} />
                                </Button>
                            </div>
                        </Card>
                    )}

                    <Card className="recent-activities">
                        <h3>Recent Activity</h3>
                        <div className="activity-list">
                            {activities.slice(-3).reverse().map(a => (
                                <div key={a.id} className="activity-item">
                                    <div className="activity-date">{new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                                    <div className="activity-text">{a.text}</div>
                                </div>
                            ))}
                            {activities.length === 0 && (
                                <div className="empty-state">No activities yet. Start learning today!</div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
