import { LayoutDashboard, BookOpen, ClipboardList, GraduationCap, LogOut, UserPlus } from "lucide-react";
import { NavLink } from "./NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { Button } from "./ui/button";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Modules", url: "/modules", icon: BookOpen },
  { title: "Module Assignments", url: "/assignments", icon: ClipboardList },
  { title: "Enrollments", url: "/enrollments", icon: GraduationCap },
  { title: "Register Tutor", url: "/tutors/register", icon: UserPlus }, // New Menu Item
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    // Clear session storage to log the user out
    sessionStorage.removeItem("isAuthenticated");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className="px-4 py-6">
          <h1 className={`font-display font-bold text-sidebar-foreground transition-all ${collapsed ? "text-lg" : "text-2xl"}`}>
            {collapsed ? "L" : "LMS"}
          </h1>
          {!collapsed && <p className="text-xs text-sidebar-foreground/70 mt-1">Admin Portal</p>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs font-semibold tracking-wider">
            {collapsed ? "—" : "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border flex flex-col gap-2">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-semibold">
              A
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">Institution Admin</p>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            className={`w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 ${collapsed ? "px-0 justify-center" : ""}`}
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}