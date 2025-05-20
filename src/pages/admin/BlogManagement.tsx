import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author_id: string;
  published: boolean;
  created_at: string;
}

const BlogManagement = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "The Future of Care",
      excerpt: "Exploring new trends in caregiving.",
      content: "Detailed content here...",
      author_id: "101",
      published: true,
      created_at: "2024-01-20",
    },
    {
      id: "2",
      title: "Caring for Seniors",
      excerpt: "Tips for providing excellent senior care.",
      content: "Detailed content here...",
      author_id: "102",
      published: false,
      created_at: "2024-01-15",
    },
  ]);

  return (
    <div>
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold">Blog Management</h1>
          <Button asChild>
            <Link to="/admin/blog/new">Create New Post</Link>
          </Button>
        </div>
        <div className="mb-4">
          <Input type="text" placeholder="Search posts..." />
        </div>
        <Table>
          <TableCaption>A list of your recent blog posts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead>Excerpt</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.excerpt}</TableCell>
                <TableCell>{post.author_id}</TableCell>
                <TableCell>{post.published ? "Sim" : "Não"}</TableCell>
                <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/blog/edit/${post.id}`} className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/blog/${post.id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BlogManagement;
