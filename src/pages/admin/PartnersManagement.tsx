
import React, { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "Descrição deve ter pelo menos 10 caracteres.",
  }),
  logo_url: z.string().url({
    message: "URL do logo inválida.",
  }),
  website_url: z.string().url({
    message: "URL do website inválida.",
  }),
  status: z.enum(['active', 'inactive']),
  type: z.enum(['hospital', 'farmacia', 'clinica']),
})

interface Partner {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  status: string;
  type: string;
}

export default function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      logo_url: "",
      website_url: "",
      status: "active",
      type: "hospital",
    },
  })

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar parceiros:", error);
        setError("Erro ao carregar parceiros.");
      } else {
        setPartners(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const { error } = await supabase
        .from('partners')
        .insert([values]);

      if (error) {
        console.error("Erro ao adicionar parceiro:", error);
        toast.error("Erro ao adicionar parceiro.");
      } else {
        toast.success("Parceiro adicionado com sucesso!");
        form.reset();
        fetchPartners();
      }
    } catch (error) {
      console.error("Erro ao adicionar parceiro:", error);
      toast.error("Erro ao adicionar parceiro.");
    }
  };

  const addSamplePartners = async () => {
    const samplePartners = [
      {
        name: "Hospital São José",
        description: "Parceria para cuidados hospitalares especializados",
        logo_url: "/placeholder.svg",
        website_url: "https://hospitalsaojose.com.br",
        status: "active" as const,
        type: "hospital" as const
      },
      {
        name: "Farmácia Central", 
        description: "Desconto especial em medicamentos para nossos clientes",
        logo_url: "/placeholder.svg",
        website_url: "https://farmaciacentral.com.br",
        status: "active" as const,
        type: "farmacia" as const
      },
      {
        name: "Clínica Fisio+",
        description: "Serviços de fisioterapia com valores especiais",
        logo_url: "/placeholder.svg",
        website_url: "https://clinicafisio.com.br",
        status: "active" as const,
        type: "clinica" as const
      }
    ];

    try {
      const { error } = await supabase
        .from('partners')
        .insert(samplePartners);

      if (error) throw error;

      toast.success("Parceiros exemplo adicionados com sucesso!");
      fetchPartners();
    } catch (error) {
      console.error("Erro ao adicionar parceiros exemplo:", error);
      toast.error("Erro ao adicionar parceiros exemplo.");
    }
  };

  if (loading) return <div>Carregando parceiros...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Parceiros</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Adicionar Novo Parceiro</CardTitle>
          <CardDescription>Preencha o formulário para adicionar um novo parceiro.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do parceiro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição do parceiro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Logo</FormLabel>
                    <FormControl>
                      <Input placeholder="URL do logo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Website</FormLabel>
                    <FormControl>
                      <Input placeholder="URL do website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="farmacia">Farmácia</SelectItem>
                        <SelectItem value="clinica">Clínica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Adicionar Parceiro</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Button onClick={addSamplePartners} className="mb-6">Adicionar Parceiros Exemplo</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Logo URL</TableHead>
            <TableHead>Website URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tipo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium">{partner.name}</TableCell>
              <TableCell>{partner.description}</TableCell>
              <TableCell>{partner.logo_url}</TableCell>
              <TableCell>{partner.website_url}</TableCell>
              <TableCell>{partner.status}</TableCell>
              <TableCell>{partner.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
