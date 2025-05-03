import React from 'react';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout; 