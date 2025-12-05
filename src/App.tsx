import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import Index from "./pages/Index";
import Modules from "./pages/Modules";
import Assignments from "./pages/Assignments";
import Enrollments from "./pages/Enrollments";
import TutorRegistration from "./pages/TutorRegistration";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Route - The entry point for unauthenticated users */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Wrapped in AdminLayout which handles Auth check */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/enrollments" element={<Enrollments />} />
            
            {/* New Route for Tutor Registration */}
            <Route path="/tutors/register" element={<TutorRegistration />} />
            {/* Default /tutors route goes to registration for now */}
            <Route path="/tutors" element={<TutorRegistration />} /> 
          </Route>

          {/* Catch-all Route for 404s */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;