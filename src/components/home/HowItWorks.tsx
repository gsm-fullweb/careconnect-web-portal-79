
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Encontre Cuidadores",
      description: "Mande uma mensagem para a Mila, sua assistente virtual. Ela vai entender suas necessidades e ajudar a encontrar um(a) cuidador(a) qualificado(a) que atenda aos seus requisitos específicos, localização e disponibilidade.",
    },
    {
      number: "2",
      title: "Escolha o Ideal",
      description: "Receba no seu WhatsApp os perfis dos cuidadores. Compare, veja avaliações, referências e experiências para encontrar o cuidador ideal para a sua necessidade.",
    },
    {
      number: "3",
      title: "Agende o Serviço",
      description: "Marque o atendimento diretamente com o cuidador, sem intermediários, escolhendo a forma de pagamento, data, horário e duração.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Como funciona a busca de cuidador com a Mila?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Conecte-se com a Mila e encontre o cuidador perfeito de forma rápida, segura e sem estresse!
            </p>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold text-xl mb-2">Busca sem estresse</h3>
                <p className="text-gray-600">
                  A Mila faz a busca para você por meio do WhatsApp, tudo se torna mais simples e rápido. Esqueça formulários longos e repetitivos.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold text-xl mb-2">Peça com facilidade</h3>
                <p className="text-gray-600">
                  Basta enviar uma mensagem de voz ou texto pelo WhatsApp solicitando um cuidador. A Mila cuida do resto e encontra o profissional ideal para você.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold text-xl mb-2">Histórico organizado</h3>
                <p className="text-gray-600">
                  A Mila mantém um resumo dos seus agendamentos para que você tenha tudo sob controle, sem precisar buscar informações manualmente.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-bold text-xl mb-2">Cancelamento simplificado</h3>
                <p className="text-gray-600">
                  Precisa cancelar um agendamento? Apenas envie uma mensagem e pronto! Sem burocracia, sem complicações.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <h3 className="text-2xl font-bold text-center mb-8">
              Procurar cuidadores nunca foi tão fácil!
            </h3>

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
