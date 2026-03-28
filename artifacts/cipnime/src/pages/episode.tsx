import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetAnimeEpisode } from "@workspace/api-client-react";
import { Play, SkipBack, SkipForward, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Episode() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data, isLoading, error } = useGetAnimeEpisode(slug);
  const episodeData = data?.data;

  const [selectedQuality, setSelectedQuality] = useState<string>("");

  useEffect(() => {
    // Auto-select best quality (usually 720p or highest available) when data loads
    if (episodeData?.streamUrls && episodeData.streamUrls.length > 0) {
      const q720 = episodeData.streamUrls.find(s => s.quality.includes("720"));
      setSelectedQuality(q720 ? q720.quality : episodeData.streamUrls[0].quality);
    }
  }, [episodeData]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-secondary rounded w-1/3 mb-6" />
        <div className="w-full aspect-video bg-card rounded-2xl border border-white/5 mb-6" />
        <div className="flex justify-between items-center">
          <div className="h-10 bg-secondary rounded w-32" />
          <div className="h-10 bg-secondary rounded w-48" />
        </div>
      </div>
    );
  }

  if (error || !episodeData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Episode Not Found</h2>
        <p className="text-muted-foreground mb-6">This episode might be unavailable or removed.</p>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const currentStream = episodeData.streamUrls?.find(s => s.quality === selectedQuality) || episodeData.streamUrls?.[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      
      <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-white" onClick={() => window.history.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white leading-snug">
          {episodeData.title}
        </h1>
      </div>

      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black ring-1 ring-white/10 mb-6 group">
        {currentStream ? (
          <iframe 
            src={currentStream.url} 
            allowFullScreen 
            className="w-full h-full border-none"
            title="Anime Player"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground flex-col gap-4">
            <Play className="w-16 h-16 opacity-20" />
            <p>No video source available</p>
          </div>
        )}
      </div>

      {/* Controls & Qualities */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {episodeData.prev && (
            <Link href={`/episode/${episodeData.prev}`} className="flex-1 md:flex-none">
              <Button variant="secondary" className="w-full bg-secondary/80 hover:bg-secondary">
                <SkipBack className="w-4 h-4 mr-2" /> Prev
              </Button>
            </Link>
          )}
          {episodeData.next && (
            <Link href={`/episode/${episodeData.next}`} className="flex-1 md:flex-none">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Next <SkipForward className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {episodeData.streamUrls && episodeData.streamUrls.length > 0 && (
          <div className="flex items-center gap-3 bg-secondary/50 p-1.5 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto hide-scrollbar">
            <Settings className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
            {episodeData.streamUrls.map(stream => (
              <button
                key={stream.quality}
                onClick={() => setSelectedQuality(stream.quality)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  selectedQuality === stream.quality 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                {stream.quality}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
