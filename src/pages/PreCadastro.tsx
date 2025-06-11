
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
});

type FormData = z.infer<typeof formSchema>;

export default function PreCadastro() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
    },
  });

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const sendToWebhook = async (data: FormData) => {
    try {
      console.log("Enviando dados para webhook:", data);
      
      const response = await fetch("https://n8n-n8n.n1n956.easypanel.host/webhook/sdr-youtube", {
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
          source: "pre-cadastro-cuidador",
        }),
      });

      console.log("Dados enviados para webhook com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao enviar para webhook:", error);
      // Não interrompe o fluxo mesmo se o webhook falhar
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    console.log("Iniciando pré-cadastro para:", data.email);

    try {
      // Primeiro, enviar para o webhook
      await sendToWebhook(data);

      const generatedPassword = generateSecurePassword();
      console.log("Senha gerada:", generatedPassword);

      // Create the caregiver candidate record in candidatos_cuidadores_rows
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidatos_cuidadores_rows')
        .insert({
          nome: data.name,
          email: data.email.toLowerCase().trim(),
          telefone: data.whatsapp, // Salvar WhatsApp no campo telefone
          data_nascimento: '', // Will be filled in the complete form
          fumante: 'Não', // Default value
          escolaridade: '', // Will be filled in the complete form
          possui_experiencia: 'Não', // Default value
          disponivel_dormir_local: 'Não', // Default value
          status_candidatura: 'Em análise',
          cidade: '', // Will be filled in the complete form
          endereco: '', // Will be filled in the complete form
          cep: '', // Will be filled in the complete form
          possui_filhos: false, // Default value
          data_cadastro: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (candidateError) {
        console.error("Erro ao criar registro do candidato:", candidateError);
        if (candidateError.code === '23505') {
          toast.error("Este email já está cadastrado no sistema.");
        } else {
          toast.error("Erro ao criar pré-cadastro. Tente novamente.");
        }
        return;
      }

      console.log("Candidato criado:", candidateData);

      // Store fallback user data in localStorage for immediate access
      localStorage.setItem('fallback_user', JSON.stringify({
        id: candidateData.id,
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        password: generatedPassword
      }));

      toast.success("Pré-cadastro realizado com sucesso! Redirecionando para o formulário completo...");
      
      // Redirect to complete registration form after 2 seconds
      setTimeout(() => {
        window.location.href = "/cadastrar-cuidador";
      }, 2000);

    } catch (error) {
      console.error("Erro no pré-cadastro:", error);
      toast.error("Erro ao processar pré-cadastro. Tente novamente.");
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
                Pré-Cadastro de Cuidador
              </CardTitle>
              <p className="text-gray-600">
                Insira seus dados básicos para começar seu cadastro
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

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>📱 WhatsApp:</strong> As informações para concluir seu cadastro 
                      e suas credenciais de acesso serão enviadas no WhatsApp informado acima.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>📧 Próximo passo:</strong> Após confirmar seus dados básicos, 
                      você será redirecionado para preencher o formulário completo com suas 
                      informações profissionais.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processando..." : "Continuar Cadastro"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Após confirmar seus dados, você preencherá suas informações 
                  profissionais e receberá suas credenciais de acesso via WhatsApp.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
