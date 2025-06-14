
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Phone, Calendar, FileText, Users } from "lucide-react";

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
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-careconnect-blue to-careconnect-blue/90 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="w-4 h-4" />
              Nome Completo
            </label>
            {editMode ? (
              <Input 
                name="nome"
                value={editFormData.nome || ''}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-careconnect-blue focus:ring-careconnect-blue"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900 font-medium">{candidatoData?.nome}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{candidatoData?.email}</p>
              <p className="text-xs text-gray-500 mt-1">🔒 Email não pode ser alterado</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              Data de Nascimento
            </label>
            {editMode ? (
              <Input 
                name="data_nascimento"
                type="date"
                value={editFormData.data_nascimento || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-careconnect-blue focus:ring-careconnect-blue"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.data_nascimento || 'Não informado'}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4" />
              Telefone/WhatsApp
            </label>
            {editMode ? (
              <Input 
                name="telefone"
                value={editFormData.telefone || ''}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                className="border-gray-300 focus:border-careconnect-blue focus:ring-careconnect-blue"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.telefone || 'Não informado'}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              CPF
            </label>
            {editMode ? (
              <Input 
                name="cpf"
                value={editFormData.cpf || ''}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                className="border-gray-300 focus:border-careconnect-blue focus:ring-careconnect-blue"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.cpf || 'Não informado'}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              RG
            </label>
            {editMode ? (
              <Input 
                name="RG"
                value={editFormData.RG || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-careconnect-blue focus:ring-careconnect-blue"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.RG || 'Não informado'}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4" />
              Possui filhos
            </label>
            {editMode ? (
              <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                <Checkbox
                  id="possui_filhos"
                  checked={editFormData.possui_filhos === 'Sim'}
                  onCheckedChange={(checked) => handleCheckboxChange('possui_filhos', checked as boolean)}
                />
                <label htmlFor="possui_filhos" className="text-sm cursor-pointer">Sim, tenho filhos</label>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.possui_filhos || 'Não informado'}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fumante</label>
            {editMode ? (
              <Select onValueChange={(value) => handleSelectChange('fumante', value)} value={editFormData.fumante || ''}>
                <SelectTrigger className="border-gray-300 focus:border-careconnect-blue focus:ring-careconnect-blue">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.fumante || 'Não informado'}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
