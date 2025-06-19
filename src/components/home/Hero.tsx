
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-primary/5 py-16 md:py-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Conectando cuidado a quem precisa ser cuidado
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Conectamos famílias a cuidadores experientes, garantindo segurança, praticidade e confiança. Encontre o profissional ideal de forma simples e tenha tranquilidade no cuidado com seus entes queridos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#6B46C1] hover:bg-[#5A3A9F] text-white text-base"
              >
                <a href="https://careconnect.com.br/plans" target="_self" rel="noopener noreferrer">Encontre um Cuidador</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#6B46C1] text-[#6B46C1] hover:bg-[#6B46C1]/10 text-base"
              >
                <a href="https://careconnect.com.br/pre-cadastro" target="_self" rel="noopener noreferrer">Cadastrar como Cuidador</a>
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-full overflow-hidden">
              <img
                src="https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//hero-image.jpg"
                alt="Cuidador e pessoa idosa juntos"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
