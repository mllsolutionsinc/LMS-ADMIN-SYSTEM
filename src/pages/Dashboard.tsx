import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ClipboardList, GraduationCap } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Modules",
      value: "24",
      description: "Active learning modules",
      icon: BookOpen,
      trend: "+2 this month",
    },
    {
      title: "Module Assignments",
      value: "48",
      description: "Tutors assigned to modules",
      icon: ClipboardList,
      trend: "+5 this week",
    },
    {
      title: "Student Enrollments",
      value: "342",
      description: "Active student enrollments",
      icon: GraduationCap,
      trend: "+18 this week",
    },
    {
      title: "Active Tutors",
      value: "12",
      description: "Teaching this semester",
      icon: Users,
      trend: "Unchanged",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader
        title="Dashboard"
        description="Overview of your institution's learning management system"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  <p className="text-xs text-accent mt-2 font-medium">{stat.trend}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Recent Activity</CardTitle>
              <CardDescription>Latest updates across your institution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New enrollment", detail: "Sarah Johnson enrolled in Advanced Mathematics", time: "2 hours ago" },
                  { action: "Module created", detail: "Introduction to Data Science", time: "5 hours ago" },
                  { action: "Tutor assigned", detail: "Dr. Smith assigned to Physics 101", time: "1 day ago" },
                  { action: "Grade updated", detail: "Final grades posted for Chemistry Lab", time: "2 days ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.detail}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <button className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left">
                  <BookOpen className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Create New Module</p>
                    <p className="text-xs text-muted-foreground">Add a new learning module</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left">
                  <ClipboardList className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Assign Tutor</p>
                    <p className="text-xs text-muted-foreground">Link tutor to module</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Enroll Student</p>
                    <p className="text-xs text-muted-foreground">Add student to module</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
