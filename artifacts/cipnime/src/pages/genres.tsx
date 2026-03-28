import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetAnimeGenres } from "@workspace/api-client-react";
import { Grid, Hash } from "lucide-react";

export function Genres() {
  const { data, isLoading, error } = useGetAnimeGenres();
  const genres = data?.data || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
          <Grid className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Browse Genres</h1>
          <p className="text-muted-foreground mt-1">Discover anime by your favorite category</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-16 bg-secondary/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-destructive">Failed to load genres.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {genres.map((genre, i) => (
            <Link key={genre.slug} href={`/genres/${genre.slug}`}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="group relative h-16 flex items-center justify-center rounded-xl bg-secondary/30 hover:bg-primary/20 border border-white/5 hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 font-bold text-muted-foreground group-hover:text-white transition-colors flex items-center gap-2">
                  <Hash className="w-4 h-4 opacity-50" />
                  {genre.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
