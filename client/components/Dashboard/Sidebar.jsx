import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { LayoutDashboard, Briefcase, FileText, User, LogOut, UserCheck, Settings as SettingsIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  const NavLink = ({ to, label, Icon }) => (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        isActive(to)
          ? 'bg-white/10 text-white ring-1 ring-white/10'
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
      {isActive(to) && <span className="ml-auto h-2 w-2 rounded-full bg-primary" />}
    </Link>
  );

  const roleRoot = user?.role === 'admin'
    ? '/dashboard/admin'
    : user?.role === 'recruiter'
      ? '/dashboard/recruiter'
      : '/dashboard/candidate';

  const adminLinks = (
    <>
      <NavLink to={`${roleRoot}`} label="Overview" Icon={LayoutDashboard} />
      <NavLink to="/dashboard/admin/users" label="Manage Users" Icon={UserCheck} />
      <NavLink to="/dashboard/admin/jobs" label="Manage Jobs" Icon={Briefcase} />
    </>
  );

  const recruiterLinks = (
    <>
      <NavLink to={`${roleRoot}`} label="Overview" Icon={LayoutDashboard} />
      <NavLink to="/dashboard/recruiter/post-job" label="Post a Job" Icon={FileText} />
      <NavLink to="/dashboard/recruiter/posted-jobs" label="Posted Jobs" Icon={Briefcase} />
      <NavLink to="/dashboard/recruiter/applications" label="Applications" Icon={FileText} />
    </>
  );

  const candidateLinks = (
    <>
      <NavLink to={`${roleRoot}`} label="Overview" Icon={LayoutDashboard} />
      <NavLink to="/dashboard/candidate/applications" label="My Applications" Icon={FileText} />
      <NavLink to="/dashboard/candidate/profile" label="My Profile" Icon={User} />
      <NavLink to="/dashboard/candidate/settings" label="Settings" Icon={SettingsIcon} />
    </>
  );

  const initials = (user?.name || user?.email || 'U').slice(0, 2).toUpperCase();

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 min-h-screen flex flex-col border-r border-white/10">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">CJ</div>
          <div>
            <div className="text-sm font-semibold tracking-wide">ClickJob Dashboard</div>
            <div className="text-[11px] text-gray-300">{user?.role ? user.role.toUpperCase() : 'USER'}</div>
          </div>
        </div>
      </div>

      {/* User panel */}
      <div className="p-4">
        <div className="p-4 bg-white/5 rounded-xl ring-1 ring-white/10 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-white/10">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || user?.email} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{user?.name || user?.email}</div>
            <div className="text-[11px] text-gray-300 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-1">
        {user?.role === 'admin' && adminLinks}
        {user?.role === 'recruiter' && recruiterLinks}
        {user?.role === 'candidate' && candidateLinks}
      </nav>

      <div className="mt-auto p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/90 hover:bg-red-500 text-white transition-colors shadow-soft"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
