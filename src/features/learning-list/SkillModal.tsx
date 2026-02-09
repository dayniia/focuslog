import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Modal, Button } from '../../components/ui';
import type { Status } from '../../types';

export const SkillModal: React.FC = () => {
    const { isAddModalOpen, setAddModalOpen, editingItem, addItem, updateItem } = useStore();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<Status>('Not started');
    const [progress, setProgress] = useState(0);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (editingItem) {
            setTitle(editingItem.title);
            setCategory(editingItem.category);
            setStatus(editingItem.status);
            setProgress(editingItem.progress);
            setNotes(editingItem.notes || '');
        } else {
            setTitle('');
            setCategory('');
            setStatus('Not started');
            setProgress(0);
            setNotes('');
        }
    }, [editingItem, isAddModalOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            updateItem(editingItem.id, { title, category, status, progress: Number(progress), notes });
        } else {
            addItem({ title, category, status, progress: Number(progress), notes });
        }
        setAddModalOpen(false);
    };

    return (
        <Modal
            isOpen={isAddModalOpen}
            onClose={() => setAddModalOpen(false)}
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
                    <Button type="button" variant="ghost" onClick={() => setAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingItem ? 'Update Skill' : 'Create Skill'}</Button>
                </div>
            </form>
        </Modal>
    );
};
