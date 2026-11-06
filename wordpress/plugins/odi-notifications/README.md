# ODI Notifications

Minimal replacement for the BracketSpace **Notification** plugin + its paid
**Webhooks** extension, covering the only thing digital-ca-gov actually used:
pinging an AWS API Gateway endpoint when posts/pages change.

> **Source of truth.** This directory is the canonical home for the plugin,
> as of 2026-11-06. It supersedes the standalone `cagov/odi_notifications_plugin`
> repo, which is archived. The plugin is not part of the Eleventy build and is
> never deployed to S3 — Eleventy only reads `pages/`, and the workflows only
> sync `_site/`. To install, copy `odi-notifications.php` into
> `wp-content/plugins/odi-notifications/` on the target environment.

## What it replaces

Six `notification` CPT entries, all using carrier `webhook_json/v2`, all
pointing at the same endpoint, all sending an effectively empty body:

| Trigger | Event key |
|---|---|
| `post/post/published` | `post_published` |
| `post/page/published` | `page_published` |
| `post/post/updated`   | `post_updated` |
| `post/page/updated`   | `page_updated` |
| `post/post/trashed`   | `post_trashed` |
| `post/page/trashed`   | `page_trashed` |

## Settings

**Settings → ODI Notifications**

- **Endpoint URL** — validated with `wp_http_validate_url()`
- **Fire on** — six independent toggles
- **Request body** — sent verbatim with `Content-Type: application/json`;
  empty by default, which matches the old plugin's behaviour
- **Dry run** — logs what *would* be sent, sends nothing. **Defaults to ON**,
  so an incomplete install can never fire real traffic.
- **Logging** — write every send and its response to the PHP error log
- **Send test ping** — uses saved settings, respects dry run

Stored as one option, `odi_notifications_settings`.

## Implementation notes

- Hooks `transition_post_status`; classifies `trash` → trashed,
  `publish` from `publish` → updated, `publish` from anything else → published.
- Ignores revisions, autosaves, and post types other than `post`/`page`.
- Sends via `wp_remote_post()`, 10s timeout, no redirects.
- Settings page is capability-gated (`manage_options`); the test ping is
  nonce-protected via `admin-post.php`.

## How the endpoint actually behaves

`POST /` on the sync service (`cagov/service-wordpress-to-github-digital-ca-gov`,
an Architect app) runs the **entire** WordPress-to-GitHub sync inline before
responding:

```
@http
get /
post /
@scheduled
syncherweekend  cron(*/59 * ? * SAT,SUN *)
syncherweekday  cron(*/30 * ? * MON,TUE,WED,THU,FRI *)
@aws
timeout 900
concurrency 1
```

Consequences:

- The POST can take far longer than any sane client timeout. The old plugin
  passed no timeout, so it inherited WordPress's 5s default and would have
  been timing out on most publishes. The sync still completed — Lambda keeps
  running after the client disconnects — so the timeouts were cosmetic, but
  every publish paid a 5s stall.
- **This plugin sends event pings non-blocking.** We only need to trigger the
  sync, not wait for it. The manual test ping stays blocking so the admin
  screen can report a real HTTP status.
- The same sync runs on a schedule anyway: every 30 min on weekdays, every
  59 min on weekends. So the webhook is a "sync now" accelerator, not the only
  path. If it fails, content still reaches GitHub on the next scheduled run.
- `concurrency 1` means overlapping triggers queue rather than run in parallel.

## Duplicate suppression

The block editor issues two saves roughly a second apart for a single user
action, and each one would otherwise start a full sync run. (The old
Notification plugin had exactly the same behaviour — its two sends were ~6s
apart, which was its 5s timeout plus overhead.)

A repeat of the same event for the same post inside a 10-second window is
suppressed. It uses a transient, because the two saves arrive as separate
requests and an in-process static would not see both.

- Filterable: `odi_notifications_dedupe_window` (seconds; return `0` to disable).
- Different events for the same post are keyed separately, so a
  `published` immediately followed by an `updated` both fire.

Verified on dev:

```
20:35:22  dispatched  page_published post=4225
20:35:39  dispatched  page_updated   post=4225
20:35:45  suppressed  page_updated   post=4225  (within 10s)
20:36:08  dispatched  page_updated   post=4225  (window expired)
```

## Status

**Cutover completed 2026-11-04 on all three environments.** `notification`
and `notification-webhooks` are deactivated on dev, test and live;
`odi-notifications` is active and identically configured on all three
(`dry_run=false`, `logging=true`, all six events).

Confirmed working on live: publishing page 1226 dispatched `page_updated`
and triggered the GitHub Actions deploy.

### Verified on dev

| Action | Result |
|---|---|
| Create page as draft | no fire |
| Draft to publish | one `page_published` |
| Edit while published | one `page_updated` |
| Trash | one `page_trashed` |
| Create post, edit draft x2 | no fires |
| Draft to publish | one `post_published` |
| Revision row touched | correctly ignored (`wp_is_post_revision`) |
| Real non-blocking send | `dispatched ... (non-blocking)`, no stall |
| PHP warnings/errors | none |

### Notes

- The old plugin also emitted `PHP Warning: Undefined array key "args"` in
  `WebhookJson.php:111` on every send. This replacement does not.
- The six old `notification` CPT entries (IDs 1931-1936) remain in the
  database, harmless, in case you want to refer back to them.
