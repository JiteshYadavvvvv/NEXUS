import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Building, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SharedMyClubs() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Check if user has any clubs
    const clubs = user?.clubs || [];

    if (clubs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                    <Building className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hold Tight!</h2>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Once you are selected, your official clubs will show up right here.
                </p>
            </div>
        );
    }

    const handleClubClick = async (club) => {
        const clubId = typeof club === 'string' ? null : club?._id; 
        if (!clubId) {
            toast.error("Invalid club format");
            return;
        }

        const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        try {
            const res = await toast.promise(
                axios.post(`${API}/api/auth/verify-membership`, { clubId }, { withCredentials: true }),
                { pending: 'Verifying membership...' }
            );

            if (res.data.success) {
                const clubData = {
                    id: club._id,
                    name: club.name,
                    abbr: club.name.substring(0, 3).toUpperCase(),
                    logo: "/clubprofiles/ns.png"
                };
                localStorage.setItem("enteredClub", JSON.stringify(clubData));
                navigate('/profile/Member', { state: { club: clubData } });
            } else {
                toast.error(res.data.message || 'Verification failed');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error verifying membership');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">My Clubs</h2>
                <p className="text-gray-500">
                    You are officially a member of these clubs.
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        Official Memberships
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">Club Name</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {clubs.map((club, index) => {
                                // Handle if club is a string or an object with a name property
                                const clubName = typeof club === 'string' ? club : (club?.name || 'Unknown Club');
                                return (
                                    <tr 
                                        key={index} 
                                        onClick={() => handleClubClick(club)}
                                        className="bg-white hover:bg-gray-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                                    {clubName.charAt(0)}
                                                </div>
                                                {clubName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end items-center gap-2">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                Official Member
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
