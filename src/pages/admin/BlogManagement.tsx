
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
  status: "Published" | "Draft";
  date: string;
  excerpt: string;
  content?: string;
  slug?: string;
};

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const { toast } = useToast();
  
  // For editing
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editStatus, setEditStatus] = useState<"Published" | "Draft">("Draft");
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
        category: post.category || "Uncategorized",
        author: post.author || "Admin",
        status: post.published ? "Published" : "Draft",
        date: new Date(post.created_at).toISOString().split("T")[0],
        excerpt: post.excerpt || "",
        content: post.content,
        slug: post.slug
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error fetching posts",
        description: "There was an error loading the blog posts.",
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
    
    const matchesCategory = categoryFilter === "All Categories" || post.category === categoryFilter;
    const matchesStatus = statusFilter === "All Status" || post.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories from posts
  const categories = ["All Categories", ...new Set(posts.map(post => post.category))];

  // Handle delete post
  const handleDeletePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
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
          title: "Blog post deleted",
          description: "The blog post has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        toast({
          title: "Error deleting post",
          description: "There was an error deleting the blog post.",
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
          published: editStatus === "Published"
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
        title: "Blog post updated",
        description: "The blog post has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error updating post",
        description: "There was an error updating the blog post.",
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
          <h1 className="text-3xl font-bold mb-2">Blog Management</h1>
          <p className="text-gray-600">Create, edit, and manage blog posts.</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-careconnect-blue hover:bg-careconnect-blue/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Post
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search posts..."
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
                <option value="All Status">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          
          {/* Blog Posts Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading blog posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No blog posts found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
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
                          post.status === "Published" 
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
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
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
              Showing {filteredPosts.length} of {posts.length} posts
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Blog Post Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-[90vw] sm:max-w-[600px] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Edit Blog Post</SheetTitle>
            <SheetDescription>Make changes to your blog post here. Click save when you're done.</SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Post title"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <Input
                id="category"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Post category"
              />
            </div>
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Excerpt</label>
              <Input
                id="excerpt"
                value={editExcerpt}
                onChange={(e) => setEditExcerpt(e.target.value)}
                placeholder="Short excerpt"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
              <textarea
                id="content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
                placeholder="Blog content"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-careconnect-blue focus:border-careconnect-blue"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
              <select
                id="status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as "Published" | "Draft")}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-careconnect-blue focus:border-careconnect-blue"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          
          <SheetFooter className="mt-6">
            <Button type="submit" onClick={handleSavePost} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
              {!isSaving && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BlogManagement;
