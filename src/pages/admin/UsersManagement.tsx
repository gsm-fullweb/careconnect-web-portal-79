import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, UserPlus, Eye, Filter, Users, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CandidateDetailsModal } from "@/components/admin/CandidateDetailsModal";

type CandidatoCuidador = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  data_cadastro: string;
  status_candidatura: string;
  cargo: string | null;
  data_nascimento: string;
  fumante: string;
  possui_filhos: string;
  escolaridade: string;
  cursos: string | null;
  possui_experiencia: string;
  descricao_experiencia: string | null;
  disponibilidade_horarios: string | null;
  disponivel_dormir_local: string;
  referencias: string | null;
  referencia_1: string | null;
  referencia_2: string | null;
  referencia_3: string | null;
  perfil_profissional: string | null;
  ultima_atualizacao: string | null;
  cidade: string;
  endereco: string;
  cep: string;
  cpf: string | null;
  RG: string | null;
  estado: string | null;
  coren: string | null;
  crefito: string | null;
  crm: string | null;
};

const UsersManagement = () => {
  const [users, setUsers] = useState<CandidatoCuidador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CandidatoCuidador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cargoFilter, setCargoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('candidatos_cuidadores_rows')
        .select(`
          id, nome, email, telefone, data_cadastro, status_candidatura, cargo, data_nascimento,
          fumante, possui_filhos, escolaridade, cursos, possui_experiencia, descricao_experiencia,
          disponibilidade_horarios, disponivel_dormir_local, referencias, referencia_1, referencia_2,
          referencia_3, perfil_profissional, ultima_atualizacao, cidade, endereco, cep, cpf, RG,
          estado, coren, crefito, crm
        `);
      
      if (error) {
        console.error('Erro ao buscar candidatos:', error);
        throw error;
      }
      setUsers(data || []);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error);
      setError('Falha ao carregar dados dos candidatos. Por favor, tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os candidatos do banco de dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('candidatos_cuidadores_rows')
        .update({ 
          status_candidatura: newStatus,
          ultima_atualizacao: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      // Atualiza o estado local
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user.id === userId ? { ...user, status_candidatura: newStatus } : user
        )
      );
      
      toast({
        title: "Status atualizado",
        description: `Status do candidato alterado para "${newStatus}" com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do candidato. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCargo = cargoFilter === "all" || user.cargo === cargoFilter;
    const matchesStatus = statusFilter === "all" || user.status_candidatura === statusFilter;
    
    return matchesSearch && matchesCargo && matchesStatus;
  });

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este candidato?")) {
      try {
        const { error } = await supabase
          .from('candidatos_cuidadores_rows')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        setUsers(users.filter(user => user.id !== id));
        
        toast({
          title: "Candidato excluído",
          description: "O candidato foi excluído com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao excluir candidato:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o candidato. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const handleViewDetails = (user: CandidatoCuidador) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateUser = (updatedUser: CandidatoCuidador) => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setIsDetailsModalOpen(false);
    fetchUsers();
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const cargoOptions = Array.from(
    new Set(users.filter(user => user.cargo).map(user => user.cargo))
  );

  const statusOptions = Array.from(
    new Set(users.map(user => user.status_candidatura))
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejeitado":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "default";
      case "Rejeitado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatBooleanValue = (value: boolean | string | null): string => {
    if (value === true || value === "true" || value === "Sim") return "Sim";
    if (value === false || value === "false" || value === "Não") return "Não";
    return String(value || "Não informado");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-careconnect-blue" />
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Candidatos</h1>
          </div>
          <p className="text-gray-600">
            Gerencie contas de candidatos e visualize seus dados de forma organizada.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-gray-700">{users.length} candidatos total</span>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-gray-700">{filteredUsers.length} filtrados</span>
            </div>
          </div>
        </div>
        <Button 
          className="mt-6 lg:mt-0 bg-careconnect-blue hover:bg-careconnect-blue/90 text-white font-semibold"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar Candidato
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-careconnect-blue" />
              Lista de Candidatos
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar por nome, email ou cidade..."
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
              <Button
                variant="outline"
                onClick={fetchUsers}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Cargo</label>
                <select 
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-careconnect-blue min-w-40"
                  value={cargoFilter}
                  onChange={(e) => setCargoFilter(e.target.value)}
                >
                  <option value="all">Todos os Cargos</option>
                  {cargoOptions.map((cargo, index) => (
                    cargo && <option key={index} value={cargo}>{cargo}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select 
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-careconnect-blue min-w-40"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  {statusOptions.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              {(cargoFilter !== "all" || statusFilter !== "all") && (
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCargoFilter("all");
                      setStatusFilter("all");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          {loading && (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-careconnect-blue border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Carregando candidatos...</p>
            </div>
          )}
          
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 p-6 m-6 rounded-lg text-center">
              <div className="text-red-600 mb-4">
                <XCircle className="w-12 h-12 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Erro ao carregar dados</h3>
                <p className="text-sm">{error}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={fetchUsers}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Tentar novamente
              </Button>
            </div>
          )}
          
          {!loading && !error && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Candidato</TableHead>
                    <TableHead className="font-semibold">Contato</TableHead>
                    <TableHead className="font-semibold">Localização</TableHead>
                    <TableHead className="font-semibold">Qualificação</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Cadastro</TableHead>
                    <TableHead className="font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Users className="w-12 h-12 mb-2 opacity-50" />
                          <p className="font-medium">Nenhum candidato encontrado</p>
                          <p className="text-sm">Tente ajustar os filtros de busca</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{user.nome}</p>
                            {user.cargo && (
                              <Badge variant="outline" className="text-xs">
                                {user.cargo}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-900">{user.email}</p>
                            <p className="text-gray-500">{user.telefone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-900">{user.cidade}</p>
                            <p className="text-gray-500">{user.cep}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-900">{user.escolaridade}</p>
                            <p className="text-gray-500">
                              {user.possui_experiencia === "Sim" ? "Com experiência" : "Sem experiência"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.status_candidatura}
                            onValueChange={(newStatus) => handleStatusChange(user.id, newStatus)}
                          >
                            <SelectTrigger className="w-32">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(user.status_candidatura)}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Em análise">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Em análise
                                </div>
                              </SelectItem>
                              <SelectItem value="Aprovado">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Aprovado
                                </div>
                              </SelectItem>
                              <SelectItem value="Rejeitado">
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  Rejeitado
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {user.data_cadastro ? 
                            new Date(user.data_cadastro).toLocaleDateString('pt-BR') : 
                            "N/A"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(user)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                              title="Visualizar detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(user)}
                              className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                              title="Editar candidato"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              title="Excluir candidato"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="flex justify-between items-center p-4 border-t bg-gray-50/30">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-medium">{filteredUsers.length}</span> de{" "}
                <span className="font-medium">{users.length}</span> candidatos
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Paginação em desenvolvimento</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedUser && (
        <CandidateDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModal}
          candidate={selectedUser}
          onUpdate={handleUpdateUser}
        />
      )}
      
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsAddUserModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Adicionar Novo Candidato</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "A adição de novos candidatos via painel administrativo está em desenvolvimento.",
                });
                setIsAddUserModalOpen(false);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <Input required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input type="email" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <Input type="tel" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <Input required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                    >
                      <option value="Em análise">Em análise</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Rejeitado">Rejeitado</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAddUserModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-careconnect-blue hover:bg-careconnect-blue/90"
                  >
                    Adicionar Candidato
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

export default UsersManagement;
