import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card, Button, ProgressBar } from '../../components/ui';
import { Flame, CheckCircle, Book, ChevronRight, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const { items, activities, getStreak, todos, addTodo, toggleTodo, deleteTodo, clearCompletedTodos } = useStore();

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 5 || hour >= 22) return 'Good night';
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const activeItems = items.filter(i => i.status === 'In progress');
    const completedItems = items.filter(i => i.status === 'Completed');
    const streak = getStreak();

    const chartData = useMemo(() => {
        const days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return days.map(date => ({
            date: date.split('-').slice(1).join('/'),
            count: activities.filter(a => a.date === date).length
        }));
    }, [activities]);

    const mostRecentItem = activeItems.sort((a, b) => b.createdAt - a.createdAt)[0];



    return (
        <div className="container dashboard">
            <header className="dashboard-header">
                <h1>{greeting}, learner</h1>
                <p>Your current streak is <strong>{streak} days</strong>. You're doing great.</p>
            </header>

            <div className="dashboard-stats-row">
                <Card className="stat-card">
                    <div className="stat-icon"><Book size={24} strokeWidth={2.5} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Learning</span>
                        <span className="stat-value">{activeItems.length}</span>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-icon"><CheckCircle size={24} strokeWidth={2.5} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{completedItems.length}</span>
                    </div>
                </Card>
                <Card className="stat-card highlight">
                    <div className="stat-icon"><Flame size={24} strokeWidth={2.5} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Streak</span>
                        <span className="stat-value">{streak} Days</span>
                    </div>
                </Card>
            </div>

            <div className="dashboard-main-grid">
                <Card className="consistency-card">
                    <h3>Consistency Overview</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 600 }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'var(--border)', strokeWidth: 2 }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        boxShadow: 'var(--shadow)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ color: 'var(--accent)', fontWeight: 700 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="var(--accent)"
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                    strokeWidth={4}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {mostRecentItem ? (
                    <Card className="focus-card">
                        <h3>Active Mastery</h3>
                        <div className="focus-item">
                            <div className="focus-header">
                                <span className="category-tag">{mostRecentItem.category}</span>
                                <h4>{mostRecentItem.title}</h4>
                            </div>
                            <div className="focus-progress">
                                <div className="progress-text">
                                    <span>Current Progress</span>
                                    <span>{mostRecentItem.progress}%</span>
                                </div>
                                <ProgressBar progress={mostRecentItem.progress} />
                            </div>
                            <Button variant="secondary" onClick={() => window.location.href = '/items'}>
                                View Library <ChevronRight size={16} strokeWidth={3} />
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Card className="focus-card">
                        <h3>Active Mastery</h3>
                        <div className="empty-focus">
                            <Zap size={32} color="var(--border)" />
                            <p>No active skill. Start something new!</p>
                            <Button size="sm" onClick={() => window.location.href = '/items'}>Go to Library</Button>
                        </div>
                    </Card>
                )}

                <Card className="todo-card">
                    <div className="todo-header-row">
                        <h3>Today's Focus</h3>
                        {todos.some(t => t.completed) && (
                            <button className="clear-btn" onClick={clearCompletedTodos}>Clear Done</button>
                        )}
                    </div>

                    <div className="todo-list">
                        {todos.map(todo => (
                            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                    id={`todo-${todo.id}`}
                                />
                                <label htmlFor={`todo-${todo.id}`}>{todo.text}</label>
                                <button className="todo-delete" onClick={() => deleteTodo(todo.id)}>&times;</button>
                            </div>
                        ))}

                        {todos.length === 0 && (
                            <div className="empty-todo">
                                <p>No tasks for today. Add one below!</p>
                            </div>
                        )}
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const input = form.elements.namedItem('todoText') as HTMLInputElement;
                        if (input.value.trim()) {
                            addTodo(input.value.trim());
                            form.reset();
                        }
                    }} className="todo-form">
                        <input
                            name="todoText"
                            type="text"
                            className="form-control"
                            placeholder="Add a task..."
                        />
                        <Button type="submit" size="sm">Add</Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
