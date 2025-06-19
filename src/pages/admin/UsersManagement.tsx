import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CandidatoCuidador {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  fumante: string;
  escolaridade: string;
  possui_experiencia: string;
  disponivel_dormir_local: string;
  status_candidatura: string;
  cidade: string;
  endereco: string;
  cep: string;
  possui_filhos: string;
  cursos: string;
  descricao_experiencia: string;
  disponibilidade_horarios: string;
  referencias: string;
  data_cadastro: string;
  user_id: string | null;
  ultima_atualizacao: string | null;
  perfil_profissional: string | null;
  RG: number | null;
  cpf: number | null;
  Declaracao: string | null;
  ativo: string | null;
  coren: string | null;
  crefito: string | null;
  crm: string | null;
  referencia_1: string | null;
  referencia_2: string | null;
  referencia_3: string | null;
  desconfortos_atividades: string | null;
  descricao: string | null;
  experiencia: string | null;
  cargo: string | null;
  estado: string | null;
}

export default function UsersManagement() {
  const [candidatos, setCandidatos] = useState<CandidatoCuidador[]>([]);

  useEffect(() => {
    const fetchCandidatos = async () => {
      const { data, error } = await supabase
        .from('candidatos_cuidadores_rows')
        .select(`
          id, nome, email, telefone, data_nascimento, fumante, escolaridade,
          possui_experiencia, disponivel_dormir_local, status_candidatura,
          cidade, endereco, cep, possui_filhos, cursos, descricao_experiencia,
          disponibilidade_horarios, referencias, data_cadastro, user_id,
          ultima_atualizacao, perfil_profissional, RG, cpf, Declaracao,
          ativo, coren, crefito, crm, referencia_1, referencia_2, referencia_3,
          desconfortos_atividades, descricao, experiencia, cargo, estado
        `)
        .order('data_cadastro', { ascending: false });

      if (error) {
        console.error('Error fetching candidatos:', error);
        toast.error('Erro ao carregar candidatos');
      } else {
        setCandidatos(data as CandidatoCuidador[]);
      }
    };

    fetchCandidatos();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Gerenciamento de Usuários (Cuidadores)</h1>

      <Table>
        <TableCaption>Lista de candidatos a cuidadores.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidatos.map((candidato) => (
            <TableRow key={candidato.id}>
              <TableCell className="font-medium">{candidato.id}</TableCell>
              <TableCell>{candidato.nome}</TableCell>
              <TableCell>{candidato.email}</TableCell>
              <TableCell>{candidato.telefone}</TableCell>
              <TableCell>
                <Badge variant="secondary">{candidato.status_candidatura}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Remover
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá remover o candidato permanentemente. Tem certeza que deseja continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
