// src/pages/Modules.tsx
import { useEffect, useState } from "react";
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
import { toast } from "sonner";

import { fetchModules, createModule, deleteModule } from "@/services/modules";

type ModuleRow = {
  MODULE_ID?: number;
  MODULE_CODE?: string;
  MODULE_NAME?: string;
  DESCRIPTION?: string;
  // fallback lowercase keys if your backend returns lowercase
  module_id?: number;
  module_code?: string;
  module_name?: string;
  description?: string;
};

export default function Modules() {
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ code: "", name: "", description: "" });

  // load modules from backend
  const loadModules = async () => {
    setLoading(true);
    try {
      const data = await fetchModules();
      setModules(data);
    } catch (err: any) {
      console.error("Load modules error", err);
      toast.error(err?.message || "Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  // create new module
  const handleCreate = async () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error("Module code and name are required");
      return;
    }
    setCreating(true);
    try {
      await createModule({
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      toast.success("Module created");
      setFormData({ code: "", name: "", description: "" });
      setIsCreateOpen(false);
      await loadModules();
    } catch (err: any) {
      console.error("Create module error", err);
      toast.error(err?.message || "Failed to create module");
    } finally {
      setCreating(false);
    }
  };

  // delete module
  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this module? This cannot be undone.")) return;
    try {
      await deleteModule(id);
      toast.success("Module deleted");
      await loadModules();
    } catch (err: any) {
      console.error("Delete module error", err);
      toast.error(err?.message || "Failed to delete module");
    }
  };

  // helper to read module fields regardless of case
  const get = (m: ModuleRow, keyUpper: string, keyLower: string) =>
    (m as any)[keyUpper] ?? (m as any)[keyLower] ?? "";

  const filteredModules = modules.filter((module) => {
    const code = (get(module, "MODULE_CODE", "module_code") as string).toLowerCase();
    const name = (get(module, "MODULE_NAME", "module_name") as string).toLowerCase();
    const q = searchQuery.toLowerCase();
    return code.includes(q) || name.includes(q);
  });

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
                <Button
                  onClick={handleCreate}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Module"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="p-4 border-b">
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Loading modules...
                  </TableCell>
                </TableRow>
              ) : filteredModules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No modules found. Create your first module to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredModules.map((module) => {
                  const id = get(module, "MODULE_ID", "module_id");
                  const code = get(module, "MODULE_CODE", "module_code");
                  const name = get(module, "MODULE_NAME", "module_name");
                  const desc = get(module, "DESCRIPTION", "description");
                  return (
                    <TableRow key={id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{code}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell className="text-muted-foreground">{desc}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="hover:bg-accent/10 hover:text-accent">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(Number(id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
