
import { useEffect, useState } from "react";

const partnersData = [
  {
    id: 1,
    name: "HealthPlus Insurance",
    logo: "https://via.placeholder.com/150x80?text=HealthPlus"
  },
  {
    id: 2,
    name: "MediNet",
    logo: "https://via.placeholder.com/150x80?text=MediNet"
  },
  {
    id: 3,
    name: "SeniorLife Foundation",
    logo: "https://via.placeholder.com/150x80?text=SeniorLife"
  },
  {
    id: 4,
    name: "Community Health Alliance",
    logo: "https://via.placeholder.com/150x80?text=CHA"
  },
  {
    id: 5,
    name: "CareTrust",
    logo: "https://via.placeholder.com/150x80?text=CareTrust"
  },
  {
    id: 6,
    name: "ElderCare Association",
    logo: "https://via.placeholder.com/150x80?text=ElderCare"
  }
];

const Partners = () => {
  return (
    <section className="section bg-white border-t border-gray-200">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-careconnect-dark mb-2">
            Our Trusted Partners
          </h2>
          <p className="text-gray-600">
            We work with leading healthcare and insurance providers to ensure comprehensive care.
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
