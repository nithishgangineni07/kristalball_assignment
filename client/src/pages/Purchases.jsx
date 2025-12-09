import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { ShoppingCart } from 'lucide-react';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [form, setForm] = useState({
        baseId: '',
        equipmentType: '',
        quantity: 0
    });

    const fetchPurchases = useCallback(async () => {
        try {
            const res = await api.get('/purchases');
            setPurchases(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchPurchases();
    }, [fetchPurchases]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/purchases', form);
            fetchPurchases();
            setForm({ baseId: '', equipmentType: '', quantity: 0 });
        } catch (err) {
            alert('Error recording purchase: ' + (err.response?.data?.msg || err.message));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Procurement Log</h2>
            </div>

            <div className="card border-l-4 border-green-600">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="p-1.5 bg-green-100 text-green-600 rounded-lg"><ShoppingCart size={18} /></span>
                    Record New Purchase
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Base ID</label>
                        <input className="input-field" placeholder="Base ID" value={form.baseId} onChange={e => setForm({ ...form, baseId: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Equipment Type</label>
                        <input className="input-field" placeholder="M16, Humvee..." value={form.equipmentType} onChange={e => setForm({ ...form, equipmentType: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
                        <input type="number" className="input-field" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })} required />
                    </div>
                    <button className="btn-primary h-[50px] w-full bg-green-700 hover:bg-green-800">Record Purchase</button>
                </form>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h4 className="font-bold text-slate-700">Recent Requisitions</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="table-header">Date</th>
                                <th className="table-header">Base</th>
                                <th className="table-header">Equipment</th>
                                <th className="table-header text-right">Quantity</th>
                                <th className="table-header">Recorded By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {purchases.map(p => (
                                <tr key={p._id} className="table-row">
                                    <td className="p-5 font-mono text-slate-500 text-sm">{format(new Date(p.date), 'yyyy-MM-dd HH:mm')}</td>
                                    <td className="p-5 font-bold text-slate-700">{p.baseId?.name || p.baseId}</td>
                                    <td className="p-5 font-medium text-slate-800">{p.equipmentType}</td>
                                    <td className="p-5 text-right font-mono font-bold text-green-600">+{p.quantity}</td>
                                    <td className="p-5 text-slate-500 text-sm">{p.recordedBy?.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Purchases;
