
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, Home, Users, FileText, MessageSquare, User, LogOut, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get current user info
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    
    getUserInfo();
  }, []);

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("admin-token");
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard.",
      });
      
      navigate("/admin/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-careconnect-dark"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
            <Link to="/admin" className="flex items-center">
              <span className="text-xl font-semibold text-careconnect-blue">
                Care<span className="text-careconnect-green">Connect</span>
              </span>
              <span className="ml-2 text-sm text-gray-500">Admin</span>
            </Link>
          </div>
          
          {/* Sidebar Navigation */}
          <nav className="flex-grow py-6 px-4 space-y-1">
            <Link
              to="/admin"
              className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                isActiveRoute("/admin")
                  ? "bg-careconnect-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <Home size={20} className="mr-3" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/admin/users"
              className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                isActiveRoute("/admin/users")
                  ? "bg-careconnect-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <Users size={20} className="mr-3" />
              <span>Users</span>
            </Link>
            
            <Link
              to="/admin/customers"
              className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                isActiveRoute("/admin/customers")
                  ? "bg-careconnect-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <UserCheck size={20} className="mr-3" />
              <span>Clientes</span>
            </Link>
            
            <Link
              to="/admin/content"
              className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                isActiveRoute("/admin/content")
                  ? "bg-careconnect-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <FileText size={20} className="mr-3" />
              <span>Content</span>
            </Link>
            
            <Link
              to="/admin/blog"
              className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                isActiveRoute("/admin/blog")
                  ? "bg-careconnect-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <FileText size={20} className="mr-3" />
              <span>Blog Posts</span>
            </Link>
            
            <Link
              to="/admin/testimonials"
              className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                isActiveRoute("/admin/testimonials")
                  ? "bg-careconnect-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <MessageSquare size={20} className="mr-3" />
              <span>Testimonials</span>
            </Link>
            
            <Link
              to="/admin/partners"
              className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                isActiveRoute("/admin/partners")
                  ? "bg-careconnect-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <Users size={20} className="mr-3" />
              <span>Partners</span>
            </Link>
          </nav>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Admin User</p>
                <p className="text-sm text-gray-500">{userEmail || "admin@careconnect.com"}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
      
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
