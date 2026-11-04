import { useState, useEffect, useCallback } from 'react';
import {
    getAllApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    getApplicationStats
} from '../services/application.api.js';

export function useApplications() {
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        try {
            const [appsData, statsData] = await Promise.all([
                getAllApplications(),
                getApplicationStats().catch(() => null)
            ]);
            setApplications(appsData);
            setStats(statsData);
        } catch (err) {
            setError(err.message || 'Error loading applications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        Promise.all([
            getAllApplications(),
            getApplicationStats().catch(() => null)
        ]).then(([appsData, statsData]) => {
            if (active) {
                setApplications(appsData);
                setStats(statsData);
                setLoading(false);
            }
        }).catch((err) => {
            if (active) {
                setError(err.message || 'Error loading applications');
                setLoading(false);
            }
        });
        return () => { active = false; };
    }, []);

    const refresh = async () => {
        setLoading(true);
        setError(null);
        await loadData();
    };

    const addApplication = async (data) => {
        setError(null);
        try {
            const saved = await createApplication(data);
            setApplications(prev => [saved, ...prev]);
            getApplicationStats().then(setStats).catch(() => {});
            return saved;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const changeStatus = async (id, newStatus) => {
        setError(null);
        try {
            const updated = await updateApplication(id, { status: newStatus });
            setApplications(prev => prev.map(a => a._id === id ? updated : a));
            getApplicationStats().then(setStats).catch(() => {});
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const editApplication = async (id, data) => {
        setError(null);
        try {
            const updated = await updateApplication(id, data);
            setApplications(prev => prev.map(a => a._id === id ? updated : a));
            getApplicationStats().then(setStats).catch(() => {});
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const removeApplication = async (id) => {
        setError(null);
        try {
            await deleteApplication(id);
            setApplications(prev => prev.filter(a => a._id !== id));
            getApplicationStats().then(setStats).catch(() => {});
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        applications,
        stats,
        loading,
        error,
        refresh,
        addApplication,
        changeStatus,
        editApplication,
        removeApplication
    };
}
