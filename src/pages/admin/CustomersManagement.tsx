import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Lock, Unlock, Filter, Calendar, Phone, Mail, MapPin, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface Customer {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  birth_date: string | null;
  cep: string | null;
  address: string | null;
  city: string;
  state: string | null;
  has_children: boolean | null;
  smoker: boolean | null;
  necessity: string | null;
  special_care: string | null;
  observations: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

interface EditCustomerForm {
  observations: string;
  status: string;
}

const CustomersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EditCustomerForm>();

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching customers:", error);
        throw error;
      }

      return data as Customer[];
    },
  });

  // Update customer
  const updateCustomerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
      const { error } = await supabase
        .from("customer")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
      setEditingCustomer(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
      console.error("Error updating customer:", error);
    },
  });

  // Update customer status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("customer")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: "Status atualizado",
        description: "O status do cliente foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do cliente.",
        variant: "destructive",
      });
      console.error("Error updating customer status:", error);
    },
  });

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const handleStatusChange = (customerId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: customerId, status: newStatus });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getCustomerStats = () => {
    const total = customers.length;
    const active = customers.filter(c => c.status === "active").length;
    const blocked = customers.filter(c => c.status === "blocked").length;
    const pending = customers.filter(c => c.status === "pending" || !c.status).length;
    
    return { total, active, blocked, pending };
  };

  const stats = getCustomerStats();

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    form.reset({
      observations: customer.observations || "",
      status: customer.status || "pending",
    });
  };

  const handleSaveCustomer = (data: EditCustomerForm) => {
    if (!editingCustomer) return;
    
    updateCustomerMutation.mutate({
      id: editingCustomer.id,
      data: {
        observations: data.observations,
        status: data.status,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-careconnect-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Clientes</h1>
          <p className="text-gray-600">Gerencie clientes, monitore atividades e controle acesso</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Unlock className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bloqueados</p>
                <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="blocked">Bloqueados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>{formatDate(customer.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Cliente</DialogTitle>
                          </DialogHeader>
                          {selectedCustomer && (
                            <div className="space-y-6">
                              <Tabs defaultValue="personal">
                                <TabsList>
                                  <TabsTrigger value="personal">Pessoal</TabsTrigger>
                                  <TabsTrigger value="contact">Contato</TabsTrigger>
                                  <TabsTrigger value="care">Cuidados</TabsTrigger>
                                  <TabsTrigger value="observations">Observações</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="personal" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Nome</label>
                                      <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Idade</label>
                                      <p className="text-sm text-gray-600">{calculateAge(selectedCustomer.birth_date)} anos</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Filhos</label>
                                      <p className="text-sm text-gray-600">{selectedCustomer.has_children ? "Sim" : "Não"}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Fumante</label>
                                      <p className="text-sm text-gray-600">{selectedCustomer.smoker ? "Sim" : "Não"}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="contact" className="space-y-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-gray-500" />
                                      <span>{selectedCustomer.email}</span>
                                    </div>
                                    {selectedCustomer.whatsapp && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span>{selectedCustomer.whatsapp}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-gray-500" />
                                      <span>
                                        {selectedCustomer.address}, {selectedCustomer.city}
                                        {selectedCustomer.state && `, ${selectedCustomer.state}`}
                                        {selectedCustomer.cep && ` - ${selectedCustomer.cep}`}
                                      </span>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="care" className="space-y-4">
                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-sm font-medium">Necessidade</label>
                                      <p className="text-sm text-gray-600">{selectedCustomer.necessity || "Não informado"}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Cuidados Especiais</label>
                                      <p className="text-sm text-gray-600">{selectedCustomer.special_care || "Não informado"}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="observations" className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Observações</label>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                      {selectedCustomer.observations || "Nenhuma observação registrada"}
                                    </p>
                                  </div>
                                </TabsContent>
                              </Tabs>
                              
                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => handleStatusChange(selectedCustomer.id, "active")}
                                  disabled={selectedCustomer.status === "active"}
                                >
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Ativar
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => handleStatusChange(selectedCustomer.id, "blocked")}
                                  disabled={selectedCustomer.status === "blocked"}
                                >
                                  <Lock className="w-4 h-4 mr-2" />
                                  Bloquear
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Cliente - {customer.name}</DialogTitle>
                          </DialogHeader>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSaveCustomer)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="blocked">Bloqueado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="observations"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Adicione observações sobre o cliente..."
                                        className="min-h-[120px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="flex gap-2 pt-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => setEditingCustomer(null)}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  type="submit"
                                  className="flex-1"
                                  disabled={updateCustomerMutation.isPending}
                                >
                                  {updateCustomerMutation.isPending ? "Salvando..." : "Salvar"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      
                      {customer.status !== "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(customer.id, "active")}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Unlock className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(customer.id, "blocked")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Lock className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum cliente encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersManagement;
