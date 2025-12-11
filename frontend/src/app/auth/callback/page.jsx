'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getOrCreateProfile } from '@/utils/supabase/database';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/dashboard';

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          // Create profile if it doesn't exist
          await getOrCreateProfile();
          router.push(next);
        } else {
          console.error('Auth error:', error);
          router.push('/login?error=auth_callback_error');
        }
      } else {
        // If no code, check if we have a session anyway
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // Create profile if it doesn't exist
            await getOrCreateProfile();
            router.push(next);
        } else {
            router.push('/login');
        }
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: '#0A1128', 
      color: '#fff' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Verifying Login...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
