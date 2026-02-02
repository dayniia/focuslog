import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Card, Button, ProgressBar } from '../../components/ui';
import { Search, Plus, Edit2, Trash2, Book } from 'lucide-react';
import type { Category, Status, LearningItem } from '../../types';
import { LearningItemModal } from './LearningItemModal';
import './LearningList.css';

export const LearningList: React.FC = () => {
    const { items, updateItem, deleteItem, setAddModalOpen } = useStore();
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LearningItem | null>(null);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
            const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [items, search, filterCategory, filterStatus]);

    const openEditModal = (item: LearningItem) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    return (
        <div className="learning-list-page">
            <header className="page-header">
                <div>
                    <h1>Your Learning Path</h1>
                    <p>{items.length} skills tracked</p>
                </div>
                <Button onClick={() => setAddModalOpen(true)}>
                    <Plus size={18} />
                    <span>Add New skill</span>
                </Button>
            </header>

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="select-filters">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as any)}
                        className="filter-select"
                    >
                        <option value="All">All Categories</option>
                        <option value="DSA">DSA</option>
                        <option value="Web">Web</option>
                        <option value="CS">Computer Science</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="filter-select"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Not started">Not started</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="items-grid">
                {filteredItems.map(item => (
                    <Card key={item.id} className="item-card">
                        <div className="item-card-header">
                            <span className={`status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                                {item.status}
                            </span>
                            <div className="item-actions">
                                <Button variant="ghost" size="sm" onClick={() => openEditModal(item)}>
                                    <Edit2 size={14} />
                                </Button>
                                <Button variant="ghost" size="sm" className="delete-btn" onClick={() => deleteItem(item.id)}>
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>

                        <div className="item-card-body">
                            <span className="category-label">{item.category}</span>
                            <h3>{item.title}</h3>
                            {item.notes && <p className="item-notes">{item.notes}</p>}
                        </div>

                        <div className="item-card-footer">
                            <div className="progress-info">
                                <span>Progress</span>
                                <span>{item.progress}%</span>
                            </div>
                            <ProgressBar progress={item.progress} />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={item.progress}
                                onChange={(e) => updateItem(item.id, { progress: Number(e.target.value) })}
                                className="progress-slider"
                            />
                        </div>
                    </Card>
                ))}

                {filteredItems.length === 0 && (
                    <div className="empty-list-state">
                        <Book size={48} />
                        <h3>No items found</h3>
                        <p>Try adjusting your search or filters, or add a new skill to track.</p>
                        <Button variant="secondary" onClick={() => setAddModalOpen(true)}>Add your first skill</Button>
                    </div>
                )}
            </div>

            <LearningItemModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                itemToEdit={editingItem}
            />
        </div>
    );
};

