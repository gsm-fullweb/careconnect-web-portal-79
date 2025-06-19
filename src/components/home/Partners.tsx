
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  published: boolean | null;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_URL = "https://cxuhdhtfknvwlqkipjmv.supabase.co/storage/v1/object/public/image/";

const getImageUrl = (fileName: string) =>
  `${STORAGE_URL.replace(/\/$/, "")}/${fileName.replace(/^\//, "")}`;

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("status", "Active")
        .order("name", { ascending: true });
      
      console.log("Parceiros ativos encontrados:", data);
      
      if (error) {
        console.error("Erro ao buscar parceiros:", error);
        return;
      }
      
      if (data) {
        setPartners(data);
      }
    } catch (error) {
      console.error("Erro ao conectar com o banco:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="section bg-white border-t border-gray-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-careconnect-dark mb-2">
              Nossos Parceiros
            </h2>
            <p className="text-gray-600">
              Carregando parceiros...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return (
      <section className="section bg-white border-t border-gray-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-careconnect-dark mb-2">
              Nossos Parceiros
            </h2>
            <p className="text-gray-600">
              Em breve, novos parceiros se juntarão à nossa rede de cuidado.
            </p>
          </div>
        </div>
      </section>
    );
  }

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          {partners.map((partner) => {
            const imageUrl = partner.logo_url
              ? partner.logo_url.startsWith("http")
                ? partner.logo_url
                : getImageUrl(partner.logo_url)
              : "/placeholder.svg";

            return (
              <div 
                key={partner.id} 
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-20 flex items-center justify-center mb-4 bg-gray-50 rounded-md overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-lg text-careconnect-dark mb-2">
                    {partner.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    {partner.type}
                  </p>
                  
                  {partner.website_url && (
                    <a 
                      href={partner.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-careconnect-blue hover:text-careconnect-blue/80 transition-colors"
                    >
                      Visitar site
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  
                  {partner.description && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {partner.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partners;
