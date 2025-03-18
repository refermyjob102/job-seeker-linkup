
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile Picture" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">John Doe</CardTitle>
            <CardDescription>Software Engineer</CardDescription>
            
            <div className="flex items-center mt-2 gap-2">
              <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                Job Seeker
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>john.doe@example.com</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p>San Francisco, CA</p>
            </div>
            
            <Separator />
            
            <div className="pt-2">
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="resume">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                  <CardDescription>Your professional experience and education</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Experience</h3>
                    <div className="mt-2 space-y-4">
                      <div className="border p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Senior Developer</h4>
                            <p className="text-sm text-muted-foreground">Tech Company Inc.</p>
                          </div>
                          <p className="text-sm text-muted-foreground">2020 - Present</p>
                        </div>
                        <p className="mt-2 text-sm">Led development of core product features and mentored junior developers.</p>
                      </div>
                      
                      <div className="border p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Web Developer</h4>
                            <p className="text-sm text-muted-foreground">Digital Agency XYZ</p>
                          </div>
                          <p className="text-sm text-muted-foreground">2018 - 2020</p>
                        </div>
                        <p className="mt-2 text-sm">Built responsive web applications using React and Node.js.</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium">Education</h3>
                    <div className="mt-2 space-y-4">
                      <div className="border p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">B.S. Computer Science</h4>
                            <p className="text-sm text-muted-foreground">University of Technology</p>
                          </div>
                          <p className="text-sm text-muted-foreground">2014 - 2018</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Upload New Resume</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Technical skills and competencies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Technical Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">React</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">TypeScript</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Node.js</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">GraphQL</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">AWS</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Docker</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Soft Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">Team Leadership</span>
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">Project Management</span>
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">Communication</span>
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">Problem Solving</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline">Add Skills</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="applications" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job Applications</CardTitle>
                  <CardDescription>Track your job application status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Senior Frontend Developer</h4>
                          <p className="text-sm text-muted-foreground">Tech Innovations Inc.</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                          In Progress
                        </span>
                      </div>
                      <p className="mt-2 text-sm">Applied on: May 15, 2023</p>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Full Stack Engineer</h4>
                          <p className="text-sm text-muted-foreground">Digital Products Co.</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                          Interview
                        </span>
                      </div>
                      <p className="mt-2 text-sm">Applied on: May 10, 2023</p>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">React Developer</h4>
                          <p className="text-sm text-muted-foreground">WebApp Studios</p>
                        </div>
                        <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                          Rejected
                        </span>
                      </div>
                      <p className="mt-2 text-sm">Applied on: May 5, 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
