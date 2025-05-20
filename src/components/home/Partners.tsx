
import { useEffect, useState } from "react";

const partnersData = [
  {
    id: 1,
    name: "HospitalPlus",
    logo: "https://via.placeholder.com/150x80?text=HospitalPlus"
  },
  {
    id: 2,
    name: "RedeVida",
    logo: "https://via.placeholder.com/150x80?text=RedeVida"
  },
  {
    id: 3,
    name: "Instituto SeniorBem",
    logo: "https://via.placeholder.com/150x80?text=SeniorBem"
  },
  {
    id: 4,
    name: "Aliança Saúde",
    logo: "https://via.placeholder.com/150x80?text=AliançaSaúde"
  },
  {
    id: 5,
    name: "Amparo Seguro",
    logo: "https://via.placeholder.com/150x80?text=AmparoSeguro"
  },
  {
    id: 6,
    name: "Associação Bem-Estar",
    logo: "https://via.placeholder.com/150x80?text=Bem-Estar"
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
                className="h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
