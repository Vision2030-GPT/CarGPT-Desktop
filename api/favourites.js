// CarGPT Favourites API — Supabase-backed persistent favourites
// GET  /api/favourites?user_id=xxx — get user's favourites
// POST /api/favourites { user_id, vehicle_id } — add favourite
// DELETE /api/favourites { user_id, vehicle_id } — remove favourite

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SB_URL || !SB_KEY) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  const headers = {
    "Content-Type": "application/json",
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
  };

  try {
    // ─── GET FAVOURITES ───
    if (req.method === "GET") {
      const userId = req.query.user_id;
      if (!userId) return res.status(400).json({ error: "user_id required" });

      const r = await fetch(
        `${SB_URL}/rest/v1/favourites?user_id=eq.${userId}&select=vehicle_id,created_at`,
        { headers }
      );
      const favs = await r.json();
      return res.status(200).json({
        favourites: (favs || []).map((f) => f.vehicle_id),
        details: favs || [],
      });
    }

    // ─── ADD FAVOURITE ───
    if (req.method === "POST") {
      const { user_id, vehicle_id } = req.body || {};
      if (!user_id || !vehicle_id) return res.status(400).json({ error: "user_id and vehicle_id required" });

      // Upsert (ignore if already exists)
      const r = await fetch(`${SB_URL}/rest/v1/favourites`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal,resolution=ignore-duplicates" },
        body: JSON.stringify({ user_id, vehicle_id }),
      });

      if (r.status >= 400) {
        const err = await r.json();
        return res.status(400).json({ error: err.message || "Failed to add favourite" });
      }

      return res.status(200).json({ success: true });
    }

    // ─── REMOVE FAVOURITE ───
    if (req.method === "DELETE") {
      const { user_id, vehicle_id } = req.body || {};
      if (!user_id || !vehicle_id) return res.status(400).json({ error: "user_id and vehicle_id required" });

      await fetch(
        `${SB_URL}/rest/v1/favourites?user_id=eq.${user_id}&vehicle_id=eq.${vehicle_id}`,
        { method: "DELETE", headers }
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Favourites error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
