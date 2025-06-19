
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const Assinatura = () => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMercadoPagoForm, setShowMercadoPagoForm] = useState(false);

  useEffect(() => {
    // Carregar script do Mercado Pago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (preferenceId && showMercadoPagoForm && typeof window !== 'undefined' && window.MercadoPago) {
      const mp = new window.MercadoPago('APP_USR-54942fdb-b693-4ed4-a97f-58908ed89825', {
        locale: 'pt-BR'
      });

      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '#mercadopago-button-container',
          label: 'Pagar',
        }
      });
    }
  }, [preferenceId, showMercadoPagoForm]);

  const subscriptions = [
    {
      price: "19.90",
      plan: "Básico",
      description: "Ideal para quem busca o essencial para encontrar o cuidador ideal.",
      features: [
        "Acesso ilimitado à Mila, sua assistente virtual 24/7",
        "Recomendações personalizadas de cuidadores",
        "Processo de agendamento simplificado e rápido",
        "Notificações sobre novos cuidadores na sua região"
      ],
    },
    {
      price: "29.90",
      plan: "Essencial",
      description: "Mais recursos para uma busca e contratação de cuidadores ainda mais eficiente.",
      popular: true,
      features: [
        "Todos os recursos do plano Básico",
        "Prioridade nas recomendações de cuidadores",
        "Suporte dedicado via chat",
        "Acesso a avaliações e comentários de outros usuários"
      ],
    },
    {
      price: "59.90",
      plan: "Premium",
      description: "Experiência completa e personalizada para quem busca o máximo em cuidado e conveniência.",
      features: [
        "Todos os recursos do plano Essencial",
        "Acesso exclusivo a cuidadores premium",
        "Consultoria personalizada",
        "Gerenciamento completo de agendamentos e pagamentos"
      ],
    },
  ];

  async function handleSubscribe(subscription: { price: string; plan: string }) {
    setLoading(true);
    
    try {
      // Criar preferência de pagamento com Mercado Pago
      const preference = {
        items: [
          {
            title: `Plano ${subscription.plan} - CareConnect`,
            unit_price: parseFloat(subscription.price),
            quantity: 1,
            currency_id: 'BRL'
          }
        ],
        back_urls: {
          success: window.location.origin + '/assinatura/sucesso',
          failure: window.location.origin + '/assinatura/falha',
          pending: window.location.origin + '/assinatura/pendente'
        },
        auto_return: 'approved',
        payment_methods: {
          excluded_payment_types: [],
          installments: 12
        },
        external_reference: `subscription-${subscription.plan}-${Date.now()}`
      };

      // Simular criação de preferência
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer APP_USR-8971928988049703-041413-7d628f5f23c1c299419433b25a0d273e-686166954'
        },
        body: JSON.stringify(preference)
      });

      if (response.ok) {
        const data = await response.json();
        setPreferenceId(data.id);
        setShowMercadoPagoForm(true);
        
        toast.success(`Plano ${subscription.plan} selecionado!`, {
          description: "Você será redirecionado para o pagamento.",
        });
      } else {
        throw new Error('Erro ao criar preferência de pagamento');
      }
      
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      toast.error("Erro ao processar pagamento", {
        description: "Tente novamente em alguns minutos.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-careconnect-blue to-careconnect-green text-white py-20 md:py-32">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Cuidado de Qualidade ao Seu Alcance
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto">
            Assine a Mila e transforme a maneira como você encontra e gerencia cuidadores. 
            Tenha acesso a uma rede de profissionais qualificados e a ferramentas que simplificam o cuidado.
          </p>
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto font-semibold text-yellow-300">
            E o melhor: seu primeiro agendamento é gratuito!
          </p>
          <Button 
            size="lg" 
            className="bg-white text-careconnect-blue hover:bg-gray-100 text-lg rounded-full px-8 py-3"
            onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Escolha seu Plano
          </Button>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section id="planos" className="py-16 md:py-24 bg-primary/5">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Planos de Assinatura
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              Encontre o plano perfeito para suas necessidades e comece a desfrutar dos benefícios da CareConnect com a ajuda da Mila.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptions.map((sub, index) => (
              <Card 
                key={index}
                className={`relative border-2 transition-all ${
                  sub.popular 
                    ? "border-careconnect-blue scale-105 shadow-xl" 
                    : "border-gray-200 hover:border-careconnect-blue/50 hover:shadow-md"
                }`}
              >
                {sub.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-careconnect-blue text-white rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-careconnect-blue">{sub.plan}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">R${sub.price}</span>
                    <span className="text-gray-500">/mês</span>
                  </div>
                  <p className="text-gray-600 mt-2">{sub.description}</p>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {sub.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-careconnect-green mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    className={`w-full ${
                      sub.popular 
                        ? 'bg-careconnect-blue hover:bg-careconnect-blue/90' 
                        : 'bg-careconnect-green hover:bg-careconnect-green/90'
                    } text-white rounded-full text-lg py-3`}
                    onClick={() => handleSubscribe(sub)}
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : `Assinar ${sub.plan}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="text-center mt-8">
              <p className="text-gray-600">Processando pagamento...</p>
            </div>
          )}

          {/* Modal do Mercado Pago */}
          {showMercadoPagoForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Finalizar Pagamento</h3>
                  <button 
                    onClick={() => setShowMercadoPagoForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div id="mercadopago-button-container">
                  {/* Botão do Mercado Pago será renderizado aqui */}
                  <div className="text-center py-8">
                    <p className="text-gray-600">Carregando opções de pagamento...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mila Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-careconnect-blue to-careconnect-green flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold">Mila</h3>
              <p className="text-lg">Sua Assistente Virtual</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Conheça a Mila: Sua Aliada no Cuidado
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Mila é a inteligência artificial da CareConnect, desenvolvida para simplificar a sua busca por cuidadores. 
              Com ela, você tem acesso rápido e intuitivo a recomendações personalizadas, agendamentos e todas as informações que precisa.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-careconnect-green flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">Disponível 24 horas por dia, 7 dias por semana</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-careconnect-green flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">Recomendações precisas baseadas em suas preferências e localização</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-careconnect-green flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">Facilita a comunicação e o agendamento com cuidadores</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-careconnect-green flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">Guarda suas conversas anteriores, tornando novos agendamentos mais simples</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-careconnect-blue text-white text-center">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Simplificar o Cuidado?
          </h2>
          <p className="text-lg mb-12 max-w-3xl mx-auto opacity-90">
            Escolha seu plano hoje mesmo e tenha a tranquilidade de encontrar o cuidador ideal com a ajuda da Mila e da CareConnect.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-careconnect-blue hover:bg-gray-100 text-lg rounded-full px-8 py-3"
            onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Assinar Agora
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Assinatura;
