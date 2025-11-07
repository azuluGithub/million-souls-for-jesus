import { Home, Users, Calendar, History, LogOut, UserCog } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Members", url: "/members", icon: Users },
  { title: "Daily Collection", url: "/daily-collection", icon: Calendar },
  { title: "History", url: "/history", icon: History },
  { title: "Admins", url: "/admins", icon: UserCog },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const { currentAdmin, logout } = useAuth();

  const handleNavClick = () => {
    if (state === "expanded" && window.innerWidth < 768) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const getInitial = () => {
    if (currentAdmin) {
      return currentAdmin.name.charAt(0).toUpperCase();
    }
    return 'A';
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="VeggieTrack" className="w-10 h-10 rounded" />
            {state === "expanded" && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">M.S.F.J</h2>
                <p className="text-xs text-sidebar-foreground/80">Food Rescure Project</p>
              </div>
            )}
          </div>
          
          {currentAdmin && state === "expanded" && (
            <div className="flex items-center gap-3 p-2 rounded-md bg-sidebar-accent/50">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold">
                {getInitial()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {currentAdmin.name} {currentAdmin.surname}
                </p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{currentAdmin.role}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mx-4 h-[2px] bg-accent" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1">
              <ThemeToggle />
              {state === "expanded" && (
                <span className="text-sm text-sidebar-foreground/70">Theme</span>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
