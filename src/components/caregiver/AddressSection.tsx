
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home, Map } from "lucide-react";

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
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-careconnect-green to-careconnect-green/90 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          Endereço
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4" />
              CEP
            </label>
            {editMode ? (
              <Input 
                name="cep"
                value={editFormData.cep || ''}
                onChange={handleInputChange}
                placeholder="00000-000"
                className="border-gray-300 focus:border-careconnect-green focus:ring-careconnect-green"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.cep || 'Não informado'}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Map className="w-4 h-4" />
              Estado
            </label>
            {editMode ? (
              <Select onValueChange={(value) => handleSelectChange('estado', value)} value={editFormData.estado || ''}>
                <SelectTrigger className="border-gray-300 focus:border-careconnect-green focus:ring-careconnect-green">
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
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.estado || 'Não informado'}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4" />
              Cidade
            </label>
            {editMode ? (
              <Input 
                name="cidade"
                value={editFormData.cidade || ''}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-careconnect-green focus:ring-careconnect-green"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.cidade || 'Não informado'}</p>
              </div>
            )}
          </div>

          <div className="md:col-span-1 space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Home className="w-4 h-4" />
              Endereço Completo
            </label>
            {editMode ? (
              <Input 
                name="endereco"
                value={editFormData.endereco || ''}
                onChange={handleInputChange}
                placeholder="Rua, número, complemento"
                className="border-gray-300 focus:border-careconnect-green focus:ring-careconnect-green"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{candidatoData?.endereco || 'Não informado'}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
