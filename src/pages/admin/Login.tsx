
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already logged in
  const isAuthenticated = localStorage.getItem("admin-token");
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication - in a real app, this would call an API
    // For demo purposes, allow login with any email and "admin123" as password
    setTimeout(() => {
      if (password === "admin123") {
        // Set a token in localStorage to simulate authentication
        localStorage.setItem("admin-token", "demo-token-123");
        
        toast({
          title: "Login successful",
          description: "Welcome to the CareConnect admin dashboard",
        });
        
        navigate("/admin");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Hint: Use any email and 'admin123' as password.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-careconnect-blue">
            Care<span className="text-careconnect-green">Connect</span>
            <span className="block text-lg text-gray-600 mt-1">Admin Dashboard</span>
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@careconnect.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          
          <div>
            <Button 
              type="submit" 
              className="w-full bg-careconnect-blue hover:bg-careconnect-blue/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>For demo purposes, use any email and "admin123" as password.</p>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-careconnect-blue hover:underline">
            &larr; Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
