
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
});

type FormData = z.infer<typeof formSchema>;

export default function PreCadastro() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    console.log("Iniciando pré-cadastro para:", data.email);

    try {
      const generatedPassword = generateSecurePassword();
      console.log("Senha gerada:", generatedPassword);

      // First, create the caregiver record
      const { data: caregiverData, error: caregiverError } = await supabase
        .from('caregivers')
        .insert({
          name: data.name,
          email: data.email.toLowerCase().trim(),
          status: 'pre_registered'
        })
        .select()
        .single();

      if (caregiverError) {
        console.error("Erro ao criar registro do cuidador:", caregiverError);
        if (caregiverError.code === '23505') {
          toast.error("Este email já está cadastrado no sistema.");
        } else {
          toast.error("Erro ao criar pré-cadastro. Tente novamente.");
        }
        return;
      }

      console.log("Cuidador criado:", caregiverData);

      // Store fallback user data in localStorage for immediate access
      localStorage.setItem('fallback_user', JSON.stringify({
        id: caregiverData.id,
        name: data.name,
        email: data.email,
        password: generatedPassword
      }));

      // Try to create Supabase Auth user
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email.toLowerCase().trim(),
          password: generatedPassword,
          options: {
            data: {
              first_name: data.name.split(' ')[0],
              last_name: data.name.split(' ').slice(1).join(' ') || '',
            }
          }
        });

        if (authError) {
          console.error("Erro na criação de usuário Supabase:", authError);
          // Continue with fallback method - don't block the process
        } else {
          console.log("Usuário Supabase criado:", authData);
          
          // Update caregiver record with user_id if auth was successful
          if (authData.user) {
            await supabase
              .from('caregivers')
              .update({ user_id: authData.user.id })
              .eq('id', caregiverData.id);
          }
        }
      } catch (authError) {
        console.error("Erro no processo de autenticação:", authError);
        // Continue with fallback method
      }

      toast.success(`Pré-cadastro realizado com sucesso! Uma senha foi gerada: ${generatedPassword}. Você será redirecionado para completar seu cadastro.`);
      
      // Redirect to complete registration form after 3 seconds
      setTimeout(() => {
        window.location.href = "/cadastrar-cuidador";
      }, 3000);

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

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>📧 Importante:</strong> Uma senha segura será gerada automaticamente 
                      e exibida na tela após o cadastro. Anote-a para futuras consultas!
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processando..." : "Criar Pré-Cadastro"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Após o pré-cadastro, você será direcionado para o formulário completo 
                  onde poderá preencher todas suas informações profissionais.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
