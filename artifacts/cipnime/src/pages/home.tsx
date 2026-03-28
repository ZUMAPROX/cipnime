import { motion } from "framer-motion";
import { useGetAnimeHome } from "@workspace/api-client-react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import { HeroSection } from "@/components/hero-section";
import { Flame, Clock, PlayCircle } from "lucide-react";

export function Home() {
  const { data, isLoading, error } = useGetAnimeHome();
  const animeData = data?.data;

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Flame className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Failed to load anime</h2>
        <p className="text-muted-foreground max-w-md">Our servers might be taking a nap. Please try refreshing the page in a few moments.</p>
      </div>
    );
  }

  const featuredAnime = animeData?.popular?.[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {isLoading ? (
        <div className="w-full h-[60vh] rounded-3xl bg-secondary/50 animate-pulse mb-12 border border-border" />
      ) : featuredAnime ? (
        <HeroSection anime={featuredAnime} />
      ) : null}

      <div className="space-y-16">
        {/* Popular Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Popular Right Now</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => <AnimeCardSkeleton key={i} />)
              : animeData?.popular?.slice(1).map((anime) => (
                  <AnimeCard key={anime.slug} anime={anime} />
                ))}
          </div>
        </section>

        {/* Ongoing Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <PlayCircle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Currently Airing</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => <AnimeCardSkeleton key={i} />)
              : animeData?.ongoing?.map((anime) => (
                  <AnimeCard key={anime.slug} anime={anime} />
                ))}
          </div>
        </section>

        {/* Recent Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-accent" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Recent Episodes</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => <AnimeCardSkeleton key={i} />)
              : animeData?.recent?.map((anime) => (
                  <AnimeCard key={anime.slug} anime={anime} />
                ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
