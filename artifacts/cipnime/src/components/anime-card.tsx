import { Link } from "wouter";
import { Play, Star, ListVideo } from "lucide-react";
import { AnimeItem } from "@workspace/api-client-react";

interface AnimeCardProps {
  anime: AnimeItem;
  priority?: boolean;
}

export function AnimeCard({ anime, priority = false }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.slug}`} className="group block">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-3 shadow-lg transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-primary/20 group-hover:shadow-xl border border-white/5">
        <img
          src={anime.poster}
          alt={anime.title}
          loading={priority ? "eager" : "lazy"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/50 text-white">
            <Play className="w-6 h-6 fill-white ml-1" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {anime.rating && anime.rating !== "Unknown" && (
            <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold text-yellow-400 border border-white/10">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {anime.rating}
            </div>
          )}
          {anime.type && (
            <div className="bg-primary/80 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/10 shadow-sm ml-auto">
              {anime.type}
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-medium text-white/80">
          {anime.episode && (
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
              <ListVideo className="w-3.5 h-3.5 text-primary" />
              <span className="truncate max-w-[100px]">{anime.episode}</span>
            </div>
          )}
          {anime.status && (
            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
              {anime.status}
            </div>
          )}
        </div>
      </div>
      
      {/* Title */}
      <h3 className="font-display font-semibold text-sm md:text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
        {anime.title}
      </h3>
    </Link>
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-secondary mb-3 border border-white/5" />
      <div className="h-4 bg-secondary rounded w-full mb-2" />
      <div className="h-4 bg-secondary rounded w-2/3" />
    </div>
  );
}
