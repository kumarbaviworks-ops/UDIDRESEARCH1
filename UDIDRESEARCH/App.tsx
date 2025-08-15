
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultDisplay } from './components/ResultDisplay';
import { searchWithGoogle } from './services/geminiService';
import { type GroundingChunk } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError('Please enter a question.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswer('');
    setSources([]);
    setImageUrl(null);
    setSearchQuery(query);

    try {
      const result = await searchWithGoogle(query);
      setAnswer(result.answer);
      setSources(result.sources);
      setImageUrl(result.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main>
          <SearchBar 
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            isLoading={isLoading}
          />
          <ResultDisplay
            query={searchQuery}
            answer={answer}
            sources={sources}
            isLoading={isLoading}
            error={error}
            imageUrl={imageUrl}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
