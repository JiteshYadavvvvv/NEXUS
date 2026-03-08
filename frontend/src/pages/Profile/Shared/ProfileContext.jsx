import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useView } from '../../../context/ViewContext';
import { useLocation } from 'react-router-dom';

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
        if (!m.clubId || !activeClub?.id) return false;
        const clubs = m.clubId.split(',').map(c => c.trim());
        return clubs.includes(activeClub.id);
    });
    const clubMessages = messages.filter(m => m.clubId === activeClub?.id);

    const switchClub = (clubId) => {
        const club = profile.clubs.find(c => c.id === clubId);
        if (club) {
            setActiveClub(club);
        }
    };

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

    const addMember = (member) => {
        const newMember = { ...member, id: `m${Date.now()}` };
        setMembers([...members, newMember]);
        addNotification({ title: 'Member Added', message: `${member.name} added to the team.`, type: 'success' });
    };

    const removeMember = (id) => {
        setMembers(members.filter(m => m.id !== id));
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
