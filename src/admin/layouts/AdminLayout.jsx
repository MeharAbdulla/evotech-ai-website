import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30">

      <Sidebar />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}