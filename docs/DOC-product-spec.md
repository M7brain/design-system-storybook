# Quicklo — Product Specification

> **Status:** Live reference. This document is the authority for product scope, features, UX, pricing, and competitive positioning. Update it when any feature moves between versions, when pricing changes, or when the onboarding flow changes. The HTML source (`DOC-product-spec.html`) is retained as an archive.
>
> **Sections:** What it does · Full workflow · Core features · Onboarding UX · Connections · Notifications · User dashboard · From competitors · Feature summary · Pricing · No-website clients

---

## 1. What the product does

### The core problem we solve

Studies consistently show that a lead contacted within 5 minutes of enquiring is 21× more likely to convert than one contacted after 30 minutes. For a plumber, dentist, or electrician — those leads are worth $200 to $5,000 each. The problem: the owner is on a job, in an appointment, or simply sleeping when the enquiry comes in. The form sits there. The lead moves on to the next business on Google. Our product solves exactly this — it responds in under 90 seconds, every time, whether it's 2pm or 2am.

### What the product is — in one sentence

An AI agent that lives on the business owner's website and responds to every enquiry within 90 seconds — in the owner's voice, referencing the customer's specific request — while the owner is busy doing their actual job.

### Who it helps and how

**Group A — businesses with a website + contact form**

Customer fills out the contact form → within 90 seconds they receive a personalised email + SMS from the owner. Reply feels like the owner wrote it personally — references the specific service they asked about, matches the business's tone. Owner gets a notification with the lead details and a link to the conversation. Never loses a lead to slow response again.

**Group B — businesses without a website (missed call)**

Customer calls, owner can't answer → within 60 seconds the caller receives an SMS: "Hi, this is [Business Name] — sorry I missed your call! I'm finishing a job. What can I help you with? I'll call you back within 2 hours." Owner gets notified with caller details. Available on the Business plan — Twilio number + call forwarding setup.

### The real value — in numbers

| Metric | Value | What it means |
|---|---|---|
| Conversion lift | 21× | More likely to convert if contacted within 5 minutes vs 30 minutes |
| Reply gap | 62% | Of contact form submissions get no reply within 24 hours |
| Our response time | <90 seconds | At 3am, weekends, and holidays — always |

---

## 2. Full workflow

### Complete workflow — from lead arrives to owner closes the job

**Step 0 — Customer fills out the contact form on the business website**

They type their name, email, phone number, and a message — "I need my HVAC serviced, it stopped working yesterday." They hit Submit. From this moment, our system takes over completely.

**Step 1 — Webhook fires instantly — job queued in milliseconds**

The form sends a POST request to the business's unique webhook URL (`yourplatform.com/webhook/abc123`). Our API receives it and immediately pushes a job to Upstash Redis queue. The form gets a 200 OK response instantly — no timeout, no spinner. From this point the 90-second clock starts.

**Step 2 — 5-agent AI pipeline fires in the background**

A background worker picks up the job and runs all five agents in sequence. Total time: 30–60 seconds. Each agent does one specific job — intake classifies the lead, context loads the business profile, writer drafts the messages, reviewer quality-checks them, delivery sends them.

**Step 3 — Lead receives a personalised SMS within 90 seconds**

SMS is sent first — 98% open rate, the customer is on their phone. Example for an HVAC lead:

> "Hi Sarah, it's Mike from Denver HVAC Pro — got your message about the unit that stopped working. Sounds urgent! I have a slot tomorrow morning at 9am or can squeeze you in this afternoon at 4. Which works better? — Mike"

It references the specific problem (stopped working), sounds exactly like Mike wrote it, and moves immediately toward booking. Not a generic "thanks for contacting us."

**Step 4 — Lead receives a personalised email (backup + more detail)**

Email arrives at the same time — slightly longer, same personal tone, includes the business's contact details and a link to book directly if they have a booking system connected. Email is the paper trail — customers who prefer email have it, SMS users already replied.

**Step 5 — Owner is notified immediately on their phone**

Owner gets an SMS or push notification: "New lead from Sarah — HVAC stopped working. We replied 47 seconds ago. Tap to see the conversation." They open the app or dashboard, see the full lead, the message sent, and the customer's reply if one came in already. They can reply directly from the dashboard or just call.

**Step 6 — Lead replies — conversation continues**

Customer replies to the SMS: "4pm works!" — this reply comes into the owner's dashboard as a new message in that lead's thread. The owner can reply manually from the dashboard, or if they have AI follow-up enabled, the system can respond to simple replies automatically (e.g. "Great, I'll confirm your 4pm booking shortly!" while the owner finishes their current job).

**Step 7 — 24h alert if lead goes cold**

If the customer received the follow-up but hasn't replied after 24 hours, the system flags it as "no response." Owner gets a notification: "Sarah from the HVAC enquiry hasn't replied in 24 hours — worth a follow-up call?" The lead stays in the dashboard with a "needs attention" badge until the owner takes action or marks it as closed.

**Step 8 — Lead appears in the full lead dashboard — full audit trail**

