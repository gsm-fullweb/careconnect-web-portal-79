
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";

interface PersonalInfoSectionProps {
  editMode: boolean;
  candidatoData: any;
  editFormData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  editMode,
  candidatoData,
  editFormData,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
}) => {
  return (
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone/WhatsApp</label>
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
  );
};
