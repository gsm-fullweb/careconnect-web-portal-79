
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, Plus, LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  type: string | null;
  status: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const PartnersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [newPartner, setNewPartner] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    type: "Healthcare Provider",
    status: "Active",
    description: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch partners from database
  const { data: partners = [], isLoading, error } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Partner[];
    }
  });

  // Add partner mutation
  const addPartnerMutation = useMutation({
    mutationFn: async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('partners')
        .insert([partner])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      setIsAddModalOpen(false);
      setNewPartner({
        name: "",
        logo_url: "",
        website_url: "",
        type: "Healthcare Provider",
        status: "Active",
        description: ""
      });
      toast({
        title: "Partner added",
        description: "The new partner has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add partner. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding partner:", error);
    }
  });

  // Edit partner mutation
  const editPartnerMutation = useMutation({
    mutationFn: async (partner: Partner) => {
      const { data, error } = await supabase
        .from('partners')
        .update({
          name: partner.name,
          logo_url: partner.logo_url,
          website_url: partner.website_url,
          type: partner.type,
          status: partner.status,
          description: partner.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', partner.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      setIsEditModalOpen(false);
      setEditingPartner(null);
      toast({
        title: "Partner updated",
        description: "The partner has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update partner. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating partner:", error);
    }
  });

  // Delete partner mutation
  const deletePartnerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({
        title: "Partner deleted",
        description: "The partner has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete partner. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting partner:", error);
    }
  });

  // Filter partners based on search term and filters
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (partner.type && partner.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || partner.type === typeFilter;
    const matchesStatus = statusFilter === "all" || partner.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeletePartner = (id: string) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      deletePartnerMutation.mutate(id);
    }
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    addPartnerMutation.mutate(newPartner);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setIsEditModalOpen(true);
  };

  const handleUpdatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPartner) {
      editPartnerMutation.mutate(editingPartner);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading partners: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Partners Management</h1>
          <p className="text-gray-600">Manage healthcare and insurance partners.</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-careconnect-blue hover:bg-careconnect-blue/90"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Partners</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search partners..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue bg-white"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Insurance">Insurance</option>
                <option value="Healthcare Provider">Healthcare Provider</option>
                <option value="Non-Profit">Non-Profit</option>
                <option value="Community Organization">Community Organization</option>
                <option value="Association">Association</option>
              </select>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading partners...</p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No partners found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="h-24 flex items-center justify-center mb-4 bg-gray-100 rounded-md">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-h-16 max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">No logo</div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{partner.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{partner.type || 'No type specified'}</p>
                    
                    {partner.website_url && (
                      <div className="flex items-center mb-4">
                        <LinkIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <a 
                          href={partner.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-careconnect-blue hover:underline truncate"
                        >
                          {partner.website_url}
                        </a>
                      </div>
                    )}
                    
                    {partner.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{partner.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        partner.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {partner.status || 'Unknown'}
                      </span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPartner(partner)}
                        >
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePartner(partner.id)}
                          disabled={deletePartnerMutation.isPending}
                        >
                          <Trash className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Partner Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Add New Partner</h3>
              <form onSubmit={handleAddPartner}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner Name *
                    </label>
                    <Input
                      required
                      value={newPartner.name}
                      onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <Input
                      type="url"
                      value={newPartner.logo_url}
                      onChange={(e) => setNewPartner({...newPartner, logo_url: e.target.value})}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <Input
                      type="url"
                      value={newPartner.website_url}
                      onChange={(e) => setNewPartner({...newPartner, website_url: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      value={newPartner.description}
                      onChange={(e) => setNewPartner({...newPartner, description: e.target.value})}
                      placeholder="Brief description of the partner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner Type
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue bg-white"
                      value={newPartner.type}
                      onChange={(e) => setNewPartner({...newPartner, type: e.target.value})}
                    >
                      <option value="Insurance">Insurance</option>
                      <option value="Healthcare Provider">Healthcare Provider</option>
                      <option value="Non-Profit">Non-Profit</option>
                      <option value="Community Organization">Community Organization</option>
                      <option value="Association">Association</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue bg-white"
                      value={newPartner.status}
                      onChange={(e) => setNewPartner({...newPartner, status: e.target.value})}
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
                    disabled={addPartnerMutation.isPending}
                  >
                    {addPartnerMutation.isPending ? 'Adding...' : 'Add Partner'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Partner Modal */}
      {isEditModalOpen && editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Edit Partner</h3>
              <form onSubmit={handleUpdatePartner}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner Name *
                    </label>
                    <Input
                      required
                      value={editingPartner.name}
                      onChange={(e) => setEditingPartner({...editingPartner, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <Input
                      type="url"
                      value={editingPartner.logo_url || ""}
                      onChange={(e) => setEditingPartner({...editingPartner, logo_url: e.target.value})}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <Input
                      type="url"
                      value={editingPartner.website_url || ""}
                      onChange={(e) => setEditingPartner({...editingPartner, website_url: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      value={editingPartner.description || ""}
                      onChange={(e) => setEditingPartner({...editingPartner, description: e.target.value})}
                      placeholder="Brief description of the partner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner Type
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue bg-white"
                      value={editingPartner.type || "Healthcare Provider"}
                      onChange={(e) => setEditingPartner({...editingPartner, type: e.target.value})}
                    >
                      <option value="Insurance">Insurance</option>
                      <option value="Healthcare Provider">Healthcare Provider</option>
                      <option value="Non-Profit">Non-Profit</option>
                      <option value="Community Organization">Community Organization</option>
                      <option value="Association">Association</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue bg-white"
                      value={editingPartner.status || "Active"}
                      onChange={(e) => setEditingPartner({...editingPartner, status: e.target.value})}
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
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-careconnect-blue hover:bg-careconnect-blue/90"
                    disabled={editPartnerMutation.isPending}
                  >
                    {editPartnerMutation.isPending ? 'Updating...' : 'Update Partner'}
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

export default PartnersManagement;
