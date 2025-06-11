
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  whatsapp: z.string().min(10, {
    message: "WhatsApp deve ter pelo menos 10 dígitos.",
  }).regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/, {
    message: "WhatsApp deve estar no formato (11) 99999-9999 ou apenas números.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Confirmação de senha deve ter pelo menos 6 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem.",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export default function PreCadastro() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const sendToWebhook = async (data: FormData) => {
    try {
      console.log("Enviando dados para webhook:", data);
      
      await fetch("https://n8n-n8n.n1n956.easypanel.host/webhook/sdr-youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
          timestamp: new Date().toISOString(),
          source: "cadastro-cuidador-acesso",
        }),
      });

      console.log("Dados enviados para webhook com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao enviar para webhook:", error);
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    console.log("Iniciando cadastro de acesso para:", data.email);

    try {
      // Primeiro, enviar para o webhook
      await sendToWebhook(data);

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        options: {
          data: {
            name: data.name,
            whatsapp: data.whatsapp,
          }
        }
      });

      if (authError) {
        console.error("Erro ao criar usuário:", authError);
        if (authError.message.includes('already registered')) {
          toast.error("Este email já está cadastrado no sistema.");
        } else {
          toast.error("Erro ao criar conta. Tente novamente.");
        }
        return;
      }

      console.log("Usuário criado no auth:", authData);

      // Criar registro na tabela de candidatos
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidatos_cuidadores_rows')
        .insert({
          nome: data.name,
          email: data.email.toLowerCase().trim(),
          telefone: data.whatsapp,
          data_nascimento: '', // Será preenchido posteriormente
          fumante: 'Não',
          escolaridade: '',
          possui_experiencia: 'Não',
          disponivel_dormir_local: 'Não',
          status_candidatura: 'Em análise',
          cidade: '',
          endereco: '',
          cep: '',
          possui_filhos: false,
          data_cadastro: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (candidateError) {
        console.error("Erro ao criar registro do candidato:", candidateError);
        if (candidateError.code === '23505') {
          toast.error("Já existe um cadastro com este email.");
        } else {
          toast.error("Erro ao criar registro. Tente novamente.");
        }
        return;
      }

      console.log("Candidato criado:", candidateData);

      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.");
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate("/admin/login");
      }, 3000);

    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao processar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-12 md:py-20 bg-primary/5 min-h-screen flex items-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Cadastro de Acesso - Cuidador
              </CardTitle>
              <p className="text-gray-600">
                Crie sua conta para acessar a área do cuidador
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite seu nome completo" 
                            {...field} 
                          />
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
                          <Input 
                            type="email" 
                            placeholder="seu@email.com" 
                            {...field} 
                          />
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
                          <Input 
                            placeholder="(11) 99999-9999" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Digite uma senha segura" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Repita a senha" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>📱 WhatsApp:</strong> Você receberá informações importantes 
                      sobre sua candidatura no WhatsApp informado.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>🔐 Acesso:</strong> Após criar sua conta, você poderá 
                      fazer login e acessar sua área do cuidador para completar 
                      suas informações profissionais.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Criando Conta..." : "Criar Conta de Acesso"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Já possui uma conta?{" "}
                  <a href="/admin/login" className="text-primary hover:underline">
                    Faça login aqui
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
