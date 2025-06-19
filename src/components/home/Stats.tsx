
import { Users, Star, Clock, Shield } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "2.500+",
    label: "Cuidadores Cadastrados",
    color: "text-careconnect-blue"
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "Avaliação Média",
    color: "text-yellow-500"
  },
  {
    icon: Clock,
    number: "24/7",
    label: "Disponibilidade",
    color: "text-careconnect-green"
  },
  {
    icon: Shield,
    number: "100%",
    label: "Verificados",
    color: "text-blue-600"
  }
];

const Stats = () => {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center animate-fade-in">
              <div className="flex justify-center mb-3">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-careconnect-dark mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
