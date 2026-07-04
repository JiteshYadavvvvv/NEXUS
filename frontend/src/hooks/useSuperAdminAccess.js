import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const SUPER_ROLES = ['director', 'principal', 'jd'];

export default function useSuperAdminAccess() {
    const { checkAdminAuth, setUser, setIsAdmin } = useAuth();
    const [status, setStatus] = useState('loading'); // loading | ok | denied
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        let active = true;
        (async () => {
            const info = await checkAdminAuth();
            if (!active) return;
            if (info && SUPER_ROLES.includes(info.role)) {
                setAdmin(info);
                setUser(info);
                setIsAdmin(true);
                setStatus('ok');
            } else {
                setStatus('denied');
            }
        })();
        return () => { active = false; };
    }, []);

    return { status, admin };
}
