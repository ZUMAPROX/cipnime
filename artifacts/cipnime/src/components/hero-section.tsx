import { Link } from "wouter";
import { Play, Info } from "lucide-react";
import { AnimeItem } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  anime: AnimeItem;
}

export function HeroSection({ anime }: HeroSectionProps) {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] flex items-center rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-black/50">
      {/* Background Image with Blending */}
      <div className="absolute inset-0">
        <img 
          src={anime.poster} 
          alt={anime.title} 
          className="w-full h-full object-cover object-top opacity-50 blur-sm scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 backdrop-blur-md">
              Featured
            </span>
            {anime.rating && (
              <span className="px-3 py-1 text-xs font-bold text-yellow-400 bg-yellow-400/10 rounded-full border border-yellow-400/20 backdrop-blur-md">
                ★ {anime.rating}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            {anime.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm md:text-base text-muted-foreground font-medium">
            {anime.type && <span>{anime.type}</span>}
            {anime.type && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />}
            {anime.status && <span>{anime.status}</span>}
            {anime.status && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />}
            {anime.episode && <span>{anime.episode}</span>}
          </div>

          <div className="flex items-center gap-4">
            <Link href={`/anime/${anime.slug}`}>
              <Button size="lg" className="rounded-xl px-8 h-14 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 group">
                <Play className="w-5 h-5 mr-2 fill-white group-hover:scale-110 transition-transform" />
                Watch Now
              </Button>
            </Link>
            <Link href={`/anime/${anime.slug}`}>
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-base font-bold border-white/20 hover:bg-white/10 text-white backdrop-blur-md">
                <Info className="w-5 h-5 mr-2" />
                Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Poster */}
        <div className="hidden md:block w-64 lg:w-80 shrink-0 transform rotate-2 hover:rotate-0 transition-transform duration-500 hover:scale-105">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 ring-1 ring-white/5">
            <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
