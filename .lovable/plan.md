# Guest access for vendors and partners

## The idea
Keep Google sign-in for @ordergroove.com staff. Add an **invite-only guest pass**: an Ordergroove admin invites a specific outside email, the guest gets an email with a sign-in link, and they can browse the hub without an Ordergroove account. No open sign-up, so strangers still can't get in.

## How it works for people
- **Admin (staff):** new "Guests" page in the admin area. Enter email, name, company, optional expiry date (default 90 days), then Send invite. See all guests, resend, extend, or revoke access in one click.
- **Guest:** gets an email "You've been invited to the Ordergroove Brand Hub". Clicks the link, lands signed in. Later visits: the sign-in screen has a second option, "Guest? Email me a sign-in link", which only works for invited emails.
- **Expired or revoked guests** see a friendly "Your access has ended, contact your Ordergroove contact" screen.

## What guests can see (default, adjustable)
- Brand guidelines, colors, typography, logos, public downloads: yes
- Internal-only items (GTM toolkits, internal templates, admin): hidden
- Each asset/category gets an "Visible to guests" switch in admin so you control it item by item

## Build steps
1. Guest list in the backend (email, name, company, invited by, expires, revoked), staff-only access.
2. Update the domain guard: allow @ordergroove.com OR an email on the active guest list.
3. Admin "Guests" page with invite / resend / extend / revoke; invites sent from the hub via email sign-in links.
4. Sign-in screen gets the "Guest sign-in link" option; access check reads staff vs guest vs expired.
5. "Visible to guests" flag on asset categories and assets; hide internal nav sections for guests.
6. Small guest badge in the header so everyone knows the view they're in.

## Technical details
- New `public.guest_invites` table + `user_roles` (`staff`, `guest`, `admin`) via `has_role()`; roles never on profiles.
- Replace `enforce_ordergroove_domain()` trigger logic to also accept emails in `guest_invites` where `revoked_at is null and expires_at > now()`.
- Enable email (magic link) auth; invites use `auth.admin.inviteUserByEmail` / `signInWithOtp` from a service-role server function with `shouldCreateUser` only for invited emails.
- AuthGate: resolves role server-side; expiry checked on each session load, not just at sign-up.
- `guest_visible boolean default false` on `assets` and `asset_categories`; server functions filter by role.
- Branded invite email templates (requires email domain setup; falls back to default sender until then).

## Open questions
- Should guests download files, or view only?
- Default expiry: 90 days OK?
- Who can invite: any staff, or admins only?
