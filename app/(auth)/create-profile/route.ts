import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const body = await request.json();
    const { id, email, full_name } = body;

    if (!id || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (existingProfile) {
      return NextResponse.json({
        success: true,
        message: "Profile already exists",
        profile: existingProfile,
      });
    }

    // Create profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: id,
          email: email,
          full_name: full_name || email,
          role: 'admin', // Set as admin
          status: 'active',
          department: 'Management',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Profile creation error:", insertError);
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}