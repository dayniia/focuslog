import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card, Button, ProgressBar } from '../../components/ui';
import { Search, Plus, Edit2, Trash2, Book, Filter } from 'lucide-react';
import type { Category, Status } from '../../types';
import './LearningList.css';

export const LearningList: React.FC = () => {
    const { items, updateItem, deleteItem, setAddModalOpen } = useStore();
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');

    const allCategories = useMemo(() => {
        const cats = new Set(items.map(item => item.category));
        return Array.from(cats).sort();
    }, [items]);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
            const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [items, search, filterCategory, filterStatus]);

    return (
        <div className="container learning-page">
            <header className="page-header">
                <div className="header-text">
                    <h1>Learning Library</h1>
                    <p>Organize your journey to mastery</p>
                </div>
                <Button onClick={() => setAddModalOpen(true)} className="add-btn">
                    <Plus size={20} strokeWidth={3} />
                    <span>New Skill</span>
                </Button>
            </header>

            <div className="discovery-bar">
                <div className="search-wrapper">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <div className="filter-item">
                        <Filter size={14} />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {allCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-item">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Not started">Not started</option>
                            <option value="In progress">In progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="items-grid">
                {filteredItems.map(item => (
                    <Card key={item.id} className="skill-card">
                        <div className="skill-card-body">
                            <div className="skill-tag-row">
                                <span className="category-label">{item.category}</span>
                                <span className={`status-pill status-${item.status.toLowerCase().replace(' ', '-')}`}>
                                    {item.status}
                                </span>
                            </div>
                            <h3>{item.title}</h3>
                            {item.notes && <p className="skill-notes">{item.notes}</p>}
                        </div>

                        <div className="skill-card-footer">
                            <div className="skill-progress-row">
                                <ProgressBar progress={item.progress} />
                                <span className="progress-value">{item.progress}%</span>
                            </div>

                            <div className="skill-actions">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={item.progress}
                                    onChange={(e) => updateItem(item.id, { progress: Number(e.target.value) })}
                                    className="inline-slider"
                                />
                                <div className="action-buttons">
                                    <Button variant="ghost" size="sm" onClick={() => setAddModalOpen(true, item)}>
                                        <Edit2 size={14} strokeWidth={2.5} />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="delete-btn" onClick={() => deleteItem(item.id)}>
                                        <Trash2 size={14} strokeWidth={2.5} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredItems.length === 0 && (
                    <div className="empty-library">
                        <div className="empty-icon"><Book size={48} strokeWidth={1.5} /></div>
                        <h3>Nothing matches yet</h3>
                        <p>Try clearing your filters or add a new skill to track.</p>
                        <Button variant="secondary" onClick={() => setAddModalOpen(true)}>Add First Skill</Button>
                    </div>
                )}
            </div>
        </div>
    );
};
