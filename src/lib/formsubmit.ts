// Mirror form submissions to the brand inbox via FormSubmit.co
export async function mirrorToInbox(subject: string, payload: Record<string, unknown>) {
  try {
    await fetch("https://formsubmit.co/ajax/info@worldwidecargotransit.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: subject, ...payload }),
    });
  } catch {
    // best-effort; the DB insert is the source of truth
  }
}