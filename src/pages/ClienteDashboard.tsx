
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MessageSquare, User, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ClienteDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState([]);
  const [novoDepoimento, setNovoDepoimento] = useState({
    texto: "",
    avaliacao: 5
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simular carregamento de agendamentos
    // Em um sistema real, isso viria de uma tabela de agendamentos
    setAgendamentos([
      {
        id: 1,
        cuidador: "Maria Silva",
        data: "2024-01-15",
        horario: "14:00",
        status: "Concluído",
        servico: "Cuidados domiciliares"
      },
      {
        id: 2,
        cuidador: "João Santos",
        data: "2024-01-20",
        horario: "09:00",
        status: "Agendado",
        servico: "Acompanhamento médico"
      }
    ]);
  }, []);

  const handleSubmitDepoimento = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular envio de depoimento
      // Em um sistema real, isso seria salvo em uma tabela de depoimentos
      console.log("Novo depoimento:", {
        cliente_email: user?.email,
        texto: novoDepoimento.texto,
        avaliacao: novoDepoimento.avaliacao,
        data: new Date().toISOString()
      });

      toast({
        title: "Depoimento enviado",
        description: "Seu depoimento foi enviado com sucesso e está em análise.",
      });

      setNovoDepoimento({ texto: "", avaliacao: 5 });
    } catch (error) {
      console.error("Erro ao enviar depoimento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu depoimento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Cliente</h1>
              <p className="text-gray-600">Bem-vindo, {user?.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => supabase.auth.signOut()}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Histórico de Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Histórico de Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendamentos.map((agendamento: any) => (
                  <div key={agendamento.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{agendamento.servico}</h3>
                        <p className="text-sm text-gray-600">
                          Cuidador: {agendamento.cuidador}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        agendamento.status === "Concluído"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {agendamento.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {agendamento.data}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {agendamento.horario}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enviar Depoimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Enviar Depoimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDepoimento} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avaliação
                  </label>
                  <select
                    value={novoDepoimento.avaliacao}
                    onChange={(e) => setNovoDepoimento({
                      ...novoDepoimento,
                      avaliacao: parseInt(e.target.value)
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ Excelente</option>
                    <option value={4}>⭐⭐⭐⭐ Muito Bom</option>
                    <option value={3}>⭐⭐⭐ Bom</option>
                    <option value={2}>⭐⭐ Regular</option>
                    <option value={1}>⭐ Ruim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Depoimento
                  </label>
                  <Textarea
                    value={novoDepoimento.texto}
                    onChange={(e) => setNovoDepoimento({
                      ...novoDepoimento,
                      texto: e.target.value
                    })}
                    placeholder="Conte sua experiência com nossos serviços..."
                    rows={4}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Depoimento"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{agendamentos.length}</p>
                  <p className="text-sm text-gray-600">Total de Agendamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {agendamentos.filter((a: any) => a.status === "Concluído").length}
                  </p>
                  <p className="text-sm text-gray-600">Serviços Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-sm text-gray-600">Depoimentos Enviados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClienteDashboard;
