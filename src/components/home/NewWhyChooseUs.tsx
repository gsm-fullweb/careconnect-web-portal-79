
import { Shield, GraduationCap, Clock, Bot } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Segurança Garantida",
    description: "Todos os cuidadores passam por verificação completa de antecedentes criminais e referências.",
    color: "bg-blue-500"
  },
  {
    icon: GraduationCap,
    title: "Profissionais Qualificados",
    description: "Cuidadores certificados com experiência comprovada e treinamento contínuo.",
    color: "bg-careconnect-green"
  },
  {
    icon: Clock,
    title: "Disponibilidade 24/7",
    description: "Suporte e cuidadores disponíveis a qualquer hora, todos os dias da semana.",
    color: "bg-purple-500"
  },
  {
    icon: Bot,
    title: "IA Mila Personalizada",
    description: "Nossa inteligência artificial aprende suas preferências para matches perfeitos.",
    color: "bg-careconnect-blue"
  }
];

const NewWhyChooseUs = () => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="mb-6 text-careconnect-blue">
            Por que escolher a CareConnect?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos pioneiros em conectar famílias a cuidadores através de tecnologia inteligente e humanizada.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-careconnect-blue mb-4">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-careconnect-light to-purple-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-careconnect-blue mb-4">
                Tecnologia que humaniza o cuidado
              </h3>
              <p className="text-gray-600 mb-6">
                Combinamos inteligência artificial com o toque humano para criar conexões autênticas 
                entre cuidadores e famílias. A Mila não substitui o relacionamento pessoal, ela o facilita.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-careconnect-green rounded-full mr-3"></span>
                  Análise de compatibilidade personalizada
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-careconnect-green rounded-full mr-3"></span>
                  Acompanhamento contínuo da satisfação
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-careconnect-green rounded-full mr-3"></span>
                  Suporte humano sempre disponível
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-careconnect-blue to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-careconnect-green rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              </div>
              <p className="mt-4 font-semibold text-careconnect-blue">Mila IA</p>
              <p className="text-sm text-gray-600">Sua assistente virtual especializada</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewWhyChooseUs;
