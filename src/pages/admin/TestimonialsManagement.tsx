
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, Plus, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Testimonial {
  id: string;
  content: string;
  name: string;
  role: string | null;
  rating: number | null;
  published: boolean | null;
  avatar_url: string | null;
  caregiver_id: string | null;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

interface Caregiver {
  id: string;
  name: string;
  email: string;
}

const TestimonialsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({
    content: "",
    name: "",
    role: "",
    rating: 5,
    published: true,
    caregiver_id: "",
    customer_id: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar depoimentos
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      console.log('Buscando depoimentos...');
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar depoimentos:', error);
        throw error;
      }
      console.log('Depoimentos encontrados:', data);
      return data as Testimonial[];
    }
  });

  // Buscar clientes - usando a tabela profiles
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log('Buscando clientes...');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('user_role', 'cliente');
      
      if (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      }
      console.log('Clientes encontrados:', data);
      return data as Client[];
    }
  });

  // Buscar cuidadores - usando a tabela candidatos_cuidadores_rows
  const { data: caregivers = [] } = useQuery({
    queryKey: ['caregivers'],
    queryFn: async () => {
      console.log('Buscando cuidadores...');
      const { data, error } = await supabase
        .from('candidatos_cuidadores_rows')
        .select('id, nome as name, email');
      
      if (error) {
        console.error('Erro ao buscar cuidadores:', error);
        // Se a tabela não existir, retornamos array vazio
        if (error.code === '42P01') {
          console.log('Tabela candidatos_cuidadores_rows não existe, retornando array vazio');
          return [];
        }
        throw error;
      }
      console.log('Cuidadores encontrados:', data);
      return data as Caregiver[];
    }
  });

  // Mutation para adicionar depoimento
  const addTestimonialMutation = useMutation({
    mutationFn: async (testimonialData: typeof newTestimonial) => {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          content: testimonialData.content,
          name: testimonialData.name,
          role: testimonialData.role,
          rating: testimonialData.rating,
          published: testimonialData.published,
          caregiver_id: testimonialData.caregiver_id || null,
          customer_id: testimonialData.customer_id || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({
        title: "Depoimento adicionado",
        description: "O depoimento foi adicionado com sucesso.",
      });
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao adicionar depoimento: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Mutation para atualizar depoimento
  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Testimonial> }) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({
        title: "Depoimento atualizado",
        description: "O depoimento foi atualizado com sucesso.",
      });
      setEditingTestimonial(null);
      resetForm();
    }
  });

  // Mutation para deletar depoimento
  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({
        title: "Depoimento excluído",
        description: "O depoimento foi excluído com sucesso.",
      });
    }
  });

  const resetForm = () => {
    setNewTestimonial({
      content: "",
      name: "",
      role: "",
      rating: 5,
      published: true,
      caregiver_id: "",
      customer_id: ""
    });
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    addTestimonialMutation.mutate(newTestimonial);
  };

  const handleUpdateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    
    updateTestimonialMutation.mutate({
      id: editingTestimonial.id,
      updates: {
        content: newTestimonial.content,
        name: newTestimonial.name,
        role: newTestimonial.role,
        rating: newTestimonial.rating,
        published: newTestimonial.published,
        caregiver_id: newTestimonial.caregiver_id || null,
        customer_id: newTestimonial.customer_id || null
      }
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este depoimento?")) {
      deleteTestimonialMutation.mutate(id);
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setNewTestimonial({
      content: testimonial.content,
      name: testimonial.name,
      role: testimonial.role || "",
      rating: testimonial.rating || 5,
      published: testimonial.published ?? true,
      caregiver_id: testimonial.caregiver_id || "",
      customer_id: testimonial.customer_id || ""
    });
    setIsAddModalOpen(true);
  };

  // Filtrar depoimentos
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (testimonial.role && testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && testimonial.published) ||
                         (statusFilter === "unpublished" && !testimonial.published);
    
    return matchesSearch && matchesStatus;
  });

  const getClientName = (customerId: string | null) => {
    if (!customerId) return "Cliente não identificado";
    const client = clients.find(c => c.id === customerId);
    if (!client) return "Cliente não encontrado";
    return `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.email;
  };

  const getCaregiverName = (caregiverId: string | null) => {
    if (!caregiverId) return "Cuidador não identificado";
    const caregiver = caregivers.find(c => c.id === caregiverId);
    return caregiver ? caregiver.name : "Cuidador não encontrado";
  };

  const renderStars = (rating: number | null) => {
    const stars = [];
    const ratingValue = rating || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= ratingValue ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Depoimentos</h1>
          <p className="text-gray-600">Gerencie depoimentos de clientes e avaliações.</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-careconnect-blue hover:bg-careconnect-blue/90"
          onClick={() => {
            setEditingTestimonial(null);
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Depoimento
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Depoimentos</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Pesquisa e Filtros */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Pesquisar depoimentos..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="published">Publicados</option>
                <option value="unpublished">Não Publicados</option>
              </select>
            </div>
          </div>
          
          {/* Grid de Depoimentos */}
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum depoimento encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center">
                        {testimonial.avatar_url ? (
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm font-medium">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <blockquote className="text-gray-700 mb-4 text-sm line-clamp-4">
                      "{testimonial.content}"
                    </blockquote>
                    
                    {testimonial.rating && (
                      <div className="mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mb-3">
                      <p><strong>Cliente:</strong> {getClientName(testimonial.customer_id)}</p>
                      <p><strong>Cuidador:</strong> {getCaregiverName(testimonial.caregiver_id)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        testimonial.published 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {testimonial.published ? "Publicado" : "Não Publicado"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditTestimonial(testimonial)}
                      >
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                      >
                        <Trash className="w-4 h-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Modal Adicionar/Editar Depoimento */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingTestimonial ? "Editar Depoimento" : "Adicionar Novo Depoimento"}
              </h3>
              <form onSubmit={editingTestimonial ? handleUpdateTestimonial : handleAddTestimonial}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <Input
                      required
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Função/Relacionamento
                    </label>
                    <Input
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                      placeholder="ex: Cliente, Familiar, Cuidador"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                      value={newTestimonial.customer_id}
                      onChange={(e) => setNewTestimonial({...newTestimonial, customer_id: e.target.value})}
                    >
                      <option value="">Selecionar cliente</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {`${client.first_name || ''} ${client.last_name || ''}`.trim() || client.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cuidador
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                      value={newTestimonial.caregiver_id}
                      onChange={(e) => setNewTestimonial({...newTestimonial, caregiver_id: e.target.value})}
                    >
                      <option value="">Selecionar cuidador</option>
                      {caregivers.map((caregiver) => (
                        <option key={caregiver.id} value={caregiver.id}>
                          {caregiver.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avaliação
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                      value={newTestimonial.rating}
                      onChange={(e) => setNewTestimonial({...newTestimonial, rating: Number(e.target.value)})}
                    >
                      <option value={5}>5 estrelas</option>
                      <option value={4}>4 estrelas</option>
                      <option value={3}>3 estrelas</option>
                      <option value={2}>2 estrelas</option>
                      <option value={1}>1 estrela</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Texto do Depoimento
                    </label>
                    <Textarea
                      required
                      value={newTestimonial.content}
                      onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={newTestimonial.published}
                      onChange={(e) => setNewTestimonial({...newTestimonial, published: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700">
                      Publicar depoimento
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-careconnect-blue hover:bg-careconnect-blue/90"
                    disabled={addTestimonialMutation.isPending || updateTestimonialMutation.isPending}
                  >
                    {editingTestimonial ? "Atualizar" : "Adicionar"} Depoimento
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManagement;
