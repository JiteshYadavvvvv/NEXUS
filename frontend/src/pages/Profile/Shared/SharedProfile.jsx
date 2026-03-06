import React, { useState, useRef } from 'react';
import { Mail, Phone, Award, MessageCircle, Send, Edit2, Check, X, Camera, Save, Copy } from 'lucide-react';
import { useProfile } from './ProfileContext';
import { useAuth } from '@/context/AuthContext';

const SharedProfile = () => {
    const { profile } = useProfile();
    const { user, updateUserInfo } = useAuth();
    const [saveStatus, setSaveStatus] = useState(null);
    const [copied, setCopied] = useState(false);

    const [saveError, setSaveError] = useState('');
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    if (!profile) return <div>Loading Profile...</div>;

    const startEditing = () => {
        setEditForm({
            name: user?.name || '',
            bio: user?.bio || '',
            year: user?.year || '',
            callSign: user?.callSign || '',
            bannerText: profile?.bannerText || 'NEXUS',
            avatar: profile?.avatar || '/clubprofiles/ns.png',
            phone: profile?.phone || '',
            email: user?.email || '',
        });
        setSaveStatus(null);
        setSaveError('');
        setIsEditing(true);
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        setSaveError('');
        const result = await updateUserInfo({
            name: editForm.name,
            bio: editForm.bio,
            year: editForm.year,
            callSign: editForm.callSign,
            number: editForm.phone,
        });
        if (result.success) {
            setSaveStatus('success');
            setTimeout(() => setIsEditing(false), 800);
        } else {
            setSaveStatus('error');
            setSaveError(result.message || 'Failed to save profile.');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setEditForm({ ...editForm, avatar: imageUrl });
        }
    };

    if (isEditing) {
        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-gray-50/50 p-4 md:p-8 rounded-2xl min-h-screen">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                    <div className="flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saveStatus === 'saving'}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <Save className="h-4 w-4" />
                            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-8 space-y-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <img
                                    src={editForm.avatar}
                                    alt="Profile"
                                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-75 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg shadow-blue-600/20 border-2 border-white">
                                    <Camera className="h-4 w-4" />
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    className="hidden" 
                                    accept="image/*"
                                />
                            </div>
                            <div className="text-center sm:text-left space-y-1">
                                <h3 className="font-semibold text-gray-900 text-lg">Profile Photo</h3>
                                <p className="text-sm text-gray-500">Click the image to upload a new profile photo.</p>
                                <p className="text-xs text-gray-400 mt-2">Recommended: 1:1 ratio, max 5MB.</p>
                            </div>
                        </div>

                        {/* General Info */}
                        <div className="space-y-6">
                            <h3 className="font-semibold text-gray-900 text-lg">General Information</h3>
                            
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                        value={editForm.name}
                                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Year</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                        value={editForm.year}
                                        onChange={e => setEditForm({...editForm, year: e.target.value})}
                                    >
                                        <option value="">Select Year</option>
                                        <option value="FE">FE</option>
                                        <option value="SE">SE</option>
                                        <option value="TE">TE</option>
                                        <option value="BE">BE</option>
                                    </select>
                                </div>
                            </div>



                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Bio</label>
                                <textarea 
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-y"
                                    value={editForm.bio}
                                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                    placeholder="Tell others a bit about yourself..."
                                />
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Contact Info */}
                        <div className="space-y-6 pb-4">
                            <h3 className="font-semibold text-gray-900 text-lg">Contact Details</h3>
                            
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Call Sign</label>
                                    <input 
                                        type="text"
                                        maxLength={10}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                        value={editForm.callSign}
                                        onChange={e => setEditForm({...editForm, callSign: e.target.value.replace(/\s/g, '')})}
                                        placeholder="e.g. NEXUS"
                                    />
                                    <p className="text-xs text-gray-400 text-right">{(editForm.callSign || '').length}/10 — shown as your profile banner</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                                        <input 
                                            type="tel" 
                                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                            value={editForm.phone}
                                            onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Error */}
                        {saveStatus === 'error' && (
                            <p className="text-sm text-red-600 font-medium text-center">{saveError}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* View Mode Actions */}
            <div className="flex justify-end pr-4 pt-4">
                <button onClick={startEditing} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 text-sm font-semibold transition-colors">
                    <Edit2 className="h-4 w-4" /> Edit Profile
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div className="relative h-24 md:h-28 bg-gray-900 text-white flex items-center justify-center font-black text-4xl md:text-6xl lg:text-8xl px-4 text-center">
                    {user.callSign || 'NEXUS'}
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(user.callSign || 'NEXUS');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        title="Copy callsign"
                        className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors backdrop-blur-sm"
                    >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                
                <div className="px-8 pb-8">
                    <div className="relative flex items-end -mt-12 mb-6">
                        <img
                            src={profile.avatar || "/clubprofiles/ns.png"}
                            alt={user.name}
                            className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-sm"
                        />
                        <div className="ml-6 mt-12 flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-500 text-sm">{user.role}</p>
                            <p className="text-gray-500 text-sm">{user.year}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                                    {profile.phone}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Bio</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {user.bio}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="h-5 w-5 text-gray-900" />
                    Club Memberships & Communities
                </h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {profile.clubs?.map((club) => (
                        <div key={club.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col h-full">
                            <div className="mb-4">
                                <div className="h-16 w-16 mb-4">
                                    <img src={club.logo} alt={club.name} className="h-full w-full object-contain" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 transition-colors">
                                    {club.name}
                                </h3>
                                <p className="text-sm font-medium text-blue-600 mt-1 mb-2">
                                    {club.role}
                                </p>
                                <p className="text-sm text-gray-500 leading-snug">
                                    {club.description}
                                </p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                                <a
                                    href={club.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                                >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    WhatsApp
                                </a>
                                <a
                                    href={club.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-sky-50 text-sky-700 text-xs font-medium hover:bg-sky-100 transition-colors"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    Telegram
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SharedProfile;
