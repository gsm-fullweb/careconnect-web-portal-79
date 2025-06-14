
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
  const references = candidatoData?.referencias ? candidatoData.referencias.split(' | ') : [];
  const editReferences = editFormData.referencias ? editFormData.referencias.split(' | ') : ['', '', ''];

  const handleReferenceChange = (index: number, value: string) => {
    const newReferences = [...editReferences];
    newReferences[index] = value;
    
    const event = {
      target: {
        name: 'referencias',
        value: newReferences.join(' | '),
        type: 'text'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(event);
  };

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
            
            {[0, 1, 2].map((index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referência {index + 1}
                </label>
                <Input
                  value={editReferences[index] || ''}
                  onChange={(e) => handleReferenceChange(index, e.target.value)}
                  placeholder="Nome, telefone, local de trabalho, período"
                />
              </div>
            ))}

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
            {references.length > 0 ? (
              references.map((ref: string, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">Referência {index + 1}:</span>
                  <p className="text-gray-700 mt-1">{ref}</p>
                </div>
              ))
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
