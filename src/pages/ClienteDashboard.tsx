
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, MessageSquare, User, Star, MapPin, Phone, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';

// ✅ Function: ClienteDashboard
// 📌 Description: Main dashboard component for clients to search caregivers and submit testimonials
// 📥 Parameters: none
// 📤 Returns: JSX.Element - Complete client dashboard interface
const ClienteDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estados para busca de cuidadores
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cuidadoresEncontrados, setCuidadoresEncontrados] = useState([]);
  const [cuidadorSelecionado, setCuidadorSelecionado] = useState(null);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  
  // Estados para depoimentos
  const [novoDepoimento, setNovoDepoimento] = useState({
    cuidador_id: "",
    cuidador_nome: "",
    texto: "",
    avaliacao: 5
  });
  const [meusDepoimentos, setMeusDepoimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  
  // ✅ Novos estados para dados dinâmicos
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState([]);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);

  // ✅ Function: loadCidadesECategorias
  // 📌 Description: Loads available cities and categories from database
  // 📥 Parameters: none
  // 📤 Returns: Promise<void>
  const loadCidadesECategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('candidatos_cuidadores_rows')
        .select('cidade, cargo')
        .eq('ativo', 'true')  // ✅ Mudança: true → 'true'
        .eq('status_candidatura', 'Aprovado');
      
      if (error) throw error;
      
      // Extrair cidades únicas
      const cidades = [...new Set(data?.map(item => item.cidade).filter(Boolean))];
      setCidadesDisponiveis(cidades.sort());
      
      // Extrair categorias únicas
      const categorias = [...new Set(data?.map(item => item.cargo).filter(Boolean))];
      setCategoriasDisponiveis(categorias.sort());
      
    } catch (error) {
      console.error('Erro ao carregar cidades e categorias:', error);
    }
  };

  // ✅ Function: useEffect para carregar dados iniciais
  useEffect(() => {
    loadCidadesECategorias();
    loadMeusDepoimentos();
  }, [user]);

  // ✅ Function: handleLogout
  // 📌 Description: Handles user logout and redirects to home page
  // 📥 Parameters: none
  // 📤 Returns: Promise<void>
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // ✅ Function: handleBuscarCuidadores
  // 📌 Description: Searches for caregivers in the database based on filters
  // 📥 Parameters: none
  // 📤 Returns: Promise<void>
  const handleBuscarCuidadores = async () => {
    setLoading(true);
    setBuscaRealizada(true);
    setLoadingBusca(true); // ✅ Adicionado: Inicia o estado de carregamento da busca
    
    try {
      let query = supabase
        .from('candidatos_cuidadores_rows')
        .select('*');
      
      // ✅ Filtro 'ativo' simplificado para consistência com o banco de dados
      query = query.eq('ativo', 'true');
      
      // ✅ Filtro 'status_candidatura' simplificado para o status exato 'Aprovado'
      query = query.eq('status_candidatura', 'Aprovado');
      
      // Filtrar por nome se houver termo de busca
      if (searchTerm && searchTerm.trim()) {
        const termo = searchTerm.trim().toLowerCase();
        // ✅ Busca mais flexível - procura em qualquer parte do nome
        query = query.or(`nome.ilike.%${termo}%,nome.ilike.%${termo.split(' ').reverse().join(' ')}%`);
      }
      
      // Filtrar por localização se selecionada
      if (selectedLocation && selectedLocation !== '') {
        query = query.ilike('cidade', `%${selectedLocation.trim()}%`);
      }
      
      // Filtrar por categoria se selecionada
      if (selectedCategory && selectedCategory !== '') {
        query = query.ilike('cargo', `%${selectedCategory}%`);
      }
      
      console.log('🔍 Executando busca com filtros:', {
        searchTerm,
        selectedLocation,
        selectedCategory
      });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Erro na busca:', error);
        throw error;
      }
      
      console.log('✅ Dados brutos encontrados:', data?.length || 0);
      console.log('📋 Amostra dos dados:', data?.slice(0, 3));
      
      // ✅ Filtro adicional no frontend para maior flexibilidade
      let dadosFiltrados = data || [];
      
      // Se há termo de busca, aplica filtro adicional no frontend
      if (searchTerm && searchTerm.trim()) {
        const termo = searchTerm.trim().toLowerCase();
        dadosFiltrados = dadosFiltrados.filter(cuidador => {
          const nome = (cuidador.nome || '').toLowerCase();
          const nomeInvertido = nome.split(' ').reverse().join(' ');
          return nome.includes(termo) || 
                 nomeInvertido.includes(termo) ||
                 termo.split(' ').some(palavra => nome.includes(palavra));
        });
      }
      
      console.log('✅ Dados após filtro frontend:', dadosFiltrados.length);
      
      // Mapear os dados para o formato esperado pelo componente
      const cuidadoresFormatados = dadosFiltrados.map(cuidador => ({
        id: cuidador.id,
        nome: cuidador.nome,
        cidade: cuidador.cidade,
        categoria: cuidador.cargo || 'geral',
        experiencia: cuidador.experiencia || 'Não informado',
        avaliacao: 5.0,
        telefone: cuidador.telefone,
        descricao: cuidador.descricao_experiencia || cuidador.descricao || 'Cuidador profissional',
        email: cuidador.email,
        escolaridade: cuidador.escolaridade,
        disponibilidade: cuidador.disponibilidade_horarios,
        referencias: cuidador.referencias
      }));
      
      setCuidadoresEncontrados(cuidadoresFormatados);
      
      if (cuidadoresFormatados.length === 0) {
        toast({
          title: "Nenhum cuidador encontrado",
          description: "Tente ajustar os filtros de busca para encontrar mais resultados.",
          variant: "default"
        });
      } else {
        toast({
          title: "Busca realizada",
          description: `Encontrados ${cuidadoresFormatados.length} cuidador(es)`,
          variant: "default"
        });
      }
      
    } catch (error) {
      console.error('Erro ao buscar cuidadores:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar cuidadores. Tente novamente.",
        variant: "destructive"
      });
      setCuidadoresEncontrados([]);
    } finally {
      setLoading(false);
      setLoadingBusca(false); // ✅ Adicionado: Finaliza o estado de carregamento da busca
    }
  };

  // ✅ Function: handleSelecionarCuidador
  // 📌 Description: Selects a caregiver for testimonial submission
  // 📥 Parameters: cuidador (object) - caregiver data
  // 📤 Returns: void
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

  // ✅ Function: handleSubmitDepoimento
  // 📌 Description: Submits a testimonial for a selected caregiver
  // 📥 Parameters: e (React.FormEvent) - form submission event
  // 📤 Returns: Promise<void>
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
          rating: novoDepoimento.avaliacao, // ✅ Corrigido: removido .toString() para manter como número
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

  // ✅ Function: loadMeusDepoimentos
  // 📌 Description: Loads user's submitted testimonials from database
  // 📥 Parameters: none
  // 📤 Returns: Promise<void>
  const loadMeusDepoimentos = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Se a tabela não existir, não mostrar erro
        if (error.code === '42P01') {
          console.log('Tabela testimonials ainda não criada');
          setMeusDepoimentos([]);
          return;
        }
        throw error;
      }
      
      setMeusDepoimentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
      setMeusDepoimentos([]);
    }
  };

  useEffect(() => {
    if (user) {
      loadMeusDepoimentos();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel do Cliente</h1>
              <p className="text-gray-600">Encontre e avalie cuidadores</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Busca de Cuidadores */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Buscar Cuidadores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nome do cuidador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Todas as cidades</option>
                    {cidadesDisponiveis.map((cidade) => (
                      <option key={cidade} value={cidade}>
                        {cidade}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Todas as categorias</option>
                    {categoriasDisponiveis.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleBuscarCuidadores}
                  disabled={loadingBusca}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {loadingBusca ? "Buscando..." : "Buscar Cuidadores"}
                </Button>
              </CardContent>
            </Card>

            {/* Resultados da Busca */}
            <Card>
              <CardHeader>
                <CardTitle>Cuidadores Encontrados</CardTitle>
              </CardHeader>
              <CardContent>
                {!buscaRealizada ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Use os filtros acima para encontrar cuidadores</p>
                    <p className="text-sm">Nossa plataforma conecta você aos melhores profissionais</p>
                  </div>
                ) : cuidadoresEncontrados.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum cuidador encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros de busca</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cuidadoresEncontrados.map((cuidador: any) => (
                      <div key={cuidador.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{cuidador.nome}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {cuidador.cidade}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {cuidador.avaliacao}
                              </span>
                              <span>{cuidador.experiencia} de experiência</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSelecionarCuidador(cuidador)}
                            >
                              Avaliar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => window.open(`https://wa.me/${cuidador.telefone.replace(/\D/g, '')}`, '_blank')}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Contatar
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{cuidador.descricao}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Depoimentos */}
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
                  <div className="text-center py-4 text-gray-500">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Selecione um cuidador para avaliar</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitDepoimento} className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-900">{cuidadorSelecionado.nome}</p>
                      <p className="text-sm text-blue-700">Cuidador selecionado</p>
                    </div>
                    
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
                        placeholder="Como foi sua experiência com este cuidador?"
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
                        {loading ? "Enviando..." : "Enviar"}
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
                  <Star className="w-5 h-5" />
                  Meus Depoimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meusDepoimentos.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum depoimento enviado ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {meusDepoimentos.map((depoimento: any) => (
                      <div key={depoimento.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm">{depoimento.cuidador_nome}</p>
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
                            {depoimento.published ? 'Aprovado' : 'Em análise'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(depoimento.created_at).toLocaleDateString()}
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

        {/* Estatísticas */}
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
                <MessageSquare className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{meusDepoimentos.length}</p>
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
