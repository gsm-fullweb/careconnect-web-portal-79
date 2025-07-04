"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Schema do formulário
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  whatsapp: z.string().min(10, {
    message: "WhatsApp inválido.",
  }),
  birthDate: z.string().min(1, {
    message: "Data de nascimento é obrigatória.",
  }),
  hasChildren: z.boolean(),
  smoker: z.boolean(),
  cep: z.string().min(8, {
    message: "CEP inválido.",
  }),
  address: z.string().min(5, {
    message: "Endereço inválido.",
  }),
  state: z.string().min(1, {
    message: "Estado é obrigatório.",
  }),
  city: z.string().min(2, {
    message: "Cidade inválida.",
  }),
  education: z.string().min(1, {
    message: "Escolaridade é obrigatória.",
  }),
  courses: z.string().optional(),
  availability: z.string().min(1, {
    message: "Disponibilidade é obrigatória.",
  }),
  sleepAtClient: z.boolean(),
  careCategory: z.string().min(1, {
    message: "Categoria é obrigatória.",
  }),
  experience: z.string().min(10, {
    message: "Experiência é obrigatória.",
  }),
  reference1: z.string().min(1, {
    message: "A primeira referência é obrigatória.",
  }),
  reference2: z.string().min(1, {
    message: "A segunda referência é obrigatória.",
  }),
  reference3: z.string().min(1, {
    message: "A terceira referência é obrigatória.",
  }),
  coren: z.string().optional(),
  crefito: z.string().optional(),
  crm: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function CadastrarCuidador() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidateData, setCandidateData] = useState<any>(null);
  const totalSteps = 4;

  // Verificar se o usuário está logado
  useEffect(() => {
    if (!loading && !user) {
      const fallbackUser = localStorage.getItem('fallback_user');
      if (!fallbackUser) {
        toast.error("Você precisa estar logado para acessar este formulário. Crie sua conta primeiro em /pre-cadastro");
        window.location.href = "/pre-cadastro";
      }
    }
  }, [user, loading]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      birthDate: "",
      hasChildren: false,
      smoker: false,
      cep: "",
      address: "",
      state: "",
      city: "",
      education: "",
      courses: "",
      availability: "",
      sleepAtClient: false,
      careCategory: "",
      experience: "",
      reference1: "",
      reference2: "",
      reference3: "",
      coren: "",
      crefito: "",
      crm: "",
    },
  });

  // Load and auto-fill candidate data
  useEffect(() => {
    const loadCandidateData = async () => {
      console.log("Carregando dados do candidato...");
      console.log("User:", user);

      if (!user?.email) {
        console.log("Sem email do usuário, verificando fallback...");
        const fallbackUser = localStorage.getItem('fallback_user');
        if (fallbackUser) {
          const fallbackData = JSON.parse(fallbackUser);
          console.log("Dados do fallback user:", fallbackData);
          setCandidateData(fallbackData);
          return;
        }
        return;
      }

      try {
        // First try to get data from localStorage (when coming from PainelCuidador)
        const localStorageData = localStorage.getItem('caregiver_data');
        
        let candidateInfo = null;
        
        if (localStorageData) {
          candidateInfo = JSON.parse(localStorageData);
          console.log('Dados carregados do localStorage:', candidateInfo);
        } else {
          // Fallback: fetch from Supabase
          console.log('Buscando dados no Supabase para email:', user.email);
          const { data, error } = await supabase
            .from('candidatos_cuidadores_rows')
            .select('*')
            .eq('email', user.email)
            .single();

          if (error) {
            console.error('Erro ao buscar dados do candidato:', error);
            // Try fallback user if Supabase fails
            const fallbackUser = localStorage.getItem('fallback_user');
            if (fallbackUser) {
              candidateInfo = JSON.parse(fallbackUser);
              console.log('Usando dados do fallback após erro no Supabase:', candidateInfo);
            }
          } else {
            candidateInfo = data;
            console.log('Dados carregados do Supabase:', candidateInfo);
          }
        }
        
        if (candidateInfo) {
          setCandidateData(candidateInfo);
          
          // Auto-fill form with existing data
          const autoFillData = {
            name: candidateInfo.nome || "",
            email: candidateInfo.email || "",
            whatsapp: candidateInfo.telefone || "",
            birthDate: candidateInfo.data_nascimento || "",
            hasChildren: candidateInfo.possui_filhos || false,
            smoker: candidateInfo.fumante === 'Sim',
            cep: candidateInfo.cep || "",
            address: candidateInfo.endereco || "",
            state: "", // Will need to be filled by user
            city: candidateInfo.cidade || "",
            education: candidateInfo.escolaridade || "",
            courses: candidateInfo.cursos || "",
            availability: candidateInfo.disponibilidade_horarios || "",
            sleepAtClient: candidateInfo.disponivel_dormir_local === 'Sim',
            careCategory: candidateInfo.cargo || "",
            experience: candidateInfo.experiencia || candidateInfo.descricao_experiencia || "",
            reference1: "",
            reference2: "",
            reference3: "",
            coren: candidateInfo.coren || "",
            crefito: candidateInfo.crefito || "",
            crm: candidateInfo.crm || "",
          };
          
          // Parse references if they exist
          if (candidateInfo.referencias) {
            const references = candidateInfo.referencias.split(' | ');
            autoFillData.reference1 = references[0] || "";
            autoFillData.reference2 = references[1] || "";
            autoFillData.reference3 = references[2] || "";
          }
          
          // Reset form with auto-filled data
          form.reset(autoFillData);
          
          toast.success("Formulário preenchido automaticamente com seus dados!");
        }
      } catch (error) {
        console.error('Erro ao carregar dados do candidato:', error);
      }
    };

    if (!loading) {
      loadCandidateData();
    }
  }, [user, loading, form]);

  // Formulário dividido em 4 etapas
  const formSteps = [
    {
      id: 1,
      title: "Dados Pessoais",
      fields: ["name", "email", "whatsapp", "birthDate", "hasChildren", "smoker"],
    },
    {
      id: 2,
      title: "Endereço",
      fields: ["cep", "address", "state", "city"],
    },
    {
      id: 3,
      title: "Formação e Categoria",
      fields: ["education", "courses", "availability", "sleepAtClient", "careCategory", "coren", "crefito", "crm"],
    },
    {
      id: 4,
      title: "Experiência e Termo",
      fields: ["experience", "reference1", "reference2", "reference3"],
    },
  ];

  const handleNextStep = async () => {
    const currentStepFields = formSteps.find(step => step.id === currentStep)?.fields || [];
    const isValid = await form.trigger(currentStepFields as (keyof FormSchemaType)[]);

    if (!isValid) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (formData: FormSchemaType) => {
    console.log("=== INICIANDO SUBMISSÃO ===");
    console.log("Dados do formulário:", formData);
    console.log("Dados do candidato armazenados:", candidateData);
    console.log("User atual:", user);
    
    let candidateId = null;
    
    // Priority 1: Use candidateData.id if available
    if (candidateData?.id) {
      candidateId = candidateData.id;
      console.log("Usando ID do candidateData:", candidateId);
    } else {
      // Priority 2: Try fallback user
      const fallbackUser = localStorage.getItem('fallback_user');
      if (fallbackUser) {
        const fallbackData = JSON.parse(fallbackUser);
        candidateId = fallbackData.id;
        console.log("Usando ID do fallback user:", candidateId);
      } else if (user?.email) {
        // Priority 3: Try to find by email in database
        console.log("Tentando buscar candidato por email:", user.email);
        try {
          const { data, error } = await supabase
            .from('candidatos_cuidadores_rows')
            .select('id')
            .eq('email', user.email)
            .single();
          
          if (data && !error) {
            candidateId = data.id;
            console.log("ID encontrado por email:", candidateId);
          } else {
            console.error("Erro ao buscar por email:", error);
          }
        } catch (err) {
          console.error("Erro na busca por email:", err);
        }
      }
    }

    if (!candidateId) {
      console.error("ERRO: ID do candidato não encontrado");
      toast.error("Erro: dados de pré-cadastro não encontrados. Refaça o pré-cadastro.");
      navigate("/pre-cadastro");
      return;
    }

    console.log("ID final do candidato para atualização:", candidateId);
    setIsSubmitting(true);

    try {
      // Atualizar o registro existente na tabela candidatos_cuidadores_rows
      const updateData = {
        nome: formData.name,
        email: formData.email.toLowerCase().trim(),
        telefone: formData.whatsapp,
        data_nascimento: formData.birthDate,
        fumante: formData.smoker ? 'Sim' : 'Não',
        escolaridade: formData.education,
        cursos: formData.courses || '',
        possui_experiencia: 'Sim', // Como tem campo de experiência, assumimos que sim
        descricao_experiencia: formData.experience,
        disponibilidade_horarios: formData.availability,
        disponivel_dormir_local: formData.sleepAtClient ? 'Sim' : 'Não',
        referencias: `${formData.reference1} | ${formData.reference2} | ${formData.reference3}`,
        cidade: formData.city,
        endereco: formData.address,
        cep: formData.cep,
        possui_filhos: formData.hasChildren ? "Sim" : "Não", // <-- CORRIGIDO aqui
        ultima_atualizacao: new Date().toISOString(),
        status_candidatura: 'Cadastro completo - Em análise',
        cargo: formData.careCategory,
        coren: formData.coren || '',
        experiencia: formData.experience,
        crefito: formData.crefito || '',
        crm: formData.crm || ''
      };

      console.log("Dados para atualização:", updateData);
      console.log("Tentando atualizar registro com ID:", candidateId);

      const { data: candidateResult, error: candidateError } = await supabase
        .from('candidatos_cuidadores_rows')
        .update(updateData)
        .eq('id', candidateId)
        .select()
        .single();

      console.log("Resultado da atualização:", candidateResult);
      console.log("Erro da atualização:", candidateError);

      if (candidateError) {
        console.error("Erro ao atualizar dados do candidato:", candidateError);
        toast.error("Erro ao salvar dados do candidato: " + candidateError.message);
        return;
      }

      console.log("Dados do candidato atualizados com sucesso:", candidateResult);
      
      // Clear localStorage data after successful submission
      localStorage.removeItem('caregiver_data');
      
      toast.success("Cadastro realizado com sucesso! Você será redirecionado para o painel do cuidador.");
      
      // Redirecionar para painel do cuidador após sucesso
      setTimeout(() => {
        navigate("/painel-cuidador");
      }, 2000);

    } catch (error) {
      console.error("Erro de rede ou exceção:", error);
      toast.error("Ocorreu um erro ao enviar o formulário. Verifique sua conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-12 md:py-20 bg-primary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Formulário de Cadastro para Prestador(a) de Serviços como Cuidador(a) de Idosos
            </h1>
            <p className="text-lg text-gray-600">
              Preencha o formulário abaixo com seus dados e experiências
            </p>
            {candidateData && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ Formulário preenchido automaticamente com seus dados do pré-cadastro
                </p>
              </div>
            )}
          </div>

          {/* Progresso do formulário */}
          <div className="flex justify-between items-center mb-12 relative">
            {formSteps.map((step) => (
              <div key={step.id} className="flex flex-col items-center z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold mb-2
                    ${currentStep === step.id
                      ? "bg-primary text-white"
                      : currentStep > step.id
                        ? "bg-primary/20 text-primary"
                        : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {step.id}
                </div>
                <p className={`text-sm md:text-base font-medium ${
                  currentStep === step.id ? "text-primary" : "text-gray-500"
                }`}>
                  {step.title}
                </p>
              </div>
            ))}
            <div className="absolute top-6 left-0 right-0 h-[2px] bg-gray-200 z-0">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Etapa 1: Dados Pessoais */}
                {currentStep === 1 && (
                  <>
                    <h2 className="text-xl font-bold mb-6">Dados Pessoais</h2>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hasChildren"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Possui filhos?</FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="smoker"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>É fumante?</FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {/* Etapa 2: Endereço */}
                {currentStep === 2 && (
                  <>
                    <h2 className="text-xl font-bold mb-6">Endereço</h2>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input placeholder="00000-000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input placeholder="Rua, número, complemento" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SP">São Paulo</SelectItem>
                                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                <SelectItem value="MG">Minas Gerais</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Município</FormLabel>
                            <FormControl>
                              <Input placeholder="Sua cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {/* Etapa 3: Formação e Categoria */}
                {currentStep === 3 && (
                  <>
                    <h2 className="text-xl font-bold mb-6">Formação Acadêmica e Categoria Profissional</h2>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Escolaridade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                                <SelectItem value="medio">Ensino Médio</SelectItem>
                                <SelectItem value="tecnico">Curso Técnico</SelectItem>
                                <SelectItem value="superior">Ensino Superior</SelectItem>
                                <SelectItem value="pos">Pós-graduação</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cursos realizados</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Liste os cursos relacionados à área da saúde ou cuidados com idosos que você realizou"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disponibilidade de horários?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="diurno">Período Diurno</SelectItem>
                                <SelectItem value="noturno">Período Noturno</SelectItem>
                                <SelectItem value="integral">Período Integral</SelectItem>
                                <SelectItem value="flexivel">Horário Flexível</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sleepAtClient"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Disponível para dormir no local?</FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                       />
                       <FormField
                        control={form.control}
                        name="careCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Com qual categoria você mais se identifica?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cuidador">Cuidador(a) de Idosos</SelectItem>
                                <SelectItem value="tecnico">Técnico(a) de Enfermagem</SelectItem>
                                <SelectItem value="enfermeiro">Enfermeiro(a)</SelectItem>
                                <SelectItem value="fisioterapeuta">Fisioterapeuta</SelectItem>
                                <SelectItem value="terapeuta">Terapeuta Ocupacional</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {(form.watch("careCategory") === "tecnico" || form.watch("careCategory") === "enfermeiro") && (
                        <FormField
                          control={form.control}
                          name="coren"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número do COREN</FormLabel>
                              <FormControl>
                                <Input placeholder="Informe o número do COREN" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {(form.watch("careCategory") === "fisioterapeuta" || form.watch("careCategory") === "terapeuta") && (
                        <FormField
                          control={form.control}
                          name="crefito"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número do CREFITO</FormLabel>
                              <FormControl>
                                <Input placeholder="Informe o número do CREFITO" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {form.watch("careCategory") === "medico" && (
                        <FormField
                          control={form.control}
                          name="crm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número do CRM</FormLabel>
                              <FormControl>
                                <Input placeholder="Informe o número do CRM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </>
                )}

                {/* Etapa 4: Experiência Profissional e Termo */}
                {currentStep === 4 && (
                  <>
                    <h2 className="text-xl font-bold mb-6">Experiência Profissional</h2>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descreva suas últimas experiências</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Conte um pouco sobre suas experiências anteriores, mencionando o tempo de atuação em cada local e as atividades realizadas"
                                rows={6}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <h3 className="text-lg font-semibold mb-4">Referências de locais de trabalho (3 obrigatórias)</h3>
                      <FormField
                        control={form.control}
                        name="reference1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referência 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do local, contato, período" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reference2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referência 2</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do local, contato, período" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reference3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referência 3</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do local, contato, período" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                <div className="mt-8 flex justify-between">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      Voltar
                    </Button>
                  )}
                  <div className="ml-auto">
                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        Avançar
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Finalizar Cadastro"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
