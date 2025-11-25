import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center gap-4 px-6 py-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
