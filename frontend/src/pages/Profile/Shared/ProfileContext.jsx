import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const ProfileContext = createContext();

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export const ProfileProvider = ({ children, initialData, role }) => {
    const location = useLocation();
    const [profile, setProfile] = useState(initialData.profile);
    const [members, setMembers] = useState(initialData.members);
    const [tasks, setTasks] = useState(initialData.tasks);
    const [messages, setMessages] = useState(initialData.messages);
    const [notifications, setNotifications] = useState(initialData.notifications);
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || (role === 'Applicant' ? 'messages' : 'overview'));
    const [activeClub, setActiveClub] = useState(profile.clubs?.[0] || null);
    // const { setCurrentView } = useView();

    const clubTasks = tasks.filter(t => t.clubId === activeClub?.id);
    const clubMembers = members.filter(m => {
        return true;
    });
    const clubMessages = messages.filter(m => m.clubId === activeClub?.id);

    const switchClub = (clubId) => {
        const club = profile.clubs?.find(c => c.id === clubId);
        if (club) {
            setActiveClub(club);
        }
    };

    // Fetch members from API
    useEffect(() => {
        const fetchMembers = async () => {
            if (role !== 'Admin' || !activeClub) return;
            try {
                const res = await axios.get(`${API}/api/admin/get-club-members`, 
                    { withCredentials: true }
                );

                if (res.data.success) {
                    // Map API user objects to context member format
                    const apiMembers = res.data.data.map(u => ({
                        id: u._id,
                        name: u.name,
                        email: u.email,
                        role: u.role || 'Member',
                        domain: 'Technical', // Default or fetch if available
                        status: 'Active',
                        clubId: activeClub.id
                    }));
                    setMembers(apiMembers);
                }
            } catch (err) {
                console.error("Failed to load members:", err);
            }
        };
        fetchMembers();
    }, [activeClub, role]);

    const unreadMessagesCount = 0;
    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
    const pendingTasksCount = clubTasks.filter(t => t.status !== 'Completed').length;

    const addTask = (task) => {
        const newTask = {
            ...task,
            id: `t${Date.now()}`,
            clubId: task.clubId || activeClub.id,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            assignedToName: members.find(m => m.id === task.assignedTo)?.name || 'Unknown'
        };
        setTasks([...tasks, newTask]);
        addNotification({ title: 'Task Created', message: `Task "${task.title}" assigned to ${newTask.assignedToName}.`, type: 'info' });
    };

    const updateTaskStatus = (id, status) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    };

    const editTask = (updatedTask) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        addNotification({ title: 'Task Updated', message: `Task "${updatedTask.title}" has been updated.`, type: 'info' });
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const sendMessage = (content, receiverId = null) => {
        const newMsg = {
            id: `msg${Date.now()}`,
            clubId: activeClub.id,
            senderId: profile.id,
            senderName: profile.name,
            receiverId,
            content,
            timestamp: new Date().toISOString(),
            avatar: profile.avatar || ''
        };
        setMessages([...messages, newMsg]);
    };

    const addMember = async (member) => {
        try {
            const res = await axios.post(`${API}/api/admin/add-member`,
                { name: member.name, memberEmail: member.email },
                { withCredentials: true }
            );
            if (res.data.success) {
                // If backend doesn't return the full populated user immediately, we append what we have
                // but usually it's better to just refetch. For now, we trust local state append.
                const newMember = { ...member, id: res.data.data?._id || `m${Date.now()}` };
                setMembers([...members, newMember]);
                addNotification({ title: 'Member Added', message: `${member.name} added to the team.`, type: 'success' });
                toast.success('Member added successfully');
            } else {
                toast.error(res.data.message || 'Failed to add member');
            }
        } catch(err) {
            console.error(err);
            toast.error('Error adding member');
        }
    };

    const removeMember = async (member) => {
        try {
            const res = await axios.post(`${API}/api/admin/remove-member`, 
                { name: member.name, memberEmail: member.email },
                { withCredentials: true }
            );
            if (res.data.success) {
                setMembers(members.filter(m => m.id !== member.id));
                toast.success('Member removed successfully');
            } else {
                toast.error(res.data.message || 'Failed to remove member');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error removing member');
        }
    };

    const editMember = (updatedMember) => {
        setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
    };

    const markNotificationRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const addNotification = ({ title, message, type }) => {
        const newNotif = {
            id: `n${Date.now()}`,
            title,
            message,
            type,
            isRead: false,
            timestamp: new Date().toISOString()
        };
        setNotifications([newNotif, ...notifications]);
    };



    const value = {
        role,
        profile,
        members: clubMembers,
        tasks: clubTasks,
        messages: clubMessages,
        notifications,
        activeTab,
        setActiveTab,
        activeClub,
        switchClub,
        addTask,
        updateTaskStatus,
        editTask,
        deleteTask,
        sendMessage,
        addMember,
        removeMember,
        editMember,
        markNotificationRead,
        addNotification,
        unreadMessagesCount,
        unreadNotificationsCount,
        pendingTasksCount
    };

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