Every lead, every message sent, every reply, every timestamp — all visible in the dashboard. Owner can filter by status (new, replied, booked, closed, cold), see weekly trends, and know exactly how many leads came in vs how many converted.

### What happens if something fails

Zero silent failures — always a fallback:

- Twilio SMS fails → retry 3 times with exponential backoff (5s, 30s, 2min) → if all fail, send email only + alert owner that SMS delivery failed
- Resend email fails → same retry logic → if all fail, raw lead data emailed directly to owner as plain text fallback
- Claude API timeout → retry once → if fails, send a pre-written generic but professional fallback message, log for review
- Webhook receives malformed data → validated immediately on receipt, bad data rejected with 400 error, owner notified of a potentially broken form
- Every failure is logged in Supabase and visible in the owner's dashboard — they can see if a delivery failed

---

## 3. Core features

### Group A — web form lead follow-up

**Webhook integration — works with any form builder**

One unique webhook URL per business. Paste it into any form builder — Wix, Squarespace, WordPress/Gravity Forms, Typeform, Google Forms, Webflow, custom HTML. No developer needed. Most form builders have a "send to webhook" field built in. Setup time: under 5 minutes. Once connected, it works forever with zero maintenance.

**AI-personalised follow-up — email + SMS in the owner's voice**

The 5-agent pipeline generates messages that reference the customer's specific request, match the business's tone profile (set during onboarding), and sound like the owner wrote them personally. No templates, no generic "we received your enquiry" messages. Each response is unique to that lead.

**Business voice profile**

During onboarding the owner sets: business name, industry, services offered, preferred tone (casual/professional/friendly/formal), owner's first name, and any custom instructions ("always mention our 5-star rating", "never promise same-day service on weekends"). The AI uses this profile for every message. Owner can update it any time from settings.

### Group B — missed call SMS (Business plan)

**Dedicated Twilio number + call forwarding**

Owner gets a dedicated phone number. They forward their business number to it (2-minute phone setting, no tech required). When a call comes in and they can't answer: the caller hears the owner's custom greeting, the call is transcribed if a voicemail is left, and within 60 seconds the caller receives a personalised SMS. All missed-call leads appear in the same dashboard as web form leads.

### Lead management

**Unified lead inbox**

Every lead — web form or missed call — in one dashboard. Filterable by status (new, replied, booked, closed, cold) — a single-select `segmented` Tabs switch, since a lead is in exactly one status at a time — by date, by source (web/phone), and by urgency — the latter two are `FilterPill` (multi-select, dismissible; a lead can match more than one source/urgency filter at once, unlike status). Each lead shows the full conversation thread: original enquiry, AI response sent, customer replies, owner replies. One-click to reply from the dashboard via SMS or email.

**Lead status pipeline**

Simple kanban-style status: New → Contacted → Replied → Booked → Closed / Cold. Owner drags leads through stages or marks them with one click. Helps them see at a glance: how many new leads, how many are warm, how many need follow-up. Builds a habit of checking the dashboard daily.

**Manual reply from dashboard**

Owner can reply to any lead directly from the dashboard — sends as SMS or email. Threaded conversation view. They never need to switch to their phone or email client to handle leads that came through the platform.

### Notifications

**Instant, daily digest, and 24h cold lead alerts**

