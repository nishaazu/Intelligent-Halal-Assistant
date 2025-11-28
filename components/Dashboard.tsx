import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { OutletStats, User } from '../types';
import { AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface DashboardProps {
  outlets: OutletStats[];
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ outlets, user }) => {
  
  // Filter data based on user role
  const visibleOutlets = user.role === 'HALAL_EXECUTIVE' && user.outletId
    ? outlets.filter(o => o.id === user.outletId)
    : outlets;

  // Colors for charts
  const getBarColor = (score: number) => {
    if (score < 70) return '#ef4444'; // red-500
    if (score < 85) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  const pieData = [
    { name: 'Critical NCRs', value: visibleOutlets.reduce((acc, curr) => acc + curr.ncrs, 0), fill: '#ef4444' },
    { name: 'Expiring Items', value: visibleOutlets.reduce((acc, curr) => acc + curr.expiringItems, 0), fill: '#eab308' },
    { name: 'Compliant Items', value: 120, fill: '#22c55e' }, // Mock constant for visual balance
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {user.role === 'HALAL_EXECUTIVE' ? `${user.outletName} Dashboard` : 'Chain-Wide Audit Dashboard'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Real-time Halal compliance monitoring</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                Date: {new Date().toLocaleDateString('en-MY')}
            </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium">Avg Readiness</p>
                <p className="text-2xl font-bold text-gray-800">
                    {Math.round(visibleOutlets.reduce((acc, o) => acc + o.readinessScore, 0) / visibleOutlets.length)}%
                </p>
            </div>
            <div className="p-3 bg-hsm-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-hsm-600" />
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium">Pending Renewals</p>
                <p className="text-2xl font-bold text-yellow-600">
                    {visibleOutlets.reduce((acc, o) => acc + o.expiringItems, 0)}
                </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
                <FileText className="w-6 h-6 text-yellow-600" />
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium">Open NCRs</p>
                <p className="text-2xl font-bold text-red-600">
                    {visibleOutlets.reduce((acc, o) => acc + o.ncrs, 0)}
                </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Readiness Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-[300px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Readiness Score by Outlet</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visibleOutlets} layout={visibleOutlets.length === 1 ? 'horizontal' : 'horizontal'}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="readinessScore" radius={[4, 4, 0, 0]}>
                {visibleOutlets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.readinessScore)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Issues Pie Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-[300px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Compliance Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-[-20px]">
            {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                    <span className="text-xs text-gray-600">{entry.name}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
