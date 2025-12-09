import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

const Transfers = () => {
    const [transfers, setTransfers] = useState([]);
    const [form, setForm] = useState({
        fromBaseId: '',
        toBaseId: '',
        equipmentType: '',
        quantity: 0
    });

    const fetchTransfers = useCallback(async () => {
        try {
            const res = await api.get('/transfers');
            setTransfers(res.data);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => {
        fetchTransfers();
    }, [fetchTransfers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/transfers', form);
            fetchTransfers();
            setForm({ fromBaseId: '', toBaseId: '', equipmentType: '', quantity: 0 });
        } catch (err) {
            alert('Error: ' + (err.response?.data?.msg || err.message));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Asset Transfers</h2>
            </div>

            <div className="card border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><ArrowRight size={18} /></span>
                    Initiate New Transfer
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">From Base ID</label>
                        <input className="input-field" placeholder="Source ID" value={form.fromBaseId} onChange={e => setForm({ ...form, fromBaseId: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">To Base ID</label>
                        <input className="input-field" placeholder="Dest ID" value={form.toBaseId} onChange={e => setForm({ ...form, toBaseId: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Equipment</label>
                        <input className="input-field" placeholder="Type" value={form.equipmentType} onChange={e => setForm({ ...form, equipmentType: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
                        <input type="number" className="input-field" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })} required />
                    </div>
                    <button className="btn-primary h-[50px] w-full">Transfer Assets</button>
                </form>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-700">Recent Movements</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="table-header">Date</th>
                                <th className="table-header">Route</th>
                                <th className="table-header">Equipment</th>
                                <th className="table-header text-right">Quantity</th>
                                <th className="table-header text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transfers.map(t => (
                                <tr key={t._id} className="table-row">
                                    <td className="p-5 text-sm text-slate-500 font-mono">{format(new Date(t.date), 'yyyy-MM-dd HH:mm')}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">{t.fromBaseId?.name || t.fromBaseId}</span>
                                            <ArrowRight size={14} className="text-slate-400" />
                                            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">{t.toBaseId?.name || t.toBaseId}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 font-medium text-slate-800">{t.equipmentType}</td>
                                    <td className="p-5 text-right font-mono font-bold text-slate-600">{t.quantity}</td>
                                    <td className="p-5 text-center">
                                        <span className="badge bg-green-100 text-green-700 border border-green-200">
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transfers;
