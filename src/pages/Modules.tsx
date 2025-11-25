import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data
const mockModules = [
  { id: 1, code: "CS101", name: "Introduction to Programming", description: "Basic programming concepts using Python" },
  { id: 2, code: "MATH201", name: "Advanced Mathematics", description: "Calculus and linear algebra fundamentals" },
  { id: 3, code: "PHY101", name: "Physics Fundamentals", description: "Classical mechanics and thermodynamics" },
  { id: 4, code: "ENG202", name: "Technical Writing", description: "Professional communication and documentation" },
  { id: 5, code: "DATA301", name: "Data Science Intro", description: "Statistics, ML basics, and data analysis" },
];

export default function Modules() {
  const [modules, setModules] = useState(mockModules);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ code: "", name: "", description: "" });

  const filteredModules = modules.filter(
    (module) =>
      module.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (formData.code && formData.name) {
      setModules([...modules, { id: modules.length + 1, ...formData }]);
      setFormData({ code: "", name: "", description: "" });
      setIsCreateOpen(false);
    }
  };

  const handleDelete = (id: number) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader
        title="Modules"
        description="Manage learning modules for your institution"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Module
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="font-display">Create New Module</DialogTitle>
                <DialogDescription>
                  Add a new learning module to your institution's curriculum
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Module Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., CS101"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Module Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Introduction to Programming"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the module"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Create Module
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modules by code or name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display">Module Code</TableHead>
                <TableHead className="font-display">Module Name</TableHead>
                <TableHead className="font-display">Description</TableHead>
                <TableHead className="font-display text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No modules found. Create your first module to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredModules.map((module) => (
                  <TableRow key={module.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{module.code}</TableCell>
                    <TableCell>{module.name}</TableCell>
                    <TableCell className="text-muted-foreground">{module.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-accent/10 hover:text-accent">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(module.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
