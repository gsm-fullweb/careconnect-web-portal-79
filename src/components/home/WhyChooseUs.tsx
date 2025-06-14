
const reasons = [
  {
    title: "Profissionais Capacitados",
    description: "Todos os cuidadores passam por rigoroso processo de seleção, verificação e treinamento contínuo.",
    emoji: "🎓",
  },
  {
    title: "Atendimento Humanizado",
    description: "Valorizamos o respeito, a empatia e a individualidade de cada família.",
    emoji: "❤️",
  },
  {
    title: "Cuidado Personalizado",
    description: "Soluções sob medida para cada situação, desde acompanhamento domiciliar até suporte 24h.",
    emoji: "🛟",
  },
  {
    title: "Suporte Ágil",
    description: "Nossa equipe está sempre disponível para ajudar no que for preciso, a qualquer momento.",
    emoji: "💬",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section bg-careconnect-blue/90">
      <div className="container-custom text-center text-white">
        <h2 className="mb-6 text-white">Por que escolher a CareConnect?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {reasons.map((reason, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-6 shadow text-white animate-fade-in hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">{reason.emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-white/90 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
