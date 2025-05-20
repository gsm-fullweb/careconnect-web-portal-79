
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6">Sobre CareConnect</h2>
            <p className="text-lg text-gray-700 mb-6">
              Fundada em 2010, a CareConnect tem a missão de transformar a forma como os serviços de cuidado são prestados. Acreditamos que todos merecem cuidados compassivos adaptados às suas necessidades únicas.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Nossa rede inclui centenas de cuidadores certificados que passam por triagem rigorosa e treinamento para garantir que forneçam a mais alta qualidade de cuidado.
            </p>
            <div className="flex flex-wrap gap-8 mb-8">
              <div>
                <h3 className="text-4xl font-bold text-careconnect-blue">500+</h3>
                <p className="text-gray-600">Cuidadores Certificados</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-careconnect-blue">1000+</h3>
                <p className="text-gray-600">Clientes Satisfeitos</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-careconnect-blue">15+</h3>
                <p className="text-gray-600">Anos de Experiência</p>
              </div>
            </div>
            <Button asChild className="bg-careconnect-blue hover:bg-careconnect-blue/90">
              <Link to="/about">Saiba Mais Sobre Nós</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Membros da equipe CareConnect" 
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
