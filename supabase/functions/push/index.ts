import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Notification;
  schema: "public";
  old_record: null | Notification;
}

const supabase = createClient(
  Deno.env.get("_SUPABASE_URL")!,
  Deno.env.get("_SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json();
  const { data } = await supabase
    .from("profiles")
    .select("expo_push_token")
    .eq("id", payload.record.user_id)
    .single();

  const countNotificationsForUser = async (userId: string) => {
    const { count } = await supabase
      .from("notifications")
      .select('*', { count: 'exact', head: true })
      .eq("user_id", userId);
      return count;
  };

  const badgeCount = await countNotificationsForUser(payload.record.user_id);

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("_EXPO_ACCESS_TOKEN")}`,
    },
    body: JSON.stringify({
      to: data?.expo_push_token,
      sound: "default",
      title: payload.record.title,
      body: payload.record.body,
      badge: badgeCount,
      data: {
        url: 'juletraet://requests'
      }
    }),
  }).then((res) => res.json());

  return new Response(JSON.stringify(res), {
    headers: { "Content-Type": "application/json" },
  });
});