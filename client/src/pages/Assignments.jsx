import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { Package, ShieldAlert } from 'lucide-react';

const Assignments = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [view, setView] = useState('assignments'); // 'assignments' or 'expenditure'

    // Assignment Form
    const [assignForm, setAssignForm] = useState({
        baseId: user.baseId || '',
        equipmentType: '',
        quantity: 0,
        assignedTo: ''
    });

    // Expenditure Form
    const [expendForm, setExpendForm] = useState({
        baseId: user.baseId || '',
        equipmentType: '',
        quantity: 0,
        reason: ''
    });

    const fetchAssignments = useCallback(async () => {
        try {
            const res = await api.get('/assignments');
            setAssignments(res.data);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assignments', assignForm);
            fetchAssignments();
            setAssignForm({ ...assignForm, equipmentType: '', quantity: 0, assignedTo: '' });
        } catch (err) { alert('Error: ' + (err.response?.data?.msg || err.message)); }
    };

    const handleExpend = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assignments/expend', expendForm);
            alert('Expenditure recorded');
            setExpendForm({ ...expendForm, equipmentType: '', quantity: 0, reason: '' });
            // Ideally fetch expenditures history too, but for now just showing assignments list
        } catch (err) { alert('Error: ' + (err.response?.data?.msg || err.message)); }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Personnel & Logistics</h2>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setView('assignments')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${view === 'assignments'
                        ? 'bg-military-800 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <Package size={20} />
                    Assign Assets
                </button>
                <button
                    onClick={() => setView('expenditure')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${view === 'expenditure'
                        ? 'bg-red-700 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <ShieldAlert size={20} />
                    Record Expenditure
                </button>
            </div>

            {view === 'assignments' ? (
                <div className="card shadow-lg border-l-4 border-blue-600">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider">Assign to Personnel</h3>
                    <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        {!user.baseId && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Base ID</label>
                                <input className="input-field" value={assignForm.baseId} onChange={e => setAssignForm({ ...assignForm, baseId: e.target.value })} required />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Equipment</label>
                            <input className="input-field" placeholder="Item Name" value={assignForm.equipmentType} onChange={e => setAssignForm({ ...assignForm, equipmentType: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
                            <input type="number" className="input-field" min="1" value={assignForm.quantity} onChange={e => setAssignForm({ ...assignForm, quantity: parseInt(e.target.value) })} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Assign To (Name/ID)</label>
                            <input className="input-field" placeholder="Soldier Name" value={assignForm.assignedTo} onChange={e => setAssignForm({ ...assignForm, assignedTo: e.target.value })} required />
                        </div>
                        <button className="btn-primary h-[50px] w-full bg-blue-700 hover:bg-blue-800">Confirm Assignment</button>
                    </form>
                </div>
            ) : (
                <div className="card shadow-lg border-l-4 border-red-600">
                    <h3 className="text-lg font-bold text-red-700 mb-6 uppercase tracking-wider">Record Expenditure</h3>
                    <form onSubmit={handleExpend} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        {!user.baseId && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Base ID</label>
                                <input className="input-field" value={expendForm.baseId} onChange={e => setExpendForm({ ...expendForm, baseId: e.target.value })} required />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Equipment</label>
                            <input className="input-field" value={expendForm.equipmentType} onChange={e => setExpendForm({ ...expendForm, equipmentType: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
                            <input type="number" className="input-field" min="1" value={expendForm.quantity} onChange={e => setExpendForm({ ...expendForm, quantity: parseInt(e.target.value) })} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Reason</label>
                            <input className="input-field" placeholder="Training, Damage..." value={expendForm.reason} onChange={e => setExpendForm({ ...expendForm, reason: e.target.value })} required />
                        </div>
                        <button className="btn-primary h-[50px] w-full bg-red-700 hover:bg-red-800 shadow-red-900/20">Record Expend</button>
                    </form>
                </div>
            )}

            <div className="card p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h4 className="font-bold text-slate-700">Active Assignments List</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="table-header">Date</th>
                                <th className="table-header">Base</th>
                                <th className="table-header">Equipment</th>
                                <th className="table-header">Assigned To</th>
                                <th className="table-header text-right">Quantity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assignments.map(a => (
                                <tr key={a._id} className="table-row">
                                    <td className="p-5 font-mono text-slate-500 text-sm">{format(new Date(a.date), 'yyyy-MM-dd HH:mm')}</td>
                                    <td className="p-5 font-bold text-slate-700">{a.baseId?.name || a.baseId}</td>
                                    <td className="p-5 font-medium text-slate-800">{a.equipmentType}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {a.assignedTo.charAt(0)}
                                            </div>
                                            <span className="text-slate-700">{a.assignedTo}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right font-mono font-bold text-slate-600">{a.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Assignments;
