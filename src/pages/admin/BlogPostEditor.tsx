
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author_id: string;
  published: boolean;
  created_at: string;
  slug: string;
  cover_image?: string;
}

const BlogPostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNewPost = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [post, setPost] = useState<BlogPost>({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    author_id: "",
    published: false,
    created_at: new Date().toISOString(),
    slug: "",
    cover_image: ""
  });
  
  useEffect(() => {
    if (!isNewPost) {
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [id]);
  
  const fetchPost = async () => {
    try {
      console.log("Fetching post with ID:", id);
      
      // First try to fetch the post using the ID directly
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id);
        
      let { data, error } = await query.single();
      
      // If there's an error (likely due to invalid UUID format), try to fetch by numeric ID
      if (error && error.code === "22P02") {
        console.log("ID appears to be numeric, trying to fetch posts and find by position");
        
        // Get all posts ordered by creation date
        const allPostsResult = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (allPostsResult.error) {
          throw allPostsResult.error;
        }
        
        // Get post at position (id-1) if id is a valid number
        const numericId = parseInt(id || "0", 10);
        if (numericId > 0 && allPostsResult.data && allPostsResult.data.length >= numericId) {
          data = allPostsResult.data[numericId - 1];
          error = null;
        }
      }
      
      if (error) {
        throw error;
      }
      
      if (data) {
        console.log("Fetched post data:", data);
        setPost(data as BlogPost);
      }
    } catch (error: any) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: `Failed to fetch blog post: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleContentChange = (content: string) => {
    setPost((prev) => ({ ...prev, content }));
  };
  
  const handlePublishedChange = (checked: boolean) => {
    setPost((prev) => ({ ...prev, published: checked }));
  };
  
  const handleImageUpload = (url: string) => {
    if (!post.cover_image) {
      setPost((prev) => ({ ...prev, cover_image: url }));
    }
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    let slug = post.slug;
    
    // If it's a new post or the slug is empty/matches the old title pattern,
    // auto-generate a new slug
    if (isNewPost || !post.slug || post.slug === generateSlug(post.title)) {
      slug = generateSlug(title);
    }
    
    setPost((prev) => ({ ...prev, title, slug }));
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!post.title || !post.content) {
        toast({
          title: "Missing information",
          description: "Title and content are required.",
          variant: "destructive",
        });
        return;
      }

      // Ensure we have a slug
      if (!post.slug) {
        post.slug = generateSlug(post.title);
      }
      
      let result;
      
      if (isNewPost) {
        // Create new post - remove the empty id field to let Supabase generate one
        const { id, ...postWithoutId } = post;
        console.log("Creating new post with data:", postWithoutId);
        
        result = await supabase.from("blog_posts").insert({
          ...postWithoutId,
          author_id: post.author_id || null // Use current user ID ideally
        }).select();
      } else {
        // Update existing post using the post.id from state
        // Only proceed if we have a valid ID
        if (!post.id) {
          throw new Error("Cannot update post: Missing post ID");
        }
        
        console.log("Updating post with ID:", post.id, "Data:", {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          published: post.published,
          slug: post.slug,
          cover_image: post.cover_image
        });
        
        result = await supabase
          .from("blog_posts")
          .update({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            published: post.published,
            slug: post.slug,
            cover_image: post.cover_image,
            updated_at: new Date().toISOString()
          })
          .eq("id", post.id) // Use the post.id from state, not from URL params
          .select();
      }
      
      const { error, data } = result;
      
      if (error) {
        console.error("Error saving post:", error);
        throw error;
      }
      
      console.log("Post saved successfully:", data);
      
      toast({
        title: "Success",
        description: `Blog post ${isNewPost ? "created" : "updated"} successfully.`,
      });
      
      // Redirect to blog management
      navigate("/admin/blog");
      
    } catch (error: any) {
      console.error("Error in handleSave:", error);
      toast({
        title: "Error",
        description: `Failed to save blog post: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">
          {isNewPost ? "Create New Post" : "Edit Post"}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/blog")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={post.title}
            onChange={handleTitleChange}
            placeholder="Post title"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={post.slug}
            onChange={handleInputChange}
            placeholder="post-url-slug"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={post.excerpt || ""}
            onChange={handleInputChange}
            placeholder="Brief description of the post"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="content">Content</Label>
          <div className="mt-1">
            <RichTextEditor 
              value={post.content} 
              onChange={handleContentChange}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="cover_image">Cover Image URL</Label>
          <Input
            id="cover_image"
            name="cover_image"
            value={post.cover_image || ""}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="published"
            checked={post.published || false}
            onCheckedChange={handlePublishedChange}
          />
          <Label htmlFor="published">Publish this post</Label>
        </div>
      </div>
    </div>
  );
};

export default BlogPostEditor;
