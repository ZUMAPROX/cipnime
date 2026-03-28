import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetAnimeDetail } from "@workspace/api-client-react";
import { Play, Star, Calendar, Clock, Tv, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Detail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data, isLoading, error } = useGetAnimeDetail(slug);
  const detail = data?.data;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-full h-[50vh] bg-secondary/50" />
        <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8 -mt-32">
          <div className="w-64 aspect-[3/4] bg-card rounded-2xl border-4 border-background shrink-0" />
          <div className="flex-1 mt-36 space-y-4">
            <div className="h-10 bg-secondary rounded-lg w-2/3" />
            <div className="h-6 bg-secondary rounded-lg w-1/3" />
            <div className="h-32 bg-secondary rounded-lg w-full mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Anime Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-6">We couldn't find the anime you're looking for.</p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const firstEpisodeSlug = detail.episodeList && detail.episodeList.length > 0 
    ? detail.episodeList[detail.episodeList.length - 1].slug // Usually reverse chronological
    : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
      {/* Banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-card overflow-hidden">
        <img 
          src={detail.poster} 
          alt={detail.title} 
          className="w-full h-full object-cover opacity-30 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster Column */}
          <div className="w-48 sm:w-64 shrink-0 mx-auto md:mx-0">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-background bg-card">
              <img src={detail.poster} alt={detail.title} className="w-full h-full object-cover" />
            </div>
            
            {firstEpisodeSlug && (
              <Link href={`/episode/${firstEpisodeSlug}`}>
                <Button className="w-full mt-6 h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-xl">
                  <Play className="w-5 h-5 mr-2 fill-white" />
                  Watch First Ep
                </Button>
              </Link>
            )}
          </div>

          {/* Info Column */}
          <div className="flex-1 mt-4 md:mt-24">
            <div className="flex flex-wrap gap-2 mb-4">
              {detail.status && (
                <span className="px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold border border-white/10">
                  {detail.status}
                </span>
              )}
              {detail.type && (
                <span className="px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold border border-white/10 flex items-center gap-1">
                  {detail.type.toLowerCase().includes('movie') ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                  {detail.type}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4 drop-shadow-md">
              {detail.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium mb-8 bg-card/50 backdrop-blur-md p-4 rounded-2xl border border-white/5 inline-flex">
              {detail.rating && (
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {detail.rating}
                </div>
              )}
              {detail.duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {detail.duration}
                </div>
              )}
              {detail.episodes && (
                <div className="flex items-center gap-1.5">
                  <ListVideo className="w-4 h-4" />
                  {detail.episodes}
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-8">
              {detail.genres?.map(genre => (
                <Link key={genre} href={`/genres/${genre.toLowerCase().replace(/\s+/g, '-')}`}>
                  <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer border border-primary/20">
                    {genre}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-display font-bold text-white mb-4">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                {detail.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* Episodes List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold text-white">Episodes</h3>
                <span className="text-muted-foreground">{detail.episodeList?.length || 0} Total</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {detail.episodeList?.map((ep, index) => (
                  <Link key={ep.slug} href={`/episode/${ep.slug}`}>
                    <div className="group glass-card p-4 rounded-xl cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:border-primary/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors text-white">
                          <Play className="w-4 h-4 ml-0.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            {ep.title}
                          </h4>
                          {ep.date && <p className="text-xs text-muted-foreground">{ep.date}</p>}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Just importing this so it works if used above
import { ListVideo } from "lucide-react";
