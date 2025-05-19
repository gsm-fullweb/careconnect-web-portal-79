
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, FileText, MessageSquare, Users, ArrowUp, ArrowDown } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the CareConnect admin dashboard.</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="w-3 h-3 mr-1" /> 12%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="w-3 h-3 mr-1" /> 8%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <MessageSquare className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="w-3 h-3 mr-1" /> 15%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Partners</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <span className="text-red-500 flex items-center mr-1">
                <ArrowDown className="w-3 h-3 mr-1" /> 2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "New User",
                    details: "John Smith registered as a new user",
                    time: "2 hours ago",
                    icon: <User className="w-4 h-4" />
                  },
                  {
                    type: "Blog Post",
                    details: "New blog post published: 'Self-Care Strategies'",
                    time: "5 hours ago",
                    icon: <FileText className="w-4 h-4" />
                  },
                  {
                    type: "Testimonial",
                    details: "New testimonial received from Maria Rodriguez",
                    time: "1 day ago",
                    icon: <MessageSquare className="w-4 h-4" />
                  },
                  {
                    type: "Partner",
                    details: "MediNet partnership updated",
                    time: "2 days ago",
                    icon: <Users className="w-4 h-4" />
                  },
                  {
                    type: "Blog Post",
                    details: "Blog post updated: 'Tips for Supporting a Loved One'",
                    time: "3 days ago",
                    icon: <FileText className="w-4 h-4" />
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-careconnect-blue/10 flex items-center justify-center text-careconnect-blue mr-4">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.type}</p>
                      <p className="text-gray-600">{activity.details}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-careconnect-blue hover:bg-careconnect-blue/90 justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Blog Post
                </Button>
                <Button className="w-full bg-careconnect-green hover:bg-careconnect-green/90 justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Add Partner
                </Button>
              </div>
              
              <div className="mt-6 bg-careconnect-light p-4 rounded-lg">
                <h3 className="font-semibold mb-2">System Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Website:</span>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database:</span>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Backup:</span>
                    <span className="text-sm font-medium">3 hours ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
