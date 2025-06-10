
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Save, X, User, MapPin, GraduationCap, Clock, FileText } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type CandidatoCuidador = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
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
  cidade: string;
  endereco: string;
  cep: string;
  status_candidatura: string;
  data_cadastro: string;
  ultima_atualizacao: string | null;
};

export default function PainelCuidador() {
  const [candidato, setCandidato] = useState<CandidatoCuidador | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<CandidatoCuidador>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há credenciais salvas ou usuário logado
    const userData = localStorage.getItem('fallback_user');
    if (!userData) {
      navigate('/admin/login');
      return;
    }

    const user = JSON.parse(userData);
    fetchCandidatoData(user.email);
  }, [navigate]);

  const fetchCandidatoData = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('candidatos_cuidadores_rows')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        throw error;
      }

      setCandidato(data);
      setEditData(data);
    } catch (error) {
      console.error('Erro ao buscar dados do candidato:', error);
      toast.error('Não foi possível carregar seus dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditData({ ...candidato });
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({ ...candidato });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!candidato) return;

    setSaving(true);
    try {
      const updateData = {
        ...editData,
        ultima_atualizacao: new Date().toISOString()
      };

      const { error } = await supabase
        .from('candidatos_cuidadores_rows')
        .update(updateData)
        .eq('id', candidato.id);

      if (error) throw error;

      setCandidato({ ...candidato, ...updateData } as CandidatoCuidador);
      setEditMode(false);
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fallback_user');
    navigate('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-12 md:py-20 bg-primary/5 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-4">Carregando seus dados...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (!candidato) {
    return (
      <Layout>
        <div className="py-12 md:py-20 bg-primary/5 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Dados não encontrados</h1>
            <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-20 bg-primary/5 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Olá, {candidato.nome}!
              </h1>
              <p className="text-lg text-gray-600">
                Gerencie suas informações de candidato
              </p>
            </div>
            <div className="flex gap-3">
              {!editMode ? (
                <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Dados
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
              <Button onClick={handleLogout} variant="outline">
                Sair
              </Button>
            </div>
          </div>

          {/* Status da Candidatura */}
          <Alert className="mb-6">
            <AlertDescription>
              <strong>Status da sua candidatura:</strong> 
              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                candidato.status_candidatura === "Aprovado"
                  ? "bg-green-100 text-green-800" 
                  : candidato.status_candidatura === "Rejeitado"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {candidato.status_candidatura}
              </span>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  {editMode ? (
                    <Input 
                      name="nome"
                      value={editData.nome || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.nome}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {editMode ? (
                    <Input 
                      name="email"
                      type="email"
                      value={editData.email || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  {editMode ? (
                    <Input 
                      name="telefone"
                      value={editData.telefone || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.telefone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                  {editMode ? (
                    <Input 
                      name="data_nascimento"
                      value={editData.data_nascimento || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.data_nascimento}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fumante</label>
                  {editMode ? (
                    <select
                      name="fumante"
                      value={editData.fumante || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{candidato.fumante}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Possui Filhos</label>
                  {editMode ? (
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        name="possui_filhos"
                        checked={!!editData.possui_filhos}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span>Sim</span>
                    </div>
                  ) : (
                    <p className="text-gray-900">{candidato.possui_filhos ? 'Sim' : 'Não'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  {editMode ? (
                    <Input 
                      name="cidade"
                      value={editData.cidade || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.cidade}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  {editMode ? (
                    <Input 
                      name="endereco"
                      value={editData.endereco || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.endereco}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                  {editMode ? (
                    <Input 
                      name="cep"
                      value={editData.cep || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.cep}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Formação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Formação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Escolaridade</label>
                  {editMode ? (
                    <Input 
                      name="escolaridade"
                      value={editData.escolaridade || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.escolaridade}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cursos</label>
                  {editMode ? (
                    <textarea
                      name="cursos"
                      value={editData.cursos || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.cursos || 'Não informado'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experiência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Experiência e Disponibilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Possui Experiência</label>
                  {editMode ? (
                    <select
                      name="possui_experiencia"
                      value={editData.possui_experiencia || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{candidato.possui_experiencia}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Experiência</label>
                  {editMode ? (
                    <textarea
                      name="descricao_experiencia"
                      value={editData.descricao_experiencia || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.descricao_experiencia || 'Não informado'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidade de Horários</label>
                  {editMode ? (
                    <Input 
                      name="disponibilidade_horarios"
                      value={editData.disponibilidade_horarios || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidato.disponibilidade_horarios || 'Não informado'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disponível para Dormir no Local</label>
                  {editMode ? (
                    <select
                      name="disponivel_dormir_local"
                      value={editData.disponivel_dormir_local || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{candidato.disponivel_dormir_local}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações Adicionais */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referências</label>
                {editMode ? (
                  <textarea
                    name="referencias"
                    value={editData.referencias || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{candidato.referencias || 'Não informado'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil Profissional</label>
                {editMode ? (
                  <textarea
                    name="perfil_profissional"
                    value={editData.perfil_profissional || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{candidato.perfil_profissional || 'Não informado'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Data de Cadastro:</span> {candidato.data_cadastro}
                </div>
                <div>
                  <span className="font-medium">Última Atualização:</span> {candidato.ultima_atualizacao || 'Nunca atualizado'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
