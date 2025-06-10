
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      title: "Experiência e Referências",
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
    const fallbackUser = localStorage.getItem('fallback_user');
    if (!fallbackUser) {
      toast.error("Erro: dados de pré-cadastro não encontrados. Refaça o pré-cadastro.");
      window.location.href = "/pre-cadastro";
      return;
    }

    const fallbackData = JSON.parse(fallbackUser);
    const candidateId = fallbackData.id;

    setIsSubmitting(true);
    console.log("Dados do formulário:", formData);

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
        possui_filhos: formData.hasChildren,
        ultima_atualizacao: new Date().toISOString().split('T')[0],
        status_candidatura: 'Cadastro completo - Em análise',
        cargo: formData.careCategory,
        coren: formData.coren || '',
        experiencia: formData.experience
      };

      const { data: candidateResult, error: candidateError } = await supabase
        .from('candidatos_cuidadores_rows')
        .update(updateData)
        .eq('id', candidateId)
        .select()
        .single();

      if (candidateError) {
        console.error("Erro ao atualizar dados do candidato:", candidateError);
        toast.error("Erro ao salvar dados do candidato.");
        return;
      }

      console.log("Dados do candidato atualizados com sucesso:", candidateResult);
      
      toast.success("Cadastro realizado com sucesso!");
      
      // Redirecionar para página de obrigado
      setTimeout(() => {
        window.location.href = "/obrigado";
      }, 1500);

    } catch (error) {
      toast.error("Ocorreu um erro ao enviar o formulário. Verifique sua conexão.");
      console.error("Erro de rede:", error);
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

                {/* Etapa 4: Experiência Profissional */}
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
