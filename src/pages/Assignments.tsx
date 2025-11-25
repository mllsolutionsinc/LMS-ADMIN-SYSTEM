import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockAssignments = [
  { id: 1, moduleName: "Introduction to Programming", moduleCode: "CS101", tutorName: "Dr. Sarah Johnson", assignmentDate: "2024-01-15" },
  { id: 2, moduleName: "Advanced Mathematics", moduleCode: "MATH201", tutorName: "Prof. Michael Chen", assignmentDate: "2024-01-18" },
  { id: 3, moduleName: "Physics Fundamentals", moduleCode: "PHY101", tutorName: "Dr. Emily Watson", assignmentDate: "2024-01-20" },
  { id: 4, moduleName: "Technical Writing", moduleCode: "ENG202", tutorName: "Dr. Robert Brown", assignmentDate: "2024-01-22" },
];

const mockModules = [
  { id: 1, code: "CS101", name: "Introduction to Programming" },
  { id: 2, code: "MATH201", name: "Advanced Mathematics" },
  { id: 3, code: "PHY101", name: "Physics Fundamentals" },
  { id: 4, code: "ENG202", name: "Technical Writing" },
];

const mockTutors = [
  { id: 1, name: "Dr. Sarah Johnson" },
  { id: 2, name: "Prof. Michael Chen" },
  { id: 3, name: "Dr. Emily Watson" },
  { id: 4, name: "Dr. Robert Brown" },
];

export default function Assignments() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ moduleId: "", tutorId: "" });

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.moduleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.tutorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (formData.moduleId && formData.tutorId) {
      const module = mockModules.find((m) => m.id.toString() === formData.moduleId);
      const tutor = mockTutors.find((t) => t.id.toString() === formData.tutorId);
      if (module && tutor) {
        setAssignments([
          ...assignments,
          {
            id: assignments.length + 1,
            moduleName: module.name,
            moduleCode: module.code,
            tutorName: tutor.name,
            assignmentDate: new Date().toISOString().split("T")[0],
          },
        ]);
        setFormData({ moduleId: "", tutorId: "" });
        setIsCreateOpen(false);
      }
    }
  };

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader
        title="Module Assignments"
        description="Assign tutors to modules"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="font-display">Assign Tutor to Module</DialogTitle>
                <DialogDescription>
                  Select a module and tutor to create a new assignment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="module">Module</Label>
                  <Select value={formData.moduleId} onValueChange={(value) => setFormData({ ...formData, moduleId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a module" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockModules.map((module) => (
                        <SelectItem key={module.id} value={module.id.toString()}>
                          {module.code} - {module.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tutor">Tutor</Label>
                  <Select value={formData.tutorId} onValueChange={(value) => setFormData({ ...formData, tutorId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tutor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTutors.map((tutor) => (
                        <SelectItem key={tutor.id} value={tutor.id.toString()}>
                          {tutor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Create Assignment
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
                placeholder="Search by module or tutor..."
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
                <TableHead className="font-display">Tutor</TableHead>
                <TableHead className="font-display">Assignment Date</TableHead>
                <TableHead className="font-display text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No assignments found. Create your first assignment to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{assignment.moduleCode}</TableCell>
                    <TableCell>{assignment.moduleName}</TableCell>
                    <TableCell>{assignment.tutorName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(assignment.assignmentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
