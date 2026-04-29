import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Car, Calendar, CreditCard, TrendingUp } from 'lucide-react';
import apiClient from '../../services/apiClient';

const ShowroomDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    activeRentals: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [carsRes, bookingsRes, walletRes] = await Promise.all([
          apiClient.get('/cars/my-cars'),
          apiClient.get('/bookings/host'),
          apiClient.get('/wallet/balance'),
        ]);

        const cars = carsRes.data?.data || carsRes.data || [];
        const bookings = bookingsRes.data?.data || bookingsRes.data || [];
        const wallet = walletRes.data?.data || walletRes.data || {};

        setStats({
          totalCars: Array.isArray(cars) ? cars.length : 0,
          totalBookings: Array.isArray(bookings) ? bookings.length : 0,
          activeRentals: Array.isArray(bookings) 
            ? bookings.filter(b => b.status === 'ongoing').length 
            : 0,
          totalRevenue: wallet.balance || 0,
        });
      } catch (err) {
        console.error('Failed to fetch showroom stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Inventory', 
      value: stats.totalCars, 
      icon: <Car className="w-6 h-6" />, 
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100'
    },
    { 
      label: 'Total Rentals', 
      value: stats.totalBookings, 
      icon: <Calendar className="w-6 h-6" />, 
      color: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100'
    },
    { 
      label: 'Active Rentals', 
      value: stats.activeRentals, 
      icon: <TrendingUp className="w-6 h-6" />, 
      color: 'bg-green-50 text-green-600',
      border: 'border-green-100'
    },
    { 
      label: 'Wallet Balance', 
      value: `PKR ${stats.totalRevenue.toLocaleString()}`, 
      icon: <CreditCard className="w-6 h-6" />, 
      color: 'bg-yellow-50 text-yellow-600',
      border: 'border-yellow-100'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Showroom Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Car className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">
              Showroom Dashboard
            </p>
            <h1 className="text-2xl font-bold">
              {user.showroomName || user.fullName}
            </h1>
            <p className="text-indigo-200 text-sm mt-1">
              Manage your inventory, rentals and business wallet
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Business Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-2xl p-5 border ${card.border} shadow-sm`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/host/add-car" 
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Add to Inventory</p>
              <p className="text-sm text-gray-500">List a new vehicle</p>
            </div>
          </a>
          <a href="/dashboard/requests"
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Rental Requests</p>
              <p className="text-sm text-gray-500">Review pending rentals</p>
            </div>
          </a>
          <a href="/dashboard/wallet"
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Business Wallet</p>
              <p className="text-sm text-gray-500">View earnings & payouts</p>
            </div>
          </a>
        </div>
      </div>

    </div>
  );
};

export default ShowroomDashboard;
