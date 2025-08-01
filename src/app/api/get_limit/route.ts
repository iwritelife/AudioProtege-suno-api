import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    try {
      const limit = await (await sunoApi((await cookies()).toString())).get_credits();
      
      return new NextResponse(JSON.stringify(limit), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('Error fetching limit:', error);
      
      // Return mock data when SUNO_COOKIE is invalid/missing
      const mockLimit = {
        credits_left: 0,
        period: "day",
        monthly_limit: 50,
        monthly_usage: 0,
        error: "SUNO_COOKIE not configured or invalid"
      };
      
      return new NextResponse(JSON.stringify(mockLimit), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } else {
    return new NextResponse('Method Not Allowed', {
      headers: {
        Allow: 'GET',
        ...corsHeaders
      },
      status: 405
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}