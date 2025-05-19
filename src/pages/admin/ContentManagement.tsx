
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText, Edit, Image, Save } from "lucide-react";

// Sample content data
const initialContent = [
  {
    id: 1,
    title: "Home Page - Hero Section",
    type: "Text",
    status: "Published",
    lastUpdated: "2023-05-15",
    content: {
      heading: "Connecting Care with Compassion",
      subheading: "Professional caregiving services tailored to your needs. We connect qualified caregivers with those who need assistance."
    }
  },
  {
    id: 2,
    title: "Home Page - About Section",
    type: "Text",
    status: "Published",
    lastUpdated: "2023-05-10",
    content: {
      heading: "About CareConnect",
      text: "Founded in 2010, CareConnect has been on a mission to transform the way caregiving services are delivered. We believe that everyone deserves compassionate care tailored to their unique needs.",
      stats: [
        { label: "Certified Caregivers", value: "500+" },
        { label: "Happy Clients", value: "1000+" },
        { label: "Years of Experience", value: "15+" }
      ]
    }
  },
  {
    id: 3,
    title: "Services Page - Hero Image",
    type: "Image",
    status: "Published",
    lastUpdated: "2023-04-28",
    content: {
      imageUrl: "https://images.unsplash.com/photo-1576765608622-067973a79f53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      altText: "Caregiver helping elderly person"
    }
  },
  {
    id: 4,
    title: "About Page - Mission Statement",
    type: "Text",
    status: "Published",
    lastUpdated: "2023-04-20",
    content: {
      heading: "Our Mission",
      text: "To enhance the quality of life for those who need care by connecting them with compassionate, skilled caregivers who provide personalized support that respects dignity and independence."
    }
  },
  {
    id: 5,
    title: "Contact Page - Information",
    type: "Text",
    status: "Draft",
    lastUpdated: "2023-05-18",
    content: {
      heading: "Get In Touch",
      text: "Whether you're looking for care for yourself or a loved one, or if you have questions about our services, we're here to help. Reach out to us using the contact information below or fill out the form.",
      email: "info@careconnect.com",
      phone: "(123) 456-7890",
      address: "123 Care Street, Anytown, ST 12345"
    }
  }
];

