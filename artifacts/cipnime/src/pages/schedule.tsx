import { useState } from "react";
import { motion } from "framer-motion";
import { useGetAnimeSchedule } from "@workspace/api-client-react";
import { AnimeCard, AnimeCardSkeleton } from "@/components/anime-card";
import { Calendar as CalendarIcon } from "lucide-react";

export function Schedule() {
  const { data, isLoading, error } = useGetAnimeSchedule();
  const scheduleData = data?.data || [];
  
  const [activeDay, setActiveDay] = useState<string>("Senin"); // Default indonesian monday

  // Set active day to current day on load
  const today = new Date().getDay();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const todayName = days[today];

  if (!isLoading && scheduleData.length > 0 && activeDay === "Senin" && todayName !== "Senin") {
    // Just a basic default, user can click others
  }

  const activeDayData = scheduleData.find(d => d.day.toLowerCase() === activeDay.toLowerCase());

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 mb-6 shadow-lg shadow-primary/10">
          <CalendarIcon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Release Schedule</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Keep track of your favorite ongoing anime and know exactly when the next episode drops.</p>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-12 w-24 bg-secondary rounded-xl animate-pulse shrink-0" />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => <AnimeCardSkeleton key={i} />)}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-destructive">Failed to load schedule.</div>
      ) : (
        <div className="space-y-8">
          {/* Day Selector */}
          <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar justify-start md:justify-center">
            {scheduleData.map((schedule) => (
              <button
                key={schedule.day}
                onClick={() => setActiveDay(schedule.day)}
                className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeDay === schedule.day
                    ? "bg-primary text-white shadow-lg shadow-primary/25 border border-primary"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-white border border-transparent"
                }`}
              >
                {schedule.day}
              </button>
            ))}
          </div>

          {/* Anime Grid for selected day */}
          <motion.div 
            key={activeDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeDayData && activeDayData.anime.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {activeDayData.anime.map((anime) => (
                  <AnimeCard key={anime.slug} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground glass-card rounded-3xl">
                <p>No anime scheduled for {activeDay}.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
