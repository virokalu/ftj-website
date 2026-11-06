"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AccentDivider } from "@/components/ui/accent-divider";

type FormLabels = {
  heading: string;
  close: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  website: string;
  submit: string;
  privacyNotice: string;
  privacyLink: string;
  errors: {
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    tooShort: string;
    tooLong: string;
  };
  states: {
    submitting: string;
    success: string;
    generalError: string;
    networkError: string;
  };
};

type Values = {
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY_VALUES: Values = { name: "", email: "", phone: "", country: "", message: "" };

const PHONE_PATTERN = /^[0-9+() .-]{5,40}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values, errors: FormLabels["errors"]): Errors {
  const next: Errors = {};

  const name = values.name.trim();
  if (!name) next.name = errors.required;
  else if (name.length > 100) next.name = errors.tooLong;

  const email = values.email.trim();
  if (!email) next.email = errors.required;
  else if (email.length > 150) next.email = errors.tooLong;
  else if (!EMAIL_PATTERN.test(email)) next.email = errors.invalidEmail;

  const phone = values.phone.trim();
  if (phone && !PHONE_PATTERN.test(phone)) next.phone = errors.invalidPhone;

  const country = values.country.trim();
  if (!country) next.country = errors.required;
  else if (country.length < 2 || country.length > 60) next.country = errors.tooShort;

  const message = values.message.trim();
  if (!message || message.length < 10) next.message = errors.tooShort;
  else if (message.length > 2000) next.message = errors.tooLong;

  return next;
}

type Status = "idle" | "submitting" | "success" | "generalError" | "networkError";

