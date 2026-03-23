import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Wills from "@/pages/wills";
import Guardians from "@/pages/guardians";
import Debts from "@/pages/debts";
import DigitalAssets from "@/pages/digital-assets";
import DeadManSwitch from "@/pages/dead-man-switch";

// Initialize Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center rtl"><div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function LandingOrDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center rtl"><div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }
  if (isAuthenticated) return <Redirect to="/dashboard" />;
  return <Landing />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingOrDashboard} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/wills">
        {() => <ProtectedRoute component={Wills} />}
      </Route>
      <Route path="/guardians">
        {() => <ProtectedRoute component={Guardians} />}
      </Route>
      <Route path="/debts">
        {() => <ProtectedRoute component={Debts} />}
      </Route>
      <Route path="/digital-assets">
        {() => <ProtectedRoute component={DigitalAssets} />}
      </Route>
      <Route path="/dead-man-switch">
        {() => <ProtectedRoute component={DeadManSwitch} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
