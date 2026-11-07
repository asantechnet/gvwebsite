import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import PasswordInput from "@cms/components/PasswordInput.jsx";

function navigate(path) {
  window.location.assign(path);
}

function AuthPage({ auth, content }) {
  const params = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname;
  const mode = pathname.endsWith("/forgot-password")
    ? "forgot"
    : pathname.endsWith("/reset-password")
      ? "reset"
      : "login";
  const hasResetLink = Boolean(params.get("token") && params.get("email"));
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      if (mode === "forgot") {
        const response = await auth.forgotPassword({
          email: form.get("email"),
        });
        setMessage(response.message || content.resetSent);
      } else if (mode === "reset") {
        await auth.resetPassword({
          token: params.get("token"),
          email: params.get("email"),
          password: form.get("password"),
          confirmPassword: form.get("password_confirmation"),
        });
        setComplete(true);
      } else {
        const session = await auth.login({
          email: form.get("email"),
          password: form.get("password"),
          remember: form.get("remember") === "on",
        });
        window.location.replace(
          session.user.role === "super_user"
            ? "/dashboard/super"
            : "/dashboard",
        );
      }
    } catch (requestError) {
      setError(
        Object.values(requestError.details || {})[0]?.[0] ||
          requestError.message ||
          content.invalid,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === "forgot")
    return (
      <RecoveryShell
        icon={Mail}
        eyebrow={content.recovery || "Account recovery"}
        title={content.resetPassword}
        description={
          content.forgotDescription ||
          "Enter your account email and we will send a secure reset link."
        }
      >
        {message ? (
          <Status message={message} />
        ) : (
          <form className="mt-7 grid gap-5" onSubmit={submit}>
            <EmailField content={content} />
            {error && <ErrorMessage message={error} />}
            <SubmitButton
              busy={submitting}
              label={content.sendReset}
              busyLabel={content.sending || "Sending…"}
            />
          </form>
        )}
        <BackButton content={content} />
      </RecoveryShell>
    );

  if (mode === "reset")
    return (
      <RecoveryShell
        icon={LockKeyhole}
        eyebrow={content.recovery || "Account recovery"}
        title={
          complete
            ? content.resetComplete || "Password reset"
            : content.choosePassword || content.resetPassword
        }
        description={
          complete
            ? content.resetCompleteDescription ||
              "Your new password is ready. Previously active sessions have been signed out."
            : content.passwordRules ||
              "Use at least 12 characters with uppercase and lowercase letters and numbers."
        }
      >
        {!hasResetLink ? (
          <>
            <ErrorMessage
              message={
                content.resetLinkRequired ||
                "This reset link is incomplete or expired."
              }
            />
            <button
              type="button"
              onClick={() => navigate("/dashboard/forgot-password")}
              className="mt-5 min-h-11 rounded-xl bg-admin-brand px-4 text-sm font-semibold text-white"
            >
              {content.requestNewLink || content.sendReset}
            </button>
          </>
        ) : complete ? (
          <>
            <Status
              message={
                content.resetCompleteDescription ||
                "Your password was reset successfully."
              }
            />
            <BackButton content={content} />
          </>
        ) : (
          <form className="mt-7 grid gap-5" onSubmit={submit}>
            <PasswordField
              name="password"
              label={content.newPassword || content.password}
              content={content}
              autoFocus
            />
            <PasswordField
              name="password_confirmation"
              label={content.confirmPassword}
              content={content}
            />
            {error && <ErrorMessage message={error} />}
            <SubmitButton
              busy={submitting}
              label={content.resetPassword}
              busyLabel={content.resetting || "Resetting…"}
            />
          </form>
        )}
      </RecoveryShell>
    );

  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-background p-3 text-admin-heading sm:p-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-e-20 -top-24 -z-10 size-64 rounded-full bg-brand-orange/15 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -inset-s-20 -z-10 size-64 rounded-full bg-brand-red/10 blur-3xl"
      />
      <section className="relative z-10 flex w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-admin-border bg-admin-card/95 shadow-[0_26px_80px_rgba(36,32,27,.15)] backdrop-blur-xl">
        <div className="relative flex w-full flex-col justify-center px-6 py-8 sm:px-10">
          <a
            href="/"
            className="absolute inset-s-6 top-5 inline-flex items-center gap-2 text-xs text-admin-muted hover:text-admin-brand-text"
          >
            <ArrowLeft size={15} />
            {content.backToWebsite || "Back to website"}
          </a>
          <div className="mt-10 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full border-4 border-admin-card bg-admin-brand-soft text-admin-brand-text shadow-xl">
              <UserRound size={32} />
            </span>
            <h2 className="mt-4 font-heading text-lg">Global Vision</h2>
            <p className="mt-2 text-sm text-admin-muted">
              {content.unauthenticated}
            </p>
          </div>
          <form className="mt-7 grid gap-4" onSubmit={submit}>
            <EmailField content={content} />
            <PasswordField
              name="password"
              label={content.password}
              content={content}
              current
            />
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-xs text-admin-muted">
                <input
                  className="size-4 accent-admin-brand"
                  type="checkbox"
                  name="remember"
                />
                {content.remember || "Keep me signed in"}
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-admin-brand-text"
                onClick={() => navigate("/dashboard/forgot-password")}
              >
                {content.forgotPassword}
              </button>
            </div>
            {error && <ErrorMessage message={error} />}
            <SubmitButton
              busy={submitting}
              label={content.signIn}
              busyLabel={content.signingIn}
              arrow
            />
          </form>
        </div>
      </section>
    </main>
  );
}

