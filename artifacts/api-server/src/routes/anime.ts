import { Router, type IRouter } from "express";
import {
  GetAnimeHomeResponse,
  GetAnimePopularResponse,
  GetAnimeRecentResponse,
  SearchAnimeResponse,
  GetAnimeGenresResponse,
  GetAnimeByGenreResponse,
  GetAnimeDetailResponse,
  GetAnimeEpisodeResponse,
  GetAnimeScheduleResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const JIKAN = "https://api.jikan.moe/v4";

async function fetchJikan(path: string) {
  const url = `${JIKAN}/${path}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "CipNime/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Jikan API error: ${res.status} at ${path}`);
  }
  return res.json();
}

function mapAnimeItem(a: any) {
  return {
    title: a.title || a.title_english || "",
    slug: String(a.mal_id || ""),
    poster: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || "",
    episode: a.episodes ? String(a.episodes) : a.type === "Movie" ? "Movie" : "?",
    rating: a.score ? String(a.score) : "",
    type: a.type || "",
    status: a.status || "",
    genres: Array.isArray(a.genres) ? a.genres.map((g: any) => g.name) : [],
  };
}

router.get("/home", async (req, res) => {
  try {
    const [popularRes, recentRes, ongoingRes] = await Promise.all([
      fetchJikan("top/anime?limit=12&filter=bypopularity"),
      fetchJikan("top/anime?limit=12&filter=favorite"),
      fetchJikan("seasons/now?limit=12"),
    ]);

    const data = GetAnimeHomeResponse.parse({
      success: true,
      data: {
        popular: (popularRes?.data || []).map(mapAnimeItem),
        recent: (recentRes?.data || []).map(mapAnimeItem),
        ongoing: (ongoingRes?.data || []).map(mapAnimeItem),
      },
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch anime home");
    res.status(500).json({ success: false, data: { popular: [], recent: [], ongoing: [] } });
  }
});

router.get("/popular", async (req, res) => {
  try {
    const result = await fetchJikan("top/anime?limit=24&filter=bypopularity");
    const data = GetAnimePopularResponse.parse({
      success: true,
      data: (result?.data || []).map(mapAnimeItem),
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch popular");
    res.status(500).json({ success: false, data: [] });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const result = await fetchJikan("seasons/now?limit=24");
    const data = GetAnimeRecentResponse.parse({
      success: true,
      data: (result?.data || []).map(mapAnimeItem),
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch recent");
    res.status(500).json({ success: false, data: [] });
  }
});

router.get("/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json({ success: true, data: [] });

    const result = await fetchJikan(`anime?q=${encodeURIComponent(q)}&limit=20&sfw=true`);
    const data = SearchAnimeResponse.parse({
      success: true,
      data: (result?.data || []).map(mapAnimeItem),
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to search");
    res.status(500).json({ success: false, data: [] });
  }
});

router.get("/genres", async (req, res) => {
  try {
    const result = await fetchJikan("genres/anime");
    const data = GetAnimeGenresResponse.parse({
      success: true,
      data: (result?.data || []).map((g: any) => ({
        name: g.name,
        slug: String(g.mal_id),
      })),
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch genres");
    res.status(500).json({ success: false, data: [] });
  }
});

router.get("/genre/:genre", async (req, res) => {
  try {
    const genreId = req.params.genre;
    const result = await fetchJikan(`anime?genres=${genreId}&limit=24&order_by=score&sort=desc&sfw=true`);
    const data = GetAnimeByGenreResponse.parse({
      success: true,
      data: (result?.data || []).map(mapAnimeItem),
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch anime by genre");
    res.status(500).json({ success: false, data: [] });
  }
});

router.get("/detail/:slug", async (req, res) => {
  try {
    const id = req.params.slug;
    const [animeRes, episodesRes] = await Promise.all([
      fetchJikan(`anime/${id}/full`),
      fetchJikan(`anime/${id}/episodes`),
    ]);

    const a = animeRes?.data || {};
    const episodeList = (episodesRes?.data || []).map((ep: any) => ({
      title: ep.title || `Episode ${ep.mal_id}`,
      slug: `${id}-ep-${ep.mal_id}`,
      date: ep.aired || "",
    }));

    const data = GetAnimeDetailResponse.parse({
      success: true,
      data: {
        title: a.title || "",
        poster: a.images?.jpg?.large_image_url || "",
        synopsis: a.synopsis || "",
        type: a.type || "",
        status: a.status || "",
        episodes: a.episodes ? String(a.episodes) : "?",
        duration: a.duration || "",
        rating: a.score ? String(a.score) : "",
        studios: Array.isArray(a.studios) ? a.studios.map((s: any) => s.name).join(", ") : "",
        genres: Array.isArray(a.genres) ? a.genres.map((g: any) => g.name) : [],
        episodeList,
      },
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch detail");
    res.status(500).json({ success: false, data: {} });
  }
});

router.get("/episode/:slug", async (req, res) => {
  try {
    const slugParts = req.params.slug.split("-ep-");
    const animeId = slugParts[0];
    const episodeNum = slugParts[1] || "1";

    const [animeRes] = await Promise.all([
      fetchJikan(`anime/${animeId}`),
    ]);

    const a = animeRes?.data || {};
    const trailerUrl = a.trailer?.embed_url || "";

    const data = GetAnimeEpisodeResponse.parse({
      success: true,
      data: {
        title: `${a.title || "Anime"} - Episode ${episodeNum}`,
        prev: Number(episodeNum) > 1 ? `${animeId}-ep-${Number(episodeNum) - 1}` : null,
        next: a.episodes && Number(episodeNum) < a.episodes
          ? `${animeId}-ep-${Number(episodeNum) + 1}`
          : null,
        streamUrls: trailerUrl
          ? [{ quality: "Trailer", url: trailerUrl }]
          : [],
      },
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch episode");
    res.status(500).json({ success: false, data: { title: "", streamUrls: [] } });
  }
});

router.get("/schedule", async (req, res) => {
  try {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const results = await Promise.all(
      days.map(day => fetchJikan(`schedules?filter=${day}&limit=10`))
    );

    const scheduleData = days.map((day, i) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      anime: (results[i]?.data || []).map(mapAnimeItem),
    }));

    const data = GetAnimeScheduleResponse.parse({
      success: true,
      data: scheduleData,
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch schedule");
    res.status(500).json({ success: false, data: [] });
  }
});

export default router;
