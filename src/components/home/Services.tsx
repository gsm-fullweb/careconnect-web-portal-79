
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Cuidado Domiciliar",
    description: "Cuidadores profissionais fornecendo assistência no conforto da sua casa.",
    icon: "🏠",
  },
  {
    title: "Cuidado Especializado",
    description: "Cuidadores treinados para condições específicas como Alzheimer, Parkinson e mais.",
    icon: "⚕️",
  },
  {
    title: "Cuidado de Alívio",
    description: "Alívio temporário para cuidadores primários descansarem e recarregarem.",
    icon: "🌿",
  },
  {
    title: "Suporte 24/7",
    description: "Cuidado e suporte 24 horas por dia para aqueles que precisam de assistência contínua.",
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
            Oferecemos uma ampla gama de serviços de cuidado para atender às suas necessidades específicas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="card-hover">
              <CardHeader>
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
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
