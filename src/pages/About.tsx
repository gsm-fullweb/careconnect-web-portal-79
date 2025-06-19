
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Award, Heart, CheckCircle, Lock, Zap, MessageCircle } from "lucide-react";

const About = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5511999999999";
    const message = "Olá! Gostaria de conhecer mais sobre a CareConnect.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const values = [
    {
      icon: <Shield className="h-12 w-12 text-careconnect-blue mb-4" />,
      title: "Segurança",
      description: "Priorizamos a segurança e o bem-estar dos idosos e de suas famílias. Todos os nossos cuidadores passam por uma rigorosa verificação de antecedentes.",
    },
    {
      icon: <Clock className="h-12 w-12 text-careconnect-blue mb-4" />,
      title: "Disponibilidade",
      description: "Entendemos que o cuidado não tem hora marcada. Por isso, estamos disponíveis 24 horas por dia, 7 dias por semana para atender às necessidades dos nossos clientes.",
    },
    {
      icon: <Award className="h-12 w-12 text-careconnect-blue mb-4" />,
      title: "Qualidade",
      description: "Comprometemo-nos com a excelência em todos os serviços prestados, garantindo que cada cuidador tenha a qualificação necessária para oferecer o melhor atendimento.",
    },
    {
      icon: <Heart className="h-12 w-12 text-careconnect-blue mb-4" />,
      title: "Empatia",
      description: "Tratamos cada idoso com o carinho, respeito e dignidade que merecem, compreendendo suas necessidades individuais e oferecendo um atendimento humanizado.",
    },
  ];

  const teamMembers = [
    {
      image: "https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//member-1.jpg",
      name: "Kleber de Oliveira",
      title: "Diretor Geral",
      description: "Kleber de Oliveira é Diretor Geral e idealizador do projeto, que nasceu a partir de sua própria dificuldade em encontrar cuidadores de idosos qualificados. Com ampla experiência empresarial, ele une visão estratégica, foco na humanização do atendimento e uso da tecnologia para criar soluções eficazes e empáticas no cuidado com a pessoa idosa.",
    },
    {
      image: "https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//member-2.jpg",
      name: "Richard Portela",
      title: "Desenvolvedor",
      description: "Richard Portela é o desenvolvedor responsável por dar vida à plataforma CareConnect, com foco na implementação da assistente virtual IA Mila, que torna o agendamento de cuidadores mais rápido e inteligente. Combinando tecnologia e empatia para criar soluções modernas, funcionais e acessíveis, sendo peça-chave na transformação digital do cuidado com idosos.",
    },
    {
      image: "https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//member-3.jpg",
      name: "Silas Cilva",
      title: "Social Media Manager",
      description: "Silas Cilva é especialista em redes sociais, responsável pelo planejamento, gerenciamento e desempenho das plataformas digitais da empresa. Com experiência também em desenvolvimento web e criação de interfaces modernas e responsivas, destaca-se por desenvolver soluções eficientes, criativas e centradas na experiência do usuário.",
    },
  ];

  const features = [
    {
      icon: <CheckCircle className="h-10 w-10 text-careconnect-green mb-3" />,
      title: "Recomendações Personalizadas",
      description: "Entendemos as necessidades específicas do seu familiar e sugerimos os cuidadores mais adequados com base em experiência e especialidades.",
    },
    {
      icon: <Lock className="h-10 w-10 text-careconnect-green mb-3" />,
      title: "Contratação Segura",
      description: "Confirme agendamentos, verifique disponibilidade e finalize a contratação de forma segura diretamente pela plataforma.",
    },
    {
      icon: <Zap className="h-10 w-10 text-careconnect-green mb-3" />,
      title: "Resposta Rápida",
      description: "Receba respostas rápidas para suas dúvidas sobre cuidadores, serviços e agendamentos sem tempo de espera.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-careconnect-blue to-purple-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in">
                Sobre a <span className="text-careconnect-green">CareConnect</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed animate-fade-in">
                A CareConnect foi fundada no final de 2024 a partir da experiência pessoal de Kleber de Oliveira, que enfrentou desafios para encontrar cuidadores qualificados e confiáveis para um familiar idoso.
              </p>
              <p className="text-lg text-white/80 leading-relaxed animate-fade-in">
                Nossa missão é transformar a forma como o cuidado é acessado, garantindo que cada idoso receba atenção adequada com dignidade, conforto e qualidade de vida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in">
                <Button
                  size="lg"
                  className="bg-careconnect-green hover:bg-careconnect-green/90 text-white group"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                  Falar com a Mila
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <a href="/cadastrar-cuidador">Seja um Cuidador</a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end animate-fade-in">
              <div className="relative">
                <img
                  src="https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//about-image.png"
                  alt="Equipe CareConnect"
                  className="rounded-2xl shadow-2xl w-full max-w-md"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-careconnect-green rounded-lg hidden md:block opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="hidden lg:block absolute -bottom-10 right-10 w-32 h-32 bg-careconnect-green rounded-full opacity-20"></div>
        <div className="hidden lg:block absolute top-20 left-10 w-16 h-16 bg-careconnect-green rounded-full opacity-30"></div>
      </section>

      {/* Nossa História */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-careconnect-blue">Nossa História</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça como começamos e porque estamos comprometidos com o cuidado de qualidade
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-careconnect-blue">Como tudo começou</h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  A CareConnect nasceu da necessidade real enfrentada por nosso fundador, que percebeu a dificuldade das famílias em encontrar cuidadores confiáveis e qualificados para seus entes queridos.
                </p>
                <p>
                  A partir desta experiência, criamos uma plataforma que revolucionou o mercado de cuidados para idosos, implementando tecnologias avançadas para garantir uma experiência simples, segura e humanizada.
                </p>
                <p>
                  Hoje, conectamos famílias a cuidadores experientes em todo o Brasil, sempre com o compromisso de oferecer o melhor cuidado possível, com a conveniência da tecnologia e o calor humano que cada idoso merece.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src="https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//history-image.jpg"
                  alt="História da CareConnect"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-careconnect-green rounded-lg hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="section bg-careconnect-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-careconnect-blue">Nossos Valores</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os princípios que norteiam nosso trabalho e garantem a qualidade do nosso serviço
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-careconnect-blue mb-4 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossos Recursos */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-careconnect-blue">Nossos Recursos</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologia avançada para simplificar a busca por cuidadores qualificados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-xl text-careconnect-blue mb-4 text-center">{feature.title}</h4>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="section bg-careconnect-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-careconnect-blue">Nossa Equipe</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça os profissionais dedicados que fazem parte da CareConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-6">
                  <img
                    src={member.image}
                    alt={`Membro da equipe ${member.name}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-careconnect-blue"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-careconnect-blue mb-2">{member.name}</h3>
                  <p className="text-careconnect-green font-medium mb-4">{member.title}</p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-careconnect-blue via-purple-600 to-careconnect-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="container-custom text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experimente o futuro do cuidado para idosos
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Comece agora mesmo encontrando cuidadores qualificados ou junte-se à nossa equipe de profissionais.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-careconnect-green hover:bg-careconnect-green/90 text-white"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Buscar Cuidadores
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <a href="/cadastrar-cuidador">Cadastrar como Cuidador</a>
            </Button>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="hidden lg:block absolute -bottom-10 right-10 w-32 h-32 bg-careconnect-green rounded-full opacity-20"></div>
        <div className="hidden lg:block absolute top-20 left-10 w-16 h-16 bg-careconnect-green rounded-full opacity-30"></div>
      </section>
    </Layout>
  );
};

export default About;
