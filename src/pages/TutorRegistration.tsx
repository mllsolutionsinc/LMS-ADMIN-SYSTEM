import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { UserPlus, Mail, User,Lock } from "lucide-react";
import { registerTutor, TutorData } from "../services/tutors";

export default function TutorRegistration() {
  const navigate = useNavigate();
  //const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TutorData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerTutor(formData);
      toast.success(`${formData.firstName} ${formData.lastName} has been registered successfully.`);
      navigate("/tutors"); 
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to register tutor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
      <PageHeader
        title="Register Tutor"
        description="Onboard new teaching staff to the system"
      />

      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div className="w-full max-w-2xl space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-card/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">New Tutor Profile</CardTitle>
                  <CardDescription>
                    Register a new tutor by entering their details below.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-6">
                
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                      <Input 
                        id="firstName" 
                        placeholder="e.g. John" 
                        value={formData.firstName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                      <Input 
                        id="lastName" 
                        placeholder="e.g. Doe" 
                        value={formData.lastName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Contact Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Contact Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="tutor@university.edu" 
                          className="pl-9"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-background/50 focus:bg-background border-input transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>


                </div>

              </CardContent>
              <CardFooter className="flex justify-end gap-3 bg-muted/10 p-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-white min-w-[140px]"
                >
                  {isLoading ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Register Tutor
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}