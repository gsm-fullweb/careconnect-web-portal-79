
import { MessageCircle, UserCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: MessageCircle,
    title: "1. Envie uma mensagem para a Mila",
    description: "Nossa IA via WhatsApp entende suas necessidades e preferências de cuidado.",
    highlight: "Sem formulários longos!"
  },
  {
    icon: UserCheck,
    title: "2. Receba perfis personalizados",
    description: "A Mila seleciona cuidadores qualificados que combinam com seu perfil.",
    highlight: "Busca inteligente"
  },
  {
    icon: Calendar,
    title: "3. Agende direto com o cuidador",
    description: "Conecte-se diretamente e agende o serviço de forma simples e rápida.",
    highlight: "Cancelamento fácil"
  }
];

const NewHowItWorks = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5511999999999";
    const message = "Olá Mila! Gostaria de encontrar um cuidador.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="section bg-gradient-to-b from-careconnect-light to-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-6 text-careconnect-blue">
            Como funciona a busca de cuidador com a Mila?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa inteligência artificial revoluciona a forma de encontrar cuidadores. 
            Simples, rápido e personalizado.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-careconnect-blue to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-careconnect-blue mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {step.description}
                </p>
                
                <span className="inline-block bg-careconnect-green/10 text-careconnect-green px-3 py-1 rounded-full text-sm font-medium">
                  {step.highlight}
                </span>
              </div>
              
              {/* Conectores entre os passos */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 transform -translate-y-1/2">
                  <div className="w-full h-0.5 bg-careconnect-blue/30 relative">
                    <div className="absolute -right-2 -top-1 w-3 h-3 bg-careconnect-blue/30 rotate-45 transform"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-gradient-to-r from-careconnect-blue to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Diferenciais que fazem a diferença
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-2">✨ Cancelamento Fácil</h4>
                <p className="text-white/90 text-sm">Cancele ou reagende quando precisar</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📋 Sem Formulários Longos</h4>
                <p className="text-white/90 text-sm">Conversação natural via WhatsApp</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📚 Histórico Organizado</h4>
                <p className="text-white/90 text-sm">Acompanhe todos os atendimentos</p>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-white text-careconnect-blue hover:bg-white/90"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Começar Agora com a Mila
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHowItWorks;
