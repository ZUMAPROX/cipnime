import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search as SearchIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchAnime } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";

export function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  const { data, isLoading, error } = useSearchAnime(
    { q: debouncedQuery },
    { query: { enabled: debouncedQuery.length > 2 } }
  );

  // Update URL silently
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      window.history.replaceState(null, "", `/search?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery]);

  const results = data?.data || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">Find Your Next Anime</h1>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <SearchIcon className="w-6 h-6 text-muted-foreground ml-4 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full bg-transparent border-none py-4 px-4 text-lg text-white focus:outline-none placeholder:text-muted-foreground/70"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="p-4 text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-[50vh]">
        {debouncedQuery.length <= 2 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
            <SearchIcon className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">Type at least 3 characters to search</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => <AnimeCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
            <p className="text-lg font-medium">Failed to search anime. Please try again.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
              <SearchIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-muted-foreground">We couldn't find any anime matching "{debouncedQuery}"</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-muted-foreground">
              Found {results.length} results for "<span className="text-white">{debouncedQuery}</span>"
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {results.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
