import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Terms from "./pages/Terms";
import PricingIndia from "./pages/PricingIndia";
import PricingInternational from "./pages/PricingInternational";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import ToolLanding from "./pages/ToolLanding";
import NavigationMaker from "./pages/NavigationMaker";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PillarPage from "./pages/PillarPage";
import Changelog from "./pages/Changelog";
import Roadmap from "./pages/Roadmap";
import Examples from "./pages/Examples";
import AlternativePage from "./pages/AlternativePage";
import BlogCategory from "./pages/BlogCategory";
import WebsiteAnalyzer from "./pages/WebsiteAnalyzer";
import PublicSitemap from "./pages/PublicSitemap";
import SitemapLibrary from "./pages/SitemapLibrary";
import SharedSitemap from "./pages/SharedSitemap";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <InstallPrompt />
          <ErrorBoundary>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/tools/:tool" element={<ToolLanding />} />
              <Route path="/navigation-maker" element={<NavigationMaker />} />
              <Route path="/pricing-india" element={<PricingIndia />} />
              <Route path="/pricing-international" element={<PricingInternational />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/blog/category/:category" element={<BlogCategory />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/examples" element={<Examples />} />
              <Route path="/alternatives/:slug" element={<AlternativePage />} />
              <Route path="/analyzer" element={<WebsiteAnalyzer />} />
              <Route path="/sitemaps" element={<SitemapLibrary />} />
              <Route path="/sitemap/:slug" element={<PublicSitemap />} />
              <Route path="/:slug" element={<PillarPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
