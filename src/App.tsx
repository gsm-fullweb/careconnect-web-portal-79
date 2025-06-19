
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import PreCadastro from "./pages/PreCadastro";
import CadastrarCuidador from "./pages/CadastrarCuidador";
import Obrigado from "./pages/Obrigado";
import PainelCuidador from "./pages/PainelCuidador";
import ClienteDashboard from "./pages/ClienteDashboard";
import DashboardRedirect from "./pages/DashboardRedirect";
import Assinatura from "./pages/Assinatura";

// Admin Pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import UsersManagement from "./pages/admin/UsersManagement";
import CustomersManagement from "./pages/admin/CustomersManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import BlogPostEditor from "./pages/admin/BlogPostEditor";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";
import PartnersManagement from "./pages/admin/PartnersManagement";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/plans" element={<SubscriptionPlans />} />
            <Route path="/assinatura" element={<Assinatura />} />
            <Route path="/pre-cadastro" element={<PreCadastro />} />
            <Route path="/cadastrar-cuidador" element={<CadastrarCuidador />} />
            <Route path="/obrigado" element={<Obrigado />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/painel-cuidador" element={
              <ProtectedRoute>
                <PainelCuidador />
              </ProtectedRoute>
            } />
            <Route path="/cliente-dashboard" element={
              <ProtectedRoute>
                <ClienteDashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="" element={<Dashboard />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="customers" element={<CustomersManagement />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="blog/edit/:id" element={<BlogPostEditor />} />
              <Route path="testimonials" element={<TestimonialsManagement />} />
              <Route path="partners" element={<PartnersManagement />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
