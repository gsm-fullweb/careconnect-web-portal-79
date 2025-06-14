
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  type: string | null;
  status: string | null;
}

const Partners = () => {
  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['active-partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('status', 'Active')
        .order('name');
      
      if (error) throw error;
      return data as Partner[];
    }
  });

  if (isLoading) {
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
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando parceiros...</p>
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
              Trabalhamos com instituições de saúde e seguradoras líderes para garantir um cuidado abrangente.
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum parceiro encontrado.</p>
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {partners.map((partner) => (
            <div 
              key={partner.id} 
              className="flex justify-center grayscale hover:grayscale-0 transition-all duration-300"
            >
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-16 object-contain rounded"
                />
              ) : (
                <div className="h-16 flex items-center justify-center bg-gray-100 rounded px-4">
                  <span className="text-sm text-gray-600 text-center">{partner.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
