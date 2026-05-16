import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Models from '@/pages/Models';
import QuantizedModels from '@/pages/QuantizedModels';
import FinetunedModels from '@/pages/FinetunedModels';
import Datasets from '@/pages/Datasets';
import Research from '@/pages/Research';
import Blog from '@/pages/Blog';
import ArticleDetail from '@/pages/ArticleDetail';
import Team from '@/pages/Team';
import OpenSource from '@/pages/OpenSource';
import Contact from '@/pages/Contact';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } },
});

function NotFound() {
  return (
    <div className="aq-container py-32 text-center text-muted">
      <p className="font-mono text-8xl font-bold text-border mb-6">404</p>
      <p className="text-xl mb-8">Page not found.</p>
      <a href="/" className="btn-primary">Go home</a>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col text-text">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/models" element={<Models />} />
              <Route path="/models/quantized" element={<QuantizedModels />} />
              <Route path="/models/finetuned" element={<FinetunedModels />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/research" element={<Research />} />
              <Route path="/research/:slug" element={<ArticleDetail kind="research" />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<ArticleDetail kind="blog" />} />
              <Route path="/team" element={<Team />} />
              <Route path="/open-source" element={<OpenSource />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
