
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ArrowRight, CheckCircle, Users, Clock, Shield } from "lucide-react";
import {
  Heart,
  Activity,
  Thermometer,
  ShieldPlus,
  Pill,
  Utensils,
  BedDouble,
  Bath,
  BookOpen
} from "lucide-react";

const Services = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5511999999999";
    const message = "Olá Mila! Gostaria de conhecer os serviços de cuidadores da CareConnect.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const categories = [
    {
      title: "Cuidados Básicos",
      icon: <Heart className="w-16 h-16 text-careconnect-blue mb-4" />,
      description: "Serviços essenciais de assistência diária para garantir conforto e bem-estar",
      services: [
        {
          icon: <Bath className="w-8 h-8 text-careconnect-blue" />,
          name: "Higiene Pessoal",
          description: "Auxílio no banho, higiene bucal, troca de roupas e fraldas"
        },
        {
          icon: <Utensils className="w-8 h-8 text-careconnect-blue" />,
          name: "Alimentação",
          description: "Preparo de refeições adequadas à dieta e auxílio na alimentação"
        },
        {
          icon: <BedDouble className="w-8 h-8 text-careconnect-blue" />,
          name: "Locomoção e Transferência",
          description: "Auxílio para levantar da cama, sentar, caminhar e realizar atividades"
        },
        {
          icon: <Clock className="w-8 h-8 text-careconnect-blue" />,
          name: "Companhia",
          description: "Presença para conversar, entreter e fornecer apoio emocional"
        }
      ]
    },
    {
      title: "Cuidados Específicos",
      icon: <Activity className="w-16 h-16 text-careconnect-blue mb-4" />,
      description: "Cuidados especializados para necessidades específicas de saúde",
      services: [
        {
          icon: <Thermometer className="w-8 h-8 text-careconnect-blue" />,
          name: "Monitoramento de Sinais Vitais",
          description: "Acompanhamento de pressão, temperatura e batimentos cardíacos"
        },
        {
          icon: <Pill className="w-8 h-8 text-careconnect-blue" />,
          name: "Administração de Medicamentos",
          description: "Controle da medicação conforme prescrição médica"
        },
        {
          icon: <ShieldPlus className="w-8 h-8 text-careconnect-blue" />,
          name: "Cuidados com Feridas",
          description: "Limpeza e curativos em feridas sob orientação médica"
        },
        {
          icon: <BookOpen className="w-8 h-8 text-careconnect-blue" />,
          name: "Estímulo Cognitivo",
          description: "Atividades para manter e estimular as capacidades mentais"
        }
      ]
    }
  ];

  const additionalServices = [
    {
      title: "Acompanhamento em Consultas",
      description: "Transporte e acompanhamento em consultas médicas, exames e terapias"
    },
    {
      title: "Atendimento Pós-Hospitalar",
      description: "Cuidados especiais para pacientes em recuperação após internação"
    },
    {
      title: "Cuidados a Pacientes com Alzheimer",
      description: "Atendimento especializado para pessoas com Alzheimer e outras demências"
    },
    {
      title: "Cuidados Paliativos",
      description: "Suporte para proporcionar conforto e dignidade em cuidados paliativos"
    },
    {
      title: "Cuidado Noturno",
      description: "Acompanhamento durante a noite para garantir segurança e atendimento imediato"
    },
    {
      title: "Fisioterapia Domiciliar",
      description: "Sessões de fisioterapia realizadas no conforto da casa do paciente"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-careconnect-blue to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-careconnect-green/20 backdrop-blur rounded-full text-careconnect-green font-medium animate-fade-in">
                Nossos Serviços
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in">
                Cuidado <span className="text-careconnect-green">Personalizado</span> 
                <br />para Cada Necessidade
              </h1>
              <p className="text-xl text-white/90 leading-relaxed animate-fade-in">
                Oferecemos uma ampla gama de serviços de cuidados personalizados para atender às necessidades específicas de cada idoso, garantindo conforto, dignidade e qualidade de vida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in">
                <Button
                  size="lg"
                  className="bg-careconnect-green hover:bg-careconnect-green/90 text-white group"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                  Falar com a Mila
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <a href="/plans">Ver Planos</a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end animate-fade-in">
              <div className="relative">
                <img
                  src="https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//services-main.png"
                  alt="Cuidador auxiliando idoso"
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

      {/* Categorias de Serviços */}
      {categories.map((category, index) => (
        <section key={index} className={`section ${index % 2 ? "bg-white" : "bg-careconnect-light"}`}>
          <div className="container-custom">
            <div className="text-center mb-16">
              <div className="flex justify-center animate-fade-in">{category.icon}</div>
              <h2 className="mb-6 text-careconnect-blue animate-fade-in">{category.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {category.services.map((service, serviceIndex) => (
                <Card key={serviceIndex} className="card-hover p-8 border-l-4 border-l-careconnect-blue">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-careconnect-blue/10 rounded-xl">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-3 text-careconnect-blue">{service.name}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Serviços Adicionais */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-careconnect-blue">Serviços Adicionais</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Além dos cuidados básicos e específicos, oferecemos uma variedade de serviços complementares para atender a todas as necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="card-hover border-t-4 border-t-careconnect-green">
                <CardHeader>
                  <CardTitle className="text-careconnect-blue">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="section bg-careconnect-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-careconnect-blue">Como Funciona com a Mila</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contratar um cuidador através da CareConnect é simples e rápido com nossa IA Mila
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: 1,
                title: "Converse com a Mila",
                description: "Envie uma mensagem no WhatsApp para nossa IA e conte sobre as necessidades do seu familiar",
                icon: <MessageCircle className="h-8 w-8 text-white" />
              },
              {
                step: 2,
                title: "Receba Recomendações",
                description: "A Mila analisará suas necessidades e enviará perfis de cuidadores qualificados",
                icon: <Users className="h-8 w-8 text-white" />
              },
              {
                step: 3,
                title: "Inicie o Atendimento",
                description: "Escolha o cuidador ideal e agende o início do atendimento personalizado",
                icon: <CheckCircle className="h-8 w-8 text-white" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-careconnect-blue to-purple-600 text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {step.icon}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg card-hover">
                  <div className="text-sm font-semibold text-careconnect-green mb-2">PASSO {step.step}</div>
                  <h3 className="text-xl font-bold mb-3 text-careconnect-blue">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-careconnect-green hover:bg-careconnect-green/90 text-white group"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              Começar Agora com a Mila
            </Button>
          </div>
        </div>
      </section>

      {/* Perguntas Frequentes */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-careconnect-blue">Perguntas Frequentes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Respostas para as dúvidas mais comuns sobre nossos serviços
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Qual é a diferença entre cuidador e enfermeiro?",
                answer: "Cuidadores oferecem assistência nas atividades diárias como alimentação, higiene e acompanhamento, enquanto enfermeiros são profissionais de saúde formados que podem realizar procedimentos médicos específicos."
              },
              {
                question: "Os cuidadores têm formação específica?",
                answer: "Sim, todos os nossos cuidadores possuem formação e/ou experiência comprovada no cuidado com idosos. Muitos possuem cursos técnicos e especializações na área."
              },
              {
                question: "Como é feita a seleção dos cuidadores?",
                answer: "Realizamos um rigoroso processo de seleção que inclui verificação de antecedentes, validação de documentos, entrevistas e avaliação de experiência e habilidades específicas."
              },
              {
                question: "É possível contratar por períodos específicos?",
                answer: "Sim, oferecemos serviços flexíveis que podem ser contratados por horas, períodos (diurno/noturno) ou em regime integral, de acordo com a necessidade de cada família."
              }
            ].map((faq, index) => (
              <Card key={index} className="card-hover border-l-4 border-l-careconnect-green">
                <CardHeader>
                  <CardTitle className="text-careconnect-blue text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="border-careconnect-blue text-careconnect-blue hover:bg-careconnect-blue/5"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Tire suas dúvidas com a Mila
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-careconnect-blue via-purple-600 to-careconnect-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="container-custom text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para encontrar o cuidador ideal?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Converse com a Mila e descubra como podemos ajudar a sua família a encontrar o melhor cuidado
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-careconnect-green hover:bg-careconnect-green/90 text-white group"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
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

export default Services;
