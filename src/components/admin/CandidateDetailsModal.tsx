
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Heart,
  Award,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface CandidateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: any | null;
  onUpdate: (updatedCandidate: any) => void;
}

export const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  candidate 
}) => {
  if (!candidate) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Rejeitado":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejeitado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getRelevantRegistrations = (cargo: string) => {
    const registrations = [];
    
    if (cargo === "Técnico(a) de Enfermagem" || cargo === "Enfermeiro(a)") {
      registrations.push({ type: "COREN", value: candidate.coren });
    }
    
    if (cargo === "Fisioterapeuta" || cargo === "Terapeuta Ocupacional") {
      registrations.push({ type: "CREFITO", value: candidate.crefito });
    }
    
    if (cargo === "Médico(a)") {
      registrations.push({ type: "CRM", value: candidate.crm });
    }
    
    return registrations.filter(reg => reg.value);
  };

  const relevantRegistrations = getRelevantRegistrations(candidate.cargo || '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {candidate.nome}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <Badge className={`flex items-center gap-2 px-3 py-1 ${getStatusColor(candidate.status_candidatura)}`}>
                  {getStatusIcon(candidate.status_candidatura)}
                  {candidate.status_candidatura}
                </Badge>
                {candidate.cargo && (
                  <Badge variant="outline" className="px-3 py-1">
                    {candidate.cargo}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {/* 1. Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-careconnect-blue" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{candidate.telefone || 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Categoria Profissional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-careconnect-green" />
                Categoria Profissional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Categoria</p>
                  <p className="font-medium text-lg">{candidate.cargo || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experiência</p>
                  <p className="font-medium">{candidate.possui_experiencia || 'Não informado'}</p>
                </div>
              </div>

              {/* Registros Profissionais */}
              {relevantRegistrations.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-3">Registros Profissionais</p>
                  <div className="flex gap-3 flex-wrap">
                    {relevantRegistrations.map((reg, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">{reg.type}</span>
                        </div>
                        <p className="text-blue-800 font-medium">{reg.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cursos */}
              {candidate.cursos && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Cursos</p>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                      <p className="font-medium text-gray-800">{candidate.cursos}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Referências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-red-500" />
                Referências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidate.referencia_1 && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="font-medium text-gray-800 mb-2">Referência 1</p>
                  <p className="text-gray-700">{candidate.referencia_1}</p>
                </div>
              )}
              {candidate.referencia_2 && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="font-medium text-gray-800 mb-2">Referência 2</p>
                  <p className="text-gray-700">{candidate.referencia_2}</p>
                </div>
              )}
              {candidate.referencia_3 && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="font-medium text-gray-800 mb-2">Referência 3</p>
                  <p className="text-gray-700">{candidate.referencia_3}</p>
                </div>
              )}
              
              {!candidate.referencia_1 && !candidate.referencia_2 && !candidate.referencia_3 && (
                <p className="text-gray-500 italic">Nenhuma referência informada</p>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="border-t pt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
