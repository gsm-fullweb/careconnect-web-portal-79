
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="section bg-careconnect-blue text-white">
      <div className="container-custom text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">Pronto para Começar?</h2>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Entre em contato hoje para encontrar o cuidador perfeito para você ou seu ente querido.
          Nossa equipe está pronta para responder a quaisquer perguntas que você possa ter.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-careconnect-blue hover:bg-white/90">
            <Link to="/contact">Contate-nos Agora</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            <Link to="/services">Explorar Serviços</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
