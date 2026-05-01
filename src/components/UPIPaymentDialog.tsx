import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Smartphone, QrCode, CheckCircle2, Loader2, Shield, Lock, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const UPI_ID = "8638910252-2@ybl";
const PAYEE_NAME = "EPIC Pro";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email")
  .max(255);
const nameSchema = z.string().trim().max(100).optional();
const utrSchema = z.string().trim().regex(/^\d{12}$/, "UTR must be exactly 12 digits");

export type UPIPlan = "monthly" | "lifetime";

interface UPIPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: UPIPlan;
  amount: number;
  featureName?: string;
  defaultEmail?: string;
  defaultName?: string;
}

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
  if (typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches) return true;
  return false;
}

export const UPIPaymentDialog = ({
  open,
  onOpenChange,
  plan,
  amount,
  featureName,
  defaultEmail = "",
  defaultName = "",
}: UPIPaymentDialogProps) => {
  const [step, setStep] = useState<"intro" | "utr" | "done">("intro");
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [utr, setUtr] = useState("");
  const [errors, setErrors] = useState<{ email?: string; utr?: string; name?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const isMobile = useMemo(() => isMobileDevice(), []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const upiUrl = useMemo(() => {
    const tn = encodeURIComponent(`EPIC Pro ${plan}`);
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${tn}`;
  }, [plan, amount]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep("intro");
      setUtr("");
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  // Generate QR
  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(upiUrl, { width: 280, margin: 1, color: { dark: "#0a0a0a", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [open, upiUrl]);

  const validateContact = () => {
    const emailRes = emailSchema.safeParse(email);
    const nameRes = nameSchema.safeParse(name);
    const next: typeof errors = {};
    if (!emailRes.success) next.email = emailRes.error.errors[0].message;
    if (!nameRes.success) next.name = nameRes.error.errors[0].message;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const openUpiApp = async () => {
    if (!validateContact()) return;
    // Save lead (legacy table) — non-blocking
    try {
      await supabase.from("payment_leads" as any).insert({
        email: email.trim(),
        plan_selected: plan,
        amount,
      } as any);
    } catch (e) {
      console.error("lead save failed", e);
    }
    setStep("utr");
    window.location.href = upiUrl;
    toast.info("Opening your UPI app. Return here after paying to enter the UTR.", { duration: 6000 });
  };

  const showUtrForm = () => {
    if (!validateContact()) return;
    setStep("utr");
  };

  const submitUtr = async () => {
    const utrRes = utrSchema.safeParse(utr);
    if (!utrRes.success) {
      setErrors((e) => ({ ...e, utr: utrRes.error.errors[0].message }));
      return;
    }
    if (!validateContact()) return;
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("payment_submissions" as any).insert({
        user_id: user?.id ?? null,
        user_name: name.trim() || null,
        user_email: email.trim(),
        plan_selected: plan,
        amount,
        utr: utr.trim(),
      } as any);
      if (error) throw error;
      setStep("done");
      toast.success("Payment submitted for verification");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("UPI ID copied");
    } catch {
      /* noop */
    }
  };

  const planLabel = plan === "monthly" ? "₹299 / month" : "₹1,500 lifetime";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-2 border-primary/30">
        <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 pb-4">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {step === "done" ? "Submitted" : "Upgrade to Pro"}
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {featureName ? `Unlock ${featureName}` : "Pay with UPI"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {planLabel} · Manual verification within 24 hours
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {step === "intro" && (
            <>
              {/* Contact */}
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="upi-name">Name</Label>
                  <Input
                    id="upi-name"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="upi-email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="upi-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
                    }}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              {/* QR + UPI ID always visible */}
              <div className="rounded-xl border border-border bg-card/50 p-4 flex flex-col items-center gap-3">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="UPI QR code"
                    className="w-56 h-56 rounded-lg bg-white p-2"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Scan to pay {planLabel}
                  </div>
                  <button
                    onClick={copyUpi}
                    className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-foreground hover:text-primary transition"
                  >
                    {UPI_ID}
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {isMobile ? (
                <Button
                  onClick={openUpiApp}
                  className="w-full h-12 text-base font-semibold"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Open UPI App — Pay {planLabel}
                </Button>
              ) : (
                <Button
                  onClick={showUtrForm}
                  className="w-full h-12 text-base font-semibold"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  I have paid
                </Button>
              )}

              {isMobile && (
                <button
                  onClick={showUtrForm}
                  className="w-full text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  I already paid — enter UTR
                </button>
              )}

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secure UPI</span>
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Manual verify</span>
                <span className="flex items-center gap-1"><QrCode className="h-3 w-3" /> Any UPI app</span>
              </div>
            </>
          )}

          {step === "utr" && (
            <>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
                Enter the <strong>12-digit UTR</strong> (Unique Transaction Reference) shown in your UPI app
                after the payment succeeds.
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="upi-utr">UTR Number <span className="text-destructive">*</span></Label>
                <Input
                  id="upi-utr"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="123456789012"
                  value={utr}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 12);
                    setUtr(v);
                    if (errors.utr) setErrors((er) => ({ ...er, utr: undefined }));
                  }}
                  className={errors.utr ? "border-destructive font-mono tracking-wider" : "font-mono tracking-wider"}
                />
                {errors.utr && <p className="text-xs text-destructive">{errors.utr}</p>}
                <p className="text-xs text-muted-foreground">
                  Find it under transaction details in Google Pay, PhonePe, Paytm, etc.
                </p>
              </div>

              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <div><span className="text-foreground font-medium">UPI ID:</span> {UPI_ID}</div>
                <div><span className="text-foreground font-medium">Amount:</span> ₹{amount}</div>
                <div><span className="text-foreground font-medium">Plan:</span> {plan === "monthly" ? "Monthly" : "Lifetime"}</div>
                <div><span className="text-foreground font-medium">Email:</span> {email}</div>
              </div>

              <Button
                onClick={submitUtr}
                disabled={submitting}
                className="w-full h-12 text-base font-semibold"
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Verification
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("intro")}>
                Back
              </Button>
            </>
          )}

          {step === "done" && (
            <div className="text-center space-y-4 py-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Payment submitted</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your payment has been submitted for verification. Our team will review it
                and activate your Pro plan shortly — usually within a few hours.
              </p>
              <Button onClick={() => onOpenChange(false)} className="w-full h-11">
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};