Three notification types — instant (new lead arrived + was followed up), daily digest (summary of all activity), and 24h cold lead alert (lead hasn't replied, needs attention). Owner chooses their preferred channel: SMS, email, or both. All configurable in settings. See section 6 for full detail.

### Analytics (Pro + Business plans)

- Leads received this week vs last week (trend chart)
- Response time average (our system vs before they joined)
- Lead-to-reply rate: what % of leads replied to the AI follow-up
- Most common enquiry types (based on AI classification)
- Best day / hour for leads arriving
- Cold leads: how many leads never converted

### Settings and customisation

**Business profile and tone settings**

Owner sets: business name, industry, services, tone, owner name, phone number. These feed the AI for every message. Editable any time — changes apply to all future messages.

Owner can also optionally upload a profile photo (a photo of themselves) or a business logo. Whichever is uploaded is shown as their avatar across the dashboard — Sidebar, TopHeader, and anywhere else the owner's identity appears. Both are optional; if neither is uploaded, the dashboard shows an initials monogram derived from the owner's name instead. The avatar is always a circle: a square personal photo fills it edge to edge, while a wide or non-square business logo is shown whole, centred, rather than cropped to fill the circle.

**Auto-reply toggle**

Owner can pause AI responses any time (e.g. they're available and want to handle enquiries personally for a day) and resume with one click. When paused, they still get instant notifications — just no AI follow-up is sent.

**Business hours setting**

Optional: owner can set business hours. Outside hours, the AI message changes tone: "Hi Sarah, it's Mike — just saw your message come in. We're closed right now but I'll call you first thing in the morning. To give you a head start, can you tell me..." — honest about timing, still keeps the lead warm.

**Webhook management**

Owner sees all their webhooks, can create new ones, rename them (e.g. "Contact page form", "Quote request form"), regenerate the URL if needed, and see how many leads each webhook has received. Free plan: 1 webhook. Starter: 1. Pro: 3. Business: unlimited.

### Bug reporting (user-facing)

**Report an issue button — in every dashboard page footer**

One-click report: issue type dropdown, description, optional screenshot. Auto-attaches context (plan, page, browser, last 5 pipeline events). Owner gets a ticket number and a notification when it's resolved.

---

## 4. Onboarding UX

### Design principle

3 mandatory fields — everything else smart-defaulted or skippable. The owner should be live and connected in under 5 minutes. We ask only what the AI genuinely cannot function without. Everything else has a smart default based on their business type, or can be filled by AI from what they already told us. Settings are always available later for refinement.

### Step 1 — Account creation (30 seconds)

Email + password only. No name, no credit card, no phone number yet. Free plan, no commitment. One button: "Create free account."

### Step 2 — Business basics (90 seconds, 3 mandatory fields)

| # | Field | Status | Notes |
|---|---|---|---|
| 1 | Business name | Required | Cannot be smart-defaulted — used in every AI message |
| 2 | Business type | Required | Searchable dropdown (plumber, electrician, dentist, cleaner, gym, HVAC, lawyer, etc. + "Other" free text). Powers: default tone, industry-specific AI language, service area suggestions, smart defaults for everything below |
| 3 | Your first name | Required | So AI messages end with "— Mike" not "— The Team" |

> After these 3 fields the AI can already generate personalised messages. Everything below is optional refinement.

| # | Field | Status | Notes |
|---|---|---|---|
| 4 | Services you offer | Optional — AI can suggest | Free text. Button: "Let AI suggest based on my business type" — pre-fills common services for their category. If skipped: AI uses the business type to infer services |
| 5 | Communication tone | Optional — AI decides by default | Four tiles: Casual · Friendly · Professional · Formal, each with a one-sentence example. Plus a fifth tile: "Let AI decide" (default, pre-selected). Industry defaults: trades→Friendly, health→Professional, legal→Formal, gym→Casual |
| 6 | Phone number for notifications | Optional — add later | If added now: SMS notifications. If skipped: email only until added in Settings |

### Step 3 — Connect first source

The most important step — at least one connection required to go live. Three large illustrated tiles:

| Tile | Situation | Leads to |
|---|---|---|
| I have a website with a contact form | Website + form exists | Webhook or email forwarding |
| I get leads by phone — calls or texts | Phone-first business | Dedicated phone number |
| Both / not sure | Unsure | Setup wizard |

### Step 4 — Test lead (the magic moment)

Before they connect anything real, show them the product working. Pre-fill a fake lead based on their business type (a plumbing leak for a plumber, a toothache emergency for a dentist). Send it through the full pipeline. Within 90 seconds they get a real SMS. This is the moment they understand what they bought. Everything after this is logistics.

### What AI auto-populates from business type alone

- **Tone:** industry default (trades→Friendly, health→Professional, legal→Formal, gym→Casual, cleaning→Friendly)
- **Common services:** pre-filled suggestion list ready to accept or edit
- **Response time promise:** suggested default in AI messages ("I'll call you back within 2 hours" vs "I'll be in touch within 24 hours" — calibrated by industry)
- **Industry-specific language:** plumber AI knows plumbing terms, dentist AI knows dental terms — no configuration needed
- **Urgency detection:** industry-calibrated — "burst pipe" = emergency for plumber, "chipped tooth" = urgent for dentist, "gym enquiry" = normal

---

## 5. Connections

### Connection type 1 — Webhook (primary, recommended for all websites)

User gets a unique URL. They paste it into their website form's "send to webhook" field. Every form submission fires a POST request to our URL with the lead's data. Clean, instant, 100% reliable. Works on any modern form builder.

- **Works on:** WordPress/Gravity Forms, Webflow, Squarespace, Wix (via Zapier bridge), Typeform, Google Forms (via Zapier), Framer, custom HTML forms, any form with a webhook field
- **Setup time:** 2–5 minutes — copy URL, paste into form, done
- **Zero maintenance:** once connected, works indefinitely
- **Dashboard shows:** webhook URL, last received date, total leads received — owner knows it's working

> **When webhook isn't available:** some very simple website builders (basic GoDaddy sites, Jimdo, some older Wix templates) don't support webhooks. Fallback: email forwarding method below.

### Connection type 2 — Email forwarding (universal fallback)

Every contact form on any website can send an email notification when someone submits it. We give the owner a dedicated inbox address: `mike-abc123@leads.yourplatform.com`. They add this address as a CC or notification email in their form settings. Every submission email arrives at our address and we parse it for lead data.

- **Works on:** literally every website and every form builder — if it can send an email, it works
- **Setup time:** 3–5 minutes — add one email address to form notification settings
- **How we parse it:** email parser (built with Resend inbound or Mailgun routes) reads the notification email, extracts lead name, email, phone, message using AI — handles any format
- **Reliability:** slightly lower than webhook (email delivery has small delay and occasional bounce) but covers 100% of platforms that webhook can't

> **Important:** this is NOT the owner's personal inbox. This is a dedicated address we provide. Only form notification emails get forwarded there — by the owner's deliberate choice.

### Connection type 3 — Dedicated phone number (Business plan)

We assign the owner a dedicated Twilio phone number. They either forward their business line to it, or start giving it out as their primary business contact. Calls and texts to this number come to us — not their personal phone.

- **Missed calls:** caller hears custom voicemail greeting → voicemail transcribed → AI texts them back within 60 seconds
- **Incoming SMS:** classified by Intake Agent (lead vs non-lead) → leads get AI follow-up, non-leads flagged for manual review
- **Call forwarding setup:** we show them exactly how to set it on iPhone and Android — 2-minute process, no tech knowledge needed
- **The number becomes their business number:** put it on Google Maps, website, van, business card — the personal number stays private

> **Owner replies:** they reply to leads from the dashboard (sends as SMS from the Twilio number) — customer never sees it's a different number. Threaded conversation view.

### Connection dashboard (Settings → Connections)

Each connection type shows as a card with status indicator, leads received, and last activity. Owner can add, test, or remove connections at any time. Webhook / Email forwarding / Phone number are switched with `line` Tabs (an in-content section switch, not a filter — the owner is viewing one connection type at a time), and a connection type's Trigger carries the new compact `Chip` component in its optional trailing slot when that connection has a failed delivery to flag (e.g. a small error-tone "Failed" Chip on the Webhook tab — renamed from Badge 2026-07-08, since a full-size Badge read oversized at the tab's scale).

- **Webhook card:** URL shown (copyable), status (active/untested), leads received count, "Test webhook" button, setup guide link
- **Email forwarding card:** forwarding address shown (copyable), status, leads parsed, "Send test email" button, setup guide link
- **Phone number card:** Twilio number displayed, status, missed calls handled, "Test call" button, forwarding setup guide
- Any connection with no activity in 7 days shows a yellow warning: "No leads received recently — is your form still pointing to this webhook?"
- Any connection with a failed delivery shows a red badge with last error detail
- **Component boundary (2026-07-10):** this screen is `ConnectionCard` (Patterns phase), NOT the `Table` component — each connection type is a small, fixed set of cards with rich per-card status, not a row-per-record grid. See the boundary note in `docs/DOC-product-architecture.md`'s Table entry.

---

## 6. Notifications

### Design principle

The owner is on a job, hands dirty, phone in their pocket. Notifications must be actionable, concise, and never feel like noise. Every notification type can be individually toggled in settings. Default: all on. Owner adjusts to their preference after a few days of use.

### Notification type 1 — Instant new lead alert

**Fires:** every time a new lead arrives and is followed up. Always on by default.

Sent within 5 seconds of the AI reply being delivered to the lead. Owner gets this while still on a job — they know a lead came in and was handled.

SMS format:
> "LeadPing: New lead from Sarah K. — HVAC not working. We replied 47s ago. View: yourplatform.com/leads/123"

Email format:
> Subject: "New lead from Sarah K. — replied in 47 seconds"
>
> Sarah K. submitted an enquiry about HVAC service. We sent her a reply 47 seconds after submission.
>
> Her message: "My unit stopped working yesterday..."
>
> View lead and conversation →

### Notification type 2 — 24h cold lead alert

**Fires:** 24 hours after AI reply if lead has not responded. On by default.

The most valuable notification. A lead that received the AI reply but went quiet is a warm lead, not a lost one. This alert prompts the owner to take personal action.

> "LeadPing: Sarah K. from yesterday's HVAC enquiry hasn't replied yet. Worth a direct call? View: yourplatform.com/leads/123"

Owner taps the link, sees the conversation, can call directly or send a manual follow-up SMS from the dashboard. This single notification turns cold leads into booked jobs regularly.

### Notification type 3 — Daily digest

**Fires:** every morning at 8am (configurable). On by default.

A brief summary of the previous day's activity — keeps the owner in the loop without interrupting their day. Sent via email only (not SMS — too much for a daily).

Email format:
> Subject: "Yesterday's leads — 3 new, 2 replied, 1 needs attention"
>
> New leads: 3 | AI replies sent: 3 | Customer replies received: 2 | Needs attention: 1
>
> ⚠ Sarah K. (HVAC) — no reply in 24h — follow up →
> ✓ Tom R. (plumbing quote) — replied, conversation active
> ✓ Lisa M. (annual service) — replied, booked for Thursday
>
> View all leads →

### Notification type 4 — Customer reply alert

**Fires:** when a lead replies to the AI-sent SMS or email. On by default.

This is the handoff moment — the AI got the conversation started, now the owner takes over. The alert tells them a real human replied and is waiting.

> "LeadPing: Sarah K. replied — '4pm works great, what's your address?' View and reply: yourplatform.com/leads/123"

### Notification type 5 — Delivery failure alert

**Fires:** if SMS or email delivery fails after all retries. Always on — cannot be turned off.

The most critical alert — the system failed to reply to a lead. Owner must know immediately so they can follow up manually. Includes the raw lead data so they can act without opening the dashboard.

> "LeadPing ⚠ DELIVERY FAILED: Lead from James M. (roof repair) — SMS + email failed after 3 retries. Contact manually: james@email.com / 303-555-0198. View: yourplatform.com/leads/124"

### Notification type 6 — Weekly performance report

**Fires:** every Monday morning. Pro + Business plans only.

Email summary of the past week: leads received, reply rate, response time average, leads converted (marked as booked by owner), cold leads count, and a simple comparison to the previous week. Keeps the owner engaged with the product value — they see the numbers improving over time.

### Notification settings

- Each notification type has its own on/off toggle in Settings → Notifications
- Channel per type: SMS, email, or both
- Quiet hours: owner sets "no SMS notifications between 10pm and 7am" — delivery failure always overrides quiet hours
- Daily digest time: configurable (default 8am, their timezone)
- 24h cold lead threshold: configurable (12h, 24h, 48h — owner decides what "cold" means for their business)

### Not to be confused with in-app toasts

Everything above in this section — instant lead alert, 24h cold lead, daily digest, customer reply alert, delivery failure, weekly report, the "LeadPing…" copy — is an EXTERNAL notification sent via Twilio (SMS) or Resend (email) to reach the owner when they're away from the dashboard. None of it is the in-app Toast component (`src/components/ui/Toast/`); Toast never sends an SMS or email, and these external notifications never render as an in-app toast. The Notification-item pattern (Patterns phase) is a third, separate thing again — the row inside an in-dashboard notification centre, not a toast and not an SMS/email.

In-app toasts fire for immediate confirmation of something the owner just did IN the dashboard, and only ever success/error/info (never warning or neutral — see the Badge/Toast component specs in `docs/DOC-product-architecture.md`): Settings save ("Settings saved"), Connections (copying a webhook URL or email-forwarding address → "Copied"; the result of "Test webhook" / "Send test email" / "Test call"), Lead actions (mark booked, mark closed, add a private note, "Reply sent" after a manual reply), and toggling the AI pause switch. A failed delivery ALSO surfaces here as an error toast — that toast is additive, never the sole channel: the failure is always also visible on the lead's own row/thread and triggers the delivery-failure external notification above, so the owner never depends on catching a toast to learn about it.

### Where Alert appears (2026-07-07)

A fourth thing, alongside external notifications, in-app toasts, and the NotificationItem feed row: `Alert` (`src/components/ui/Alert/`) is a persistent, STANDING status message — it never auto-dismisses, unlike Toast, and it isn't a feed row, unlike NotificationItem. Use it for a condition that remains true until something changes, not a one-shot confirmation. Exact locations:

- **Settings → Connections** — an idle-connection warning (a webhook that's received nothing for 7+ days) and a failed-delivery error, both composed inside `ConnectionCard` rather than floated as a page-level banner.
- **AI paused** — a standing warning wherever the dashboard shows lead activity while the global AI pause (§4) is on, so the owner is never surprised that a lead went unanswered.
- **Billing** — a failed-payment error (persists until payment is fixed) and a plan-limit info/warning (e.g. approaching the monthly lead cap on Free/Starter) prompting an upgrade.
- **Long-form submit error summaries** — e.g. onboarding wizard steps, where a single Alert above the form lists what failed validation, rather than (or alongside) inline field errors.

**The three-way distinction, stated once for clarity:** Alert is standing/inline (in the page flow, stays until resolved or dismissed) · Toast is transient/floating (portal-rendered, auto-dismisses in 5s unless it's an error or carries an action) · NotificationItem (Patterns phase, not yet built) is a row inside the in-dashboard notification centre, representing history, not a live status. A single event can touch more than one: a failed delivery is an Alert-worthy standing condition on the connection AND fires a one-shot error Toast AND may later appear as a NotificationItem row — the three are complementary, not alternatives to pick one from.

---

## 7. User dashboard

### Responsive layout

Navigation adapts across three tiers: bottom navigation bar on mobile (< 600px), icon-only nav rail on tablet (600–1023px), full labelled sidebar on desktop (1024px+). The mobile experience is first-class — the Quicklo user (US service trade owner) checks their lead inbox primarily from a phone. All dashboard screens are designed mobile-first and must be fully functional at 390px.

### Main dashboard — overview

Stats row: Leads this week · Avg response time · Need attention

- Recent leads list (last 5) with status badges — tap any to open the lead thread
- Quick actions: "Add webhook", "Test lead", "View all leads"
- Onboarding checklist (disappears when complete)
- Plan usage bar: X of 50 leads used this month (free plan)

### Leads — the inbox

- Full list of all leads, newest first. Filterable by: status (`segmented` Tabs — All / New / Replied / Booked / Closed / Cold, single-select, since a lead has exactly one status), date range, source (web/phone) and group (A/B) — the latter two are `FilterPill` (multi-select/dismissible; a lead can be filtered by more than one source or group at once, so they stay chips, not a single-select tab switch)
- Each row: lead name (with an initials monogram avatar — leads have no photo, so this is always the Avatar component's initials fallback, never an image), a compact "Web" or "Phone" source label (`Chip variant="label"`, 2026-07-08 — a lead source is metadata, not a status, so it never uses Badge's tone language), enquiry summary (one line), time since received, AI reply status (sent/failed), response status (awaiting reply / replied / booked / cold)
- Status badges (Badge component): success/green = replied & booked · warning/amber = awaiting · error/red = needs attention (cold) · neutral/grey = new & closed
- List traversal uses the `load-more` `Pagination` variant (2026-07-09) — a single "Load more" button, not numbered pagination. Deliberate: this is a mobile-first, one-handed, dirty-hands product (an owner scrolling a filtered lead list between jobs), the filtered result sets are typically small, and "tap once for more" needs no page-number math or a second control to land a thumb on (see `docs/DECISIONS.md` for the full reasoning, including the Polaris mobile-infinite-scroll precedent and the WCAG 2.5.5 target-size angle). Contrast: the admin dashboard's desktop data tables (bug reports, users & plans, etc.) use the `table`/`numbered` `Pagination` variants instead — a desktop, mouse-driven, bounded-dataset context where jumping to an arbitrary page is the more useful shape.
- **Component boundary (2026-07-10):** the Leads inbox is a `LeadRow` list (Patterns phase), NOT the `Table` component — a lead row's density, avatar-forward layout, and load-more traversal are a different shape from Table's dense, sortable, selectable grid. See the boundary note in `docs/DOC-product-architecture.md`'s Table entry.
- Click any lead → opens the full conversation thread in a side panel or detail page
- Lead detail: original form submission, AI messages sent (email + SMS), customer replies, timestamps, delivery status, one-click reply box — sections are switched with `line` Tabs (an in-content section switch between distinct content areas, not a filter)
- Owner can: reply manually (SMS or email from dashboard), mark as booked, mark as closed, add a private note

### Settings

- Business profile (name, industry, services, tone, owner name)
- Webhook management (create, rename, regenerate, delete)
- Notification preferences (type toggles, channel, quiet hours, digest time)
- AI toggle (pause/resume auto-replies)
- Business hours (optional — changes AI message tone outside hours)
- Missed call setup (Business plan — Twilio number, forwarding instructions, greeting recording)
- Billing (current plan, usage, upgrade/downgrade, cancel) — invoice/payment history is a `Table` (2026-07-10, `selectable={false}`, `sortable` on the date column, `footer={<Pagination variant="table" />}`)

### Analytics (Pro + Business plans)

- Time range selector (`segmented` Tabs — e.g. 7 days / 30 days / 90 days, single-select) governs every chart below. A future count indicator on a tab or nav item (e.g. "3 leads need attention" on a Leads nav entry) would use `Chip variant="count"` (2026-07-08) — not built as a product feature yet, just noting the component this would compose once a nav/notification-count feature is scoped.
- Leads over time — weekly bar chart (last 12 weeks) — `Chart type="bar"`
- Response time trend — are we always under 90 seconds? — `Chart type="line"`
- Lead-to-reply rate — what % of people engage with the AI reply — `Chart type="radial"` or a plain `MetricCard` number, not a chart (a single %, no trend line adds real information at a glance)
- Top enquiry types (categorised by AI — plumbing emergency, HVAC service, new installation, etc.) — `Chart type="barHorizontal"` (long category labels read better ranked horizontally than rotated/truncated on a vertical axis)
- Cold lead rate — what % of leads never converted — `Chart type="radial"` or a plain `MetricCard` number, same reasoning as lead-to-reply rate
- Best performing day of week for leads — `Chart type="bar"` (vertical, `highlightIndex` on the best day)
- **Component boundary (2026-07-10):** Analytics is `Chart`, NOT the `Table` component — every metric above is a visualisation, not a row-per-record grid. See the boundary note in `docs/DOC-product-architecture.md`'s Table entry.

---

## 8. From competitors

Features worth borrowing — and done better.

### 1. Unified inbox — from Podium + Signpost (Build v1)

Podium's strongest UX feature is the unified inbox — every channel, every conversation, in one thread per customer. **Our version:** all leads (web form + missed call) in one place regardless of source. Later expand to include Google Business Profile messages if we add that integration. The owner has one place to check — not their email, not their texts, not a separate app.

### 2. Voicemail transcription — from LeadTruffle (Build with Group B)

LeadTruffle transcribes voicemails and uses a short summary in the first SMS so the reply feels personal. **Our version:** when a missed call includes a voicemail, Twilio's transcription runs on it and the AI uses the content in the SMS reply — "I heard your voicemail about the burst pipe — I'm on a job but I'll call you within 2 hours." Significantly more personal than a generic missed call reply.

### 3. One-tap reply from the notification (v1)

Both Podium and LeadTruffle support replying directly from the notification without opening the app. **Our version:** SMS notification includes a deep link that opens the dashboard directly to that lead's thread. On mobile, the owner taps the link, types a reply, sends — without ever navigating the dashboard. The link pre-focuses the reply box on that specific lead.

### 4. AI pause / manual takeover — from LeadTruffle (v1)

LeadTruffle lets owners pause AI and reply manually at any point, then switch back to AI. **Our version:** per-lead AI toggle — owner can turn off AI for a specific conversation once they're actively engaged, so the AI doesn't send a follow-up while they're mid-conversation with the same person. Plus a global AI pause in settings for when they want to handle everything personally for a day.

### 5. Geo-qualification — from LeadTruffle (v2)

LeadTruffle checks if a lead is in the business's service area based on zip code. **Our version:** owner sets their service radius (e.g. within 30 miles of Denver). Leads outside the radius get a different AI reply: "Thanks for reaching out! Unfortunately we don't service your area — but here's how to find a local [category] in your city." Prevents owner wasting time on out-of-area leads. Simple but high-value.

### 6. Lead source tracking — from Klenty/Signpost (v2)

Where did this lead come from? Owner should know if their Google Business Profile, their Facebook ad, or their website contact form is driving the most leads. **Our version:** UTM parameter support — if the owner's form includes UTM tags (set once, never again), we capture and display source per lead. Owner sees: "7 leads from Google this week, 2 from Facebook, 3 from organic website." Simple, powerful, no third-party analytics needed.

### 7. Review request automation — from Signpost (v2)

After an owner marks a lead as "completed/booked," automatically send the customer a review request a few days later: "Hi Sarah, hope your HVAC is running great! If you're happy with the service, it would mean a lot if you left us a Google review — [link]." Sent as SMS (highest open rate) or email. This closes the loop: lead → job → review → more leads. Competitors charge $300/mo for this — we include it in Pro.

### 8. Industry-specific AI training — from Podium + LeadTruffle (Ongoing)

Both competitors train their AI on industry-specific language. **Our version:** the business profile already handles most of this (services, tone, industry). But we should build an industry-specific prompt library — a plumber's AI knows what "water hammer", "P-trap", and "shut-off valve" mean. A dentist's AI knows "new patient exam" vs "emergency" vs "cosmetic." The more the AI sounds like it actually knows the industry, the more trust the owner has in it. Build this prompt library incrementally as we add more users from each category.

---

## 9. Feature summary

### Feature matrix by plan

| Feature | Free | Starter $9.99 | Pro $19 | Business $39 |
|---|---|---|---|---|
| Leads per month | 10 | 50 | 200 | Unlimited |
| Webhooks | 1 | 1 | 3 | Unlimited |
| Email follow-up | ✓ | ✓ | ✓ | ✓ |
| SMS follow-up | — | ✓ | ✓ | ✓ |
| Business voice profile | Basic | ✓ | ✓ | ✓ |
| Lead inbox + status pipeline | ✓ | ✓ | ✓ | ✓ |
| Manual reply from dashboard | ✓ | ✓ | ✓ | ✓ |
| Instant + cold lead notifications | Email only | Email + SMS | Email + SMS | Email + SMS |
| Daily digest | — | ✓ | ✓ | ✓ |
| AI pause toggle | ✓ | ✓ | ✓ | ✓ |
| Business hours setting | — | ✓ | ✓ | ✓ |
| Bug report button | ✓ | ✓ | ✓ | ✓ |
| Analytics dashboard | — | — | ✓ | ✓ |
| Weekly performance report | — | — | ✓ | ✓ |
| Geo-qualification (v2) | — | — | ✓ | ✓ |
| Missed call SMS | — | — | — | ✓ |
| Voicemail transcription | — | — | — | ✓ |
| Multi-location (up to 3) | — | — | — | ✓ |
| Review request automation (v2) | — | — | ✓ | ✓ |
| Cancel anytime | — | ✓ | ✓ | ✓ |
| No setup fee | ✓ | ✓ | ✓ | ✓ |

### v1 build scope — what ships first

v1 (weeks 1–4): the product that gets the first paying users.

- Webhook integration (universal, any form builder)
- 5-agent AI pipeline (intake → context → writer → reviewer → delivery)
- Email + SMS follow-up via Resend + Twilio
- Business voice profile (onboarding 5 questions)
- Lead inbox with status pipeline
- Instant + 24h cold lead notifications (SMS + email)
- Test lead button in onboarding
- AI pause toggle
- Free plan (10 leads) + Starter ($9.99) + Pro ($19) via Stripe
- Bug report button
- Landing page

### v2 build scope — what paying users will ask for

v2 (weeks 5–8, based on user feedback):

- Analytics dashboard
- Daily digest + weekly performance report
- Business hours setting
- Missed call SMS — Business plan ($39/mo)
- Manual reply from dashboard
- Per-lead AI pause toggle
- Referral program

### v3 build scope — growth and retention features

v3 (month 3+):

- Geo-qualification (service radius)
- Review request automation
- UTM / lead source tracking
- Multi-location support
- CRM integrations (Jobber, HousecallPro — via Zapier first)
- Industry-specific AI prompt library

---

## 10. Pricing

### Four tiers

| Plan | Price | Tagline | Lead cap | Webhooks |
|---|---|---|---|---|
| Free | $0/mo | Try it, see it work | 10 leads/mo | 1 |
| Starter | $9.99/mo | Price of 2 coffees | 50 leads/mo | 1 |
| Pro ★ | $19/mo | The full product | 200 leads/mo | 3 |
| Business | $39/mo | Multi-location + power | Unlimited | Unlimited |

★ Pro is the primary conversion target — "Most popular."

**Free — $0/mo**
- Up to 10 leads/mo
- Email follow-up only
- 1 webhook
- Basic AI reply
- No SMS, no custom tone, no analytics
- Goal: get them hooked, show the AI works, hit the 10-lead cap fast

**Starter — $9.99/mo**
- Up to 50 leads/mo
- Email + SMS follow-up
- 1 webhook
- Basic tone selection
- Lead dashboard
- No multi-location, no analytics
- The $9.99 price point is psychologically key — under $10 feels trivial vs a missed $1,000 job

**Pro — $19/mo (most popular)**
- Up to 200 leads/mo
- Email + SMS + custom tone
- 3 webhooks
- Lead analytics + trends
- Weekly performance report
- 24h unresponded alerts
- No multi-location
- Target: active businesses with 50–200 leads/mo. The sweet spot for $500 MRR goal

**Business — $39/mo**
- Unlimited leads
- Email + SMS + WhatsApp
- Unlimited webhooks
- Up to 3 locations
- Advanced analytics
- Missed call SMS (no-website)
- Priority queue
- Targets growing businesses, multi-location owners, and no-website clients

### $500/mo MRR math

| Mix | Users | Price | MRR |
|---|---|---|---|
| Starter plan | 20 | $9.99 | $200 |
| Pro plan | 12 | $19 | $228 |
| Business plan | 2 | $39 | $78 |
| **Total — 34 paying users** | | | **$506** |

34 paying users is very achievable. The $9.99 tier makes this significantly easier — a $10 "why not" decision converts 3–5× better than a $19 commitment for the same hesitant prospect.

---

## 11. No-website clients (Group B)

### The opportunity

About 30–40% of small local businesses in the USA have no website — especially solo tradespeople (single plumber, solo electrician, one-person cleaning service). They get leads almost entirely via phone calls and word of mouth. When the phone rings and they're on a job site, they miss it. That missed call is often a $500–2,000 job gone to a competitor. This group is completely ignored by every competitor who requires a website/contact form.

### Approach A — Missed Call SMS (no website needed)

The owner gets a dedicated phone number (via Twilio). They forward their existing business number to it, OR they start giving out the new number. When someone calls and they can't answer: the call goes to voicemail, AND simultaneously our system sends the caller an automatic SMS within 30 seconds.

- Caller receives: *"Hi, this is [Business Name] — sorry I missed your call! I'm on a job right now. What can I help you with? I'll get back to you in [X hours]."*
- Caller can reply to the SMS — our AI agent handles the back-and-forth conversation
- Owner gets a notification: "Missed call from 303-XXX-XXXX. We sent them an SMS. They replied: 'Need a quote for burst pipe.'"
- Owner can reply through the dashboard or SMS — the conversation is threaded

> **Setup for the owner:** they receive a Twilio number. They set call forwarding on their phone in 2 minutes (it's a standard phone setting). Done. No website, no tech knowledge, no code.

### Approach B — AI SMS Inbox (handles messages they can't respond to)

Some owners get messages on WhatsApp, Facebook Messenger, or text directly. They're too busy to reply immediately. The system connects to their messaging and sends an AI-drafted holding reply while they're working.

- Owner forwards their SMS or WhatsApp number → our system handles first response
- AI sends a natural, professional holding message: "Hi [name]! Got your message about [service]. [Owner] is finishing a job right now and will call you back today. Can you confirm your address and best call-back time?"
- This keeps the lead engaged and warm instead of them calling the next number on Google

### How to sell to no-website businesses

Cold email doesn't work — they have no email on Google Maps. Different outreach approach needed:

- **Cold SMS:** send a text to their business number. Short, personal: *"Hi, saw your listing on Google Maps for [Business Name] in [City]. Do you ever miss calls when you're on a job? We automatically text back missed callers for you. Free to try. Reply YES for a demo."*
- **Test first:** run a small batch (50 businesses) and track reply rate vs email group. Let the data decide which group is more profitable.
- **Compliance:** cold SMS to business numbers is legal under CAN-SPAM/TCPA in the US when targeting B2B. Always include opt-out: "Reply STOP to opt out."

> **Keep it simple for v1:** build the missed call SMS (Approach A) first. It's one Twilio feature, the setup for the owner is a 2-minute phone setting, and it's immediately valuable. Don't build the full AI conversation loop for no-website clients until you've validated the concept with 5–10 users. Complexity later, value first.

---

> The HTML version of this document (`docs/DOC-product-spec.html`) is retained as an archive. This Markdown file is the live authority — update it when any feature, pricing detail, or UX flow changes.
