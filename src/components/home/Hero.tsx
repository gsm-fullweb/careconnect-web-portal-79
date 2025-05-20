
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="hero-section bg-careconnect-blue relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="container-custom flex flex-col items-center text-center relative z-10 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
          Cuidados Personalizados <br className="hidden md:block" /> para Seu Bem-Estar
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl animate-fade-in">
          Ajudamos famílias a encontrar cuidadores qualificados que oferecem assistência personalizada e compassiva para seus entes queridos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button asChild size="lg" className="bg-white text-careconnect-blue hover:bg-white/90">
            <Link to="/services" className="flex items-center">
              Conhecer Serviços <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            <Link to="/contact">Agendar Consulta</Link>
          </Button>
        </div>
      </div>

      <div className="hidden lg:block absolute -bottom-10 right-10 w-32 h-32 bg-careconnect-green rounded-full opacity-50"></div>
      <div className="hidden lg:block absolute top-20 left-10 w-16 h-16 bg-careconnect-green rounded-full opacity-30"></div>
    </div>
  );
};

export default Hero;
