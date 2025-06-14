
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, MessageSquare, User, Star, MapPin, Phone, LogOut, Heart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';

const ClienteDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estados principais
  const [searchTerm, setSearchTerm] = useState("");
  const [cuidadoresEncontrados, setCuidadoresEncontrados] = useState([]);
  const [cuidadorSelecionado, setCuidadorSelecionado] = useState(null);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  
  // Estados para depoimentos
  const [novoDepoimento, setNovoDepoimento] = useState({
    cuidador_id: "",
    cuidador_nome: "",
    texto: "",
    avaliacao: 5
  });
  const [meusDepoimentos, setMeusDepoimentos] = useState([]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      loadMeusDepoimentos();
      loadFavoritos();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleBuscarCuidadores = async () => {
    setLoading(true);
    setBuscaRealizada(true);
    
    try {
      let query = supabase
        .from('candidatos_cuidadores_rows')
        .select('*')
        .eq('ativo', 'true')
        .eq('status_candidatura', 'Aprovado');
      
      // Filtrar por nome se houver termo de busca
      if (searchTerm && searchTerm.trim()) {
        const termo = searchTerm.trim().toLowerCase();
        query = query.ilike('nome', `%${termo}%`);
      }
      
      const { data, error } = await query.order('nome').limit(20);
      
      if (error) throw error;
      
      // Mapear os dados para o formato da tabela
      const cuidadoresFormatados = (data || []).map(cuidador => ({
        id: cuidador.id,
        nome: cuidador.nome || 'Nome não informado',
        cidade: cuidador.cidade || 'Não informado',
        telefone: cuidador.telefone || 'Não informado',
        cargo: cuidador.cargo || 'Cuidador',
        experiencia: cuidador.experiencia || 'Não informado',
        email: cuidador.email,
        disponibilidade: cuidador.disponibilidade_horarios || 'Não informado',
        descricao: cuidador.descricao_experiencia || 'Profissional experiente'
      }));
      
      setCuidadoresEncontrados(cuidadoresFormatados);
      
      toast({
        title: "Busca realizada",
        description: `Encontrados ${cuidadoresFormatados.length} cuidador(es)`,
      });
      
    } catch (error) {
      console.error('Erro ao buscar cuidadores:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar cuidadores. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (telefone: string, nome: string) => {
    if (!telefone || telefone === 'Não informado') {
      toast({
        title: "Telefone não disponível",
        description: "Este cuidador não possui telefone cadastrado.",
        variant: "destructive"
      });
      return;
    }
    
    // Limpar o telefone (remover caracteres não numéricos)
    const telefoneClean = telefone.replace(/\D/g, '');
    
    // Verificar se o telefone tem o formato correto
    let whatsappNumber = telefoneClean;
    
    // Se não começar com 55 (código do Brasil), adicionar
    if (!whatsappNumber.startsWith('55')) {
      whatsappNumber = '55' + whatsappNumber;
    }
    
    const mensagem = `Olá ${nome}, encontrei seu perfil na plataforma CareConnect e gostaria de conversar sobre serviços de cuidado.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
  };

  const toggleFavorito = async (cuidadorId: string) => {
    const isFavorito = favoritos.includes(cuidadorId);
    
    try {
      if (isFavorito) {
        // Remover dos favoritos
        setFavoritos(prev => prev.filter(id => id !== cuidadorId));
        toast({
          title: "Removido dos favoritos",
          description: "Cuidador removido da sua lista de favoritos.",
        });
      } else {
        // Adicionar aos favoritos
        setFavoritos(prev => [...prev, cuidadorId]);
        toast({
          title: "Adicionado aos favoritos",
          description: "Cuidador adicionado à sua lista de favoritos.",
        });
      }
    } catch (error) {
      console.error('Erro ao gerenciar favoritos:', error);
    }
  };

  const loadFavoritos = () => {
    // Em uma implementação real, isso viria do localStorage ou banco de dados
    const favoritosLocal = localStorage.getItem(`favoritos_${user?.id}`);
    if (favoritosLocal) {
      setFavoritos(JSON.parse(favoritosLocal));
    }
  };

  // Salvar favoritos no localStorage quando mudarem
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`favoritos_${user.id}`, JSON.stringify(favoritos));
    }
  }, [favoritos, user?.id]);

  const handleSelecionarCuidador = (cuidador: any) => {
    setCuidadorSelecionado(cuidador);
    setNovoDepoimento({
      ...novoDepoimento,
      cuidador_id: cuidador.id,
      cuidador_nome: cuidador.nome
    });
    
    toast({
      title: "Cuidador selecionado",
      description: `${cuidador.nome} foi selecionado para avaliação.`,
    });
  };

  const handleSubmitDepoimento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cuidadorSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione um cuidador para avaliar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          name: user?.user_metadata?.name || user?.email || 'Cliente',
          role: 'Cliente',
          content: novoDepoimento.texto,
          rating: novoDepoimento.avaliacao,
          published: false,
          customer_id: user?.id,
          caregiver_id: novoDepoimento.cuidador_id
        });

      if (error) throw error;

      toast({
        title: "Depoimento enviado",
        description: "Seu depoimento foi enviado com sucesso e está em análise.",
      });

      setNovoDepoimento({ cuidador_id: "", cuidador_nome: "", texto: "", avaliacao: 5 });
      setCuidadorSelecionado(null);
      
      loadMeusDepoimentos();
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

  const loadMeusDepoimentos = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error && error.code !== '42P01') throw error;
      
      setMeusDepoimentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
      setMeusDepoimentos([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Busca de Cuidadores</h1>
              <p className="text-gray-600">Encontre o cuidador ideal para suas necessidades</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Busca simples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Cuidadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Digite o nome do cuidador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleBuscarCuidadores}
                disabled={loading}
                className="min-w-[120px]"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabela de Resultados */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cuidadores Encontrados ({cuidadoresEncontrados.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {!buscaRealizada ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Faça sua primeira busca</h3>
                    <p>Digite o nome de um cuidador e clique em "Buscar"</p>
                  </div>
                ) : cuidadoresEncontrados.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Nenhum cuidador encontrado</h3>
                    <p>Tente buscar por outro nome</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cuidador</TableHead>
                          <TableHead>Cidade</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cuidadoresEncontrados.map((cuidador) => (
                          <TableRow key={cuidador.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div>
                                <p className="font-medium">{cuidador.nome}</p>
                                <p className="text-sm text-gray-600">{cuidador.cargo}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {cuidador.cidade}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm">{cuidador.telefone}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 justify-center">
                                <Button
                                  size="sm"
                                  variant={favoritos.includes(cuidador.id) ? "default" : "outline"}
                                  onClick={() => toggleFavorito(cuidador.id)}
                                  className="px-2"
                                >
                                  <Heart className={`w-4 h-4 ${favoritos.includes(cuidador.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSelecionarCuidador(cuidador)}
                                >
                                  <Star className="w-4 h-4 mr-1" />
                                  Avaliar
                                </Button>
                                
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleWhatsApp(cuidador.telefone, cuidador.nome)}
                                >
                                  <Phone className="w-4 h-4 mr-1" />
                                  WhatsApp
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Avaliações */}
          <div className="space-y-6">
            {/* Avaliar Cuidador */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Avaliar Cuidador
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!cuidadorSelecionado ? (
                  <div className="text-center py-6 text-gray-500">
                    <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Selecione um cuidador da tabela para avaliar</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitDepoimento} className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="font-medium text-blue-900">{cuidadorSelecionado.nome}</p>
                      <p className="text-sm text-blue-700">{cuidadorSelecionado.cidade}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sua Avaliação
                      </label>
                      <select
                        value={novoDepoimento.avaliacao}
                        onChange={(e) => setNovoDepoimento({
                          ...novoDepoimento,
                          avaliacao: parseInt(e.target.value)
                        })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ Excelente (5)</option>
                        <option value={4}>⭐⭐⭐⭐ Muito Bom (4)</option>
                        <option value={3}>⭐⭐⭐ Bom (3)</option>
                        <option value={2}>⭐⭐ Regular (2)</option>
                        <option value={1}>⭐ Ruim (1)</option>
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
                        placeholder="Conte como foi sua experiência com este cuidador..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCuidadorSelecionado(null);
                          setNovoDepoimento({ cuidador_id: "", cuidador_nome: "", texto: "", avaliacao: 5 });
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? "Enviando..." : "Enviar Avaliação"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Meus Depoimentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Minhas Avaliações ({meusDepoimentos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meusDepoimentos.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhuma avaliação enviada ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {meusDepoimentos.map((depoimento: any) => (
                      <div key={depoimento.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm">Cuidador avaliado</p>
                          <div className="flex">
                            {[...Array(parseInt(depoimento.rating))].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{depoimento.content}</p>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded ${
                            depoimento.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {depoimento.published ? '✅ Publicado' : '⏳ Em análise'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(depoimento.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Estatísticas simples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Search className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{buscaRealizada ? '1' : '0'}</p>
                  <p className="text-sm text-gray-600">Buscas Realizadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{cuidadoresEncontrados.length}</p>
                  <p className="text-sm text-gray-600">Cuidadores Encontrados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{favoritos.length}</p>
                  <p className="text-sm text-gray-600">Favoritos</p>
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
