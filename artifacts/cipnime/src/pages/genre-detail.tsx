import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetAnimeByGenre } from "@workspace/api-client-react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import { Hash, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GenreDetail() {
  const params = useParams();
  const genreSlug = params.genre || "";
  
  const { data, isLoading, error } = useGetAnimeByGenre(genreSlug);
  const animeList = data?.data || [];
  
  // Format slug to readable string for header if needed, though we don't have the exact original name
  const displayTitle = genreSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/genres">
        <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-white pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Genres
        </Button>
      </Link>

      <div className="mb-10 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Hash className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{displayTitle} Anime</h1>
          <p className="text-muted-foreground mt-1">Showing all anime in this genre</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 15 }).map((_, i) => <AnimeCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-destructive">Failed to load anime for this genre.</div>
      ) : animeList.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground glass-card rounded-3xl">
          <p>No anime found in this genre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {animeList.map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
