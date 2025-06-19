
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Stethoscope, Plus } from "lucide-react";

const serviceCategories = [
  {
    title: "Cuidados Básicos",
    icon: Heart,
    color: "bg-blue-500",
    services: ["Higiene pessoal", "Auxílio na alimentação", "Companhia e conversação", "Passeios acompanhados"]
  },
  {
    title: "Cuidados Específicos",
    icon: Stethoscope,
    color: "bg-careconnect-green",
    services: ["Administração de medicamentos", "Estímulo cognitivo", "Curativos simples", "Acompanhamento médico"]
  },
  {
    title: "Serviços Extras",
    icon: Plus,
    color: "bg-purple-500",
    services: ["Cuidados pós-hospitalares", "Suporte para Alzheimer", "Cuidados paliativos", "Fisioterapia domiciliar"]
  }
];

const NewServices = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5511999999999";
    const message = "Olá Mila! Gostaria de saber mais sobre os serviços de cuidado.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="section bg-careconnect-light">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-6 text-careconnect-blue">Serviços Personalizados</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma ampla gama de serviços de cuidado, desde assistência básica 
            até cuidados especializados, todos adaptados às suas necessidades.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {serviceCategories.map((category, index) => (
            <Card key={index} className="card-hover border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-careconnect-blue text-xl">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="flex items-start">
                      <span className="w-2 h-2 bg-careconnect-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-600 text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-careconnect-blue to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Precisa de um cuidado específico?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            A Mila pode ajudar você a encontrar cuidadores especializados em suas necessidades específicas. 
            Conte para ela exatamente o que você precisa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-careconnect-blue hover:bg-white/90"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Encontrar Cuidadores
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
            >
              <a href="/services">Ver Todos os Serviços</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewServices;
