import React, { useState } from 'react';
import { useProfile } from './ProfileContext';
import { Plus, Trash2, Calendar, User, CheckCircle2, Pencil } from 'lucide-react';

export default function SharedTasks() {
    const { tasks, members, addTask, deleteTask, updateTaskStatus, editTask, role } = useProfile();
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', deadline: '', priority: 'Medium' });
    const [submissionLink, setSubmissionLink] = useState({});

    const assignableMembers = role === 'TE' 
        ? members 
        : members.filter(m => m.role === 'FE');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTask.title && newTask.assignedTo) {
            if (isEditing) {
                editTask({ ...newTask, id: currentTaskId, assignedToName: members.find(m => m.id === newTask.assignedTo)?.name || 'Unknown' });
                setIsEditing(false);
                setCurrentTaskId(null);
            } else {
                addTask(newTask);
            }
            setShowAddForm(false);
            setNewTask({ title: '', description: '', assignedTo: '', deadline: '', priority: 'Medium' });
        }
    };

    const openEditModal = (task) => {
        setNewTask({
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo,
            deadline: task.deadline || '',
            priority: task.priority
        });
        setCurrentTaskId(task.id);
        setIsEditing(true);
        setShowAddForm(true);
    };

    const statusCols = ['Pending', 'In Progress', 'Completed'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Active Tasks</h2>
                    <p className="text-gray-500">Track project progress.</p>
                </div>
                {role !== 'FE' && (
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setIsEditing(false);
                            setNewTask({ title: '', description: '', assignedTo: '', deadline: '', priority: 'Medium' });
                        }}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> {showAddForm && !isEditing ? 'Close' : 'New Task'}
                    </button>
                )}
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-4 mb-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold text-lg text-gray-900">{isEditing ? 'Edit Task' : 'Create Task'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Task Title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            required
                        />
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newTask.assignedTo}
                            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                            required
                        >
                            <option value="">Assign To...</option>
                            {assignableMembers.map(m => (
                                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newTask.deadline}
                            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                            required
                        />
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                        <textarea
                            className="col-span-2 flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                            placeholder="Description (Optional)"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddForm(false);
                                setIsEditing(false);
                                setNewTask({ title: '', description: '', assignedTo: '', deadline: '', priority: 'Medium' });
                            }}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            {isEditing ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {statusCols.map(status => (
                    <div key={status} className="bg-gray-100 rounded-xl p-4 border border-gray-200 flex flex-col h-full">
                        <h3 className="font-semibold mb-4 flex items-center justify-between text-sm uppercase tracking-wide text-gray-500">
                            {status}
                            <span className="bg-white text-gray-700 px-2 py-0.5 rounded-full text-xs shadow-sm">
                                {tasks.filter(t => t.status === status).length}
                            </span>
                        </h3>

                        <div className="space-y-3 flex-1">
                            {tasks
                                .filter(t => t.status === status)
                                .filter(t => {
                                    if (role === 'TE') return true;
                                    const assignedMember = members.find(m => m.id === t.assignedTo);
                                    return assignedMember?.role === 'FE' || t.assignedTo === 'Unassigned';
                                })
                                .map(task => (
                                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group hover:border-blue-400 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                                        <div className="flex gap-1">
                                            {role !== 'FE' && (
                                                <>
                                                    <button onClick={() => openEditModal(task)} className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' :
                                                task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    'bg-blue-50 text-blue-600 border-blue-200'
                                            }`}>
                                            {task.priority}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <User className="h-3 w-3" /> {task.assignedToName?.split(' ')[0]}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Calendar className="h-3 w-3" /> {new Date(task.deadline).toLocaleDateString()}
                                        </div>
                                        {status !== 'Completed' ? (
                                            <div className="flex gap-2 w-full mt-2">
                                                <input 
                                                    type="url" 
                                                    placeholder="Submission Link" 
                                                    className="flex-1 min-w-0 text-xs px-2 py-1 rounded border border-gray-200 outline-none focus:border-blue-500"
                                                    value={submissionLink[task.id] || ''}
                                                    onChange={(e) => setSubmissionLink(prev => ({...prev, [task.id]: e.target.value}))}
                                                />
                                                <button
                                                    onClick={() => updateTaskStatus(task.id, 'Completed')}
                                                    className="text-[10px] bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors whitespace-nowrap"
                                                >
                                                    Submit Task
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Done
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.status === status).filter(t => {
                                 if (role === 'TE') return true;
                                 const assignedMember = members.find(m => m.id === t.assignedTo);
                                 return assignedMember?.role === 'FE';
                            }).length === 0 && (
                                <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                                    Empty
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
