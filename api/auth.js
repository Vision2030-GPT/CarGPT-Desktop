// CarGPT Auth API — Supabase Auth wrapper
// POST /api/auth { action: "signup"|"login"|"logout"|"session"|"update", ... }

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const SB_SERVICE = process.env.SUPABASE_SERVICE_KEY;

  if (!SB_URL || !SB_KEY) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  const { action, email, password, name, token } = req.body || {};

  try {
    // ─── SIGNUP ───
    if (action === "signup") {
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });

      // 1. Create auth user via Supabase Auth API
      const authRes = await fetch(`${SB_URL}/auth/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SB_KEY },
        body: JSON.stringify({
          email,
          password,
          data: { full_name: name || email.split("@")[0] },
        }),
      });
      const authData = await authRes.json();

      if (authData.error || authRes.status >= 400) {
        return res.status(400).json({ error: authData.error?.message || authData.msg || "Signup failed" });
      }

      // 2. Create user profile in our users table (using service key to bypass RLS)
      const userId = authData.user?.id || authData.id;
      if (userId) {
        await fetch(`${SB_URL}/rest/v1/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SB_SERVICE || SB_KEY,
            Authorization: `Bearer ${SB_SERVICE || SB_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            auth_id: userId,
            email: email,
            full_name: name || email.split("@")[0],
            plan: "free",
            preferences: {},
          }),
        });
      }

      return res.status(200).json({
        user: {
          id: userId,
          email: authData.user?.email || email,
          name: name || email.split("@")[0],
          plan: "free",
        },
        session: {
          access_token: authData.access_token,
          refresh_token: authData.refresh_token,
          expires_at: authData.expires_at,
        },
      });
    }

    // ─── LOGIN ───
    if (action === "login") {
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });

      const authRes = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SB_KEY },
        body: JSON.stringify({ email, password }),
      });
      const authData = await authRes.json();

      if (authData.error || authRes.status >= 400) {
        return res.status(401).json({ error: authData.error_description || authData.error || "Invalid credentials" });
      }

      // Fetch user profile from our users table
      const userId = authData.user?.id;
      let profile = null;
      if (userId) {
        const profileRes = await fetch(
          `${SB_URL}/rest/v1/users?auth_id=eq.${userId}&select=*`,
          {
            headers: {
              apikey: SB_SERVICE || SB_KEY,
              Authorization: `Bearer ${SB_SERVICE || SB_KEY}`,
            },
          }
        );
        const profiles = await profileRes.json();
        profile = profiles?.[0] || null;
      }

      return res.status(200).json({
        user: {
          id: profile?.id || userId,
          auth_id: userId,
          email: authData.user?.email || email,
          name: profile?.full_name || authData.user?.user_metadata?.full_name || email.split("@")[0],
          plan: profile?.plan || "free",
          location: profile?.location_postcode || null,
          joined: profile?.created_at || new Date().toISOString(),
        },
        session: {
          access_token: authData.access_token,
          refresh_token: authData.refresh_token,
          expires_at: authData.expires_at,
        },
      });
    }

    // ─── SESSION (verify token & get user) ───
    if (action === "session") {
      if (!token) return res.status(200).json({ user: null });

      const authRes = await fetch(`${SB_URL}/auth/v1/user`, {
        headers: {
          apikey: SB_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await authRes.json();

      if (authRes.status >= 400 || !userData?.id) {
        return res.status(200).json({ user: null });
      }

      // Fetch profile
      const profileRes = await fetch(
        `${SB_URL}/rest/v1/users?auth_id=eq.${userData.id}&select=*`,
        {
          headers: {
            apikey: SB_SERVICE || SB_KEY,
            Authorization: `Bearer ${SB_SERVICE || SB_KEY}`,
          },
        }
      );
      const profiles = await profileRes.json();
      const profile = profiles?.[0];

      return res.status(200).json({
        user: {
          id: profile?.id || userData.id,
          auth_id: userData.id,
          email: userData.email,
          name: profile?.full_name || userData.user_metadata?.full_name || userData.email.split("@")[0],
          plan: profile?.plan || "free",
          location: profile?.location_postcode || null,
          joined: profile?.created_at || userData.created_at,
        },
      });
    }

    // ─── REFRESH TOKEN ───
    if (action === "refresh") {
      if (!token) return res.status(400).json({ error: "Refresh token required" });

      const authRes = await fetch(`${SB_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SB_KEY },
        body: JSON.stringify({ refresh_token: token }),
      });
      const authData = await authRes.json();

      if (authRes.status >= 400) {
        return res.status(401).json({ error: "Session expired" });
      }

      return res.status(200).json({
        session: {
          access_token: authData.access_token,
          refresh_token: authData.refresh_token,
          expires_at: authData.expires_at,
        },
      });
    }

    // ─── LOGOUT ───
    if (action === "logout") {
      if (token) {
        await fetch(`${SB_URL}/auth/v1/logout`, {
          method: "POST",
          headers: {
            apikey: SB_KEY,
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
