import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#0f172a_100%)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="absolute w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -top-20 -left-20 animate-pulse"></div>
            <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[80px] bottom-0 right-0"></div>

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-10">

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40 mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                            <ShieldCheck size={36} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-slate-400">Access the Mission Command Center</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm flex items-center gap-2">
                                <span className="block w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                    placeholder="user@mams.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Sign In
                            <ChevronRight size={18} />
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900/50 px-2 text-slate-500 backdrop-blur-sm rounded">Demo Access</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-xs text-slate-400 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between">
                                <span>Admin</span>
                                <span className="font-mono text-slate-300">admin@mams.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Commander</span>
                                <span className="font-mono text-slate-300">cmdr_alpha@mams.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Logistics</span>
                                <span className="font-mono text-slate-300">logistics@mams.com</span>
                            </div>
                            <div className="pt-2 text-center text-slate-500 border-t border-slate-700/50 mt-1">
                                Password: <span className="font-mono text-slate-300">password123</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
