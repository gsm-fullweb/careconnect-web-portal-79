
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, Trash2, Search } from "lucide-react";

interface ImageGalleryProps {
  onSelect: (url: string) => void;
}

const ImageGallery = ({ onSelect }: ImageGalleryProps) => {
  const [images, setImages] = useState<Array<{ name: string; url: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .storage
        .from('public')
        .list('content-images', {
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      if (data) {
        const imageList = await Promise.all(
          data
            .filter(file => file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i))
            .map(async (file) => {
              const { data: urlData } = supabase
                .storage
                .from('public')
                .getPublicUrl(`content-images/${file.name}`);
              
              return {
                name: file.name,
                url: urlData?.publicUrl || "",
              };
            })
        );
        
        setImages(imageList);
      }
    } catch (error: any) {
      toast({
        title: "Error loading images",
        description: error.message || "Failed to load images from storage",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file.`,
            variant: "destructive",
          });
          continue;
        }
        
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
        const filePath = `content-images/${fileName}`;
        
        // Upload to Supabase
        const { error } = await supabase.storage
          .from('public')
          .upload(filePath, file);
        
        if (error) throw error;
      }
      
      toast({
        title: "Upload successful",
        description: "Image(s) uploaded successfully.",
      });
      
      // Refresh the image list
      await loadImages();
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  const handleDeleteImage = async (imageName: string) => {
    try {
      const { error } = await supabase
        .storage
        .from('public')
        .remove([`content-images/${imageName}`]);
      
      if (error) throw error;
      
      toast({
        title: "Image deleted",
        description: "The image has been removed from storage.",
      });
      
      // Update the image list
      setImages(images.filter(img => img.name !== imageName));
      
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete the image.",
        variant: "destructive",
      });
    }
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Image Gallery</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('gallery-upload')?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-careconnect-blue rounded-full animate-spin mr-2"></div>
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            Upload Images
          </Button>
          <input
            id="gallery-upload"
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search images..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="h-8 w-8 border-4 border-t-transparent border-careconnect-blue rounded-full animate-spin"></div>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
          <Image size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">
            {searchTerm ? "No images match your search" : "No images uploaded yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-1">
          {filteredImages.map((image) => (
            <div 
              key={image.name} 
              className="relative group border border-gray-200 rounded-md overflow-hidden"
            >
              <img 
                src={image.url} 
                alt={image.name} 
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="mr-1" 
                  onClick={() => onSelect(image.url)}
                >
                  Select
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDeleteImage(image.name)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
