import { useState, useEffect } from "react";
import { User } from "@/types/models";
import { UseAuthReturn } from "@/types/auth";
import { createBrowserClient } from "@supabase/ssr";

export function useAuth(): UseAuthReturn {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // State
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Helper functions
  const clearError = () => setError(null);

  const fetchUserProfile = async (userId: string, userEmail: string, retryCount = 0) => {
    try {
      const [profileResponse, usageResponse] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase
          .from("usage_tracking")
          .select("tasks_created")
          .eq("user_id", userId)
          .eq("year_month", new Date().toISOString().slice(0, 7))
          .maybeSingle(),
      ]);

      // If profile doesn't exist yet (might be creating via trigger), retry once
      if (profileResponse.error && profileResponse.error.code === 'PGRST116' && retryCount < 2) {
        console.log("Profile not found, retrying in 500ms...");
        await new Promise(resolve => setTimeout(resolve, 500));
        return fetchUserProfile(userId, userEmail, retryCount + 1);
      }

      if (profileResponse.error) {
        console.error("Error fetching profile:", profileResponse.error);
        // Don't sign out - just set a minimal user object
        setUser({
          user_id: userId,
          email: userEmail,
          name: userEmail.split('@')[0],
          subscription_plan: 'free',
          tasks_created: usageResponse.data?.tasks_created || 0,
        } as User);
        setIsLoading(false);
        return;
      }

      setUser({
        ...profileResponse.data,
        email: userEmail,
        tasks_created: usageResponse.data?.tasks_created || 0,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Don't sign out on error - allow user to continue
      // Set minimal user data so app doesn't break
      setUser({
        user_id: userId,
        email: userEmail,
        name: userEmail.split('@')[0],
        subscription_plan: 'free',
        tasks_created: 0,
      } as User);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionState = async (newSession: any) => {
    setSession(newSession);
    setIsLoggedIn(!!newSession);

    if (newSession?.user) {
      setIsLoading(true);
      await fetchUserProfile(newSession.user.id, newSession.user.email);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Auth methods
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
      window.localStorage.removeItem("supabase.auth.token");
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing out:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      console.log("✅ User logged in:", email, user);
    } catch (error: any) {
      setError(error.message);
      console.error("Error logging in:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (error: any) {
      setError(error.message);
      console.error("Error with Google login:", error);
    }
  };

  const handleSignup = async () => {
    clearError();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });

      if (error) {
        setError(error.message);
      } else {
        setError("Please check your email to confirm your account");
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing up:", error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get session - this should work after OAuth redirect
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setError(error.message);
          return;
        }
        
        console.log("Initial session check:", session?.user?.email || "No session");
        await updateSessionState(session);
      } catch (error: any) {
        console.error("Error initializing auth:", error);
        setError(error.message);
      }
    };

    initAuth();

    // Listen for auth state changes (including OAuth callbacks)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email || "No session");
      
      // Handle OAuth sign in
      if (event === 'SIGNED_IN' && session) {
        await updateSessionState(session);
      } else if (event === 'SIGNED_OUT') {
        await updateSessionState(null);
      } else {
        await updateSessionState(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    // State
    user,
    session,
    email,
    password,
    isLoggedIn,
    isLoading,
    error,
    isSignUpMode,

    // Operations
    signOut,
    handleLogin,
    handleGoogleLogin,
    handleSignup,
    setEmail,
    setPassword,
    setIsSignUpMode,
    clearError,
  };
}
