
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";

// Updated testimonials data
const testimonialsData = [
  {
    id: 1,
    text: "A CareConnect encontrou a cuidadora perfeita para minha mãe. O nível de atenção e cuidado tem sido excepcional. Não poderia recomendar mais!",
    name: "Mariana Silva",
    role: "Filha de Cliente",
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    text: "Como alguém com desafios de mobilidade, estava hesitante em ter uma cuidadora em casa. A CareConnect me apresentou uma profissional que respeita minha independência enquanto oferece o suporte necessário.",
    name: "Roberto Almeida",
    role: "Cliente",
    image: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: 3,
    text: "Trabalhar com a CareConnect tem sido maravilhoso. Eles valorizam seus cuidadores e garantem que tenhamos tudo o que precisamos para oferecer um excelente cuidado aos nossos clientes.",
    name: "Ana Rodrigues",
    role: "Cuidadora CareConnect",
    image: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 4,
    text: "A tranquilidade que vem de saber que meu avô está em mãos capazes e gentis não tem preço. A CareConnect não apenas forneceu uma cuidadora - eles se tornaram parte da nossa família.",
    name: "Carlos Santos",
    role: "Neto de Cliente",
    image: "https://i.pravatar.cc/150?img=7"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="section bg-gradient-to-b from-careconnect-blue/10 to-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-4">O Que Nossos Clientes Dizem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Não acredite apenas em nossa palavra. Ouça os clientes e famílias que experimentaram nosso cuidado.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-careconnect-blue">
                  <img 
                    src={testimonialsData[activeIndex].image} 
                    alt={testimonialsData[activeIndex].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <blockquote className="text-xl text-gray-700 text-center italic mb-6">
                "{testimonialsData[activeIndex].text}"
              </blockquote>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <div className="text-center">
                <h4 className="font-semibold text-careconnect-blue">
                  {testimonialsData[activeIndex].name}
                </h4>
                <p className="text-gray-600">
                  {testimonialsData[activeIndex].role}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                {testimonialsData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      activeIndex === index 
                        ? "bg-careconnect-blue" 
                        : "bg-gray-300"
                    }`}
                    aria-label={`Ir para depoimento ${index + 1}`}
                  />
                ))}
              </div>
            </CardFooter>
          </Card>
          
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Depoimento anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-careconnect-blue">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Próximo depoimento"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-careconnect-blue">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
