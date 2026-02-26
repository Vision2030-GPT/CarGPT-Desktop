// Vercel Serverless Function — Fetches vehicles + dealers from Supabase

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  try {
    // Fetch active vehicles with all fields
    const vRes = await fetch(
      `${SUPABASE_URL}/rest/v1/vehicles?status=eq.active&order=days_listed.asc&select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const vehicles = await vRes.json();

    // Fetch all dealers
    const dRes = await fetch(
      `${SUPABASE_URL}/rest/v1/dealers?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const dealers = await dRes.json();

    // Fetch MOT history
    const mRes = await fetch(
      `${SUPABASE_URL}/rest/v1/vehicle_mot_history?select=*&order=test_date.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const motHistory = await mRes.json();

    // Attach dealer info and MOT history to each vehicle
    const enriched = vehicles.map((v) => {
      const dealer = dealers.find((d) => d.id === v.dealer_id) || {};
      const mots = motHistory.filter((m) => m.vehicle_id === v.id);
      return {
        ...v,
        // Convert price from pence to pounds
        price: Math.round(v.price / 100),
        tax_cost: Math.round((v.tax_cost || 0) / 100),
        // Attach dealer
        dealer: {
          id: dealer.id,
          name: dealer.name,
          slug: dealer.slug,
          phone: dealer.phone,
          email: dealer.email,
          city: dealer.city,
          postcode: dealer.postcode,
          rating: dealer.rating,
          review_count: dealer.review_count,
          trust_score: dealer.trust_score,
          response_time: dealer.response_time,
          verified: dealer.verified,
          opening_hours: dealer.opening_hours,
        },
        // Attach MOT history
        mot: mots.map((m) => ({
          date: m.test_date,
          result: m.result === "pass" ? "Pass" : "Fail",
          mileage: m.mileage,
          advisories: m.advisories || [],
        })),
      };
    });

    return res.status(200).json({ vehicles: enriched, dealers });
  } catch (e) {
    console.error("Supabase fetch error:", e);
    return res.status(500).json({ error: "Failed to fetch vehicles" });
  }
}
