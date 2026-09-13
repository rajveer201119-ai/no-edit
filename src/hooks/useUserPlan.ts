import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PlanType = "free" | "student" | "pro";

interface UserPlan {
  plan: PlanType;
  isLoading: boolean;
  isPremium: boolean;
  isPro: boolean;
  canExportPDF: boolean;
  canExportPNG: boolean;
  canExportJSON: boolean;
  canUseUXTester: boolean;
  canUseAnalyzer: boolean;
  canUseLibrary: boolean;
  maxProjects: number;
  maxPages: number;
  hasWatermark: boolean;
  userId: string | null;
}

/**
 * EPIC is retired and free for lifetime.
 * Every feature is unlocked for everyone — no plans, no limits, no watermark.
 */
export function useUserPlan(): UserPlan {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserId(data.user?.id ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    plan: "pro",
    isLoading,
    isPremium: true,
    isPro: true,
    canExportPDF: true,
    canExportPNG: true,
    canExportJSON: true,
    canUseUXTester: true,
    canUseAnalyzer: true,
    canUseLibrary: true,
    maxProjects: Infinity,
    maxPages: Infinity,
    hasWatermark: false,
    userId,
  };
}
