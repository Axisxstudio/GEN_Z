import { useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Tag, LogOut, Loader2, ExternalLink, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tag, end: false },
];

const AdminLayout = () => {
  const { user, canAccessAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!canAccessAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  const displayUser = user ?? { email: "demo@genz.store" };

  // Close sidebar on navigation change on mobile
  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-foreground hover:bg-secondary h-9 w-9"
            aria-label="Open Sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-display text-base font-bold tracking-tight">
            <span className="text-gradient-red">{BRAND.name}</span> Admin
          </span>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium max-w-[150px] truncate">
          {displayUser.email}
        </p>
      </header>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar - responsive sliding on mobile, fixed on desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <p className="font-display text-lg font-bold">
              <span className="text-gradient-red">{BRAND.name}</span> Admin
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 truncate max-w-[180px]">
              {displayUser.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground hover:bg-secondary h-8 w-8 rounded-full"
            aria-label="Close Sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors font-medium",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <n.icon className="h-4 w-4 shrink-0" /> {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border space-y-2 shrink-0 bg-card">
          <Button asChild variant="outline" size="sm" className="w-full justify-start h-9 rounded-lg">
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" /> View site
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 rounded-lg"
            onClick={() => {
              signOut();
              handleNavClick();
            }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-0 focus:outline-none p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
