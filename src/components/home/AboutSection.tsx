
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6 text-careconnect-blue">Sobre a CareConnect</h2>
            <p className="text-lg text-gray-700 mb-6">
              Desde 2010, a CareConnect tem transformado a vida de famílias em todo o Brasil oferecendo serviços de cuidado de alta qualidade e personalizado.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Nossa equipe é formada por profissionais capacitados, selecionados criteriosamente e treinados continuamente para oferecer um atendimento humanizado, respeitoso e eficiente.
            </p>
            <div className="flex flex-wrap gap-8 mb-8">
              <div>
                <h3 className="text-4xl font-bold text-careconnect-blue">95%</h3>
                <p className="text-gray-600">Satisfação dos Clientes</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-careconnect-blue">+1200</h3>
                <p className="text-gray-600">Profissionais Treinados</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-careconnect-blue">+13</h3>
                <p className="text-gray-600">Anos no Mercado</p>
              </div>
            </div>
            <Button asChild className="bg-careconnect-blue hover:bg-careconnect-blue/90">
              <Link to="/about">Conheça Nossa História</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Equipe CareConnect atendendo paciente" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-careconnect-green rounded-lg hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
