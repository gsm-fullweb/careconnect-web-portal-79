import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Sample blog post data
const blogPostsData = [
  {
    id: 1,
    title: "Tips for Supporting a Loved One with Dementia",
    content: `
      <p class="mb-4">Caring for someone with dementia presents unique challenges that require patience, understanding, and specialized approaches. As cognitive abilities decline, communication can become more difficult, but maintaining connection remains vital for both the person with dementia and their caregiver.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Understanding Dementia Communication Challenges</h2>
      
      <p class="mb-4">People with dementia often experience various communication difficulties that progress over time:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Struggling to find the right words</li>
        <li>Using familiar words repeatedly</li>
        <li>Inventing new words for familiar objects</li>
        <li>Reverting to a native language</li>
        <li>Having difficulty organizing words logically</li>
        <li>Relying more on non-verbal communication</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Effective Communication Strategies</h2>
      
      <h3 class="text-xl font-medium mt-6 mb-3">1. Create the Right Environment</h3>
      <p class="mb-4">The environment plays a crucial role in successful communication:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Minimize distractions by turning off TVs or radios</li>
        <li>Ensure good lighting so your loved one can see your face clearly</li>
        <li>Maintain a calm, quiet setting to help them focus</li>
        <li>Position yourself at eye level and maintain eye contact</li>
      </ul>
      
      <h3 class="text-xl font-medium mt-6 mb-3">2. Adapt Your Approach</h3>
      <p class="mb-4">How you approach communication can make a significant difference:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Identify yourself and call the person by name</li>
        <li>Speak slowly and clearly using a gentle, calm voice</li>
        <li>Use short, simple sentences and concrete terms</li>
        <li>Give one-step directions and ask one question at a time</li>
        <li>Be patient and allow plenty of time for responses</li>
        <li>Avoid talking about the person as if they weren't present</li>
      </ul>
      
      <h3 class="text-xl font-medium mt-6 mb-3">3. Listen Actively</h3>
      <p class="mb-4">Active listening becomes even more important:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Maintain eye contact to show you're paying attention</li>
        <li>Look for non-verbal cues and body language</li>
        <li>Try to understand the feelings behind their words</li>
        <li>Don't interrupt or correct - focus on understanding their message</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Practical Tips for Daily Interactions</h2>
      
      <div class="bg-careconnect-light p-6 rounded-lg mb-6">
        <h3 class="text-xl font-medium mb-3">Visual Cues and Demonstrations</h3>
        <p>When words alone aren't enough, show what you mean. Point to objects, demonstrate actions, or use visual guides to help convey your message.</p>
      </div>
      
      <div class="bg-careconnect-light p-6 rounded-lg mb-6">
        <h3 class="text-xl font-medium mb-3">Embrace Validation</h3>
        <p>Rather than correcting misconceptions, acknowledge the emotions behind statements. If they mention needing to go to work (even though they're retired), you might say, "You've always been such a hard worker. Tell me about your job."</p>
      </div>
      
      <div class="bg-careconnect-light p-6 rounded-lg mb-6">
        <h3 class="text-xl font-medium mb-3">Create Memory Aids</h3>
        <p>Label doors and drawers with words and pictures. Create a daily schedule with visual cues. Keep a photo album with names and relationships written under pictures.</p>
      </div>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Self-Care for Caregivers</h2>
      
      <p class="mb-4">Remember that caring for someone with dementia can be emotionally taxing. Practice self-compassion when interactions don't go as planned, and consider joining a support group to share experiences with others who understand your journey.</p>
      
      <p class="mb-4">Professional respite care services, like those offered by CareConnect, can provide valuable breaks that allow you to recharge while knowing your loved one is receiving quality care.</p>
      
      <p>With patience, empathy, and these specialized communication techniques, you can maintain a meaningful connection with your loved one throughout their dementia journey.</p>
    `,
    image: "https://images.unsplash.com/photo-1576765608622-067973a79f53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Caregiving Tips",
    date: "May 12, 2023",
    author: "Dr. Lisa Johnson",
    authorTitle: "Medical Director, CareConnect",
    authorImage: "https://i.pravatar.cc/300?img=10"
  },
  {
    id: 2,
    title: "Self-Care Strategies for Family Caregivers",
    content: `
      <p class="mb-4">Family caregivers often devote so much time and energy to caring for their loved ones that they neglect their own physical, emotional, and mental health. This self-sacrifice can lead to caregiver burnout—a state of physical, emotional, and mental exhaustion that may be accompanied by a change in attitude from positive and caring to negative and unconcerned.</p>
      
      <p class="mb-4">Taking care of yourself isn't a luxury—it's a necessity. Prioritizing your own well-being doesn't mean you're being selfish or that you don't care enough about your loved one. In fact, self-care enables you to be a better caregiver by preventing burnout and allowing you to continue providing care with compassion and effectiveness.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Why Self-Care Matters</h2>
      
      <p class="mb-4">Research has shown that caregivers are at increased risk for:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Higher levels of stress and depression</li>
        <li>Weakened immune system</li>
        <li>Increased risk of chronic conditions</li>
        <li>Greater difficulties with sleep</li>
        <li>Decreased satisfaction with life</li>
      </ul>
      
      <p class="mb-4">By practicing self-care, you can mitigate these risks and maintain your capacity to provide care.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Essential Self-Care Strategies</h2>
      
      <h3 class="text-xl font-medium mt-6 mb-3">1. Acknowledge Your Feelings</h3>
      <p class="mb-4">Caregiving can trigger a complex mix of emotions, including resentment, guilt, grief, and exhaustion. These feelings are normal and valid. Allow yourself to acknowledge them without judgment.</p>
      <p class="mb-4">Consider keeping a journal to express your thoughts privately, or join a caregiver support group where you can share with others who understand your experience.</p>
      
      <h3 class="text-xl font-medium mt-6 mb-3">2. Set Realistic Expectations</h3>
      <p class="mb-4">No one can be a perfect caregiver. Set realistic goals about what you can accomplish each day, and learn to accept help from others. Remember that asking for assistance isn't a sign of weakness or inadequacy—it's a recognition of your own humanity and limitations.</p>
      
      <div class="bg-careconnect-light p-6 rounded-lg mb-6">
        <h4 class="font-semibold mb-2">Quick Tip: The 80/20 Rule</h4>
        <p>Aim to be a "good enough" caregiver 80% of the time. Give yourself permission to be less than perfect for the other 20%.</p>
      </div>
      
      <h3 class="text-xl font-medium mt-6 mb-3">3. Prioritize Your Physical Health</h3>
      <p class="mb-4">Your physical well-being directly impacts your ability to provide care. Make time for:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Regular physical activity, even if it's just a 15-minute walk</li>
        <li>Nutritious meals (avoid relying on caffeine and sugar for energy)</li>
        <li>Adequate sleep (consider respite care if nighttime caregiving is disrupting your sleep)</li>
        <li>Your own medical appointments</li>
      </ul>
      
      <h3 class="text-xl font-medium mt-6 mb-3">4. Stay Connected</h3>
      <p class="mb-4">Social isolation is a common challenge for caregivers. Make an effort to maintain relationships that bring you joy and support:</p>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Schedule regular video calls or coffee dates with friends</li>
        <li>Join a support group (in-person or online)</li>
        <li>Consider therapy or counseling if you're struggling emotionally</li>
        <li>Use technology to stay connected when you can't leave home</li>
      </ul>
      
      <h3 class="text-xl font-medium mt-6 mb-3">5. Take Regular Breaks</h3>
      <p class="mb-4">Respite care isn't a luxury—it's essential for your sustainability as a caregiver. Whether it's a few hours each week or occasional longer breaks, time away from caregiving responsibilities allows you to recharge.</p>
      <p class="mb-4">Professional respite services, like those offered by CareConnect, can provide reliable care while you take the break you need.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Creating a Sustainable Self-Care Plan</h2>
      
      <p class="mb-4">The most effective self-care isn't spontaneous or occasional—it's planned and consistent. Consider creating a weekly self-care plan that includes:</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 class="font-semibold mb-2">Physical Self-Care</h4>
          <ul class="list-disc pl-6 space-y-1">
            <li>30 minutes of movement daily</li>
            <li>Planning and preparing nutritious meals</li>
            <li>Establishing a bedtime routine</li>
            <li>Scheduling medical check-ups</li>
          </ul>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 class="font-semibold mb-2">Emotional Self-Care</h4>
          <ul class="list-disc pl-6 space-y-1">
            <li>Daily journaling or reflection</li>
            <li>Weekly contact with a supportive friend</li>
            <li>Monthly support group attendance</li>
            <li>Setting and maintaining boundaries</li>
          </ul>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 class="font-semibold mb-2">Mental Self-Care</h4>
          <ul class="list-disc pl-6 space-y-1">
            <li>Daily breaks from caregiving tasks</li>
            <li>Engaging in hobbies and interests</li>
            <li>Learning something new</li>
            <li>Practicing mindfulness or meditation</li>
          </ul>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 class="font-semibold mb-2">Spiritual Self-Care</h4>
          <ul class="list-disc pl-6 space-y-1">
            <li>Connecting with personal values</li>
            <li>Engaging in faith practices (if applicable)</li>
            <li>Spending time in nature</li>
            <li>Practicing gratitude</li>
          </ul>
        </div>
      </div>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Remember: Self-Care Isn't Selfish</h2>
      
      <p class="mb-4">When you prioritize your own well-being, everyone benefits. A healthier, more balanced you means better care for your loved one. Think of self-care as putting on your own oxygen mask first—it's not just beneficial but necessary for the journey ahead.</p>
      
      <p>If you're struggling to find time for self-care, consider exploring CareConnect's respite care services. Our professional caregivers can provide compassionate care for your loved one while you take the time you need to recharge and tend to your own well-being.</p>
    `,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Self-Care",
    date: "April 28, 2023",
    author: "Michael Chen",
    authorTitle: "Co-Founder & COO, CareConnect",
    authorImage: "https://i.pravatar.cc/300?img=12"
  },
  // Add more full blog posts as needed with id's 3-6 matching your Blog.tsx data
];

