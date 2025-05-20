
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText, Edit, Image as ImageIcon, Save, Plus, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageGallery from "@/components/admin/ImageGallery";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ContentManagement = () => {
  const [content, setContent] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<any>(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [richTextMode, setRichTextMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddContentDialog, setShowAddContentDialog] = useState(false);
  const [newContentTitle, setNewContentTitle] = useState("");
  const [newContentType, setNewContentType] = useState("Text");
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (selectedContent && selectedContent.type === "Text" && selectedContent.content.text) {
      setHtmlContent(selectedContent.content.text);
    }
  }, [selectedContent]);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;

      if (data) {
        setContent(data.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          status: item.status,
          lastUpdated: new Date(item.last_updated).toISOString().split('T')[0],
          content: item.content
        })));
      }
    } catch (error: any) {
      toast({
        title: "Error fetching content",
        description: error.message || "Failed to load content items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter content based on search term
  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectContent = (item: any) => {
    setSelectedContent(item);
    setEditedContent(JSON.parse(JSON.stringify(item.content))); // Deep copy
    setIsEditing(false);
    
    // If it's a text content, set the HTML content for the rich text editor
    if (item.type === "Text" && item.content.text) {
      setHtmlContent(item.content.text);
      setRichTextMode(false);
    }
  };

  const handleSaveContent = async () => {
    try {
      setIsSaving(true);
      
      // If we're in rich text mode and it's a text content, update the text with HTML content
      if (richTextMode && selectedContent.type === "Text" && editedContent.text !== undefined) {
        editedContent.text = htmlContent;
      }
      
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('content_items')
        .update({
          content: editedContent,
          last_updated: now,
          status: "Published"
        })
        .eq('id', selectedContent.id);
      
      if (error) throw error;
      
      // Update local state
      const updatedContent = content.map(item => {
        if (item.id === selectedContent.id) {
          return {
            ...item,
            content: editedContent,
            lastUpdated: now.split('T')[0],
            status: "Published"
          };
        }
        return item;
      });
      
      setContent(updatedContent);
      setSelectedContent({
        ...selectedContent,
        content: editedContent,
        lastUpdated: now.split('T')[0],
        status: "Published"
      });
      setIsEditing(false);
      setRichTextMode(false);
      
      toast({
        title: "Content updated",
        description: "Your changes have been published successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving content",
        description: error.message || "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddContent = async () => {
    try {
      if (!newContentTitle.trim()) {
        toast({
          title: "Title required",
          description: "Please provide a title for the content item",
          variant: "destructive"
        });
        return;
      }

      const newContent = {
        title: newContentTitle,
        type: newContentType,
        status: "Draft",
        content: newContentType === "Text" 
          ? { heading: "", subheading: "", text: "" } 
          : { imageUrl: "", altText: "" }
      };

      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          title: newContent.title,
          type: newContent.type,
          status: newContent.status,
          content: newContent.content
        }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const createdItem = {
          id: data[0].id,
          title: data[0].title,
          type: data[0].type,
          status: data[0].status,
          lastUpdated: new Date(data[0].last_updated).toISOString().split('T')[0],
          content: data[0].content
        };
        
        setContent([createdItem, ...content]);
        setNewContentTitle("");
        setShowAddContentDialog(false);
        
        // Select the newly created content
        handleSelectContent(createdItem);
        setIsEditing(true);
        
        toast({
          title: "Content created",
          description: "New content item has been created.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error creating content",
        description: error.message || "Failed to create content item",
        variant: "destructive"
      });
    }
  };

  const handleDeleteContent = async () => {
    if (!contentToDelete) return;
    
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', contentToDelete);
      
      if (error) throw error;
      
      // Update local state
      const updatedContent = content.filter(item => item.id !== contentToDelete);
      setContent(updatedContent);
      
      // Reset selected content if it was the deleted one
      if (selectedContent && selectedContent.id === contentToDelete) {
        setSelectedContent(null);
        setEditedContent(null);
      }
      
      toast({
        title: "Content deleted",
        description: "The content item has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting content",
        description: error.message || "Failed to delete content item",
        variant: "destructive"
      });
    } finally {
      setContentToDelete(null);
      setConfirmDeleteDialogOpen(false);
    }
  };

  const confirmDelete = (id: string) => {
    setContentToDelete(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleImageSelect = (url: string) => {
    // Insert image URL into the appropriate field based on content type
    if (selectedContent.type === "Image") {
      setEditedContent({
        ...editedContent,
        imageUrl: url
      });
    }
    
    setShowImageGallery(false);
  };

  const toggleRichTextMode = () => {
    if (!richTextMode && selectedContent.type === "Text" && editedContent.text) {
      // When switching to rich text mode, use the current text as HTML
      setHtmlContent(editedContent.text);
    } else if (richTextMode && selectedContent.type === "Text") {
      // When switching back to normal mode, update the text content
      setEditedContent({
        ...editedContent,
        text: htmlContent
      });
    }
    
    setRichTextMode(!richTextMode);
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Text Content
                </label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleRichTextMode}
                >
                  {richTextMode ? "Simple Editor" : "Rich Text Editor"}
                </Button>
              </div>
              
              {richTextMode ? (
                <RichTextEditor 
                  value={htmlContent} 
                  onChange={setHtmlContent}
                />
              ) : (
                <Textarea
                  value={editedContent.text}
                  onChange={(e) => setEditedContent({...editedContent, text: e.target.value})}
                  rows={4}
                />
              )}
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImageGallery(true)}
              >
                Browse Gallery
              </Button>
            </div>
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
              <div 
                className="text-gray-700" 
                dangerouslySetInnerHTML={{ __html: selectedContent.content.text }}
              />
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
              <div className="flex justify-between items-center">
                <CardTitle>Content Items</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddContentDialog(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Add New
                </Button>
              </div>
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
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="h-8 w-8 border-4 border-t-transparent border-careconnect-blue rounded-full animate-spin"></div>
                </div>
              ) : (
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
                      >
                        <div className="flex items-start">
                          <div 
                            className="flex-grow"
                            onClick={() => handleSelectContent(item)}
                          >
                            <div className="flex items-start">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                selectedContent?.id === item.id
                                  ? "bg-white text-careconnect-blue"
                                  : "bg-careconnect-blue/10 text-careconnect-blue"
                              }`}>
                                {item.type === "Text" ? <FileText size={16} /> : <ImageIcon size={16} />}
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`ml-2 ${selectedContent?.id === item.id ? "text-white hover:text-white/80" : "text-gray-400 hover:text-red-500"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(item.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
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
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
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
      
      {/* Image Gallery Dialog */}
      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Gallery</DialogTitle>
          </DialogHeader>
          <ImageGallery onSelect={handleImageSelect} />
        </DialogContent>
      </Dialog>
      
      {/* Add Content Dialog */}
      <Dialog open={showAddContentDialog} onOpenChange={setShowAddContentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Title
              </label>
              <Input
                value={newContentTitle}
                onChange={(e) => setNewContentTitle(e.target.value)}
                placeholder="Enter content title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Type
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="typeText"
                    name="contentType"
                    value="Text"
                    checked={newContentType === "Text"}
                    onChange={() => setNewContentType("Text")}
                    className="mr-2"
                  />
                  <label htmlFor="typeText" className="text-sm">Text</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="typeImage"
                    name="contentType"
                    value="Image"
                    checked={newContentType === "Image"}
                    onChange={() => setNewContentType("Image")}
                    className="mr-2"
                  />
                  <label htmlFor="typeImage" className="text-sm">Image</label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddContentDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddContent}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContent}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentManagement;
