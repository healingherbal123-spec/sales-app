import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[Session API] Error getting session:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 500 }
      );
    }

    if (!session) {
      console.log('[Session API] No active session');
      return NextResponse.json(
        { 
          success: false, 
          error: "No active session" 
        },
        { status: 401 }
      );
    }

    console.log('[Session API] Session found for user:', session.user.email);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('[Session API] Profile error:', profileError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Profile not found" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.user.id,
          email: session.user.email,
        },
        profile: profile,
      }
    });
  } catch (error) {
    console.error('[Session API] Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}