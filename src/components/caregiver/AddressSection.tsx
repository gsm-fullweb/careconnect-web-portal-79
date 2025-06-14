
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface AddressSectionProps {
  editMode: boolean;
  candidatoData: any;
  editFormData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  editMode,
  candidatoData,
  editFormData,
  handleInputChange,
  handleSelectChange,
}) => {
  return (
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            {editMode ? (
              <Select onValueChange={(value) => handleSelectChange('estado', value)} value={editFormData.estado || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-900">{candidatoData?.estado || 'Não informado'}</p>
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
  );
};
