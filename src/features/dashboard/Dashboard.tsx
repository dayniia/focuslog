import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card, Button, ProgressBar } from '../../components/ui';
import { Flame, Book, ChevronRight, Target, CheckCircle } from 'lucide-react';
import { Heatmap } from './Heatmap';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const { items, activities, getStreak, todos, toggleTodo, deleteTodo, addTodo } = useStore();

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 5 || hour >= 22) return 'Good night';
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const activeItems = items.filter(i => i.status === 'In progress');
    const streak = getStreak();
    const mostRecentItem = activeItems.sort((a, b) => b.createdAt - a.createdAt)[0];

    return (
        <div className="container dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Dashboard</h1>
                    <p>{greeting}, learner. You're doing great.</p>
                </div>
            </header>

            <div className="dashboard-main">
                <Card className="consistency-card">
                    <div className="card-header-row">
                        <div className="header-info">
                            <h3>Learning Consistency</h3>
                            <p className="subtitle">Activity map of the last 12 weeks</p>
                        </div>
                        <div className="header-actions">
                            <span className="dot-menu">•••</span>
                        </div>
                    </div>
                    <Heatmap activities={activities} />
                    <div className="heatmap-footer">
                        <div className="legend">
                            <span>Less</span>
                            <div className="legend-box level-0"></div>
                            <div className="legend-box level-1"></div>
                            <div className="legend-box level-2"></div>
                            <div className="legend-box level-3"></div>
                            <div className="legend-box level-4"></div>
                            <span>More</span>
                        </div>
                    </div>
                </Card>

                <div className="dashboard-grid-secondary">
                    <div className="stats-column">
                        <Card className="compact-stat-card highlight">
                            <div className="stat-icon-wrapper">
                                <Flame size={24} />
                            </div>
                            <div className="stat-text">
                                <span className="label">Streak:</span>
                                <span className="value">{streak} Days</span>
                            </div>
                        </Card>

                        <Card className="compact-stat-card">
                            <div className="stat-icon-wrapper">
                                <Book size={24} />
                            </div>
                            <div className="stat-text">
                                <span className="label">Active Items:</span>
                                <span className="value">{activeItems.length}</span>
                            </div>
                        </Card>

                        {mostRecentItem && (
                            <Card className="mini-focus-card">
                                <div className="card-header">
                                    <Target size={18} />
                                    <h4>Active Mastery</h4>
                                </div>
                                <span className="item-title">{mostRecentItem.title}</span>
                                <ProgressBar progress={mostRecentItem.progress} />
                            </Card>
                        )}
                    </div>

                    <Card className="todo-card">
                        <div className="todo-header-row">
                            <h3>Today's Focus</h3>
                            <div className="header-tools">
                                <button className="tool-btn"><ChevronRight size={16} /></button>
                            </div>
                        </div>

                        <div className="todo-list">
                            {todos.map(todo => (
                                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                                    <div className="todo-checkbox-wrapper" onClick={() => toggleTodo(todo.id)}>
                                        <div className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}>
                                            {todo.completed && <CheckCircle size={14} />}
                                        </div>
                                    </div>
                                    <span className="todo-text">{todo.text}</span>
                                    <button className="todo-delete" onClick={() => deleteTodo(todo.id)}>&times;</button>
                                </div>
                            ))}

                            {todos.length === 0 && (
                                <div className="empty-todo">
                                    <p>No tasks for today.</p>
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
                                placeholder="Add a focus task..."
                            />
                            <Button type="submit" size="sm">Add</Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};
