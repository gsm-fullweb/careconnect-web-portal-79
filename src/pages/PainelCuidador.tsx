
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Save, X, FileText, ArrowRight, Phone, MapPin, GraduationCap, Briefcase, Heart, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const PainelCuidador = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const handleSelectChange = (name: string, value: string) => {
    setEditFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditFormData((prev: any) => ({ ...prev, [name]: checked ? 'Sim' : 'Não' }));
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

  const handleCompleteRegistration = () => {
    localStorage.setItem('caregiver_data', JSON.stringify(candidatoData));
    navigate('/cadastrar-cuidador');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta.",
      });
      setTimeout(() => {
        navigate('/');
      }, 200);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um problema ao sair. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Check if registration is incomplete
  const isRegistrationIncomplete = !candidatoData?.escolaridade || 
    !candidatoData?.disponibilidade_horarios || 
    !candidatoData?.cargo || 
    !candidatoData?.experiencia || 
    !candidatoData?.referencias;

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
              <p className="text-gray-600">Bem-vindo(a), {candidatoData?.nome}</p>
            </div>
            <div className="flex gap-3">
              {/* Complete Registration Button */}
              {isRegistrationIncomplete && (
                <Button
                  onClick={handleCompleteRegistration}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Completar Cadastro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
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
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Status Alert */}
      {isRegistrationIncomplete && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-yellow-800 font-medium">Cadastro Incompleto</h3>
                <p className="text-yellow-700 text-sm">
                  Seu cadastro ainda não está completo. Clique em "Completar Cadastro" para preencher 
                  todas as informações necessárias e ativar seu perfil profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                {editMode ? (
                  <Input 
                    name="cpf"
                    value={editFormData.cpf || ''}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.cpf || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                {editMode ? (
                  <Input 
                    name="RG"
                    value={editFormData.RG || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.RG || 'Não informado'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Possui filhos</label>
                {editMode ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="possui_filhos"
                      checked={editFormData.possui_filhos === 'Sim'}
                      onCheckedChange={(checked) => handleCheckboxChange('possui_filhos', checked as boolean)}
                    />
                    <label htmlFor="possui_filhos" className="text-sm">Sim, tenho filhos</label>
                  </div>
                ) : (
                  <p className="text-gray-900">{candidatoData?.possui_filhos}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fumante</label>
                {editMode ? (
                  <Select onValueChange={(value) => handleSelectChange('fumante', value)} value={editFormData.fumante || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-900">{candidatoData?.fumante}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                {editMode ? (
                  <Input 
                    name="telefone"
                    value={editFormData.telefone || ''}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.telefone}</p>
                )}
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                {editMode ? (
                  <Input 
                    name="cep"
                    value={editFormData.cep || ''}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.cep || 'Não informado'}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                {editMode ? (
                  <Input 
                    name="estado"
                    value={editFormData.estado || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.estado || 'Não informado'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                {editMode ? (
                  <Input 
                    name="endereco"
                    value={editFormData.endereco || ''}
                    onChange={handleInputChange}
                    placeholder="Rua, número, complemento"
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.endereco || 'Não informado'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formação Acadêmica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Formação Acadêmica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escolaridade</label>
              {editMode ? (
                <Select onValueChange={(value) => handleSelectChange('escolaridade', value)} value={editFormData.escolaridade || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ensino Fundamental">Ensino Fundamental</SelectItem>
                    <SelectItem value="Ensino Médio">Ensino Médio</SelectItem>
                    <SelectItem value="Técnico">Curso Técnico</SelectItem>
                    <SelectItem value="Superior">Ensino Superior</SelectItem>
                    <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-900">{candidatoData?.escolaridade || 'Não informado'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cursos Realizados</label>
              {editMode ? (
                <Textarea 
                  name="cursos"
                  value={editFormData.cursos || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Descreva os cursos relacionados à área da saúde ou cuidados com idosos"
                />
              ) : (
                <p className="text-gray-900">{candidatoData?.cursos || 'Não informado'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Informações Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria Profissional</label>
                {editMode ? (
                  <Select onValueChange={(value) => handleSelectChange('cargo', value)} value={editFormData.cargo || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cuidador(a) de Idosos">Cuidador(a) de Idosos</SelectItem>
                      <SelectItem value="Técnico(a) de Enfermagem">Técnico(a) de Enfermagem</SelectItem>
                      <SelectItem value="Enfermeiro(a)">Enfermeiro(a)</SelectItem>
                      <SelectItem value="Fisioterapeuta">Fisioterapeuta</SelectItem>
                      <SelectItem value="Terapeuta Ocupacional">Terapeuta Ocupacional</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-900">{candidatoData?.cargo || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidade</label>
                {editMode ? (
                  <Select onValueChange={(value) => handleSelectChange('disponibilidade_horarios', value)} value={editFormData.disponibilidade_horarios || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Período Diurno">Período Diurno</SelectItem>
                      <SelectItem value="Período Noturno">Período Noturno</SelectItem>
                      <SelectItem value="Período Integral">Período Integral</SelectItem>
                      <SelectItem value="Horário Flexível">Horário Flexível</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-900">{candidatoData?.disponibilidade_horarios || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experiência</label>
                {editMode ? (
                  <Select onValueChange={(value) => handleSelectChange('possui_experiencia', value)} value={editFormData.possui_experiencia || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-900">{candidatoData?.possui_experiencia}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponível para Dormir no Local</label>
                {editMode ? (
                  <Select onValueChange={(value) => handleSelectChange('disponivel_dormir_local', value)} value={editFormData.disponivel_dormir_local || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sim">Sim</SelectItem>
                      <SelectItem value="Não">Não</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-900">{candidatoData?.disponivel_dormir_local}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Experiência</label>
              {editMode ? (
                <Textarea 
                  name="descricao_experiencia"
                  value={editFormData.descricao_experiencia || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Descreva suas experiências anteriores..."
                />
              ) : (
                <p className="text-gray-900">{candidatoData?.descricao_experiencia || 'Não informado'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experiência Detalhada</label>
              {editMode ? (
                <Textarea 
                  name="experiencia"
                  value={editFormData.experiencia || ''}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Conte um pouco sobre suas experiências anteriores, mencionando o tempo de atuação..."
                />
              ) : (
                <p className="text-gray-900">{candidatoData?.experiencia || 'Não informado'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registros Profissionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Registros Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COREN</label>
                {editMode ? (
                  <Input 
                    name="coren"
                    value={editFormData.coren || ''}
                    onChange={handleInputChange}
                    placeholder="Número do COREN"
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.coren || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CREFITO</label>
                {editMode ? (
                  <Input 
                    name="crefito"
                    value={editFormData.crefito || ''}
                    onChange={handleInputChange}
                    placeholder="Número do CREFITO"
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.crefito || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CRM</label>
                {editMode ? (
                  <Input 
                    name="crm"
                    value={editFormData.crm || ''}
                    onChange={handleInputChange}
                    placeholder="Número do CRM"
                  />
                ) : (
                  <p className="text-gray-900">{candidatoData?.crm || 'Não informado'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Referências Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referências</label>
              {editMode ? (
                <Textarea 
                  name="referencias"
                  value={editFormData.referencias || ''}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Liste suas referências profissionais separadas por ' | '"
                />
              ) : (
                <div className="space-y-2">
                  {candidatoData?.referencias ? (
                    candidatoData.referencias.split(' | ').map((ref: string, index: number) => (
                      <p key={index} className="text-gray-900 p-2 bg-gray-50 rounded">
                        <span className="font-medium">Referência {index + 1}:</span> {ref}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-900">Não informado</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PainelCuidador;
