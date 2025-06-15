
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";

interface ReferencesSectionProps {
  editMode: boolean;
  candidatoData: any;
  editFormData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({
  editMode,
  candidatoData,
  editFormData,
  handleInputChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Referências Profissionais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editMode ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Forneça pelo menos 3 referências de trabalhos anteriores ou pessoas que possam atestar sua experiência profissional.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referência 1
              </label>
              <Input
                name="referencia_1"
                value={editFormData.referencia_1 || ''}
                onChange={handleInputChange}
                placeholder="Nome, telefone, local de trabalho, período"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referência 2
              </label>
              <Input
                name="referencia_2"
                value={editFormData.referencia_2 || ''}
                onChange={handleInputChange}
                placeholder="Nome, telefone, local de trabalho, período"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referência 3
              </label>
              <Input
                name="referencia_3"
                value={editFormData.referencia_3 || ''}
                onChange={handleInputChange}
                placeholder="Nome, telefone, local de trabalho, período"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações Adicionais sobre Referências
              </label>
              <Textarea 
                name="descricao_experiencia"
                value={editFormData.descricao_experiencia || ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="Descreva brevemente suas experiências anteriores ou informações adicionais sobre suas referências..."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {(candidatoData?.referencia_1 || candidatoData?.referencia_2 || candidatoData?.referencia_3) ? (
              <>
                {candidatoData.referencia_1 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">Referência 1:</span>
                        <p className="text-gray-700 mt-1">{candidatoData.referencia_1}</p>
                    </div>
                )}
                {candidatoData.referencia_2 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">Referência 2:</span>
                        <p className="text-gray-700 mt-1">{candidatoData.referencia_2}</p>
                    </div>
                )}
                {candidatoData.referencia_3 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">Referência 3:</span>
                        <p className="text-gray-700 mt-1">{candidatoData.referencia_3}</p>
                    </div>
                )}
              </>
            ) : (
              <p className="text-gray-900">Não informado</p>
            )}
            
            {candidatoData?.descricao_experiencia && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Descrição da Experiência:</h4>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                  {candidatoData.descricao_experiencia}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
