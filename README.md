# 🎌 CipNime - Anime Streaming Web App

  Platform streaming anime modern yang dibangun dengan React + Express + Jikan API.

  ## ✨ Fitur

  - 🏠 **Halaman Home** - Tampilkan anime populer, sedang tayang & terbaru
  - 🔍 **Search** - Cari anime berdasarkan judul
  - 📋 **Detail Anime** - Info lengkap, sinopsis, genre, daftar episode  
  - 🎬 **Episode Player** - Trailer & info streaming
  - 📅 **Jadwal** - Jadwal tayang anime harian per hari
  - 🏷️ **Genre** - Filter anime berdasarkan genre

  ## 🚀 Tech Stack

  - **Frontend**: React + Vite + TypeScript + Tailwind CSS
  - **Backend**: Express 5 + Node.js
  - **API**: [Jikan API](https://jikan.moe/) (MyAnimeList unofficial)
  - **Database**: PostgreSQL + Drizzle ORM
  - **Monorepo**: pnpm workspaces

  ## 📦 Struktur Proyek

  ```
  cipnime/
  ├── artifacts/
  │   ├── api-server/       # Express API backend
  │   │   └── src/routes/
  │   │       └── anime.ts  # Anime API routes (Jikan)
  │   └── cipnime/          # React frontend
  │       └── src/
  │           ├── pages/    # Home, Search, Detail, Episode, Schedule, Genre
  │           └── components/
  ├── lib/
  │   ├── api-spec/         # OpenAPI specification
  │   ├── api-client-react/ # Generated React Query hooks
  │   └── api-zod/          # Generated Zod schemas
  ```

  ## 🛠️ Setup & Development

  ```bash
  # Install dependencies
  pnpm install

  # Start API server
  pnpm --filter @workspace/api-server run dev

  # Start frontend
  pnpm --filter @workspace/cipnime run dev
  ```

  ## 📡 API Endpoints

  | Method | Endpoint | Deskripsi |
  |--------|----------|-----------|
  | GET | /api/anime/home | Home page anime (popular, recent, ongoing) |
  | GET | /api/anime/popular | Daftar anime terpopuler |
  | GET | /api/anime/recent | Anime terbaru / sedang tayang |
  | GET | /api/anime/search?q={keyword} | Cari anime |
  | GET | /api/anime/genres | Daftar genre |
  | GET | /api/anime/genre/{id} | Anime berdasarkan genre |
  | GET | /api/anime/detail/{id} | Detail anime |
  | GET | /api/anime/episode/{id} | Info episode |
  | GET | /api/anime/schedule | Jadwal tayang harian |

  ## 🌐 Data Source

  Data anime diambil dari **Jikan API** - unofficial MyAnimeList REST API.
  - Website: https://jikan.moe/
  - Rate limit: 3 req/sec, 60 req/min

  ## 📄 License

  MIT License
  