export function RequestCallSection({
  triggerLabel,
  labels,
}: {
  triggerLabel: string;
  labels: FormLabels;
}) {
  const searchParams = useSearchParams();
  const vehicleSlug = searchParams.get("vehicle") ?? undefined;
  // Links that just want the form open (no vehicle context), e.g. FAQ's
  // "Get in touch", use /contact?openForm=1 instead of a ?vehicle= slug.
  const openForm = searchParams.get("openForm") === "1";

  const [open, setOpen] = useState(() => Boolean(vehicleSlug) || openForm);
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    // Lock the page behind the overlay so a scroll gesture over the panel
    // can't chain up and scroll the page once the panel has no more room to
    // scroll. The scrolling box is <html>, not <body>, in this layout, so
    // both need locking. data-lenis-prevent (below) only stops Lenis from
    // hijacking the gesture — it doesn't stop native scroll-chaining, which
    // is why this lock is still needed on top of it.
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("input")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  function updateField(field: keyof Values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const fieldErrors = validate(values, labels.errors);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const firstField = (Object.keys(fieldErrors) as Array<keyof Values>)[0];
      panelRef.current?.querySelector<HTMLElement>(`#request-call-${firstField}`)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || undefined,
          country: values.country.trim(),
          message: values.message.trim(),
          vehicle: vehicleSlug,
          website: honeypot,
        }),
      });

      if (response.status === 202) {
        setStatus("success");
        setValues(EMPTY_VALUES);
        return;
      }

      if (response.status === 400) {
        const data = await response.json().catch(() => ({}));
        if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
          setErrors(data.fieldErrors);
          setStatus("idle");
        } else {
          setStatus("generalError");
        }
        return;
      }

      setStatus("generalError");
    } catch {
      setStatus("networkError");
    }
  }

  function close() {
    setOpen(false);
    if (status !== "success") setStatus("idle");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group inline-flex items-center gap-4 text-sm font-semibold tracking-[0.2em] text-foreground-muted uppercase transition-[color,scale] duration-300 ease-out hover:text-foreground motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.97]"
      >
        {triggerLabel}
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-accent text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <path
              d="M1 5h8m0 0L5.5 1.5M9 5 5.5 8.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Same overlay language as the menu (site-nav.tsx): a translucent
          panel slides in from the left, the page stays visible-but-dimmed
          behind it. */}
      <div
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label={labels.heading}
        className={`fixed inset-0 z-[70] bg-ink/55 transition-opacity duration-500 ease-out ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      >
        <div
          ref={panelRef}
          data-lenis-prevent
          onClick={(event) => event.stopPropagation()}
          className={`scrollbar-glass relative flex h-full w-full flex-col overflow-y-auto bg-ink/90 backdrop-blur-sm transition-transform duration-500 ease-out sm:w-[60%] md:w-[48%] lg:w-[42%] ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-2 px-12 pt-10 sm:px-24 sm:pt-12 lg:px-40 lg:pt-16">
            <button
              type="button"
              onClick={close}
              className="flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:text-accent"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {labels.close}
            </button>
          </div>

          <div className="px-12 py-10 sm:px-24 lg:px-40">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{labels.heading}</h2>

            {status === "success" ? (
              <p
                role="status"
                className="mt-8 animate-in text-sm text-foreground-muted duration-500 fade-in slide-in-from-bottom-2"
              >
                {labels.states.success}
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="relative mt-10 flex flex-col gap-10">
                {/* Honeypot: off-screen, not display:none, not type=hidden, so bots
                    that auto-fill every input still trip it (section 7 of the
                    integration doc). Real users never see or reach it. */}
                <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="request-call-website">{labels.website}</label>
                  <input
                    id="request-call-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                </div>

                <Field
                  id="request-call-name"
                  label={labels.name}
                  value={values.name}
                  onChange={(value) => updateField("name", value)}
                  error={errors.name}
                  autoComplete="name"
                  open={open}
                  index={0}
                />
                <Field
                  id="request-call-email"
                  label={labels.email}
                  type="email"
                  value={values.email}
                  onChange={(value) => updateField("email", value)}
                  error={errors.email}
                  autoComplete="email"
                  open={open}
                  index={1}
                />
                <Field
                  id="request-call-phone"
                  label={labels.phone}
                  type="tel"
                  value={values.phone}
                  onChange={(value) => updateField("phone", value)}
                  error={errors.phone}
                  autoComplete="tel"
                  open={open}
                  index={2}
                />
                <Field
                  id="request-call-country"
                  label={labels.country}
                  value={values.country}
                  onChange={(value) => updateField("country", value)}
                  error={errors.country}
                  autoComplete="country-name"
                  open={open}
                  index={3}
                />
                <Field
                  id="request-call-message"
                  label={labels.message}
                  value={values.message}
                  onChange={(value) => updateField("message", value)}
                  error={errors.message}
                  multiline
                  open={open}
                  index={4}
                />

                {(status === "generalError" || status === "networkError") && (
                  <p role="alert" className="animate-in text-sm text-accent duration-300 fade-in slide-in-from-bottom-1">
                    {status === "generalError" ? labels.states.generalError : labels.states.networkError}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-5">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    aria-busy={status === "submitting"}
                    className="group flex items-center gap-5 text-sm font-semibold tracking-[0.2em] text-foreground uppercase transition-[color,opacity,scale] duration-300 ease-out hover:text-accent disabled:opacity-50 motion-safe:enabled:hover:scale-[1.03] motion-safe:enabled:active:scale-[0.97]"
                  >
                    {status === "submitting" ? labels.states.submitting : labels.submit}
                    <span
                      aria-hidden="true"
                      className="flex h-13 w-13 items-center justify-center rounded-full border border-accent text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white"
                    >
                      <svg width="16" height="16" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1 5h8m0 0L5.5 1.5M9 5 5.5 8.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>

                <AccentDivider className="mt-2" />
                <p className="text-[11px] tracking-wide text-foreground-muted">
                  {labels.privacyNotice}{" "}
                  <Link href="/privacy" className="underline transition-colors hover:text-accent">
                    {labels.privacyLink}
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  multiline = false,
  open,
  index,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  open: boolean;
  index: number;
}) {
  const sharedClassName =
    "mt-2 w-full border-b border-accent/50 bg-transparent pb-2 text-foreground outline-none transition-colors focus:border-accent";

  return (
    <div
      style={{
        transition: `opacity 600ms ease-out ${open ? 200 + index * 90 : 0}ms, translate 600ms ease-out ${
          open ? 200 + index * 90 : 0
        }ms`,
      }}
      className={open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}
    >
      <label htmlFor={id} className="text-xs font-medium tracking-[0.15em] text-foreground-muted uppercase">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          rows={3}
          className={`${sharedClassName} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete={autoComplete}
          className={sharedClassName}
        />
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