function RecoveryShell({ icon: Icon, eyebrow, title, description, children }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-admin-page px-5 py-12 text-admin-heading">
      <section className="w-full max-w-md rounded-3xl border border-admin-border bg-admin-card p-7 shadow-[0_28px_80px_rgba(15,23,42,.14)] sm:p-9">
        <span className="grid size-12 place-items-center rounded-2xl bg-admin-brand-soft text-admin-brand-text">
          <Icon size={22} />
        </span>
        <p className="mt-6 text-xs font-semibold tracking-widest text-admin-brand-text uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-admin-muted">{description}</p>
        {children}
      </section>
    </main>
  );
}
function EmailField({ content }) {
  return (
    <label className="grid gap-2 text-xs font-semibold">
      <span>{content.email}</span>
      <span className="relative block overflow-hidden rounded-xl border border-admin-border bg-admin-control">
        <Mail
          className="absolute start-s-4 top-1/2 -translate-y-1/2 text-admin-muted"
          size={16}
        />
        <input
          className="min-h-12 w-full bg-transparent ps-11 pe-4 text-sm outline-none"
          type="email"
          name="email"
          autoComplete="email"
          required
          autoFocus
        />
      </span>
    </label>
  );
}
function PasswordField({ name, label, content, autoFocus, current = false }) {
  return (
    <label className="grid gap-2 text-xs font-semibold">
      <span>{label}</span>
      <PasswordInput
        className="min-h-12 rounded-xl border border-admin-border bg-admin-control"
        name={name}
        autoComplete={current ? "current-password" : "new-password"}
        minLength={current ? undefined : 12}
        required
        autoFocus={autoFocus}
        showLabel={content.showPassword || "Show password"}
        hideLabel={content.hidePassword || "Hide password"}
      />
    </label>
  );
}
function ErrorMessage({ message }) {
  return (
    <p
      className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-xs text-red-600"
      role="alert"
    >
      {message}
    </p>
  );
}
function Status({ message }) {
  return (
    <p
      className="mt-7 flex gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-700"
      role="status"
    >
      <CheckCircle2 size={18} />
      {message}
    </p>
  );
}
function SubmitButton({ busy, label, busyLabel, arrow }) {
  return (
    <button
      className="group min-h-11 rounded-xl bg-admin-brand px-4 text-sm font-semibold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--admin-brand)_28%,transparent)] disabled:opacity-60"
      disabled={busy}
    >
      {busy ? (
        busyLabel
      ) : (
        <span className="inline-flex items-center gap-2">
          {label}
          {arrow && <ArrowRight size={17} />}
        </span>
      )}
    </button>
  );
}
function BackButton({ content }) {
  return (
    <button
      type="button"
      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-admin-muted hover:text-admin-brand-text"
      onClick={() => navigate("/dashboard/login")}
    >
      <ArrowLeft size={15} />
      {content.backToLogin}
    </button>
  );
}

export default AuthPage;
