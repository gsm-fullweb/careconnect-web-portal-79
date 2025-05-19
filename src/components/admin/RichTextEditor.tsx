
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Link, 
  Unlink, 
  Image as ImageIcon,
  Upload,
  Trash
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (url: string) => void;
}

const RichTextEditor = ({ value, onChange, onImageUpload }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const formatDoc = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateEditorContent();
  };

  const updateEditorContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploadingImage(true);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `content-images/${fileName}`;
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
        
      if (publicUrlData && publicUrlData.publicUrl) {
        // Insert the image into the editor
        document.execCommand('insertImage', false, publicUrlData.publicUrl);
        updateEditorContent();
        
        // Also notify parent component if needed
        if (onImageUpload) {
          onImageUpload(publicUrlData.publicUrl);
        }
        
        toast({
          title: "Image uploaded",
          description: "The image has been uploaded and inserted.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading the image.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddLink = () => {
    if (showLinkInput) {
      if (linkUrl) {
        formatDoc('createLink', linkUrl);
      }
      setShowLinkInput(false);
      setLinkUrl("");
    } else {
      setShowLinkInput(true);
    }
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="p-2 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => formatDoc('bold')}
          title="Bold"
        >
          <Bold size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => formatDoc('italic')}
          title="Italic"
        >
          <Italic size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => formatDoc('underline')}
          title="Underline"
        >
          <Underline size={18} />
        </Button>
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => formatDoc('justifyLeft')}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => formatDoc('justifyCenter')}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => formatDoc('justifyRight')}
          title="Align Right"
        >
          <AlignRight size={18} />
        </Button>
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => formatDoc('insertUnorderedList')}
          title="Bullet List"
        >
          <List size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => formatDoc('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </Button>
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddLink}
          title="Insert Link"
        >
          <Link size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => formatDoc('unlink')}
          title="Remove Link"
        >
          <Unlink size={18} />
        </Button>
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUploadClick}
          disabled={isUploadingImage}
          title="Upload Image"
        >
          {isUploadingImage ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-careconnect-blue rounded-full animate-spin"></div>
          ) : (
            <Upload size={18} />
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelected}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {showLinkInput && (
        <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
          <Input
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleAddLink} size="sm">
            Insert
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowLinkInput(false)}
          >
            Cancel
          </Button>
        </div>
      )}
      
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[200px] focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={updateEditorContent}
        onBlur={updateEditorContent}
      />
    </div>
  );
};

export default RichTextEditor;
