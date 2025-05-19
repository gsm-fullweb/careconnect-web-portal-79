
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
    title: "Tips for Supporting a Loved One with Dementia",
    excerpt: "Learn effective strategies to communicate and connect with someone experiencing dementia or memory loss.",
    image: "https://images.unsplash.com/photo-1576765608622-067973a79f53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Caregiving Tips",
    date: "May 12, 2023",
    author: "Dr. Lisa Johnson"
  },
  {
    id: 2,
    title: "Self-Care Strategies for Family Caregivers",
    excerpt: "Caring for a loved one can be rewarding but also exhausting. Here's how to make sure you're taking care of yourself too.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Self-Care",
    date: "April 28, 2023",
    author: "Michael Chen"
  },
  {
    id: 3,
    title: "Understanding Medicare Coverage for Home Care",
    excerpt: "Navigate the complexities of Medicare and learn what home care services might be covered under different plans.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Healthcare",
    date: "April 15, 2023",
    author: "Sarah Chen"
  },
  {
    id: 4,
    title: "Creating a Safe Home Environment for Seniors",
    excerpt: "Simple modifications and safety measures to help prevent falls and accidents in the home.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Home Safety",
    date: "March 30, 2023",
    author: "Robert Williams"
  },
  {
    id: 5,
    title: "The Benefits of Companion Care for Isolated Seniors",
    excerpt: "Loneliness can have serious health consequences. Learn how companion care can improve quality of life.",
    image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Companionship",
    date: "March 18, 2023",
    author: "Dr. Lisa Johnson"
  },
  {
    id: 6,
    title: "Nutrition Tips for Aging Adults",
    excerpt: "Proper nutrition becomes increasingly important as we age. Learn about dietary needs and meal planning for seniors.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Nutrition",
    date: "March 5, 2023",
    author: "Michael Chen"
  }
];

// Sample categories
const categories = [
  "All Categories",
  "Caregiving Tips",
  "Self-Care",
  "Healthcare",
  "Home Safety",
  "Companionship",
  "Nutrition"
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  // Filter posts based on search and category
  const filteredPosts = blogPostsData.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-careconnect-blue/90 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">CareConnect Blog</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Insights, tips, and resources for caregivers and care recipients.
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
                  placeholder="Search blog posts..."
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
                <h3 className="text-2xl font-semibold mb-4">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                  }}
                  variant="outline"
                >
                  Reset Filters
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
                        <span>By {post.author}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/blog/${post.id}`}>Read More</Link>
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
                  Subscribe to Our Newsletter
                </h2>
                <p className="text-gray-700 mb-4">
                  Stay updated with our latest articles, caregiving tips, and resources.
                  We'll deliver them straight to your inbox.
                </p>
                <p className="text-gray-500 text-sm">
                  We respect your privacy and will never share your information.
                </p>
              </div>
              <div>
                <form className="space-y-4">
                  <Input placeholder="Your Name" />
                  <Input placeholder="Your Email" type="email" />
                  <Button className="w-full bg-careconnect-blue hover:bg-careconnect-blue/90">
                    Subscribe Now
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
