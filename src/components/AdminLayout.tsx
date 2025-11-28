import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

export function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/login");
    }
  }, [navigate]);

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