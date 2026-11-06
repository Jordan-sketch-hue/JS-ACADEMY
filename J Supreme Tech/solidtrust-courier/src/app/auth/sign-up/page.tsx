"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const BRANCHES = ["Montego Bay", "Hanover"];

type Stage = "form" | "confirm" | "sent" | "exists";

export default function SignUpPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("form");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    branch: "Montego Bay",
    trn: "",
    confirmPassword: "",
  });
  const [found, setFound] = useState<{ name: string; mailbox: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string,boolean>>({});
  const fieldErr = (k: string) => touched[k] && !form[k as keyof typeof form]?.toString().trim();
  const errMsg = (k: string, label: string) =>
    fieldErr(k) ? <span style={{ fontSize: 11.5, color: "var(--danger,#dc2626)", marginTop: 3, display: "block" }}>{label} is required.</span> : null;
  const touch = (k: string) => setTouched(t => ({ ...t, [k]: true }));

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  // Brand-new customer â€” create a fresh account, already confirmed (no email
  // step) with a mailbox assigned immediately, then sign straight in.
  async function createNew() {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("st_register", {
      p_email: form.email.trim(),
      p_password: form.password,
      p_full_name: form.fullName.trim(),
      p_phone: form.phone.trim(),
      p_address: form.address.trim(),
      p_branch: form.branch,
      p_trn: form.trn.trim(),
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    if (!data?.ok) {
      setError(
        data?.reason === "exists"
          ? "An account with this email already exists â€” please sign in instead."
          : "We couldnâ€™t create your account. Please check your details and try again.",
      );
      setBusy(false);
      return;
    }
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });
    if (signErr) {
      setError(signErr.message);
      setBusy(false);
      return;
    }
    // Fire-and-forget: register the new customer in the Sethwan warehouse.
    // Never awaited â€” a failure here must never block or break the sign-in flow.
    fetch("/api/warehouse/push-customer", { method: "POST" }).catch(() => {});
    router.push("/customer");
    router.refresh();
  }

  // Step 1 â€” figure out if this is a new customer, a returning (imported) one, or already active.
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Explicit validation â€” covers trimmed-empty values that HTML `required` misses.
    if (!form.fullName.trim()) { setError("Full name is required."); return; }
    if (!form.email.trim()) { setError("Email address is required."); return; }
    if (!form.phone.trim()) { setError("Phone number is required."); return; }
    if (!form.address.trim()) { setError("Delivery address is required."); return; }
    if (!form.trn.trim()) { setError("TRN is required."); return; }
    if (!form.password) { setError("Password is required."); return; }
    if (!form.confirmPassword) { setError("Please confirm your password."); return; }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("st_signup_match", {
      p_email: form.email.trim(),
      p_phone: form.phone.trim(),
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    const status: string = data?.status;
    if (status === "new") {
      await createNew();
      return;
    }
    if (status === "active") {
      setStage("exists");
      setBusy(false);
      return;
    }
    if (status === "match") {
      setFound({ name: data.name, mailbox: data.mailbox });
      setStage("confirm");
      setBusy(false);
      return;
    }
    // phone_mismatch
    setError(
      "An account with this email already exists, but the phone number doesnâ€™t match our records. Double-check your number â€” or contact us if this account is yours.",
    );
    setBusy(false);
  }

  // Returning customer confirmed it's them â€” claim their existing record + sign in.
  async function confirmClaim() {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("st_smart_claim", {
      p_email: form.email.trim(),
      p_password: form.password,
      p_phone: form.phone.trim(),
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    if (!data?.ok) {
      setError(
        data?.reason === "phone_mismatch"
          ? "That phone number doesnâ€™t match our records."
          : data?.reason === "already_active"
          ? "This account is already active â€” please sign in instead."
          : "We couldnâ€™t finish setting up your account. Please try again.",
      );
      setBusy(false);
      return;
    }
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });
    if (signErr) {
      setError(signErr.message);
      setBusy(false);
      return;
    }
    // Push the claimed (imported) customer to all warehouses, same as a new signup.
    fetch("/api/warehouse/push-customer", { method: "POST" }).catch(() => {});
    router.push("/customer");
    router.refresh();
  }

  const errorBox = error && (
    <div style={{ fontSize: 13, color: "var(--danger)", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: 10, padding: "10px 12px" }}>
      {error}
    </div>
  );

  // â”€â”€ Already-active account â”€â”€
  if (stage === "exists") {
    return (
      <div style={{ textAlign: "center" }}>
        <UserCheck size={40} color="var(--brand)" style={{ margin: "4px auto 14px" }} />
        <h1 style={{ margin: "0 0 8px", fontSize: 21, fontWeight: 800, color: "var(--forest)" }}>You already have an account</h1>
        <p style={{ margin: "0 0 18px", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>
          An active account already exists for <strong>{form.email.trim()}</strong>. Just sign in with your password.
        </p>
        <Link href="/auth/sign-in" className="btn btn-primary" style={{ padding: 12, width: "100%", justifyContent: "center" }}>
          Go to sign in
        </Link>
      </div>
    );
  }

  // â”€â”€ Returning customer â€” confirm it's them â”€â”€
  if (stage === "confirm" && found) {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <UserCheck size={38} color="var(--brand)" style={{ margin: "2px auto 12px" }} />
          <h1 style={{ margin: "0 0 6px", fontSize: 21, fontWeight: 800, color: "var(--forest)" }}>We found your account</h1>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>
            Youâ€™re already a Solid Trust customer. Confirm itâ€™s you and weâ€™ll link this login to your existing mailbox and packages.
          </p>
        </div>
        <div style={{ background: "var(--brand-soft, #f0f7f0)", border: "1px solid rgba(7,129,10,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--forest)" }}>{found.name || "Your account"}</div>
          {found.mailbox && (
            <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 2, fontFamily: "var(--font-mono)" }}>Mailbox {found.mailbox}</div>
          )}
          <div style={{ fontSize: 12.5, color: "var(--fg-3)", marginTop: 6 }}>{form.email.trim()} Â· {form.phone.trim()}</div>
        </div>
        {errorBox}
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <button onClick={confirmClaim} disabled={busy} className="btn btn-primary" style={{ padding: 12, justifyContent: "center" }}>
            {busy ? <Loader2 size={16} className="spin" /> : "Yes, thatâ€™s me â€” set my password"}
          </button>
          <button onClick={() => { setStage("form"); setFound(null); setError(null); }} className="btn btn-outline" style={{ padding: 11, justifyContent: "center" }}>
            Not me / go back
          </button>
        </div>
      </div>
    );
  }

  // â”€â”€ Sign-up form â”€â”€
  return (
    <>
      <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "var(--forest)" }}>Create your account</h1>
      <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "var(--fg-3)" }}>
        Get your free Miami shipping address and track every package. Already a customer? We'll recognize you.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
        <div>
          <label className="label">Full name</label>
          <input className="input" required value={form.fullName} onChange={set("fullName")} onBlur={() => touch("fullName")} placeholder="Jane Brown" style={fieldErr("fullName") ? { borderColor: "var(--danger,#dc2626)", boxShadow: "0 0 0 2px rgba(220,38,38,0.15)" } : {}} />
          {errMsg("fullName", "Full name")}
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" autoComplete="email" required value={form.email} onChange={set("email")} onBlur={() => touch("email")} placeholder="you@email.com" style={fieldErr("email") ? { borderColor: "var(--danger,#dc2626)", boxShadow: "0 0 0 2px rgba(220,38,38,0.15)" } : {}} />
          {errMsg("email", "Email")}
        </div>
        <div>
          <label className="label">Phone number</label>
          <input className="input" type="tel" autoComplete="tel" required value={form.phone} onChange={set("phone")} onBlur={() => touch("phone")} placeholder="876-000-0000" style={fieldErr("phone") ? { borderColor: "var(--danger,#dc2626)", boxShadow: "0 0 0 2px rgba(220,38,38,0.15)" } : {}} />
          {errMsg("phone", "Phone number")}
        </div>
        <div>
          <label className="label">Delivery address</label>
          <textarea className="input" required rows={2} value={form.address} onChange={set("address")} onBlur={() => touch("address")} placeholder="Street, town, parish" style={{ resize: "vertical", minHeight: 44, ...(fieldErr("address") ? { borderColor: "var(--danger,#dc2626)", boxShadow: "0 0 0 2px rgba(220,38,38,0.15)" } : {}) }} />
          {errMsg("address", "Delivery address")}
        </div>
        <div className="split-2-even" style={{ gap: 12 }}>
          <div>
            <label className="label">Branch</label>
            <select className="input" value={form.branch} onChange={set("branch")}>
              {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="label">TRN</label>
            <input className="input" required value={form.trn} onChange={set("trn")} onBlur={() => touch("trn")} placeholder="000-000-000" style={fieldErr("trn") ? { borderColor: "var(--danger,#dc2626)", boxShadow: "0 0 0 2px rgba(220,38,38,0.15)" } : {}} />
            {errMsg("trn", "TRN")}
          </div>
        </div>
        <div className="split-2-even" style={{ gap: 12 }}>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" autoComplete="new-password" required value={form.password} onChange={set("password")} onBlur={() => touch("password")} placeholder="At least 8 characters" style={fieldErr("password") ? { borderColor: "var(--danger,#dc2626)", boxShadow: "0 0 0 2px rgba(220,38,38,0.15)" } : {}} />
            {errMsg("password", "Password")}
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input className="input" type="password" autoComplete="new-password" required value={form.confirmPassword} onChange={set("confirmPassword")} onBlur={() => touch("confirmPassword")} placeholder="Re-enter password" style={fieldErr("confirmPassword") ? { borderColor: "var(--danger,#dc2626)", boxShadow: "0 0 0 2px rgba(220,38,38,0.15)" } : {}} />
            {errMsg("confirmPassword", "Confirm password")}
          </div>
        </div>

        {errorBox}

        <button type="submit" className="btn btn-primary" disabled={busy} style={{ padding: 12, marginTop: 2 }}>
          {busy ? <Loader2 size={16} className="spin" /> : "Create account"}
        </button>
      </form>

      <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 13.5, color: "var(--fg-3)", textAlign: "center" }}>
        Already set up?{" "}
        <Link href="/auth/sign-in" style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
          Sign in
        </Link>
      </div>
    </>
  );
}





