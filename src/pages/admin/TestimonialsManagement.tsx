
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, Plus } from "lucide-react";

// Sample testimonials data
const initialTestimonials = [
  {
    id: 1,
    text: "CareConnect found us the perfect caregiver for my mother. The attention to detail and level of care has been exceptional. I can't recommend them enough!",
    name: "Sarah Johnson",
    role: "Daughter of Client",
    image: "https://i.pravatar.cc/150?img=1",
    status: "Active",
    date: "2023-05-15"
  },
  {
    id: 2,
    text: "As someone with mobility challenges, I was hesitant to have a caregiver in my home. CareConnect matched me with someone who respects my independence while providing the support I need.",
    name: "Robert Chen",
    role: "Client",
    image: "https://i.pravatar.cc/150?img=3",
    status: "Active",
    date: "2023-05-10"
  },
  {
    id: 3,
    text: "Working with CareConnect has been wonderful. They value their caregivers and ensure we have everything we need to provide excellent care to our clients.",
    name: "Maria Rodriguez",
    role: "CareConnect Caregiver",
    image: "https://i.pravatar.cc/150?img=5",
    status: "Active",
    date: "2023-04-28"
  },
  {
    id: 4,
    text: "The peace of mind that comes from knowing my grandfather is in capable, kind hands is priceless. CareConnect didn't just provide a caregiver - they became part of our family.",
    name: "James Williams",
    role: "Grandson of Client",
    image: "https://i.pravatar.cc/150?img=7",
    status: "Inactive",
    date: "2023-04-20"
  }
];

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    text: "",
    name: "",
    role: "",
    image: "https://i.pravatar.cc/150?img=8", // Placeholder avatar
    status: "Active"
  });
  
  const { toast } = useToast();

  // Filter testimonials based on search term
  const filteredTestimonials = testimonials.filter(testimonial => 
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    testimonial.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTestimonial = (id: number) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
      
      toast({
        title: "Testimonial deleted",
        description: "The testimonial has been successfully deleted.",
      });
    }
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];
    
    setTestimonials([
      ...testimonials,
      {
        id: testimonials.length + 1,
        ...newTestimonial,
        date: currentDate
      }
    ]);
    
    setNewTestimonial({
      text: "",
      name: "",
      role: "",
      image: "https://i.pravatar.cc/150?img=8",
      status: "Active"
    });
    
    setIsAddModalOpen(false);
    
    toast({
      title: "Testimonial added",
      description: "The new testimonial has been successfully added.",
    });
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Testimonials Management</h1>
          <p className="text-gray-600">Manage client testimonials and reviews.</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-careconnect-blue hover:bg-careconnect-blue/90"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search testimonials..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          {/* Testimonials Grid */}
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No testimonials found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 mb-4 text-sm line-clamp-4">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        testimonial.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {testimonial.status}
                      </span>
                      <span className="text-sm text-gray-500">{testimonial.date}</span>
                    </div>
                    <div className="mt-4 flex space-x-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                      >
                        <Trash className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Testimonial Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Add New Testimonial</h3>
              <form onSubmit={handleAddTestimonial}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      required
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role/Relationship
                    </label>
                    <Input
                      required
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                      placeholder="e.g., Client, Family Member, Caregiver"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Testimonial Text
                    </label>
                    <Textarea
                      required
                      value={newTestimonial.text}
                      onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
                      value={newTestimonial.status}
                      onChange={(e) => setNewTestimonial({...newTestimonial, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-careconnect-blue hover:bg-careconnect-blue/90"
                  >
                    Add Testimonial
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManagement;
