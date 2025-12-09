import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ArrowUp, ArrowDown, Wallet, ShoppingBag, Package, Shield } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterBase, setFilterBase] = useState('');
    const [bases, setBases] = useState([]); // Need to fetch bases for filter dropdown

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            // Assuming we might have a route to get all bases, currently simplified to just fetch dashboard data
            const res = await api.get(`/assets/dashboard?baseId=${filterBase}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filterBase]);

    useEffect(() => {
        // Ideally fetch bases list here for filter
        fetchDashboard();
    }, [fetchDashboard]);

    // Compute Summary
    const summary = data.reduce((acc, curr) => ({
        opening: acc.opening + curr.openingBalance,
        closing: acc.closing + curr.closingBalance,
        net: acc.net + curr.netMovement,
        purchases: acc.purchases + curr.purchases,
        transfersIn: acc.transfersIn + curr.transfersIn,
        transfersOut: acc.transfersOut + curr.transfersOut,
        expended: acc.expended + curr.expended,
        assigned: acc.assigned + curr.assigned
    }), { opening: 0, closing: 0, net: 0, purchases: 0, transfersIn: 0, transfersOut: 0, expended: 0, assigned: 0 });

    // Chart Data
    const chartData = {
        labels: data.map(d => `${d.baseName} - ${d.equipmentType}`),
        datasets: [
            {
                label: 'Closing Balance',
                data: data.map(d => d.closingBalance),
                backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue-500
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Assigned',
                data: data.map(d => d.assigned),
                backgroundColor: 'rgba(234, 179, 8, 0.6)', // Yellow-500
                borderColor: 'rgb(234, 179, 8)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-military-700"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header Removed as it is now in Layout, or we can keep a sub-header */}
            {/* Keeping it simple - Stats Grid First */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-500">
                <div className="card border-t-4 border-blue-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Opening Balance</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{summary.opening}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <Wallet className="text-blue-600 w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="card border-t-4 border-green-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Net Movement</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1 flex items-center gap-1">
                                {summary.net > 0 ? <ArrowUp size={24} className="text-green-500" /> : <ArrowDown size={24} className="text-red-500" />}
                                {summary.net}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2 font-medium">
                                <span className="text-green-600">+{summary.purchases}</span> buy • <span className="text-blue-600">+{summary.transfersIn}</span> in • <span className="text-orange-600">-{summary.transfersOut}</span> out
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <ShoppingBag className="text-green-600 w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="card border-t-4 border-yellow-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Assignments</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{summary.assigned}</h3>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-full">
                            <Package className="text-yellow-600 w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="card border-t-4 border-purple-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Closing Balance</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{summary.closing}</h3>
                            <p className="text-xs text-slate-400 mt-1">Total Available Assets</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <Shield className="text-purple-600 w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="card animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Asset Distribution</h3>
                    <button className="text-sm text-blue-600 font-semibold hover:text-blue-800">View Report</button>
                </div>
                <div className="h-80 w-full">
                    <Bar options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: '#f1f5f9'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }} data={chartData} />
                </div>
            </div>

            {/* Detailed Table */}
            <div className="card overflow-hidden !p-0 animate-in slide-in-from-bottom-8 duration-700">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-800">Asset Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="table-header">Base</th>
                                <th className="table-header">Equipment</th>
                                <th className="table-header text-right">Opening</th>
                                <th className="table-header text-right">Purchased</th>
                                <th className="table-header text-right">In</th>
                                <th className="table-header text-right">Out</th>
                                <th className="table-header text-right">Expended</th>
                                <th className="table-header text-right">Net Mvt</th>
                                <th className="table-header text-right text-slate-800">Closing</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row, idx) => (
                                <tr key={idx} className="table-row">
                                    <td className="p-5 text-slate-900 font-medium">{row.baseName}</td>
                                    <td className="p-5 text-slate-600">{row.equipmentType}</td>
                                    <td className="p-5 text-right text-slate-500 font-mono">{row.openingBalance}</td>
                                    <td className="p-5 text-right text-green-600 font-mono font-medium">
                                        {row.purchases > 0 ? `+${row.purchases}` : '-'}
                                    </td>
                                    <td className="p-5 text-right text-blue-600 font-mono font-medium">
                                        {row.transfersIn > 0 ? `+${row.transfersIn}` : '-'}
                                    </td>
                                    <td className="p-5 text-right text-orange-600 font-mono font-medium">
                                        {row.transfersOut > 0 ? `-${row.transfersOut}` : '-'}
                                    </td>
                                    <td className="p-5 text-right text-red-600 font-mono font-medium">
                                        {row.expended > 0 ? `-${row.expended}` : '-'}
                                    </td>
                                    <td className="p-5 text-right font-mono font-bold">
                                        <span className={row.netMovement >= 0 ? 'text-green-700' : 'text-red-700'}>
                                            {row.netMovement > 0 ? '+' : ''}{row.netMovement}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right font-bold text-slate-900 font-mono bg-slate-50/50">
                                        {row.closingBalance}
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
export default Dashboard;