// Related posts data (simplified version)
const relatedPostsData = [
  {
    id: 3,
    title: "Understanding Medicare Coverage for Home Care",
    excerpt: "Navigate the complexities of Medicare and learn what home care services might be covered under different plans.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Healthcare",
    date: "April 15, 2023"
  },
  {
    id: 4,
    title: "Creating a Safe Home Environment for Seniors",
    excerpt: "Simple modifications and safety measures to help prevent falls and accidents in the home.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Home Safety",
    date: "March 30, 2023"
  },
  {
    id: 5,
    title: "The Benefits of Companion Care for Isolated Seniors",
    excerpt: "Loneliness can have serious health consequences. Learn how companion care can improve quality of life.",
    image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Companionship",
    date: "March 18, 2023"
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const postId = parseInt(id || "1");
  
  // Find the post with the matching ID
  const post = blogPostsData.find(p => p.id === postId) || blogPostsData[0];

  return (
    <Layout>
      {/* Article Hero */}
      <div className="bg-careconnect-blue/90 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <span className="inline-block bg-white/20 text-white text-sm font-medium py-1 px-3 rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              {post.title}
            </h1>
            <div className="flex items-center justify-center text-white/80 text-sm md:text-base">
              <span className="mr-4">{post.date}</span>
              <span>By {post.author}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="max-w-3xl">
                {/* Featured Image */}
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-auto"
                  />
                </div>
                
                {/* Article Body */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* Author Bio */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-6">
                      <img
                        src={post.authorImage}
                        alt={post.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-careconnect-blue">
                        {post.author}
                      </h3>
                      <p className="text-gray-600">{post.authorTitle}</p>
                    </div>
                  </div>
                </div>
                
                {/* Share and Navigate */}
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center pt-8 border-t border-gray-200">
                  <div className="mb-4 sm:mb-0">
                    <span className="text-gray-700 mr-4">Share this article:</span>
                    <div className="inline-flex space-x-2">
                      {["Twitter", "Facebook", "LinkedIn", "Email"].map((platform, index) => (
                        <Button key={index} variant="outline" size="sm">
                          {platform}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button asChild variant="outline">
                      <Link to="/blog">Back to Blog</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* About CareConnect */}
                <div className="bg-careconnect-light p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">About CareConnect</h3>
                  <p className="text-gray-700 mb-4">
                    CareConnect provides compassionate caregiving services tailored to your unique needs. Our mission is to help individuals maintain their independence and quality of life.
                  </p>
                  <Button asChild className="w-full bg-careconnect-blue hover:bg-careconnect-blue/90">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
                
                {/* Related Posts */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPostsData.map((relatedPost) => (
                      <Card key={relatedPost.id} className="overflow-hidden">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-careconnect-blue text-white text-xs font-medium py-1 px-2 rounded-full">
                            {relatedPost.category}
                          </div>
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base line-clamp-2">
                            <Link to={`/blog/${relatedPost.id}`} className="hover:text-careconnect-blue">
                              {relatedPost.title}
                            </Link>
                          </CardTitle>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 text-xs text-gray-500">
                          {relatedPost.date}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {["Caregiving Tips", "Self-Care", "Healthcare", "Home Safety", "Companionship", "Nutrition"].map((category, index) => (
                      <Link 
                        key={index} 
                        to="/blog" 
                        className="block p-2 hover:bg-careconnect-light rounded transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="section bg-careconnect-light">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-700 mb-6">
              Get the latest caregiving tips, resources, and CareConnect news delivered to your inbox monthly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Your Email Address" 
                type="email"
                className="sm:flex-grow"
              />
              <Button className="bg-careconnect-blue hover:bg-careconnect-blue/90">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
