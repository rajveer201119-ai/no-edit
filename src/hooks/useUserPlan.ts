import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PlanType = "free" | "student" | "pro";

interface UserPlan {
  plan: PlanType;
  isLoading: boolean;
  isPremium: boolean; // student or pro
  isPro: boolean; // pro only
  canExportPDF: boolean; // pro only
  canExportPNG: boolean; // pro only
  canExportJSON: boolean; // free + pro
  canUseUXTester: boolean; // pro only
  canUseAnalyzer: boolean; // pro only
  canUseLibrary: boolean; // pro only
  maxProjects: number; // free: 1, pro: unlimited
  maxPages: number; // free: 10, pro: unlimited
  hasWatermark: boolean; // free only
  userId: string | null;
}

export function useUserPlan(): UserPlan {
  const [plan, setPlan] = useState<PlanType>("free");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setPlan("free");
          setUserId(null);
          setIsLoading(false);
          return;
        }
        setUserId(user.id);

        const { data, error } = await supabase
          .from("user_subscriptions")
          .select("plan_type, is_premium, premium_until")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          if (data.premium_until && new Date(data.premium_until) < new Date()) {
            setPlan("free");
          } else {
            setPlan((data.plan_type as PlanType) || "free");
          }
        } else {
          setPlan("free");
        }
      } catch (err) {
        console.error("Failed to fetch plan:", err);
        setPlan("free");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchPlan();
    });

    return () => subscription.unsubscribe();
  }, []);

  const isPro = plan === "pro" || plan === "student";

  return {
    plan,
    isLoading,
    isPremium: plan !== "free",
    isPro: plan === "pro",
    canExportPDF: isPro,
    canExportPNG: isPro,
    canExportJSON: true, // free users can export JSON
    canUseUXTester: isPro,
    canUseAnalyzer: isPro,
    canUseLibrary: isPro,
    maxProjects: isPro ? Infinity : 1,
    maxPages: isPro ? Infinity : 10,
    hasWatermark: plan === "free",
    userId,
  };
}
