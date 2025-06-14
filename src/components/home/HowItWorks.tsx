
const steps = [
  {
    title: "1. Cadastro Rápido",
    description: "Preencha o formulário online ou entre em contato para nos contar suas necessidades.",
  },
  {
    title: "2. Seleção Personalizada",
    description: "Combinamos você com um cuidador qualificado alinhado ao seu perfil e preferências.",
  },
  {
    title: "3. Início do Cuidado",
    description: "Agende o início dos serviços e conte com nosso suporte durante toda a jornada.",
  },
];

const HowItWorks = () => {
  return (
    <section className="section bg-careconnect-light">
      <div className="container-custom text-center">
        <h2 className="mb-6 text-careconnect-blue">Como Funciona</h2>
        <div className="flex flex-col md:flex-row md:justify-center gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6 flex-1 max-w-xs mx-auto animate-fade-in hover:scale-105 transition-transform">
              <span className="inline-block bg-careconnect-blue/10 text-careconnect-blue font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center mb-4">{index + 1}</span>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
