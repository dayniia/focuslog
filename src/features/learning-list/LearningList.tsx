import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card, Button, ProgressBar, Modal } from '../../components/ui';
import { Search, Plus, Edit2, Trash2, Book, Filter } from 'lucide-react';
import type { Category, Status, LearningItem } from '../../types';
import './LearningList.css';

export const LearningList: React.FC = () => {
    const { items, addItem, updateItem, deleteItem } = useStore();
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LearningItem | null>(null);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<Status>('Not started');
    const [progress, setProgress] = useState(0);
    const [notes, setNotes] = useState('');

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

    const openAddModal = () => {
        setEditingItem(null);
        setTitle('');
        setCategory('');
        setStatus('Not started');
        setProgress(0);
        setNotes('');
        setIsModalOpen(true);
    };

    const openEditModal = (item: LearningItem) => {
        setEditingItem(item);
        setTitle(item.title);
        setCategory(item.category);
        setStatus(item.status);
        setProgress(item.progress);
        setNotes(item.notes);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            updateItem(editingItem.id, { title, category, status, progress: Number(progress), notes });
        } else {
            addItem({ title, category, status, progress: Number(progress), notes });
        }
        setIsModalOpen(false);
    };

    React.useEffect(() => {
        const handleOpenModal = () => openAddModal();
        window.addEventListener('open-add-modal', handleOpenModal);
        return () => window.removeEventListener('open-add-modal', handleOpenModal);
    }, []);

    return (
        <div className="container learning-page">
            <header className="page-header">
                <div className="header-text">
                    <h1>Learning Library</h1>
                    <p>Organize your journey to mastery</p>
                </div>
                <Button onClick={openAddModal} className="add-btn">
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
                                    <Button variant="ghost" size="sm" onClick={() => openEditModal(item)}>
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
                        <Button variant="secondary" onClick={openAddModal}>Add First Skill</Button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'Edit Skill' : 'New Mastery'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Distributed Systems"
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                className="form-control"
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Web Development"
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                className="form-control"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Status)}
                            >
                                <option value="Not started">Not started</option>
                                <option value="In progress">In progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Progress ({progress}%)</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            className="modal-slider"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Resources, goals, or milestones..."
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingItem ? 'Update Skill' : 'Create Skill'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
