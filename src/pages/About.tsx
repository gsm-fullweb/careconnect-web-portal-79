
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-careconnect-blue/90 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">About CareConnect</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Dedicated to connecting compassionate care with those who need it most.
          </p>
        </div>
      </div>
      
      {/* Our Story */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                CareConnect was founded in 2010 by Sarah and Michael Chen, who experienced firsthand the challenges of finding quality care for their aging parents.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Frustrated by the lack of personalized care options, they set out to create a service that would connect families with compassionate, qualified caregivers who could provide individualized support.
              </p>
              <p className="text-lg text-gray-700">
                What started as a small local operation has grown into a nationwide network of certified caregivers, all sharing the same mission: to provide the highest quality of care with dignity and respect.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576765608622-067973a79f53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="CareConnect founders" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-careconnect-green rounded-lg hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission and Values */}
      <section className="section bg-careconnect-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're guided by a set of core principles that inform everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-careconnect-blue">Our Mission</h3>
              <p className="text-gray-700 mb-4">
                To enhance the quality of life for those who need care by connecting them with compassionate, skilled caregivers who provide personalized support that respects dignity and independence.
              </p>
              <p className="text-gray-700">
                We strive to be the bridge between exceptional caregivers and the individuals and families who need them, creating meaningful relationships built on trust and care.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-careconnect-green">Our Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-careconnect-green mr-2 text-xl">✓</span>
                  <div>
                    <h4 className="font-semibold">Compassion</h4>
                    <p className="text-gray-700">We approach every individual with empathy and understanding.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-careconnect-green mr-2 text-xl">✓</span>
                  <div>
                    <h4 className="font-semibold">Excellence</h4>
                    <p className="text-gray-700">We maintain the highest standards in caregiving and service.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-careconnect-green mr-2 text-xl">✓</span>
                  <div>
                    <h4 className="font-semibold">Respect</h4>
                    <p className="text-gray-700">We honor the dignity and individuality of each person we serve.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-careconnect-green mr-2 text-xl">✓</span>
                  <div>
                    <h4 className="font-semibold">Integrity</h4>
                    <p className="text-gray-700">We operate with honesty and transparency in all we do.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated professionals behind CareConnect.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Co-Founder & CEO",
                image: "https://i.pravatar.cc/300?img=25",
                bio: "Former healthcare executive with a passion for improving elder care."
              },
              {
                name: "Michael Chen",
                role: "Co-Founder & COO",
                image: "https://i.pravatar.cc/300?img=12",
                bio: "Background in healthcare technology and operations management."
              },
              {
                name: "Dr. Lisa Johnson",
                role: "Medical Director",
                image: "https://i.pravatar.cc/300?img=10",
                bio: "Board-certified geriatrician with 15+ years of experience."
              },
              {
                name: "Robert Williams",
                role: "Director of Caregiver Relations",
                image: "https://i.pravatar.cc/300?img=4",
                bio: "Former caregiver with a deep understanding of the profession."
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-careconnect-blue"></div>
                </div>
                <h3 className="text-xl font-semibold text-careconnect-blue">{member.name}</h3>
                <p className="text-careconnect-green font-medium mb-2">{member.role}</p>
                <p className="text-gray-700">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="section bg-careconnect-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Join Our Team</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Are you a compassionate caregiver looking to make a difference?
            We're always looking for dedicated professionals to join our network.
          </p>
          <Button className="bg-white text-careconnect-blue hover:bg-white/90">
            Apply As A Caregiver
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;
