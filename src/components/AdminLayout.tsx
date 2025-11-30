import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

export function AdminLayout() {
  // Check authentication status from sessionStorage
  // We use sessionStorage so the user has to log in every time they open a new session
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    // Redirect to login immediately if not authenticated
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}