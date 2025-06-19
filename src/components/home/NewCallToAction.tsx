
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, ArrowRight } from "lucide-react";

const NewCallToAction = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5511999999999";
    const message = "Olá Mila! Estou pronto para começar a buscar um cuidador.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="section bg-gradient-to-br from-careconnect-blue via-purple-600 to-careconnect-blue text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="container-custom text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Encontre o cuidador ideal hoje mesmo. A Mila está esperando para ajudar você 
            a criar a melhor experiência de cuidado para sua família.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-careconnect-green hover:bg-careconnect-green/90 text-white group text-lg px-8 py-4 h-auto"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-3 h-6 w-6 transition-transform group-hover:rotate-12" />
              Buscar Cuidadores
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 h-auto"
            >
              <a href="/cadastrar-cuidador" className="flex items-center">
                <Users className="mr-3 h-6 w-6" />
                Seja um Cuidador
              </a>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">&lt; 2 min</div>
              <div className="text-white/90">Para encontrar cuidadores</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">24h</div>
              <div className="text-white/90">Disponibilidade da Mila</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-white/90">Cuidadores verificados</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="hidden lg:block absolute -bottom-10 right-10 w-32 h-32 bg-careconnect-green rounded-full opacity-20"></div>
      <div className="hidden lg:block absolute top-20 left-10 w-16 h-16 bg-careconnect-green rounded-full opacity-30"></div>
    </section>
  );
};

export default NewCallToAction;
