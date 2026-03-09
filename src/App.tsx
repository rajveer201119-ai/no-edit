import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import React, { Suspense } from "react";
import Index from "./pages/Index";

// Lazy-loaded pages for code splitting
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Terms = React.lazy(() => import("./pages/Terms"));
const PricingIndia = React.lazy(() => import("./pages/PricingIndia"));
const PricingInternational = React.lazy(() => import("./pages/PricingInternational"));
const Admin = React.lazy(() => import("./pages/Admin"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const ToolLanding = React.lazy(() => import("./pages/ToolLanding"));
const NavigationMaker = React.lazy(() => import("./pages/NavigationMaker"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const PillarPage = React.lazy(() => import("./pages/PillarPage"));
const Changelog = React.lazy(() => import("./pages/Changelog"));
const Roadmap = React.lazy(() => import("./pages/Roadmap"));
const Examples = React.lazy(() => import("./pages/Examples"));
const AlternativePage = React.lazy(() => import("./pages/AlternativePage"));
const BlogCategory = React.lazy(() => import("./pages/BlogCategory"));
const WebsiteAnalyzer = React.lazy(() => import("./pages/WebsiteAnalyzer"));
const PublicSitemap = React.lazy(() => import("./pages/PublicSitemap"));
const SitemapLibrary = React.lazy(() => import("./pages/SitemapLibrary"));
const SharedSitemap = React.lazy(() => import("./pages/SharedSitemap"));
const MyProjects = React.lazy(() => import("./pages/MyProjects"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <InstallPrompt />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium">
            Skip to main content
          </a>
          <ErrorBoundary>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<PageLoader />}>
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
              <Route path="/my-projects" element={<MyProjects />} />
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
              <Route path="/shared/:id" element={<SharedSitemap />} />
              <Route path="/:slug" element={<PillarPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
