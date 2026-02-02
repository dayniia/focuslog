import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Button, Modal } from '../../components/ui';
import type { Category, Status, LearningItem } from '../../types';

interface LearningItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemToEdit?: LearningItem | null;
}

export const LearningItemModal: React.FC<LearningItemModalProps> = ({ isOpen, onClose, itemToEdit }) => {
    const { addItem, updateItem } = useStore();

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category>('Web');
    const [status, setStatus] = useState<Status>('Not started');
    const [progress, setProgress] = useState(0);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (itemToEdit) {
            setTitle(itemToEdit.title);
            setCategory(itemToEdit.category);
            setStatus(itemToEdit.status);
            setProgress(itemToEdit.progress);
            setNotes(itemToEdit.notes);
        } else {
            setTitle('');
            setCategory('Web');
            setStatus('Not started');
            setProgress(0);
            setNotes('');
        }
    }, [itemToEdit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (itemToEdit) {
            updateItem(itemToEdit.id, { title, category, status, progress: Number(progress), notes });
        } else {
            addItem({ title, category, status, progress: Number(progress), notes });
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={itemToEdit ? 'Edit Skill' : 'Add New Skill'}
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
                        placeholder="e.g. React hooks mastery"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            className="form-control"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                        >
                            <option value="DSA">DSA</option>
                            <option value="Web">Web</option>
                            <option value="CS">Computer Science</option>
                            <option value="Other">Other</option>
                        </select>
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
                        className="progress-slider-large"
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                    />
                </div>

                <div className="form-group">
                    <label>Notes (Optional)</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="What's the goal? Any resources?"
                    ></textarea>
                </div>

                <div className="modal-actions">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{itemToEdit ? 'Save Changes' : 'Add Skill'}</Button>
                </div>
            </form>
        </Modal>
    );
};
