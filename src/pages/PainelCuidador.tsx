
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Save, X, FileText, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { PersonalInfoSection } from "@/components/caregiver/PersonalInfoSection";
import { AddressSection } from "@/components/caregiver/AddressSection";
import { ProfessionalSection } from "@/components/caregiver/ProfessionalSection";
import { ReferencesSection } from "@/components/caregiver/ReferencesSection";

const PainelCuidador = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [candidatoData, setCandidatoData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchCandidatoData = async () => {
      console.log("=== INÍCIO DO CARREGAMENTO DE DADOS ===");
      console.log("User:", user);
      console.log("Auth loading:", authLoading);

      if (authLoading) {
        console.log("Aguardando autenticação...");
        return;
      }

      if (!user?.email) {
        console.log("Usuário não autenticado, redirecionando...");
        setLoading(false);
        return;
      }

      try {
        console.log("Buscando dados do candidato para email:", user.email);
        
        const { data, error } = await supabase
          .from('candidatos_cuidadores_rows')
          .select('*')
          .eq('email', user.email)
          .maybeSingle(); // Usar maybeSingle ao invés de single

        console.log("Resultado da busca:", { data, error });

        if (error) {
          console.error('Erro ao buscar dados do candidato:', error);
          // Não mostrar erro se não encontrar dados
          if (error.code !== 'PGRST116') {
            toast({
              title: "Erro",
              description: "Erro ao carregar dados. Tente novamente.",
              variant: "destructive"
            });
          }
        }

        if (data) {
          console.log("Dados do candidato encontrados:", data);
          setCandidatoData(data);
          setEditFormData({...data});
        } else {
          console.log("Nenhum dado encontrado, mas usuário está autenticado");
          // Criar um registro básico se não existir
          const basicData = {
            nome: user?.user_metadata?.name || '',
            email: user.email,
            telefone: user?.user_metadata?.whatsapp || '',
            data_nascimento: null,
            fumante: 'Não',
            escolaridade: '',
            possui_experiencia: 'Não',
            disponivel_dormir_local: 'Não',
            status_candidatura: 'Cadastro incompleto',
            cidade: '',
            endereco: 'A ser preenchido',
            cep: '00000-000',
            possui_filhos: "Não",
            cursos: 'A ser preenchido',
            descricao_experiencia: 'A ser preenchido no cadastro completo',
            disponibilidade_horarios: 'A ser definido',
            referencias: 'A ser preenchido no cadastro completo',
            data_cadastro: new Date().toISOString().split('T')[0]
          };
          
          // Tentar criar o registro
          const { data: newData, error: insertError } = await supabase
            .from('candidatos_cuidadores_rows')
            .insert(basicData)
            .select()
            .single();
            
          if (insertError) {
            console.error("Erro ao criar registro básico:", insertError);
          } else {
            console.log("Registro básico criado:", newData);
            setCandidatoData(newData);
            setEditFormData({...newData});
          }
        }
      } catch (error) {
        console.error('Erro geral ao buscar candidato:', error);
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
  }, [user, authLoading, toast]);

  // Check for changes
  useEffect(() => {
    if (candidatoData && editFormData) {
      const hasChanged = JSON.stringify(candidatoData) !== JSON.stringify(editFormData);
      setHasChanges(hasChanged);
    }
  }, [candidatoData, editFormData]);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    console.log("Redirecionando para login - usuário não autenticado");
    return <Navigate to="/admin/login" replace />;
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
        ultima_atualizacao: new Date().toISOString(),
        status_candidatura: 'Cadastro completo - Em análise'
      };
      
      const { error } = await supabase
        .from('candidatos_cuidadores_rows')
        .update(updateData)
        .eq('id', candidatoData.id);
        
      if (error) throw error;
      
      setCandidatoData({...updateData});
      setEditMode(false);
      setHasChanges(false);
      
      toast({
        title: "✅ Dados atualizados com sucesso!",
        description: "Suas informações foram salvas e estão sendo analisadas pela nossa equipe.",
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
    setHasChanges(false);
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

  // Check if registration is complete
  const requiredFields = [
    'nome', 'email', 'telefone', 'data_nascimento', 'cep', 'endereco', 
    'cidade', 'escolaridade', 'disponibilidade_horarios', 'cargo', 
    'experiencia', 'referencias'
  ];
  
  const isRegistrationComplete = candidatoData && requiredFields.every(field => 
    candidatoData[field] && candidatoData[field].toString().trim() !== '' && candidatoData[field] !== 'A ser preenchido'
  );

  const completionPercentage = candidatoData ? Math.round(
    (requiredFields.filter(field => 
      candidatoData[field] && candidatoData[field].toString().trim() !== '' && candidatoData[field] !== 'A ser preenchido'
    ).length / requiredFields.length) * 100
  ) : 0;

  const getStatusIcon = () => {
    if (isRegistrationComplete) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (completionPercentage >= 50) return <Clock className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusColor = () => {
    if (isRegistrationComplete) return 'bg-green-50 border-green-200';
    if (completionPercentage >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-careconnect-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  // Se não tem dados do candidato, mostrar opção para completar cadastro
  if (!candidatoData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Complete seu cadastro</h2>
            <p className="text-gray-600 mb-4">
              Para acessar o painel do cuidador, você precisa completar seu cadastro profissional.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/cadastrar-cuidador')}
                className="w-full bg-careconnect-blue hover:bg-careconnect-blue/90"
              >
                Completar Cadastro
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full"
              >
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header melhorado */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-careconnect-blue rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel do Cuidador</h1>
                <p className="text-gray-600">Olá, {candidatoData?.nome || 'Cuidador'} 👋</p>
              </div>
            </div>
            <div className="flex gap-3">
              {!editMode ? (
                <Button
                  onClick={() => setEditMode(true)}
                  className="bg-careconnect-blue hover:bg-careconnect-blue/90 shadow-md"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="shadow-md"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="shadow-md"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status aprimorado */}
      <div className="container mx-auto px-4 py-6">
        <Card className={`${getStatusColor()} shadow-lg`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon()}
                <div>
                  <h3 className="font-semibold text-lg">
                    {isRegistrationComplete ? '🎉 Perfil Completo!' : '📝 Complete seu Perfil'}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {isRegistrationComplete 
                      ? 'Parabéns! Seu perfil está completo e sendo analisado pela nossa equipe.'
                      : `Você está quase lá! Faltam apenas ${100 - completionPercentage}% para completar seu perfil profissional.`
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800 mb-1">{completionPercentage}%</div>
                <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 rounded-full ${
                      isRegistrationComplete ? 'bg-green-500' : 
                      completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content com animações */}
      <div className="container mx-auto px-4 pb-24 space-y-8">
        <div className="animate-fade-in">
          <PersonalInfoSection
            editMode={editMode}
            candidatoData={candidatoData}
            editFormData={editFormData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <AddressSection
            editMode={editMode}
            candidatoData={candidatoData}
            editFormData={editFormData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ProfessionalSection
            editMode={editMode}
            candidatoData={candidatoData}
            editFormData={editFormData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <ReferencesSection
            editMode={editMode}
            candidatoData={candidatoData}
            editFormData={editFormData}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>

      {/* Floating Save Button - O destaque criativo! */}
      {editMode && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`transition-all duration-300 ${hasChanges ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}`}>
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={`
                bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
                text-white shadow-2xl text-lg px-8 py-4 rounded-full
                transform transition-all duration-300 hover:scale-105
                ${hasChanges ? 'animate-pulse' : ''}
                ${saving ? 'cursor-not-allowed opacity-50' : 'hover:shadow-3xl'}
              `}
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-3" />
                  {hasChanges ? 'Salvar Alterações' : 'Salvar'}
                </>
              )}
            </Button>
          </div>
          
          {/* Indicador de mudanças */}
          {hasChanges && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute"></div>
            </div>
          )}
        </div>
      )}

      {/* Help Tip */}
      {editMode && (
        <div className="fixed bottom-6 left-6 z-40">
          <Card className="bg-blue-50 border-blue-200 shadow-lg max-w-xs">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 text-sm">💡 Dica</h4>
                  <p className="text-blue-700 text-xs mt-1">
                    Suas alterações são salvas automaticamente quando você clica em "Salvar Alterações".
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PainelCuidador;
