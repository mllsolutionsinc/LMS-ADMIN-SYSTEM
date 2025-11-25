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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockEnrollments = [
  { id: 1, studentName: "Alice Thompson", moduleName: "Introduction to Programming", moduleCode: "CS101", enrollmentDate: "2024-01-15", grade: "A" },
  { id: 2, studentName: "Bob Martinez", moduleName: "Advanced Mathematics", moduleCode: "MATH201", enrollmentDate: "2024-01-18", grade: "B+" },
  { id: 3, studentName: "Charlie Davis", moduleName: "Physics Fundamentals", moduleCode: "PHY101", enrollmentDate: "2024-01-20", grade: null },
  { id: 4, studentName: "Diana Wilson", moduleName: "Technical Writing", moduleCode: "ENG202", enrollmentDate: "2024-01-22", grade: "A-" },
  { id: 5, studentName: "Ethan Brown", moduleName: "Introduction to Programming", moduleCode: "CS101", enrollmentDate: "2024-01-25", grade: null },
];

const mockModules = [
  { id: 1, code: "CS101", name: "Introduction to Programming" },
  { id: 2, code: "MATH201", name: "Advanced Mathematics" },
  { id: 3, code: "PHY101", name: "Physics Fundamentals" },
  { id: 4, code: "ENG202", name: "Technical Writing" },
];

const mockStudents = [
  { id: 1, name: "Alice Thompson" },
  { id: 2, name: "Bob Martinez" },
  { id: 3, name: "Charlie Davis" },
  { id: 4, name: "Diana Wilson" },
  { id: 5, name: "Ethan Brown" },
];

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState(mockEnrollments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ studentId: "", moduleId: "" });

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.moduleCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (formData.studentId && formData.moduleId) {
      const student = mockStudents.find((s) => s.id.toString() === formData.studentId);
      const module = mockModules.find((m) => m.id.toString() === formData.moduleId);
      if (student && module) {
        setEnrollments([
          ...enrollments,
          {
            id: enrollments.length + 1,
            studentName: student.name,
            moduleName: module.name,
            moduleCode: module.code,
            enrollmentDate: new Date().toISOString().split("T")[0],
            grade: null,
          },
        ]);
        setFormData({ studentId: "", moduleId: "" });
        setIsCreateOpen(false);
      }
    }
  };

  const handleDelete = (id: number) => {
    setEnrollments(enrollments.filter((e) => e.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader
        title="Student Enrollments"
        description="Manage student enrollments in modules"
        action={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Enrollment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="font-display">Enroll Student in Module</DialogTitle>
                <DialogDescription>
                  Select a student and module to create a new enrollment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Student</Label>
                  <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Create Enrollment
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
                placeholder="Search by student or module..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display">Student</TableHead>
                <TableHead className="font-display">Module Code</TableHead>
                <TableHead className="font-display">Module Name</TableHead>
                <TableHead className="font-display">Enrollment Date</TableHead>
                <TableHead className="font-display">Grade</TableHead>
                <TableHead className="font-display text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No enrollments found. Create your first enrollment to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{enrollment.studentName}</TableCell>
                    <TableCell>{enrollment.moduleCode}</TableCell>
                    <TableCell>{enrollment.moduleName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {enrollment.grade ? (
                        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                          {enrollment.grade}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not graded</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-accent/10 hover:text-accent">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(enrollment.id)}
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
