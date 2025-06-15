
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoSection } from "@/components/caregiver/PersonalInfoSection";
import { AddressSection } from "@/components/caregiver/AddressSection";
import { ProfessionalSection } from "@/components/caregiver/ProfessionalSection";
import { ReferencesSection } from "@/components/caregiver/ReferencesSection";
import { Edit, Save, X } from "lucide-react";

interface CandidateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: any | null;
  onUpdate: (updatedCandidate: any) => void;
}

export const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({ isOpen, onClose, candidate, onUpdate }) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (candidate) {
      setEditFormData({ ...candidate });
      setEditMode(false);
      setHasChanges(false);
    }
  }, [candidate]);

  useEffect(() => {
    if (candidate && editFormData) {
      const originalData = JSON.stringify(candidate);
      const editedData = JSON.stringify(editFormData);
      setHasChanges(originalData !== editedData);
    }
  }, [candidate, editFormData]);

  if (!candidate) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
      };
      
      const { data, error } = await supabase
        .from('candidatos_cuidadores_rows')
        .update(updateData)
        .eq('id', candidate.id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "✅ Dados atualizados com sucesso!",
        description: "As informações do candidato foram salvas.",
      });
      onUpdate(data);
      setEditMode(false);
      
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados do candidato. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    setEditFormData({...candidate});
    setEditMode(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Perfil do Candidato: {candidate.nome}
            {!editMode ? (
              <Button size="sm" onClick={() => setEditMode(true)}>
                <Edit className="w-4 h-4 mr-2" /> Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" /> Cancelar
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving || !hasChanges}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <PersonalInfoSection
            editMode={editMode}
            candidatoData={candidate}
            editFormData={editFormData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleCheckboxChange={handleCheckboxChange}
          />
          <AddressSection
            editMode={editMode}
            candidatoData={candidate}
            editFormData={editFormData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          <ProfessionalSection
            editMode={editMode}
            candidatoData={candidate}
            editFormData={editFormData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          <ReferencesSection
            editMode={editMode}
            candidatoData={candidate}
            editFormData={editFormData}
            handleInputChange={handleInputChange}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
