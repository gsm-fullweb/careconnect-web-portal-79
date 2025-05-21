
import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

type PlanFeature = {
  included: boolean;
  text: string;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  buttonText: string;
};

const plans: Plan[] = [
  {
    id: "basic",
    name: "Plano Básico",
    price: 199,
    description: "Ideal para famílias que precisam de cuidados básicos",
    buttonText: "Escolher este plano",
    features: [
      { included: true, text: "Acesso a cuidadores qualificados" },
      { included: true, text: "Avaliação inicial" },
      { included: true, text: "Suporte por e-mail" },
      { included: true, text: "Até 20 horas por mês" },
      { included: false, text: "Cuidados especializados" },
      { included: false, text: "Atendimento 24 horas" },
      { included: false, text: "Coordenador dedicado" },
    ],
  },
  {
    id: "premium",
    name: "Plano Premium",
    price: 349,
    description: "Para necessidades de cuidados mais frequentes",
    buttonText: "Escolher este plano",
    popular: true,
    features: [
      { included: true, text: "Acesso a cuidadores qualificados" },
      { included: true, text: "Avaliação inicial e acompanhamento" },
      { included: true, text: "Suporte por e-mail e telefone" },
      { included: true, text: "Até 40 horas por mês" },
      { included: true, text: "Cuidados especializados" },
      { included: true, text: "Atendimento 24 horas" },
      { included: false, text: "Coordenador dedicado" },
    ],
  },
  {
    id: "enterprise",
    name: "Plano Enterprise",
    price: 599,
    description: "Serviço completo para cuidados intensivos",
    buttonText: "Escolher este plano",
    features: [
      { included: true, text: "Acesso a cuidadores qualificados" },
      { included: true, text: "Avaliação inicial e acompanhamentos regulares" },
      { included: true, text: "Suporte prioritário por e-mail e telefone" },
      { included: true, text: "Horas ilimitadas" },
      { included: true, text: "Cuidados especializados avançados" },
      { included: true, text: "Atendimento 24 horas" },
      { included: true, text: "Coordenador dedicado" },
    ],
  },
];

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    toast.success(`Plano ${planId} selecionado! Em breve entraremos em contato.`, {
      description: "Um de nossos consultores entrará em contato para finalizar sua assinatura.",
    });
  };

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h1 className="mb-4 text-careconnect-blue">Planos de Assinatura</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o plano que melhor atenda às suas necessidades de cuidados. Todos os nossos planos incluem cuidadores qualificados e suporte personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative border-2 transition-all ${
                  plan.popular 
                    ? "border-careconnect-blue scale-105 shadow-xl" 
                    : "border-gray-200 hover:border-careconnect-blue/50 hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-careconnect-blue text-white rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-careconnect-blue">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">R${plan.price}</span>
                    <span className="text-gray-500">/mês</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className={`flex-shrink-0 rounded-full p-1 ${feature.included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          <CheckIcon className="h-4 w-4" />
                        </span>
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-careconnect-blue hover:bg-careconnect-blue/90' 
                        : 'bg-careconnect-blue/80 hover:bg-careconnect-blue'
                    }`} 
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-20 bg-careconnect-light rounded-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-careconnect-blue mb-4">Perguntas Frequentes</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Posso cancelar minha assinatura a qualquer momento?</h3>
                <p className="text-gray-600">Sim, você pode cancelar sua assinatura a qualquer momento sem penalidades. Seu plano permanecerá ativo até o final do período pago.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Como são selecionados os cuidadores?</h3>
                <p className="text-gray-600">Todos os nossos cuidadores passam por um rigoroso processo de seleção, incluindo verificação de antecedentes, entrevistas e avaliação de qualificações profissionais.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Posso trocar de plano depois?</h3>
                <p className="text-gray-600">Sim, você pode atualizar ou fazer downgrade de seu plano a qualquer momento, e as alterações entrarão em vigor em seu próximo ciclo de cobrança.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Como funciona o processo de pagamento?</h3>
                <p className="text-gray-600">Trabalhamos com diversos métodos de pagamento, incluindo cartão de crédito, débito e transferência bancária. A cobrança é feita mensalmente na data de início da sua assinatura.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SubscriptionPlans;
