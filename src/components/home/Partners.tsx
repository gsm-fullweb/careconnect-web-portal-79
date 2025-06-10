
import { useEffect, useState } from "react";

const partnersData = [
  {
    id: 1,
    name: "HospitalPlus",
    logo: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=150&h=80&fit=crop&crop=center"
  },
  {
    id: 2,
    name: "RedeVida",
    logo: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=150&h=80&fit=crop&crop=center"
  },
  {
    id: 3,
    name: "Instituto SeniorBem",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=80&fit=crop&crop=center"
  },
  {
    id: 4,
    name: "Aliança Saúde",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=80&fit=crop&crop=center"
  },
  {
    id: 5,
    name: "Amparo Seguro",
    logo: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=150&h=80&fit=crop&crop=center"
  },
  {
    id: 6,
    name: "Associação Bem-Estar",
    logo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=80&fit=crop&crop=center"
  }
];

const Partners = () => {
  return (
    <section className="section bg-white border-t border-gray-200">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-careconnect-dark mb-2">
            Nossos Parceiros
          </h2>
          <p className="text-gray-600">
            Trabalhamos com instituições de saúde e seguradoras líderes para garantir um cuidado abrangente.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {partnersData.map((partner) => (
            <div 
              key={partner.id} 
              className="flex justify-center grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-16 object-contain rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
