
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }

      if (data.session) {
        // Store the session token
        localStorage.setItem("admin-token", data.session.access_token);
        
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para sua dashboard...",
        });
        
        // Redirect to dashboard redirect page that will determine the correct dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Falha no login",
        description: error.message || "Email ou senha inválidos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-careconnect-blue">
            Care<span className="text-careconnect-green">Connect</span>
            <span className="block text-lg text-gray-600 mt-1">Sistema de Login</span>
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
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
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Faça login com suas credenciais.</p>
            <p className="mt-2">
              <strong>Admin:</strong> admin@careconnect.com<br />
              <strong>Cuidador:</strong> Use o email cadastrado no sistema<br />
              <strong>Cliente:</strong> Qualquer outro email válido
            </p>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-careconnect-blue hover:underline">
            &larr; Voltar ao Site
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
