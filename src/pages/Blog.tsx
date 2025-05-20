
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Sample blog posts data
const blogPostsData = [
  {
    id: 1,
    title: "Dicas para Apoiar um Ente Querido com Demência",
    excerpt: "Aprenda estratégias eficazes para se comunicar e se conectar com alguém que está passando por demência ou perda de memória.",
    image: "https://images.unsplash.com/photo-1576765608622-067973a79f53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Dicas de Cuidado",
    date: "12 de Maio, 2023",
    author: "Dra. Lisa Johnson"
  },
  {
    id: 2,
    title: "Estratégias de Autocuidado para Cuidadores Familiares",
    excerpt: "Cuidar de um ente querido pode ser gratificante, mas também exaustivo. Veja como garantir que você também esteja se cuidando.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Autocuidado",
    date: "28 de Abril, 2023",
    author: "Michael Chen"
  },
  {
    id: 3,
    title: "Entendendo a Cobertura do Medicare para Cuidados Domiciliares",
    excerpt: "Navegue pelas complexidades do Medicare e saiba quais serviços de cuidados domiciliares podem ser cobertos por diferentes planos.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Saúde",
    date: "15 de Abril, 2023",
    author: "Sarah Chen"
  },
  {
    id: 4,
    title: "Criando um Ambiente Doméstico Seguro para Idosos",
    excerpt: "Modificações simples e medidas de segurança para ajudar a prevenir quedas e acidentes em casa.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Segurança Doméstica",
    date: "30 de Março, 2023",
    author: "Robert Williams"
  },
  {
    id: 5,
    title: "Os Benefícios do Cuidado Companionship para Idosos Isolados",
    excerpt: "A solidão pode ter sérias consequências para a saúde. Saiba como o cuidado de companhia pode melhorar a qualidade de vida.",
    image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Companhia",
    date: "18 de Março, 2023",
    author: "Dra. Lisa Johnson"
  },
  {
    id: 6,
    title: "Dicas de Nutrição para Adultos Idosos",
    excerpt: "Uma nutrição adequada torna-se cada vez mais importante conforme envelhecemos. Aprenda sobre necessidades dietéticas e planejamento de refeições para idosos.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Nutrição",
    date: "5 de Março, 2023",
    author: "Michael Chen"
  }
];

// Sample categories
const categories = [
  "Todas as Categorias",
  "Dicas de Cuidado",
  "Autocuidado",
  "Saúde",
  "Segurança Doméstica",
  "Companhia",
  "Nutrição"
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas as Categorias");
  
  // Filter posts based on search and category
  const filteredPosts = blogPostsData.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Todas as Categorias" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-careconnect-blue/90 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Blog CareConnect</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Insights, dicas e recursos para cuidadores e receptores de cuidados.
          </p>
        </div>
      </div>
      
      {/* Blog Content */}
      <section className="section bg-white">
        <div className="container-custom">
          {/* Search and Filters */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
              <div className="flex-grow">
                <Input
                  placeholder="Pesquisar publicações do blog..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-careconnect-blue focus:border-careconnect-blue"
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-4">Nenhum resultado encontrado</h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar sua pesquisa ou filtro para encontrar o que está procurando.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Todas as Categorias");
                  }}
                  variant="outline"
                >
                  Redefinir Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden card-hover">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-careconnect-blue text-white text-sm font-medium py-1 px-3 rounded-full">
                        {post.category}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        <Link to={`/blog/${post.id}`} className="hover:text-careconnect-blue">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 line-clamp-3 mb-4">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-4">{post.date}</span>
                        <span>Por {post.author}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/blog/${post.id}`}>Ler Mais</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-16 bg-careconnect-light p-8 md:p-12 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  Inscreva-se em Nossa Newsletter
                </h2>
                <p className="text-gray-700 mb-4">
                  Mantenha-se atualizado com nossos artigos mais recentes, dicas de cuidado e recursos.
                  Entregaremos diretamente à sua caixa de entrada.
                </p>
                <p className="text-gray-500 text-sm">
                  Respeitamos sua privacidade e nunca compartilharemos suas informações.
                </p>
              </div>
              <div>
                <form className="space-y-4">
                  <Input placeholder="Seu Nome" />
                  <Input placeholder="Seu Email" type="email" />
                  <Button className="w-full bg-careconnect-blue hover:bg-careconnect-blue/90">
                    Inscrever-se Agora
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
