
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mensagem Enviada",
        description: "Obrigado por entrar em contato! Responderemos em breve.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const faqData = [
    {
      question: "Como posso encontrar um cuidador?",
      answer: "É simples! Entre em contato conosco pelo WhatsApp ou preencha o formulário. Nossa IA Mila irá ajudá-lo a encontrar o cuidador ideal baseado nas suas necessidades específicas."
    },
    {
      question: "Os cuidadores são qualificados?",
      answer: "Sim! Todos os nossos cuidadores passam por uma rigorosa seleção que inclui verificação de antecedentes, validação de documentos e avaliação de experiência na área."
    },
    {
      question: "Qual é o valor dos serviços?",
      answer: "Os valores variam de acordo com o tipo de serviço e duração. Entre em contato conosco para receber um orçamento personalizado baseado nas suas necessidades."
    },
    {
      question: "Posso contratar por períodos específicos?",
      answer: "Sim! Oferecemos flexibilidade total - você pode contratar por horas, períodos (diurno/noturno) ou regime integral, de acordo com sua necessidade."
    },
    {
      question: "Como funciona o atendimento de emergência?",
      answer: "Temos atendimento disponível 24/7 pelo WhatsApp. Em casos de urgência, nossa equipe está preparada para responder rapidamente e oferecer suporte imediato."
    },
    {
      question: "É possível trocar de cuidador?",
      answer: "Claro! Entendemos que a compatibilidade é fundamental. Se precisar trocar de cuidador por qualquer motivo, nos ajudaremos a encontrar uma nova opção adequada."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-careconnect-blue via-careconnect-blue/90 to-careconnect-blue/80 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
            Fale Conosco
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Entre em Contato</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Estamos aqui para ajudar você a encontrar o cuidador ideal para sua família. 
            Entre em contato e descubra como podemos cuidar de quem você ama.
          </p>
        </div>
      </div>
      
      {/* Contact Info & Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Vamos Conversar</h2>
                <p className="text-lg text-gray-700 mb-8">
                  Seja para esclarecer dúvidas, solicitar um orçamento ou encontrar o cuidador perfeito, 
                  estamos sempre prontos para ajudar. Escolha a forma de contato que preferir.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="w-16 h-16 bg-gradient-to-br from-careconnect-blue to-careconnect-blue/80 rounded-2xl flex items-center justify-center text-white mr-6 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Telefone</h3>
                    <p className="text-gray-700 text-lg mb-1">
                      <a href="tel:+551148633976" className="hover:text-careconnect-blue transition-colors">
                        (11) 4863-3976
                      </a>
                    </p>
                    <p className="text-gray-500">
                      Segunda a Sexta: 8h às 20h | Sábado: 9h às 16h
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="w-16 h-16 bg-gradient-to-br from-careconnect-green to-careconnect-green/80 rounded-2xl flex items-center justify-center text-white mr-6 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                    <p className="text-gray-700 text-lg mb-1">
                      <a href="https://wa.me/551148633976" className="hover:text-careconnect-green transition-colors" target="_blank" rel="noopener noreferrer">
                        (11) 4863-3976
                      </a>
                    </p>
                    <p className="text-gray-500">
                      Atendimento disponível 24/7 com nossa IA Mila
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center text-white mr-6 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">E-mail</h3>
                    <p className="text-gray-700 text-lg mb-1">
                      <a href="mailto:contato@careconnect.com.br" className="hover:text-purple-600 transition-colors">
                        contato@careconnect.com.br
                      </a>
                    </p>
                    <p className="text-gray-500">
                      Responderemos em até 24 horas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center text-white mr-6 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Localização</h3>
                    <p className="text-gray-700 text-lg mb-1">
                      Mogi das Cruzes - SP
                    </p>
                    <p className="text-gray-500">
                      Atendemos toda a Grande São Paulo
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Envie sua Mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className="mt-2 h-12 border-gray-200 focus:border-careconnect-blue focus:ring-careconnect-blue/20"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="mt-2 h-12 border-gray-200 focus:border-careconnect-blue focus:ring-careconnect-blue/20"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="mt-2 h-12 border-gray-200 focus:border-careconnect-blue focus:ring-careconnect-blue/20"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="service" className="text-gray-700 font-medium">
                    Serviço de Interesse
                  </Label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="mt-2 w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-careconnect-blue focus:ring-2 focus:ring-careconnect-blue/20 bg-white"
                  >
                    <option value="">Selecione um serviço</option>
                    <option value="cuidado-diario">Cuidado Diário</option>
                    <option value="cuidado-noturno">Cuidado Noturno</option>
                    <option value="acompanhamento-medico">Acompanhamento Médico</option>
                    <option value="cuidados-especiais">Cuidados Especiais</option>
                    <option value="respiro-familiar">Respiro Familiar</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    Mensagem
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Conte-nos mais sobre suas necessidades..."
                    rows={5}
                    className="mt-2 border-gray-200 focus:border-careconnect-blue focus:ring-careconnect-blue/20 resize-none"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-careconnect-blue to-careconnect-blue/90 hover:from-careconnect-blue/90 hover:to-careconnect-blue text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-careconnect-blue/10 text-careconnect-blue rounded-full text-sm font-medium mb-4">
              Perguntas Frequentes
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Dúvidas Comuns</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Confira as respostas para as perguntas mais frequentes sobre nossos serviços
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-careconnect-blue transition-colors">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Não encontrou a resposta que procurava?</p>
            <Button
              asChild
              variant="outline"
              className="border-2 border-careconnect-blue text-careconnect-blue hover:bg-careconnect-blue hover:text-white transition-all duration-300"
            >
              <a href="https://wa.me/551148633976" target="_blank" rel="noopener noreferrer">
                Fale com a Mila no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-careconnect-blue via-careconnect-blue/95 to-careconnect-blue/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para Encontrar o Cuidador Ideal?
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Nossa IA Mila está disponível 24/7 para ajudar você a encontrar o cuidador perfeito para sua família.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-careconnect-blue hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <a href="https://wa.me/551148633976" target="_blank" rel="noopener noreferrer">
                Falar com a Mila
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-careconnect-green text-white hover:bg-careconnect-green/90 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/plans">
                Ver Planos Disponíveis
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
