
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Cuidado Domiciliar",
    description: "Assistência profissional para idosos, pessoas com deficiência e pós-operatório no conforto do lar.",
    icon: "🏠",
  },
  {
    title: "Cuidados Especializados",
    description: "Profissionais treinados para condições como Alzheimer, Parkinson, AVC e outras necessidades específicas.",
    icon: "⚕️",
  },
  {
    title: "Acompanhamento Hospitalar",
    description: "Cuidadores que acompanham pacientes durante internação, garantindo conforto e suporte emocional.",
    icon: "🏥",
  },
  {
    title: "Assistência 24 Horas",
    description: "Atendimento contínuo para pessoas que precisam de monitoramento e cuidados em período integral.",
    icon: "🕒",
  }
];

const Services = () => {
  return (
    <section className="section bg-careconnect-light">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">Nossos Serviços</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma ampla gama de serviços adaptados às necessidades individuais de cada pessoa.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="card-hover border-t-4 border-t-careconnect-blue">
              <CardHeader>
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle className="text-careconnect-blue">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full border-careconnect-blue text-careconnect-blue hover:bg-careconnect-blue/5">
                  <Link to="/services">Saiba Mais</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-careconnect-blue hover:bg-careconnect-blue/90">
            <Link to="/services">Ver Todos os Serviços</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
