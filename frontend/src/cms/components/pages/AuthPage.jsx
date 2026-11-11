import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Moon,
  Sun,
} from "lucide-react";

import PasswordInput from "@cms/components/PasswordInput.jsx";
import LanguageSwitcher from "@/shared/components/LanguageSwitcher.jsx";
import { navigateCms } from "@cms/navigation.js";

function navigate(path) {
  navigateCms(path);
}

function getLoginDestination(value) {
  if (!value || !value.startsWith("/dashboard") || value.startsWith("//")) return "/dashboard";
  return value;
}

function AuthPage({ auth, content, language, theme, themeLabel, companyName, brandIcon, onThemeToggle, onLanguageChange }) {
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
  const [error, setError] = useState(null);
  const errorMessage = error?.type === "invalidCredentials"
    ? content.invalid
    : error?.message;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      if (mode === "forgot") {
        const response = await auth.forgotPassword({
          email: form.get("email"),
        });
        setMessage(content.resetSent || response.message);
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
        });
        const destination = session.user.role === "super_user"
          ? "/dashboard/super"
          : getLoginDestination(params.get("redirect"));
        navigateCms(destination, { replace: true });
      }
    } catch (requestError) {
      const validationMessage = Object.values(requestError.details || {})[0]?.[0];
      const isCredentialFailure =
        mode === "login" &&
        requestError.code === "validation" &&
        validationMessage === "The provided credentials are incorrect.";

      setError(
        isCredentialFailure
          ? { type: "invalidCredentials" }
          : { message: validationMessage || requestError.message || content.invalid },
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
          <form className="mt-7 grid gap-5 text-start" onSubmit={submit}>
            <EmailField content={content} />
            {errorMessage && <ErrorMessage message={errorMessage} />}
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
            {errorMessage && <ErrorMessage message={errorMessage} />}
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
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-slate-200 bg-cover bg-center bg-no-repeat p-3 text-admin-heading dark:bg-background sm:p-6" style={{ backgroundImage: "url('/assets/images/herobg.png')" }}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-transparent dark:bg-slate-950/80" />
      <section className="relative z-10 flex w-full max-w-md overflow-hidden rounded-[1.75rem] border border-admin-border bg-admin-card/95 shadow-[0_26px_80px_rgba(36,32,27,.15)] backdrop-blur-xl">
        <div className="relative flex w-full flex-col justify-center p-4">
          <header dir={language === "en" ? "ltr" : "rtl"} className="flex items-center justify-between gap-3">
            <a href="/" className="inline-flex min-w-0 items-center gap-2 text-xs text-admin-muted hover:text-admin-brand-text">
              <ArrowRight size={15} />
              <span className="truncate">{content.backToWebsite || "Back to website"}</span>
            </a>
            <div className="flex shrink-0 items-center gap-2">
              <LanguageSwitcher language={language} onChange={onLanguageChange} />
              <button type="button" aria-label={themeLabel || "Change theme"} aria-pressed={theme === "dark"} onClick={onThemeToggle} className="grid size-10 shrink-0 place-items-center rounded-xl border border-(--header-control-border) bg-(--header-control) text-admin-muted outline-none transition hover:border-admin-brand hover:bg-(--header-control-hover) hover:text-admin-heading focus:outline-none focus-visible:border-admin-brand focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--admin-brand)_28%,transparent)]">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </header>
          <div className="mt-4 rounded-3xl bg-admin-card/70 px-2 py-4 sm:px-8">
            <div className="text-center">
              <img src={brandIcon} alt={companyName} className="mx-auto size-20 rounded-full border-4 border-admin-card bg-admin-brand-soft object-contain p-2 shadow-xl" />
              <h2 className="mt-2 font-heading text-lg" dir={language === "en" ? "ltr" : "rtl"}>{companyName}</h2>
            </div>
            <form className="mt-7 grid gap-2" onSubmit={submit}>
              <EmailField content={content} />
              <PasswordField
                name="password"
                label={content.password}
                content={content}
                current
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="!text-[12px] font-semibold leading-none text-admin-brand-text transition-colors hover:text-admin-heading hover:underline"
                  onClick={() => navigate("/dashboard/forgot-password")}
                >
                  {content.forgotPassword}
                </button>
              </div>
              {errorMessage && <ErrorMessage message={errorMessage} />}
              <SubmitButton
              busy={submitting}
              label={content.signIn}
              busyLabel={content.signingIn}
              arrow
              className="mt-2"
              />
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function RecoveryShell({ icon: Icon, title, children }) {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden bg-slate-200 bg-cover bg-center bg-no-repeat px-5 py-12 text-admin-heading dark:bg-background" style={{ backgroundImage: "url('/assets/images/herobg.png')" }}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-transparent dark:bg-slate-950/80" />
      <section className="relative z-10 w-full max-w-md rounded-3xl border border-admin-border bg-admin-card p-7 text-center shadow-[0_28px_80px_rgba(15,23,42,.14)] sm:p-9">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-admin-brand-soft text-admin-brand-text">
          <Icon size={22} />
        </span>
        <h1 className="mt-2 font-heading text-3xl">{title}</h1>
        {children}
      </section>
    </main>
  );
}
function EmailField({ content }) {
  return (
    <label className="grid gap-2 text-xs font-semibold">
      <span>{content.email}</span>
      <span className="relative block overflow-hidden rounded-xl border border-admin-border bg-slate-100 dark:bg-admin-control">
        <Mail
          className="absolute start-4 top-1/2 -translate-y-1/2 text-admin-muted"
          size={16}
        />
        <input
          className="min-h-10 w-full bg-transparent ps-11 pe-4 text-sm outline-none"
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
        className="min-h-10 rounded-xl border border-admin-border bg-slate-100 dark:bg-admin-control"
        name={name}
        startIcon={LockKeyhole}
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
      className="mt-7 flex gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300"
      role="status"
    >
      <CheckCircle2 size={18} />
      {message}
    </p>
  );
}
function SubmitButton({ busy, label, busyLabel, arrow, className = "" }) {
  return (
    <button
      className={`group min-h-11 rounded-xl bg-admin-brand px-4 text-sm font-semibold text-white shadow-[0_12px_28px_color-mix(in_srgb,var(--admin-brand)_28%,transparent)] disabled:opacity-60 ${className}`}
      disabled={busy}
    >
      {busy ? (
        busyLabel
      ) : (
        <span className="inline-flex items-center gap-2">
          {label}
          {arrow && <ArrowLeft size={17} />}
        </span>
      )}
    </button>
  );
}
function BackButton({ content }) {
  return (
    <button
      type="button"
      className="mx-auto mt-6 inline-flex items-center justify-center gap-2 text-xs font-semibold text-admin-muted hover:text-admin-brand-text"
      onClick={() => navigate("/dashboard/login")}
    >
      <ArrowRight size={15} />
      {content.backToLogin}
    </button>
  );
}

export default AuthPage;
