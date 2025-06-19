
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = {
  id: string;
  name: string;
  avatar_url: string | null;
  content: string;
  rating: number | null;
  role: string | null;
  published: boolean | null;
};

function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('Buscando depoimentos do banco de dados...');
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Erro ao buscar depoimentos:', error);
          return;
        }
        
        console.log('Depoimentos encontrados:', data);
        setTestimonials(data || []);
      } catch (error) {
        console.error('Erro ao buscar depoimentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const createGroups = (items: Testimonial[], size: number): Testimonial[][] => {
    const groups: Testimonial[][] = [];
    for (let i = 0; i < items.length; i += size) {
      groups.push(items.slice(i, i + size));
    }
    return groups;
  };

  const testimonialGroups = createGroups(testimonials, 3);
  const [currentGroup, setCurrentGroup] = useState(0);

  const goToNextGroup = () => {
    setCurrentGroup((prev) => (prev === testimonialGroups.length - 1 ? 0 : prev + 1));
  };

  const goToPrevGroup = () => {
    setCurrentGroup((prev) => (prev === 0 ? testimonialGroups.length - 1 : prev - 1));
  };

  const getAvatarUrl = (avatarUrl: string | null) => {
    if (!avatarUrl) {
      return 'https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//avatar-1.png';
    }
    
    if (avatarUrl.startsWith('http')) {
      return avatarUrl;
    }
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatarUrl);
    
    return data.publicUrl;
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-lg text-gray-600">Carregando depoimentos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Esqueça a complicação dos apps. <span className="text-[#6B46C1]">Com a Mila</span>, você encontra o cuidador ideal em poucos cliques
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sem baixar ou descobrir novos aplicativos. O CareConnect organiza tudo por meio do seu aplicativo de mensagens. Basta adicionar o número da Mila!
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-600">Em breve, novos depoimentos serão adicionados.</p>
            <p className="text-sm text-gray-500 mt-2">Verifique o console do navegador para logs de debug.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Esqueça a complicação dos apps. <span className="text-[#6B46C1]">Com a Mila</span>, você encontra o cuidador ideal em poucos cliques
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sem baixar ou descobrir novos aplicativos. O CareConnect organiza tudo por meio do seu aplicativo de mensagens. Basta adicionar o número da Mila!
          </p>
        </div>

        {/* Desktop Testimonials */}
        <div className="hidden md:block relative">
          <div className="flex gap-6">
            {testimonialGroups[currentGroup]?.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={getAvatarUrl(testimonial.avatar_url)}
                      alt={testimonial.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//avatar-1.png';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    {testimonial.role && (
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    )}
                    <div className="flex">
                      {[...Array(testimonial.rating || 5)].map((_, index) => (
                        <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows */}
          {testimonialGroups.length > 1 && (
            <>
              <button
                onClick={goToPrevGroup}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={goToNextGroup}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Testimonials */}
        <div className="md:hidden">
          <div className="space-y-4">
            {testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={getAvatarUrl(testimonial.avatar_url)}
                      alt={testimonial.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://dyxkbbojlyppizsgjjxx.supabase.co/storage/v1/object/public/images//avatar-1.png';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    {testimonial.role && (
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    )}
                    <div className="flex">
                      {[...Array(testimonial.rating || 5)].map((_, index) => (
                        <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        {testimonialGroups.length > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {testimonialGroups.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentGroup(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentGroup ? "bg-[#6B46C1]" : "bg-gray-300"
                }`}
                aria-label={`Ver grupo de depoimentos ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
