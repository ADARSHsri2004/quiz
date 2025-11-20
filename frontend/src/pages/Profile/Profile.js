import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <div className="px-4 py-2 bg-gray-50 rounded border">{user?.name || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <div className="px-4 py-2 bg-gray-50 rounded border">{user?.email || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <div className="px-4 py-2 bg-gray-50 rounded border capitalize">{user?.role || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

