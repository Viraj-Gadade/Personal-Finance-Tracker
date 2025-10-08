import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

// Assuming these are your page/component imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Balance from "./pages/Balance";
import Transactions from "./pages/Transations";
import Bills from "./pages/Bills";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import { setOpenSidebar } from "./redux/authSlice";
import { useAuth } from "./context/AuthContext";

import './index.css';
import Footer from "./components/Footer";
import Header from "./components/Header";


const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- APPLICATION LOGIC (UNCHANGED) ---

function Layout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* --- Desktop Sidebar --- */}
      <Sidebar className={clsx("hidden md:flex h-full")} />

      {/* --- Mobile Sidebar --- */}
      <MobileSidebar />

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-4 2xl:px-10">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      {/* Background Overlay Transition */}
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition-opacity ease-in-out duration-500'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity ease-in-out duration-500'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <div
          className='md:hidden fixed inset-0 bg-black/40 z-40'
          onClick={closeSidebar}
        />
      </Transition>

      {/* Sidebar Panel Transition */}
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition ease-in-out duration-500 transform'
        enterFrom='-translate-x-full'
        enterTo='translate-x-0'
        leave='transition ease-in-out duration-500 transform'
        leaveFrom='translate-x-0'
        leaveTo='-translate-x-full'
      >
        <div
          ref={mobileMenuRef}
          className='md:hidden bg-white w-3/4 h-full fixed top-0 left-0 z-50'
        >
          <div className='w-full flex justify-end px-5 mt-5'>
            <button
              onClick={closeSidebar}
              className='flex justify-end items-end'
            >
              <CloseIcon />
            </button>
          </div>
          <div className='-mt-10'>
            <Sidebar />
          </div>
        </div>
      </Transition>
    </>
  );
};


const App = () => (
  <main className='w-full min-h-screen bg-[#f3f4f6]'>
    <Routes>
      {/* === Public Routes === */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* === Protected Routes === */}
      {/* The Layout component now handles the auth check for all its children */}
      <Route element={<Layout />}>
        {/* The redundant ProtectedRoute wrapper is removed */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/settings" element={<Settings />} />

        {/* Redirects for root and unmatched routes for logged-in users */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  </main>
);

export default App;