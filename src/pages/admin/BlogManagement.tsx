
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, Plus, Eye, Save } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

// Define Blog Post type
type BlogPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  status: "Publicado" | "Rascunho";
  date: string;
  excerpt: string;
  content?: string;
  slug?: string;
};

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas as Categorias");
  const [statusFilter, setStatusFilter] = useState("Todos os Status");
  const { toast } = useToast();
  
  // For editing
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState<"Publicado" | "Rascunho">("Rascunho");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch blog posts from Supabase
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Format the posts
      const formattedPosts = data.map(post => ({
        id: post.id,
        title: post.title,
        category: post.category || "Sem categoria",
        author: post.author || "Admin",
        status: post.published ? "Publicado" : "Rascunho",
        date: new Date(post.created_at).toISOString().split("T")[0],
        excerpt: post.excerpt || "",
        content: post.content,
        slug: post.slug
      })) as BlogPost[];

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Erro ao buscar publicações",
        description: "Houve um erro ao carregar as publicações do blog.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter posts based on search term and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "Todas as Categorias" || post.category === categoryFilter;
    const matchesStatus = statusFilter === "Todos os Status" || post.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories from posts
  const categories = ["Todas as Categorias", ...new Set(posts.map(post => post.category))];

  // Handle delete post
  const handleDeletePost = async (id: string) => {
    if (window.confirm("Tem certeza de que deseja excluir esta publicação do blog?")) {
      try {
        const { error } = await supabase
          .from("blog_posts")
          .delete()
          .eq("id", id);

        if (error) {
          throw error;
        }
        
        setPosts(posts.filter(post => post.id !== id));
        
        toast({
          title: "Publicação do blog excluída",
          description: "A publicação do blog foi excluída com sucesso.",
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        toast({
          title: "Erro ao excluir publicação",
          description: "Houve um erro ao excluir a publicação do blog.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle edit post
  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setEditTitle(post.title);
    setEditCategory(post.category);
    setEditExcerpt(post.excerpt || "");
    setEditContent(post.content || "");
    setEditStatus(post.status);
    setIsEditSheetOpen(true);
  };

  // Save edited post
  const handleSavePost = async () => {
    if (!currentPost) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: editTitle,
          category: editCategory,
          excerpt: editExcerpt,
          content: editContent,
          published: editStatus === "Publicado"
        })
        .eq("id", currentPost.id);

      if (error) {
        throw error;
      }

      // Update local state
      setPosts(posts.map(post => 
        post.id === currentPost.id 
          ? {
              ...post,
              title: editTitle,
              category: editCategory,
              excerpt: editExcerpt,
              content: editContent,
              status: editStatus
            } 
          : post
      ));
      
      setIsEditSheetOpen(false);
      
      toast({
        title: "Publicação do blog atualizada",
        description: "A publicação do blog foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Erro ao atualizar publicação",
        description: "Houve um erro ao atualizar a publicação do blog.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento do Blog</h1>
          <p className="text-gray-600">Crie, edite e gerencie publicações do blog.</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-careconnect-blue hover:bg-careconnect-blue/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Nova Publicação
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Publicações do Blog</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Pesquisar publicações..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Todos os Status">Todos os Status</option>
                <option value="Publicado">Publicado</option>
                <option value="Rascunho">Rascunho</option>
              </select>
            </div>
          </div>
          
          {/* Blog Posts Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando publicações do blog...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma publicação do blog encontrada.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="max-w-xs truncate font-medium">{post.title}</div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-careconnect-blue/10 text-careconnect-blue">
                          {post.category}
                        </span>
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.status === "Publicado" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {post.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">{post.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash className="w-4 h-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          
          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Mostrando {filteredPosts.length} de {posts.length} publicações
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Blog Post Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-[90vw] sm:max-w-[600px] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Editar Publicação do Blog</SheetTitle>
            <SheetDescription>Faça alterações na sua publicação do blog aqui. Clique em salvar quando terminar.</SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Título</label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título da publicação"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Categoria</label>
              <Input
                id="category"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Categoria da publicação"
              />
            </div>
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Resumo</label>
              <Input
                id="excerpt"
                value={editExcerpt}
                onChange={(e) => setEditExcerpt(e.target.value)}
                placeholder="Resumo curto"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">Conteúdo</label>
              <textarea
                id="content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
                placeholder="Conteúdo do blog"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-careconnect-blue focus:border-careconnect-blue"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
              <select
                id="status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as "Publicado" | "Rascunho")}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-careconnect-blue focus:border-careconnect-blue"
              >
                <option value="Publicado">Publicado</option>
                <option value="Rascunho">Rascunho</option>
              </select>
            </div>
          </div>
          
          <SheetFooter className="mt-6">
            <Button type="submit" onClick={handleSavePost} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Alterações"}
              {!isSaving && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BlogManagement;
