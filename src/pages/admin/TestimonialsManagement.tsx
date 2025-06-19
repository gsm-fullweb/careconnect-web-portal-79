
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch"

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  published: boolean;
  customer_id: string;
  caregiver_id: string;
}

interface Caregiver {
  id: string;
  email: string;
  name?: string;
}

interface Client {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  user_role?: string;
}

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, first_name, last_name, user_role')
        .eq('user_role', 'cliente');

      if (error) {
        console.error('Error fetching clients:', error);
        toast.error('Erro ao carregar clientes');
      } else {
        setClients(data as Client[]);
      }
    };

    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*');

      if (error) {
        console.error('Error fetching testimonials:', error);
        toast.error('Erro ao carregar depoimentos');
      } else {
        setTestimonials(data as Testimonial[]);
      }
    };

    const fetchCaregivers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name')
        .eq('user_role', 'cuidador');

      if (error) {
        console.error('Error fetching caregivers:', error);
        toast.error('Erro ao carregar cuidadores');
      } else {
        setCaregivers(data as Caregiver[]);
      }
    };

    fetchClients();
    fetchTestimonials();
    fetchCaregivers();
  }, []);

  const addSampleTestimonials = async () => {
    const sampleTestimonials = [
      {
        content: "Excelente serviço! A cuidadora foi muito atenciosa e profissional.",
        name: "Maria Silva",
        role: "Cliente",
        rating: 5,
        published: true,
        caregiver_id: caregivers[0]?.id || "",
        customer_id: clients[0]?.id || ""
      },
      {
        content: "Recomendo muito! Cuidado excepcional com minha mãe idosa.",
        name: "João Santos",
        role: "Cliente", 
        rating: 5,
        published: true,
        caregiver_id: caregivers[1]?.id || "",
        customer_id: clients[1]?.id || ""
      },
      {
        content: "Profissional dedicada e carinhosa. Muito satisfeita com o serviço.",
        name: "Ana Costa",
        role: "Cliente",
        rating: 4,
        published: true,
        caregiver_id: caregivers[0]?.id || "",
        customer_id: clients[2]?.id || ""
      }
    ];

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert(sampleTestimonials);

      if (error) throw error;

      toast.success("Depoimentos exemplo adicionados com sucesso!");
      
      // Refresh testimonials after adding samples
      const { data } = await supabase.from('testimonials').select('*');
      if (data) setTestimonials(data as Testimonial[]);
    } catch (error) {
      console.error("Erro ao adicionar depoimentos exemplo:", error);
      toast.error("Erro ao adicionar depoimentos exemplo.");
    }
  };

  const handlePublishToggle = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ published: !testimonial.published })
        .eq('id', testimonial.id);

      if (error) throw error;

      setTestimonials(testimonials.map(t =>
        t.id === testimonial.id ? { ...t, published: !t.published } : t
      ));
      toast.success(`Depoimento ${testimonial.published ? 'despublicado' : 'publicado'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar o status do depoimento:", error);
      toast.error("Erro ao atualizar o status do depoimento.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Depoimentos</h1>

      <Button onClick={addSampleTestimonials} className="mb-4">
        Adicionar Depoimentos de Exemplo
      </Button>

      <Table>
        <TableCaption>Lista de depoimentos dos clientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Depoimento</TableHead>
            <TableHead>Avaliação</TableHead>
            <TableHead>Publicado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id}>
              <TableCell className="font-medium">{testimonial.name}</TableCell>
              <TableCell>{testimonial.content}</TableCell>
              <TableCell>{testimonial.rating}</TableCell>
              <TableCell>
                <Switch
                  checked={testimonial.published}
                  onCheckedChange={() => handlePublishToggle(testimonial)}
                />
              </TableCell>
              <TableCell className="text-right">
                {/* <Button size="sm">Editar</Button> */}
                {/* <Button size="sm" variant="destructive">Excluir</Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
