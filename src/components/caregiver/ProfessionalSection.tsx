
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, GraduationCap, Award } from "lucide-react";

interface ProfessionalSectionProps {
  editMode: boolean;
  candidatoData: any;
  editFormData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const ProfessionalSection: React.FC<ProfessionalSectionProps> = ({
  editMode,
  candidatoData,
  editFormData,
  handleInputChange,
  handleSelectChange,
}) => {
  // Função para determinar quais registros profissionais mostrar
  const getRelevantRegistrations = (cargo: string) => {
    const registrations = [];
    
    if (cargo === "Técnico(a) de Enfermagem" || cargo === "Enfermeiro(a)") {
      registrations.push("coren");
    }
    
    if (cargo === "Fisioterapeuta" || cargo === "Terapeuta Ocupacional") {
      registrations.push("crefito");
    }
    
    if (cargo === "Médico(a)") {
      registrations.push("crm");
    }
    
    return registrations;
  };

  const currentCargo = editMode ? editFormData.cargo : candidatoData?.cargo;
  const relevantRegistrations = getRelevantRegistrations(currentCargo || '');
  const showRegistrationsCard = relevantRegistrations.length > 0;

  return (
    <>
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
                    <SelectItem value="Médico(a)">Médico(a)</SelectItem>
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

      {/* Registros Profissionais - Condicional */}
      {showRegistrationsCard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Registros Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relevantRegistrations.includes("coren") && (
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
              )}

              {relevantRegistrations.includes("crefito") && (
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
              )}

              {relevantRegistrations.includes("crm") && (
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
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
