
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, UserPlus, Eye, Filter, Users, CheckCircle, XCircle, Clock } from "lucide-react";
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
  possui_filhos: boolean;
  escolaridade: string;
  cursos: string | null;
  possui_experiencia: string;
  descricao_experiencia: string | null;
  disponibilidade_horarios: string | null;
  disponivel_dormir_local: string;
  referencias: string | null;
  perfil_profissional: string | null;
  ultima_atualizacao: string | null;
  cidade: string;
  endereco: string;
  cep: string;
};

const UsersManagement = () => {
  const [users, setUsers] = useState<CandidatoCuidador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CandidatoCuidador | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<CandidatoCuidador>>({});
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
        .select('*');
      
      if (error) {
        throw error;
      }
      // Convert "possui_filhos" from string to boolean for the local state
      const mappedData = (data || []).map((user) => ({
        ...user,
        possui_filhos: user.possui_filhos === "Sim", // Convert to boolean
      }));
      setUsers(mappedData);
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

  // Filter users based on search term, cargo and status
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
    setIsViewDetailsModalOpen(true);
  };

  const handleEditClick = (user: CandidatoCuidador) => {
    setSelectedUser(user);
    setEditFormData({...user}); // Initialize form with current user data
    setIsEditModalOpen(true);
    setIsViewDetailsModalOpen(false);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      setLoading(true);
      // Convert possui_filhos boolean back to string for Supabase
      const updateData = {
        ...editFormData,
        possui_filhos: editFormData.possui_filhos ? "Sim" : "Não", // <<<<<
        ultima_atualizacao: new Date().toISOString(),
      };
      const { error: updateError } = await supabase
        .from('candidatos_cuidadores_rows')
        .update(updateData)
        .eq('id', selectedUser.id);
      if (updateError) throw updateError;
      // Update state with converted boolean as well
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id
            ? { ...user, ...updateData, possui_filhos: updateData.possui_filhos === "Sim" }
            : user
        )
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditFormData({});
      toast({
        title: "Candidato atualizado",
        description: "As informações do candidato foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar candidato:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o candidato. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique cargo values from the users data
  const cargoOptions = Array.from(
    new Set(users.filter(user => user.cargo).map(user => user.cargo))
  );

  // Get unique status values from the users data
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-careconnect-blue to-blue-600 text-white p-6 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Gerenciamento de Candidatos</h1>
          </div>
          <p className="text-blue-100">
            Gerencie contas de candidatos e visualize seus dados de forma organizada.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{users.length} candidatos total</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{filteredUsers.length} filtrados</span>
            </div>
          </div>
        </div>
        <Button 
          className="mt-6 lg:mt-0 bg-white text-careconnect-blue hover:bg-gray-100 font-semibold"
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
            
            {/* Search and Filter Toggle */}
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
            </div>
          </div>
          
          {/* Filters Section */}
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
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-careconnect-blue border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Carregando candidatos...</p>
            </div>
          )}
          
          {/* Error state */}
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
          
          {/* Users Table */}
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
                          <Badge 
                            variant={getStatusVariant(user.status_candidatura)}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getStatusIcon(user.status_candidatura)}
                            {user.status_candidatura}
                          </Badge>
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
                              onClick={() => handleEditClick(user)}
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
          
          {/* Footer with pagination info */}
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
      
      {/* Details Modal */}
      {isViewDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsViewDetailsModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b z-10">
              <div className="flex justify-between items-center p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedUser.nome}</h2>
                  <p className="text-gray-500 mt-1">Detalhes do candidato</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => handleEditClick(selectedUser)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="ghost" onClick={() => setIsViewDetailsModalOpen(false)}>
                    ✕
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Informações Pessoais
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="text-gray-900">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Telefone:</span>
                        <span className="text-gray-900">{selectedUser.telefone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Data de Nascimento:</span>
                        <span className="text-gray-900">{selectedUser.data_nascimento}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Fumante:</span>
                        <Badge variant={selectedUser.fumante === "Sim" ? "destructive" : "default"}>
                          {selectedUser.fumante}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Possui Filhos:</span>
                        <Badge variant={selectedUser.possui_filhos ? "default" : "secondary"}>
                          {selectedUser.possui_filhos ? 'Sim' : 'Não'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-3">Endereço</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Cidade:</span>
                        <span className="text-gray-900">{selectedUser.cidade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Endereço:</span>
                        <span className="text-gray-900">{selectedUser.endereco}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">CEP:</span>
                        <span className="text-gray-900">{selectedUser.cep}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Professional Information */}
                <div className="space-y-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-3">Qualificações</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Escolaridade:</span>
                        <span className="text-gray-900">{selectedUser.escolaridade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Cursos:</span>
                        <span className="text-gray-900">{selectedUser.cursos || "Não informado"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Cargo:</span>
                        <span className="text-gray-900">{selectedUser.cargo || "Não informado"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-3">Experiência</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Possui Experiência:</span>
                        <Badge variant={selectedUser.possui_experiencia === "Sim" ? "default" : "secondary"}>
                          {selectedUser.possui_experiencia}
                        </Badge>
                      </div>
                      {selectedUser.descricao_experiencia && (
                        <div>
                          <span className="font-medium text-gray-700 block mb-1">Descrição:</span>
                          <p className="text-gray-900 bg-white p-2 rounded border text-xs">
                            {selectedUser.descricao_experiencia}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-indigo-900 mb-3">Disponibilidade</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Horários:</span>
                        <span className="text-gray-900">{selectedUser.disponibilidade_horarios || "Não informado"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Dormir no Local:</span>
                        <Badge variant={selectedUser.disponivel_dormir_local === "Sim" ? "default" : "secondary"}>
                          {selectedUser.disponivel_dormir_local}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Status da Candidatura</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge 
                        variant={getStatusVariant(selectedUser.status_candidatura)}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(selectedUser.status_candidatura)}
                        {selectedUser.status_candidatura}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Cadastro:</span>
                        <span className="text-gray-900">
                          {selectedUser.data_cadastro ? 
                            new Date(selectedUser.data_cadastro).toLocaleDateString('pt-BR') : 
                            "N/A"
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Última Atualização:</span>
                        <span className="text-gray-900">
                          {selectedUser.ultima_atualizacao ? 
                            new Date(selectedUser.ultima_atualizacao).toLocaleDateString('pt-BR') : 
                            "Não houve atualização"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {(selectedUser.referencias || selectedUser.perfil_profissional) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Informações Adicionais</h3>
                      {selectedUser.perfil_profissional && (
                        <div className="mb-3">
                          <span className="font-medium text-gray-700 block mb-1">Perfil Profissional:</span>
                          <p className="text-gray-900 bg-white p-2 rounded border text-xs">
                            {selectedUser.perfil_profissional}
                          </p>
                        </div>
                      )}
                      {selectedUser.referencias && (
                        <div>
                          <span className="font-medium text-gray-700 block mb-1">Referências:</span>
                          <p className="text-gray-900 bg-white p-2 rounded border text-xs">
                            {selectedUser.referencias}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Editar Candidato</h2>
                <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                  Fechar
                </Button>
              </div>
              
              <form onSubmit={handleSaveEdit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações Pessoais */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 border-b pb-2">Informações Pessoais</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <Input 
                        name="nome"
                        value={editFormData.nome || ''}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input 
                        name="email" 
                        type="email"
                        value={editFormData.email || ''}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                      <Input 
                        name="telefone"
                        value={editFormData.telefone || ''}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                      <Input 
                        name="data_nascimento"
                        value={editFormData.data_nascimento || ''}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                      <Input 
                        name="cidade"
                        value={editFormData.cidade || ''}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                      <Input 
                        name="endereco"
                        value={editFormData.endereco || ''}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                      <Input 
                        name="cep"
                        value={editFormData.cep || ''}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fumante</label>
                      <select
                        name="fumante"
                        value={editFormData.fumante || ''}
                        onChange={handleEditInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                        required
                      >
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Possui Filhos</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          name="possui_filhos"
                          checked={!!editFormData.possui_filhos}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, possui_filhos: e.target.checked }))}
                          className="h-4 w-4 rounded border-gray-300 text-careconnect-blue focus:ring-careconnect-blue"
                        />
                        <span>Sim</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Formação e Experiência */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 border-b pb-2">Formação e Experiência</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Escolaridade</label>
                      <Input 
                        name="escolaridade"
                        value={editFormData.escolaridade || ''}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cursos</label>
                      <Input 
                        name="cursos"
                        value={editFormData.cursos || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                      <Input 
                        name="cargo"
                        value={editFormData.cargo || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Possui Experiência</label>
                      <select
                        name="possui_experiencia"
                        value={editFormData.possui_experiencia || ''}
                        onChange={handleEditInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                        required
                      >
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Experiência</label>
                      <textarea 
                        name="descricao_experiencia"
                        value={editFormData.descricao_experiencia || ''}
                        onChange={handleEditInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidade de Horários</label>
                      <Input 
                        name="disponibilidade_horarios"
                        value={editFormData.disponibilidade_horarios || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Disponível para Dormir no Local</label>
                      <select
                        name="disponivel_dormir_local"
                        value={editFormData.disponivel_dormir_local || ''}
                        onChange={handleEditInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                        required
                      >
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Referências</label>
                      <textarea 
                        name="referencias"
                        value={editFormData.referencias || ''}
                        onChange={handleEditInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Perfil Profissional</label>
                      <textarea 
                        name="perfil_profissional"
                        value={editFormData.perfil_profissional || ''}
                        onChange={handleEditInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status da Candidatura</label>
                      <select
                        name="status_candidatura"
                        value={editFormData.status_candidatura || ''}
                        onChange={handleEditInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                        required
                      >
                        <option value="Em análise">Em análise</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Rejeitado">Rejeitado</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-careconnect-blue hover:bg-careconnect-blue/90"
                    disabled={loading}
                  >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Add User Modal */}
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
