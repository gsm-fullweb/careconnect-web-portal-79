
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  FileText,
  Home,
  Users,
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

  const formatBooleanValue = (value: boolean | string | null): string => {
    if (value === true || value === "true" || value === "Sim") return "Sim";
    if (value === false || value === "false" || value === "Não") return "Não";
    return String(value || "Não informado");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
            <div className="text-right text-sm text-gray-500">
              <p>Cadastrado em: {candidate.data_cadastro ? new Date(candidate.data_cadastro).toLocaleDateString('pt-BR') : 'N/A'}</p>
              {candidate.ultima_atualizacao && (
                <p>Última atualização: {new Date(candidate.ultima_atualizacao).toLocaleDateString('pt-BR')}</p>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {/* Informações de Contato */}
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
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Data de Nascimento</p>
                  <p className="font-medium">{candidate.data_nascimento || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">CPF</p>
                  <p className="font-medium">{candidate.cpf || 'Não informado'}</p>
                </div>
              </div>
              {candidate.RG && (
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">RG</p>
                    <p className="font-medium">{candidate.RG}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-careconnect-green" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="font-medium">{candidate.endereco || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Cidade/Estado</p>
                  <p className="font-medium">{candidate.cidade}{candidate.estado ? `, ${candidate.estado}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">CEP</p>
                  <p className="font-medium">{candidate.cep || 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-purple-600" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Possui filhos</p>
                <p className="font-medium">{formatBooleanValue(candidate.possui_filhos)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fumante</p>
                <p className="font-medium">{formatBooleanValue(candidate.fumante)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Disponível para dormir no local</p>
                <p className="font-medium">{formatBooleanValue(candidate.disponivel_dormir_local)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Qualificações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Qualificações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Escolaridade</p>
                  <p className="font-medium">{candidate.escolaridade || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Possui experiência</p>
                  <p className="font-medium">{formatBooleanValue(candidate.possui_experiencia)}</p>
                </div>
              </div>
              
              {candidate.cursos && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Cursos</p>
                  <p className="font-medium bg-gray-50 p-3 rounded-lg">{candidate.cursos}</p>
                </div>
              )}

              {candidate.descricao_experiencia && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Descrição da Experiência</p>
                  <p className="font-medium bg-gray-50 p-3 rounded-lg">{candidate.descricao_experiencia}</p>
                </div>
              )}

              {candidate.disponibilidade_horarios && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Disponibilidade de Horários</p>
                  <p className="font-medium bg-gray-50 p-3 rounded-lg">{candidate.disponibilidade_horarios}</p>
                </div>
              )}

              {/* Registros Profissionais */}
              {(candidate.coren || candidate.crefito || candidate.crm) && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Registros Profissionais</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {candidate.coren && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">COREN</p>
                        <p className="text-blue-800">{candidate.coren}</p>
                      </div>
                    )}
                    {candidate.crefito && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-green-600 font-medium">CREFITO</p>
                        <p className="text-green-800">{candidate.crefito}</p>
                      </div>
                    )}
                    {candidate.crm && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium">CRM</p>
                        <p className="text-purple-800">{candidate.crm}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Referências */}
          {(candidate.referencia_1 || candidate.referencia_2 || candidate.referencia_3) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-red-500" />
                  Referências Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidate.referencia_1 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">Referência 1</p>
                    <p className="text-gray-700">{candidate.referencia_1}</p>
                  </div>
                )}
                {candidate.referencia_2 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">Referência 2</p>
                    <p className="text-gray-700">{candidate.referencia_2}</p>
                  </div>
                )}
                {candidate.referencia_3 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">Referência 3</p>
                    <p className="text-gray-700">{candidate.referencia_3}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Perfil Profissional */}
          {candidate.perfil_profissional && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  Perfil Profissional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                  {candidate.perfil_profissional}
                </p>
              </CardContent>
            </Card>
          )}
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
