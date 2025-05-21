
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

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
  const [selectedUser, setSelectedUser] = useState<CandidatoCuidador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cargoFilter, setCargoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
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

  // Get unique cargo values from the users data
  const cargoOptions = Array.from(
    new Set(users.filter(user => user.cargo).map(user => user.cargo))
  );

  // Get unique status values from the users data
  const statusOptions = Array.from(
    new Set(users.map(user => user.status_candidatura))
  );

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Candidatos</h1>
          <p className="text-gray-600">Gerencie contas de candidatos e visualize seus dados.</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-careconnect-blue hover:bg-careconnect-blue/90"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar Novo Candidato
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Candidatos Cuidadores</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar candidatos..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                value={cargoFilter}
                onChange={(e) => setCargoFilter(e.target.value)}
              >
                <option value="all">Todos os Cargos</option>
                {cargoOptions.map((cargo, index) => (
                  cargo && <option key={index} value={cargo}>{cargo}</option>
                ))}
              </select>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-careconnect-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Error state */}
          {!loading && error && (
            <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
              {error}
              <Button 
                variant="outline" 
                className="mt-2 mx-auto block" 
                onClick={fetchUsers}
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
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Formação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                        Nenhum candidato encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>{user.nome}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.telefone}</TableCell>
                        <TableCell>{user.cidade}</TableCell>
                        <TableCell>{user.escolaridade}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status_candidatura === "Aprovado"
                              ? "bg-green-100 text-green-800" 
                              : user.status_candidatura === "Rejeitado"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {user.status_candidatura}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-500">{user.data_cadastro || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(user)}
                            >
                              Ver detalhes
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="w-4 h-4" />
                              <span className="sr-only">Excluir</span>
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
          
          {/* Pagination */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Mostrando {filteredUsers.length} de {users.length} candidatos
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Details Modal */}
      {isViewDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsViewDetailsModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{selectedUser.nome}</h2>
                <Button variant="ghost" onClick={() => setIsViewDetailsModalOpen(false)}>
                  Fechar
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-700">Informações Pessoais</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                      <p><span className="font-medium">Telefone:</span> {selectedUser.telefone}</p>
                      <p><span className="font-medium">Data de Nascimento:</span> {selectedUser.data_nascimento}</p>
                      <p><span className="font-medium">Cidade:</span> {selectedUser.cidade}</p>
                      <p><span className="font-medium">Endereço:</span> {selectedUser.endereco}</p>
                      <p><span className="font-medium">CEP:</span> {selectedUser.cep}</p>
                      <p><span className="font-medium">Fumante:</span> {selectedUser.fumante}</p>
                      <p><span className="font-medium">Possui Filhos:</span> {selectedUser.possui_filhos ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">Formação</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Escolaridade:</span> {selectedUser.escolaridade}</p>
                      <p><span className="font-medium">Cursos:</span> {selectedUser.cursos || "Não informado"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-700">Experiência Profissional</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Possui Experiência:</span> {selectedUser.possui_experiencia}</p>
                      <p><span className="font-medium">Descrição da Experiência:</span> {selectedUser.descricao_experiencia || "Não informado"}</p>
                      <p><span className="font-medium">Perfil Profissional:</span> {selectedUser.perfil_profissional || "Não informado"}</p>
                      <p><span className="font-medium">Referências:</span> {selectedUser.referencias || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">Disponibilidade</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Horários:</span> {selectedUser.disponibilidade_horarios || "Não informado"}</p>
                      <p><span className="font-medium">Pode Dormir no Local:</span> {selectedUser.disponivel_dormir_local}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700">Status da Candidatura</h3>
                    <div className="mt-2 space-y-2">
                      <p>
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedUser.status_candidatura === "Aprovado"
                            ? "bg-green-100 text-green-800" 
                            : selectedUser.status_candidatura === "Rejeitado"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {selectedUser.status_candidatura}
                        </span>
                      </p>
                      <p><span className="font-medium">Data de Cadastro:</span> {selectedUser.data_cadastro}</p>
                      <p><span className="font-medium">Última Atualização:</span> {selectedUser.ultima_atualizacao || "Não houve atualização"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsViewDetailsModalOpen(false)}>
                  Fechar
                </Button>
                <Button 
                  className="bg-careconnect-blue hover:bg-careconnect-blue/90"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Candidato
                </Button>
              </div>
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
