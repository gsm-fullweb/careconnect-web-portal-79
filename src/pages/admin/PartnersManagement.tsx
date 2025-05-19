
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, Plus, LinkIcon } from "lucide-react";

// Sample partners data
const initialPartners = [
  {
    id: 1,
    name: "HealthPlus Insurance",
    logo: "https://via.placeholder.com/150x80?text=HealthPlus",
    website: "https://healthplus.example.com",
    type: "Insurance",
    status: "Active"
  },
  {
    id: 2,
    name: "MediNet",
    logo: "https://via.placeholder.com/150x80?text=MediNet",
    website: "https://medinet.example.com",
    type: "Healthcare Provider",
    status: "Active"
  },
  {
    id: 3,
    name: "SeniorLife Foundation",
    logo: "https://via.placeholder.com/150x80?text=SeniorLife",
    website: "https://seniorlife.example.com",
    type: "Non-Profit",
    status: "Active"
  },
  {
    id: 4,
    name: "Community Health Alliance",
    logo: "https://via.placeholder.com/150x80?text=CHA",
    website: "https://cha.example.com",
    type: "Community Organization",
    status: "Active"
  },
  {
    id: 5,
    name: "CareTrust",
    logo: "https://via.placeholder.com/150x80?text=CareTrust",
    website: "https://caretrust.example.com",
    type: "Healthcare Provider",
    status: "Inactive"
  },
  {
    id: 6,
    name: "ElderCare Association",
    logo: "https://via.placeholder.com/150x80?text=ElderCare",
    website: "https://eldercare.example.com",
    type: "Association",
    status: "Active"
  }
];

const PartnersManagement = () => {
  const [partners, setPartners] = useState(initialPartners);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    logo: "https://via.placeholder.com/150x80?text=New",
    website: "",
    type: "Healthcare Provider",
    status: "Active"
  });
  
  const { toast } = useToast();

  // Filter partners based on search term
  const filteredPartners = partners.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    partner.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePartner = (id: number) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      setPartners(partners.filter(partner => partner.id !== id));
      
      toast({
        title: "Partner deleted",
        description: "The partner has been successfully deleted.",
      });
    }
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    
    setPartners([
      ...partners,
      {
        id: partners.length + 1,
        ...newPartner
      }
    ]);
    
    setNewPartner({
      name: "",
      logo: "https://via.placeholder.com/150x80?text=New",
      website: "",
      type: "Healthcare Provider",
      status: "Active"
    });
    
    setIsAddModalOpen(false);
    
    toast({
      title: "Partner added",
      description: "The new partner has been successfully added.",
    });
  };

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
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue">
                <option value="all">All Types</option>
                <option value="insurance">Insurance</option>
                <option value="healthcare-provider">Healthcare Provider</option>
                <option value="non-profit">Non-Profit</option>
                <option value="community-organization">Community Organization</option>
                <option value="association">Association</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          {/* Partners Grid */}
          {filteredPartners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No partners found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="h-24 flex items-center justify-center mb-4 bg-gray-100 rounded-md">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-16 max-w-full"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{partner.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{partner.type}</p>
                    
                    <div className="flex items-center mb-4">
                      <LinkIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-careconnect-blue hover:underline truncate"
                      >
                        {partner.website}
                      </a>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        partner.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {partner.status}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeletePartner(partner.id)}
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
                      Partner Name
                    </label>
                    <Input
                      required
                      value={newPartner.name}
                      onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <Input
                      type="url"
                      required
                      value={newPartner.website}
                      onChange={(e) => setNewPartner({...newPartner, website: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner Type
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-careconnect-blue"
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
                  >
                    Add Partner
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
