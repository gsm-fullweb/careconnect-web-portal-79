
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Edit, Save, X, FileText, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { PersonalInfoSection } from "@/components/caregiver/PersonalInfoSection";
import { AddressSection } from "@/components/caregiver/AddressSection";
import { ProfessionalSection } from "@/components/caregiver/ProfessionalSection";
import { ReferencesSection } from "@/components/caregiver/ReferencesSection";

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
  
  const isRegistrationComplete = requiredFields.every(field => 
    candidatoData?.[field] && candidatoData[field].trim() !== ''
  );

  const completionPercentage = Math.round(
    (requiredFields.filter(field => 
      candidatoData?.[field] && candidatoData[field].trim() !== ''
    ).length / requiredFields.length) * 100
  );

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

      {/* Status do Cadastro */}
      <div className="container mx-auto px-4 py-4">
        <Card className={`${isRegistrationComplete ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isRegistrationComplete ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <FileText className="w-6 h-6 text-yellow-600" />
                )}
                <div>
                  <h3 className={`font-medium ${isRegistrationComplete ? 'text-green-800' : 'text-yellow-800'}`}>
                    {isRegistrationComplete ? 'Cadastro Completo' : 'Cadastro Incompleto'}
                  </h3>
                  <p className={`text-sm ${isRegistrationComplete ? 'text-green-700' : 'text-yellow-700'}`}>
                    {isRegistrationComplete 
                      ? 'Seu perfil está completo e em análise pela nossa equipe.'
                      : `Seu perfil está ${completionPercentage}% completo. Complete as informações para ativar seu perfil profissional.`
                    }
                  </p>
                </div>
              </div>
              {!isRegistrationComplete && (
                <div className="text-right">
                  <div className="text-sm font-medium text-yellow-800">{completionPercentage}%</div>
                  <div className="w-20 h-2 bg-yellow-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-yellow-600 rounded-full transition-all"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-6">
        <PersonalInfoSection
          editMode={editMode}
          candidatoData={candidatoData}
          editFormData={editFormData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleCheckboxChange={handleCheckboxChange}
        />

        <AddressSection
          editMode={editMode}
          candidatoData={candidatoData}
          editFormData={editFormData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />

        <ProfessionalSection
          editMode={editMode}
          candidatoData={candidatoData}
          editFormData={editFormData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />

        <ReferencesSection
          editMode={editMode}
          candidatoData={candidatoData}
          editFormData={editFormData}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default PainelCuidador;
