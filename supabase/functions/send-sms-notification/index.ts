import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationRequest {
  productId: string;
  productName: string;
  quantity: number;
  status: string;
  unit: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { productId, productName, quantity, status, unit }: NotificationRequest = await req.json();

    const { data: beneficiaries, error: beneficiariesError } = await supabase
      .from("beneficiaries")
      .select("*")
      .eq("active", true);

    if (beneficiariesError) {
      throw beneficiariesError;
    }

    const message = status === "available"
      ? `Good news! ${productName} is now available at the ration shop. Stock: ${quantity} ${unit}. Visit soon to collect your ration.`
      : `Update: ${productName} is currently out of stock at the ration shop. We will notify you when it becomes available again.`;

    const notifications = beneficiaries.map((beneficiary) => ({
      beneficiary_id: beneficiary.id,
      product_id: productId,
      message: message,
      status: "sent",
      sent_at: new Date().toISOString(),
    }));

    const { error: notificationError } = await supabase
      .from("notifications")
      .insert(notifications);

    if (notificationError) {
      throw notificationError;
    }

    const smsResults = beneficiaries.map((beneficiary) => ({
      phone: beneficiary.phone_number,
      name: beneficiary.name,
      status: "sent",
      message: message,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        message: `SMS notifications sent to ${beneficiaries.length} beneficiaries`,
        results: smsResults,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending notifications:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
