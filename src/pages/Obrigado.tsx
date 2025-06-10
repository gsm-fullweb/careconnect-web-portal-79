
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Eye, EyeOff, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";

export default function Obrigado() {
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
    name: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Recuperar credenciais do localStorage
    const fallbackUser = localStorage.getItem('fallback_user');
    if (fallbackUser) {
      const userData = JSON.parse(fallbackUser);
      setCredentials({
        email: userData.email,
        password: userData.password,
        name: userData.name
      });
      
      // Limpar do localStorage após 5 minutos por segurança
      setTimeout(() => {
        localStorage.removeItem('fallback_user');
      }, 300000); // 5 minutos
    } else {
      // Se não há credenciais, redirecionar para home
      window.location.href = "/";
    }
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copiado para a área de transferência!`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGoToLogin = () => {
    // Redirecionar para o painel do cuidador
    window.location.href = "/painel-cuidador";
  };

  if (!credentials) {
    return (
      <Layout>
        <div className="py-12 md:py-20 bg-primary/5 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-20 bg-primary/5 min-h-screen flex items-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600">
              Cadastro Realizado com Sucesso!
            </h1>
            <p className="text-lg text-gray-600">
              Olá <strong>{credentials.name}</strong>, seu cadastro foi concluído e está em análise.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                Suas Credenciais de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <strong>⚠️ Importante:</strong> Anote essas credenciais em local seguro. 
                  Esta é a única vez que a senha será exibida.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email de Acesso:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-white border rounded font-mono text-sm">
                      {credentials.email}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(credentials.email, "Email")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha Temporária:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-white border rounded font-mono text-sm">
                      {showPassword ? credentials.password : "••••••••••••"}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(credentials.password, "Senha")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-orange-800">
                  <strong>🔐 Segurança:</strong> Esta é uma senha temporária de primeiro acesso. 
                  <strong> Você DEVE alterá-la assim que fizer o primeiro login</strong> para garantir a segurança da sua conta.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Próximos Passos:</h3>
                <div className="text-left space-y-2 max-w-md mx-auto">
                  <div className="flex items-start gap-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                    <span className="text-sm">Guarde suas credenciais em local seguro</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                    <span className="text-sm">Acesse seu painel com as credenciais fornecidas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                    <span className="text-sm">Altere sua senha no primeiro acesso</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                    <span className="text-sm">Aguarde a análise do seu cadastro por nossa equipe</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleGoToLogin}
                    className="bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Acessar Meu Painel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-gray-600">
            <p>
              Dúvidas? Entre em contato conosco através do nosso 
              <a href="/contact" className="text-primary hover:underline ml-1">
                formulário de contato
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