const ContentManagement = () => {
  const [content, setContent] = useState(initialContent);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<any>(null);
  
  const { toast } = useToast();

  // Filter content based on search term
  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectContent = (item: any) => {
    setSelectedContent(item);
    setEditedContent(JSON.parse(JSON.stringify(item.content))); // Deep copy
    setIsEditing(false);
  };

  const handleSaveContent = () => {
    const updatedContent = content.map(item => {
      if (item.id === selectedContent.id) {
        const now = new Date().toISOString().split('T')[0];
        return {
          ...item,
          content: editedContent,
          lastUpdated: now,
          status: "Published"
        };
      }
      return item;
    });
    
    setContent(updatedContent);
    setSelectedContent({
      ...selectedContent,
      content: editedContent,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: "Published"
    });
    setIsEditing(false);
    
    toast({
      title: "Content updated",
      description: "Your changes have been published successfully.",
    });
  };

  const renderEditForm = () => {
    if (!selectedContent || !editedContent) return null;
    
    if (selectedContent.type === "Text") {
      return (
        <div className="space-y-4">
          {editedContent.heading !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading
              </label>
              <Input
                value={editedContent.heading}
                onChange={(e) => setEditedContent({...editedContent, heading: e.target.value})}
              />
            </div>
          )}
          
          {editedContent.subheading !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subheading
              </label>
              <Input
                value={editedContent.subheading}
                onChange={(e) => setEditedContent({...editedContent, subheading: e.target.value})}
              />
            </div>
          )}
          
          {editedContent.text !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Content
              </label>
              <Textarea
                value={editedContent.text}
                onChange={(e) => setEditedContent({...editedContent, text: e.target.value})}
                rows={4}
              />
            </div>
          )}
          
          {editedContent.email !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                value={editedContent.email}
                onChange={(e) => setEditedContent({...editedContent, email: e.target.value})}
              />
            </div>
          )}
          
          {editedContent.phone !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={editedContent.phone}
                onChange={(e) => setEditedContent({...editedContent, phone: e.target.value})}
              />
            </div>
          )}
          
          {editedContent.address !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={editedContent.address}
                onChange={(e) => setEditedContent({...editedContent, address: e.target.value})}
              />
            </div>
          )}
          
          {editedContent.stats !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statistics
              </label>
              {editedContent.stats.map((stat: any, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...editedContent.stats];
                      newStats[index].label = e.target.value;
                      setEditedContent({...editedContent, stats: newStats});
                    }}
                    placeholder="Label"
                    className="flex-grow"
                  />
                  <Input
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...editedContent.stats];
                      newStats[index].value = e.target.value;
                      setEditedContent({...editedContent, stats: newStats});
                    }}
                    placeholder="Value"
                    className="w-24"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (selectedContent.type === "Image") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <Input
              value={editedContent.imageUrl}
              onChange={(e) => setEditedContent({...editedContent, imageUrl: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <Input
              value={editedContent.altText}
              onChange={(e) => setEditedContent({...editedContent, altText: e.target.value})}
              placeholder="Descriptive text for the image"
            />
          </div>
          
          {editedContent.imageUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={editedContent.imageUrl}
                  alt={editedContent.altText || "Preview"}
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return <p className="text-gray-500">Unsupported content type.</p>;
  };

  const renderContentPreview = () => {
    if (!selectedContent) {
      return (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Select a content item to view details</p>
        </div>
      );
    }
    
    if (selectedContent.type === "Text") {
      return (
        <div className="space-y-4">
          {selectedContent.content.heading && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Heading</h4>
              <p className="text-lg font-semibold">{selectedContent.content.heading}</p>
            </div>
          )}
          
          {selectedContent.content.subheading && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Subheading</h4>
              <p>{selectedContent.content.subheading}</p>
            </div>
          )}
          
          {selectedContent.content.text && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Text Content</h4>
              <p className="text-gray-700">{selectedContent.content.text}</p>
            </div>
          )}
          
          {selectedContent.content.email && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
              <p>{selectedContent.content.email}</p>
            </div>
          )}
          
          {selectedContent.content.phone && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
              <p>{selectedContent.content.phone}</p>
            </div>
          )}
          
          {selectedContent.content.address && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
              <p>{selectedContent.content.address}</p>
            </div>
          )}
          
          {selectedContent.content.stats && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                {selectedContent.content.stats.map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                    <p className="text-xl font-bold text-careconnect-blue">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (selectedContent.type === "Image") {
      return (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Image Preview</h4>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <img
              src={selectedContent.content.imageUrl}
              alt={selectedContent.content.altText || "Content image"}
              className="max-w-full h-auto"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-medium">Alt Text:</span> {selectedContent.content.altText}
          </p>
        </div>
      );
    }
    
    return <p className="text-gray-500">Unsupported content type.</p>;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Management</h1>
        <p className="text-gray-600">Edit and manage website content.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Content Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search content..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                {filteredContent.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No content items found.</p>
                ) : (
                  filteredContent.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedContent?.id === item.id
                          ? "bg-careconnect-blue text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleSelectContent(item)}
                    >
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          selectedContent?.id === item.id
                            ? "bg-white text-careconnect-blue"
                            : "bg-careconnect-blue/10 text-careconnect-blue"
                        }`}>
                          {item.type === "Text" ? <FileText size={16} /> : <Image size={16} />}
                        </div>
                        <div>
                          <h3 className={`font-medium truncate ${
                            selectedContent?.id === item.id ? "text-white" : "text-gray-800"
                          }`}>
                            {item.title}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs ${
                              selectedContent?.id === item.id ? "text-white/80" : "text-gray-500"
                            }`}>
                              {item.type}
                            </span>
                            <span className={`mx-2 text-xs ${
                              selectedContent?.id === item.id ? "text-white/60" : "text-gray-300"
                            }`}>•</span>
                            <span className={`text-xs ${
                              selectedContent?.id === item.id
                                ? "text-white/80"
                                : item.status === "Published" ? "text-green-600" : "text-yellow-600"
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Preview/Edit */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>{selectedContent ? selectedContent.title : "Content Preview"}</CardTitle>
              {selectedContent && (
                <div className="flex space-x-2">
                  {isEditing ? (
                    <Button 
                      onClick={handleSaveContent}
                      className="bg-careconnect-blue hover:bg-careconnect-blue/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Content
                    </Button>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {selectedContent && (
                <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedContent.status === "Published" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {selectedContent.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Last updated: {selectedContent.lastUpdated}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Content type: <span className="font-medium">{selectedContent.type}</span>
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-gray-50 rounded-lg min-h-[300px]">
                {isEditing ? renderEditForm() : renderContentPreview()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
