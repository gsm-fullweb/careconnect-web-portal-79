
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from '@/components/layout/Layout';

interface Testimonial {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  published: boolean;
  customer_id: string;
  caregiver_id: string;
}

interface Caregiver {
  id: number; // Changed from string to number to match database
  nome: string;
}

export default function ClienteDashboard() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: user?.email || "",
    content: "",
    rating: 5,
    caregiver_id: ""
  });
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao carregar depoimentos:", error);
        toast.error("Erro ao carregar depoimentos.");
      } else {
        setTestimonials(data || []);
      }
    };

    const fetchCaregivers = async () => {
      const { data, error } = await supabase
        .from('candidatos_cuidadores_rows')
        .select('id, nome');

      if (error) {
        console.error("Erro ao carregar cuidadores:", error);
        toast.error("Erro ao carregar cuidadores.");
      } else {
        setCaregivers(data || []);
      }
    };

    const fetchUserData = async () => {
      if (!user) return;
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Erro ao carregar dados do usuário:", profileError);
        toast.error("Erro ao carregar dados do usuário.");
      } else {
        setUserData(profileData);
        setNewTestimonial(prev => ({ ...prev, name: profileData?.name || user.email || "" }));
      }
    };

    fetchTestimonials();
    fetchCaregivers();
    fetchUserData();
  }, [user]);

  const submitTestimonial = async () => {
    if (!user || !newTestimonial.content.trim() || !newTestimonial.rating) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          name: newTestimonial.name,
          role: "Cliente",
          content: newTestimonial.content,
          rating: newTestimonial.rating,
          published: false,
          customer_id: user.id,
          caregiver_id: newTestimonial.caregiver_id || null
        });

      if (error) throw error;

      toast.success("Depoimento enviado com sucesso! Aguarde aprovação.");
      setNewTestimonial({
        name: userData?.name || user?.email || "",
        content: "",
        rating: 5,
        caregiver_id: ""
      });
      setShowTestimonialForm(false);
    } catch (error) {
      console.error("Erro ao enviar depoimento:", error);
      toast.error("Erro ao enviar depoimento. Tente novamente.");
    }
  };

  return (
    <Layout>
      <section className="py-12 md:py-20 bg-primary/5 min-h-screen">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Seus Depoimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testimonials.length > 0 ? (
                <ul className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <li key={testimonial.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                        <div className="text-sm text-gray-500">
                          Avaliação: {testimonial.rating}
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{testimonial.content}</p>
                      <div className="text-sm text-gray-500 mt-2">
                        Status: {testimonial.published ? "Publicado" : "Pendente"}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Você ainda não enviou nenhum depoimento.</p>
              )}

              <Button className="w-full mt-6" onClick={() => setShowTestimonialForm(true)}>
                Adicionar Depoimento
              </Button>

              {showTestimonialForm && (
                <div className="mt-6">
                  <h4 className="text-xl font-semibold mb-4">Novo Depoimento</h4>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="name">Seu Nome</Label>
                      <Input
                        type="text"
                        id="name"
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="caregiver">Cuidador</Label>
                      <Select onValueChange={(value) => setNewTestimonial({ ...newTestimonial, caregiver_id: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um cuidador" />
                        </SelectTrigger>
                        <SelectContent>
                          {caregivers.map((caregiver) => (
                            <SelectItem key={caregiver.id} value={caregiver.id.toString()}>
                              {caregiver.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rating">Avaliação</Label>
                      <Select onValueChange={(value) => setNewTestimonial({ ...newTestimonial, rating: parseInt(value) })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma avaliação" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={String(rating)}>
                              {rating} Estrelas
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="content">Depoimento</Label>
                      <Textarea
                        id="content"
                        placeholder="Escreva seu depoimento aqui..."
                        value={newTestimonial.content}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                      />
                    </div>
                    <Button className="w-full" onClick={submitTestimonial}>
                      Enviar Depoimento
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
