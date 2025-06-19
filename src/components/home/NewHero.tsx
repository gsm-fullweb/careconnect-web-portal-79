
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Users } from "lucide-react";

const NewHero = () => {
  const handleWhatsAppClick = () => {
    // Número oficial da CareConnect - substitua pelo número real
    const phoneNumber = "5511999999999";
    const message = "Olá! Gostaria de encontrar um cuidador através da Mila.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="hero-section bg-gradient-to-br from-careconnect-blue to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="container-custom flex flex-col lg:flex-row items-center relative z-10 py-16 md:py-24">
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Conectando cuidado a quem precisa ser 
            <span className="text-careconnect-green block mt-2">cuidado</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-fade-in">
            Encontre cuidadores qualificados através da nossa IA Mila. 
            Busca personalizada via WhatsApp, sem formulários complicados.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button 
              size="lg" 
              className="bg-careconnect-green hover:bg-careconnect-green/90 text-white group"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              Falar com a Mila
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
            >
              <a href="/cadastrar-cuidador" className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Cadastrar como Cuidador
              </a>
            </Button>
          </div>
        </div>
        
        <div className="lg:w-1/2 lg:pl-12">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Cuidador ajudando idoso"
              className="rounded-2xl shadow-2xl w-full animate-fade-in"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-careconnect-green rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-careconnect-blue">Mila IA</p>
                  <p className="text-sm text-gray-600">Sua assistente virtual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="hidden lg:block absolute -bottom-10 right-10 w-32 h-32 bg-careconnect-green rounded-full opacity-20"></div>
      <div className="hidden lg:block absolute top-20 left-10 w-16 h-16 bg-careconnect-green rounded-full opacity-30"></div>
    </div>
  );
};

export default NewHero;
