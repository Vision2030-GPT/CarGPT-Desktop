// CarGPT Conversations API — Supabase-backed messaging
// GET    /api/conversations?user_id=xxx — list user's conversations
// POST   /api/conversations { user_id, dealer_id, vehicle_id, type } — create conversation
// GET    /api/conversations?id=xxx — get single conversation with messages
// POST   /api/conversations { action:"send", conversation_id, sender_type, text } — send message

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: "Not configured" });

  const headers = {
    "Content-Type": "application/json",
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
  };

  try {
    // ─── LIST CONVERSATIONS ───
    if (req.method === "GET" && req.query.user_id && !req.query.id) {
      const userId = req.query.user_id;
      const r = await fetch(
        `${SB_URL}/rest/v1/conversations?user_id=eq.${userId}&order=updated_at.desc&select=*`,
        { headers }
      );
      const convos = await r.json();
      return res.status(200).json({ conversations: convos || [] });
    }

    // ─── GET CONVERSATION + MESSAGES ───
    if (req.method === "GET" && req.query.id) {
      const id = req.query.id;
      // Fetch conversation
      const cr = await fetch(
        `${SB_URL}/rest/v1/conversations?id=eq.${id}&select=*`,
        { headers }
      );
      const convos = await cr.json();
      const convo = convos?.[0];
      if (!convo) return res.status(404).json({ error: "Not found" });

      // Fetch messages
      const mr = await fetch(
        `${SB_URL}/rest/v1/messages?conversation_id=eq.${id}&order=created_at.asc&select=*`,
        { headers }
      );
      const messages = await mr.json();

      return res.status(200).json({ conversation: convo, messages: messages || [] });
    }

    // ─── POST ACTIONS ───
    if (req.method === "POST") {
      const { action, user_id, dealer_id, vehicle_id, type, conversation_id, sender_type, text, metadata } = req.body || {};

      // ── CREATE CONVERSATION ──
      if (!action || action === "create") {
        if (!user_id || !dealer_id) return res.status(400).json({ error: "user_id and dealer_id required" });

        // Check if conversation already exists for this user+dealer+vehicle
        const existing = await fetch(
          `${SB_URL}/rest/v1/conversations?user_id=eq.${user_id}&dealer_id=eq.${dealer_id}${vehicle_id ? `&vehicle_id=eq.${vehicle_id}` : ""}&select=id`,
          { headers }
        );
        const existingData = await existing.json();
        if (existingData?.length > 0) {
          return res.status(200).json({ conversation_id: existingData[0].id, existing: true });
        }

        // Create new conversation
        const cr = await fetch(`${SB_URL}/rest/v1/conversations`, {
          method: "POST",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify({
            user_id,
            dealer_id,
            vehicle_id: vehicle_id || null,
            type: type || "dealer_enquiry",
            status: "active",
            last_message_preview: "",
            user_unread_count: 0,
            dealer_unread_count: 0,
          }),
        });
        const newConvo = await cr.json();
        return res.status(200).json({ conversation_id: newConvo?.[0]?.id || newConvo?.id, existing: false });
      }

      // ── SEND MESSAGE ──
      if (action === "send") {
        if (!conversation_id || !text) return res.status(400).json({ error: "conversation_id and text required" });

        // Insert message
        const mr = await fetch(`${SB_URL}/rest/v1/messages`, {
          method: "POST",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify({
            conversation_id,
            sender_type: sender_type || "user",
            message_type: "text",
            content: text,
            metadata: metadata || {},
          }),
        });
        const newMsg = await mr.json();

        // Update conversation last_message and unread counts
        const updateBody = {
          last_message_preview: text.substring(0, 100),
          updated_at: new Date().toISOString(),
        };
        if (sender_type === "user") {
          updateBody.dealer_unread_count = 1; // simplified — Pro would increment
        } else {
          updateBody.user_unread_count = 1;
        }

        await fetch(`${SB_URL}/rest/v1/conversations?id=eq.${conversation_id}`, {
          method: "PATCH",
          headers: { ...headers, Prefer: "return=minimal" },
          body: JSON.stringify(updateBody),
        });

        return res.status(200).json({ message: newMsg?.[0] || newMsg });
      }

      // ── MARK READ ──
      if (action === "mark_read") {
        if (!conversation_id) return res.status(400).json({ error: "conversation_id required" });
        await fetch(`${SB_URL}/rest/v1/conversations?id=eq.${conversation_id}`, {
          method: "PATCH",
          headers: { ...headers, Prefer: "return=minimal" },
          body: JSON.stringify({ user_unread_count: 0 }),
        });
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: "Invalid action" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Conversations error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
