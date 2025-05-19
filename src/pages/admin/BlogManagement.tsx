
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, Plus, Eye } from "lucide-react";

// Sample blog posts data
const initialPosts = [
  {
    id: 1,
    title: "Tips for Supporting a Loved One with Dementia",
    category: "Caregiving Tips",
    author: "Dr. Lisa Johnson",
    status: "Published",
    date: "2023-05-12"
  },
  {
    id: 2,
    title: "Self-Care Strategies for Family Caregivers",
    category: "Self-Care",
    author: "Michael Chen",
    status: "Published",
    date: "2023-04-28"
  },
  {
    id: 3,
    title: "Understanding Medicare Coverage for Home Care",
    category: "Healthcare",
    author: "Sarah Chen",
    status: "Published",
    date: "2023-04-15"
  },
  {
    id: 4,
    title: "Creating a Safe Home Environment for Seniors",
    category: "Home Safety",
    author: "Robert Williams",
    status: "Published",
    date: "2023-03-30"
  },
  {
    id: 5,
    title: "The Benefits of Companion Care for Isolated Seniors",
    category: "Companionship",
    author: "Dr. Lisa Johnson",
    status: "Published",
    date: "2023-03-18"
  },
  {
    id: 6,
    title: "Nutrition Tips for Aging Adults",
    category: "Nutrition",
    author: "Michael Chen",
    status: "Draft",
    date: "2023-03-05"
  }
];

const BlogManagement = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setPosts(posts.filter(post => post.id !== id));
      
      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });
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
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue">
                <option value="all">All Categories</option>
                <option value="caregiving-tips">Caregiving Tips</option>
                <option value="self-care">Self-Care</option>
                <option value="healthcare">Healthcare</option>
                <option value="home-safety">Home Safety</option>
                <option value="companionship">Companionship</option>
                <option value="nutrition">Nutrition</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue">
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          
          {/* Blog Posts Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Title</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Category</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Author</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Status</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Date</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No blog posts found.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="max-w-xs truncate font-medium">{post.title}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-careconnect-blue/10 text-careconnect-blue">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">{post.author}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.status === "Published" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500">{post.date}</td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
    </div>
  );
};

export default BlogManagement;
