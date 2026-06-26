import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let insertedCount = 0;

    // 1. Fetch from Arbeitnow (Free, No Auth)
    try {
      const arbeitnowRes = await fetch("https://www.arbeitnow.com/api/job-board-api");
      if (arbeitnowRes.ok) {
        const data = await arbeitnowRes.json();
        const jobs = data.data.slice(0, 50).map((job: any) => ({
          external_id: `arbeitnow-${job.slug}`,
          title: job.title,
          company: job.company_name,
          company_logo: null,
          location: job.location,
          country: null,
          employment_type: "Full-time", // Arbeitnow defaults mostly
          experience_level: null,
          salary: null,
          skills: job.tags || [],
          description: job.description,
          apply_url: job.url,
          source: "Arbeitnow",
          is_remote: job.remote,
          category: mapCategory(job.title),
          posted_at: new Date(job.created_at * 1000).toISOString(),
        }));

        const { error } = await supabase.from("jobs").upsert(jobs, { onConflict: "external_id" });
        if (!error) insertedCount += jobs.length;
      }
    } catch (e) {
      console.error("Arbeitnow fetch failed", e);
    }

    // 2. Fetch from RemoteOK (Free, No Auth)
    try {
      const remoteOkRes = await fetch("https://remoteok.com/api");
      if (remoteOkRes.ok) {
        const data = await remoteOkRes.json();
        // first element is legal info
        const jobs = data.slice(1, 51).map((job: any) => ({
          external_id: `remoteok-${job.id}`,
          title: job.position,
          company: job.company,
          company_logo: job.company_logo,
          location: job.location,
          country: null,
          employment_type: "Full-time",
          experience_level: null,
          salary:
            job.salary_min && job.salary_max ? `$${job.salary_min}k - $${job.salary_max}k` : null,
          skills: job.tags || [],
          description: job.description,
          apply_url: job.url,
          source: "RemoteOK",
          is_remote: true,
          category: mapCategory(job.position),
          posted_at: new Date(job.date).toISOString(),
        }));

        const { error } = await supabase.from("jobs").upsert(jobs, { onConflict: "external_id" });
        if (!error) insertedCount += jobs.length;
      }
    } catch (e) {
      console.error("RemoteOK fetch failed", e);
    }

    // 3. Delete expired jobs (older than 30 days for testing)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await supabase.from("jobs").delete().lt("posted_at", thirtyDaysAgo.toISOString());

    return new Response(JSON.stringify({ success: true, synced: insertedCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

function mapCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("front") || t.includes("react") || t.includes("angular") || t.includes("vue"))
    return "Frontend";
  if (t.includes("back") || t.includes("node") || t.includes("python") || t.includes("java"))
    return "Backend";
  if (t.includes("full") || t.includes("stack")) return "Full Stack";
  if (t.includes("data") || t.includes("machine") || t.includes("ai") || t.includes("ml"))
    return "Data Science & AI";
  if (t.includes("cloud") || t.includes("devops") || t.includes("aws")) return "Cloud & DevOps";
  if (t.includes("mobile") || t.includes("ios") || t.includes("android") || t.includes("flutter"))
    return "Mobile";
  if (t.includes("ui") || t.includes("ux") || t.includes("design")) return "Design";
  return "Engineering";
}
