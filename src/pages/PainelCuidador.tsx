
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const PainelCuidador = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [candidatoData, setCandidatoData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCandidatoData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('candidatos_cuidadores_rows')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error) {
          console.error('Erro ao buscar dados do candidato:', error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar seus dados. Verifique se você está logado corretamente.",
            variant: "destructive"
          });
          return;
        }

        setCandidatoData(data);
        setEditFormData({...data});
      } catch (error) {
        console.error('Erro ao buscar candidato:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatoData();
  }, [user]);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect if not a caregiver (no data found)
  if (!loading && !candidatoData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Acesso Negado</h2>
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar esta página ou seus dados não foram encontrados.
            </p>
            <Button onClick={() => supabase.auth.signOut()}>
              Fazer Login Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditFormData((prev: any) => ({ ...prev, [name]: checked }));
      return;
    }
    
    setEditFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const updateData = {
        ...editFormData,
        ultima_atualizacao: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('candidatos_cuidadores_rows')
        .update(updateData)
        .eq('id', candidatoData.id);
        
      if (error) throw error;
      
      setCandidatoData({...updateData});
      setEditMode(false);
      
      toast({
        title: "Dados atualizados",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seus dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditFormData({...candidatoData});
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-careconnect-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel do Cuidador</h1>
              <p className="text-gray-600">Bem-vindo, {candidatoData?.nome}</p>
            </div>
            <div className="flex gap-3">
              {!editMode ? (
                <Button
                  onClick={() => setEditMode(true)}
                  className="bg-careconnect-blue hover:bg-careconnect-blue/90"
                >
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
                    {saving ? "Salvando..." : "Salvar"}
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
              <Button
                variant="outline"
                onClick={() => supabase.auth.signOut()}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  {editMode ? (
                    <Input 
                      name="nome"
                      value={editFormData.nome || ''}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{candidatoData?.nome}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{candidatoData?.email}</p>
                  <p className="text-xs text-gray-500">Email não pode ser alterado</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  {editMode ? (
                    <Input 
                      name="telefone"
                      value={editFormData.telefone || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidatoData?.telefone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                  {editMode ? (
                    <Input 
                      name="data_nascimento"
                      type="date"
                      value={editFormData.data_nascimento || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidatoData?.data_nascimento}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  {editMode ? (
                    <Input 
                      name="cidade"
                      value={editFormData.cidade || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-900">{candidatoData?.cidade}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fumante</label>
                  {editMode ? (
                    <select
                      name="fumante"
                      value={editFormData.fumante || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{candidatoData?.fumante}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Escolaridade</label>
                {editMode ? (
                  <Input 
                    name="escolaridade"
                    value={editFormData.escolaridade || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.escolaridade}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experiência</label>
                {editMode ? (
                  <select
                    name="possui_experiencia"
                    value={editFormData.possui_experiencia || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{candidatoData?.possui_experiencia}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Experiência</label>
                {editMode ? (
                  <Textarea 
                    name="descricao_experiencia"
                    value={editFormData.descricao_experiencia || ''}
                    onChange={handleInputChange}
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.descricao_experiencia || 'Não informado'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponível para Dormir no Local</label>
                {editMode ? (
                  <select
                    name="disponivel_dormir_local"
                    value={editFormData.disponivel_dormir_local || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{candidatoData?.disponivel_dormir_local}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status da Candidatura */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Status da Candidatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Atual</label>
                <span className={`px-3 py-2 rounded-full text-sm ${
                  candidatoData?.status_candidatura === "Aprovado"
                    ? "bg-green-100 text-green-800" 
                    : candidatoData?.status_candidatura === "Rejeitado"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {candidatoData?.status_candidatura}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Cadastro</label>
                <p className="text-gray-900">{candidatoData?.data_cadastro}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Última Atualização</label>
                <p className="text-gray-900">{candidatoData?.ultima_atualizacao || 'Nunca atualizado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PainelCuidador;
