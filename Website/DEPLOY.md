# Deploying Topical Hub to Cloudflare Pages

Cloudflare Pages builds the site from the GitHub repository on every push to `main` and serves it from its free static hosting (commercial use is allowed on the free plan, which matters because ads are planned). Nothing in this guide needs to be done from a terminal; it is all clicks in the Cloudflare dashboard. You need a GitHub account that can see `zaid-aamir/topical-hub` and (if the repo is private at any point) permission to install the Cloudflare GitHub app on it.

The build settings below are the only ones that matter. Everything else can stay at its default.

| Setting | Value |
|---|---|
| Framework preset | `Astro` (or `None`; the build command and output directory are set explicitly anyway) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory (advanced) | `Website` |
| Production branch | `main` |
| Environment variable | `NODE_VERSION` = `24` |

`npm run build` runs `astro build` and then `node scripts/check-dist.mjs`. If the content validation or any post-build check fails, the build fails and Cloudflare keeps serving the previous deployment, so a broken build never goes live.

## 1. First deployment

1. Go to <https://dash.cloudflare.com> and sign in, or click **Sign up** and create a free account (email and password; verify the email). No payment details are needed for the free plan.
2. In the left sidebar click **Workers & Pages**.
3. Click **Create** (top right). On the page that opens, select the **Pages** tab.
4. Under **Import an existing Git repository** click **Connect to Git** (or **Get started** next to it).
5. Choose **GitHub**. The first time, a GitHub window opens asking you to install the "Cloudflare Pages" app. Click **Install & Authorize**. Choose **Only select repositories**, pick `zaid-aamir/topical-hub`, and confirm. You are returned to Cloudflare.
6. In the repository list select **topical-hub** and click **Begin setup**.
7. Fill in **Set up builds and deployments**:
   1. **Project name:** `topical-hub`. The project name becomes the URL, so this gives `https://topical-hub.pages.dev`, which is what `SITE_URL` in `src/config.ts` already expects. If Cloudflare says the name is taken, pick another name and read section 4 below about `SITE_URL`.
   2. **Production branch:** `main`.
   3. **Framework preset:** `Astro`.
   4. **Build command:** `npm run build` (overwrite whatever the preset filled in).
   5. **Build output directory:** `dist`.
   6. Click **Root directory (advanced)** to expand it and enter `Website`. This is essential: the website project lives in the `Website/` folder, and the build reads the question content from `../igcse-chem-pipeline/`, which is in the same clone.
   7. Click **Environment variables (advanced)**, then **Add variable**. Variable name `NODE_VERSION`, value `24`. (The repo also has `Website/.nvmrc` saying `24`; the variable is a belt-and-braces copy so the build never falls back to an old Node.)
8. Click **Save and Deploy**. Cloudflare clones the repo, runs `npm install` and `npm run build` inside `Website/`, and uploads `dist/`. The build log streams on screen; the content validation prints one line like `360 questions across 12 topics`, then `check-dist: OK`. The first build takes two to four minutes.
9. When the log ends with **Success**, the page shows the deployment URL. For a project named `topical-hub` it is `https://topical-hub.pages.dev` (each deployment also gets its own `https://<hash>.topical-hub.pages.dev` preview URL, listed under **Deployments**). Click **Continue to project** and then the URL to open the live site.

## 2. If the project name was not available

The URL is always `https://<project-name>.pages.dev`. To change it later: open the project, go to **Settings** (top tabs), then under **General** (or **Project name**) click **Edit** next to the project name, type the new name and save. The new `*.pages.dev` URL works immediately; the old one stops working. Then update `SITE_URL` as described in section 4.

## 3. How later deploys happen

Every push to `main` triggers a production deployment automatically; no clicks are needed. You can watch it under **Workers & Pages -> topical-hub -> Deployments**, where each deployment shows its commit message, status and build log. Pushes to other branches create preview deployments with their own URLs. If a build fails, the previous successful deployment stays live; fix the problem, push again, and Cloudflare rebuilds. To rebuild without a new commit, open a deployment's **...** menu and choose **Retry deployment**.

## 4. What to change in `src/config.ts`

All deployment-dependent values live in `Website/src/config.ts`:

- **`SITE_URL`** is the canonical origin, without a trailing slash. It is `https://topical-hub.pages.dev` by default. Change it when the project has a different `*.pages.dev` name or when a custom domain goes live (section 5). It feeds `site` in `astro.config.ts`, so the canonical `<link>`s, Open Graph URLs, `sitemap-index.xml` and the `Sitemap:` line in `robots.txt` all follow from this one constant. Commit and push; the next deploy picks it up.
- **`REPORT_FORM_URL` and `REPORT_FORM_FIELDS`** wire the "Report an error" link to a Google Form. While `REPORT_FORM_URL` is empty, the link opens a pre-filled new issue on the GitHub repo instead. The comment above those two constants in `src/config.ts` gives the exact four steps: create the form with "Question id" and "Page URL" short-answer fields, use **Get pre-filled link** in the form editor, paste the part of that link before `?` into `REPORT_FORM_URL`, and copy the two `entry.<number>` keys into `REPORT_FORM_FIELDS`.

## 5. Adding a custom domain later

1. Buy the domain anywhere (Cloudflare Registrar, Namecheap, Porkbun, ...).
2. In Cloudflare open **Workers & Pages -> topical-hub** and click the **Custom domains** tab, then **Set up a custom domain**.
3. Enter the domain (for example `topicalhub.com` or `www.topicalhub.com`) and click **Continue**.
4. If the domain's DNS is managed by Cloudflare, click **Activate domain**; Cloudflare adds the record itself.
   If the DNS is elsewhere, Cloudflare shows a **CNAME** record to create at your registrar: name `www` (or the subdomain you chose), target `topical-hub.pages.dev`. Add it in the registrar's DNS panel and wait for Cloudflare to show **Active** (usually minutes, up to 24 hours). A bare apex domain (`topicalhub.com` without `www`) at an outside registrar needs either CNAME flattening or ALIAS support there; the simplest route is to move the domain's DNS to Cloudflare (free) and let it add the records.
5. HTTPS certificates are issued automatically.
6. Set `SITE_URL` in `src/config.ts` to the new origin, for example `https://www.topicalhub.com`, commit and push. The `*.pages.dev` URL keeps working as an alias.
7. Optionally, in **Custom domains**, add the other form (`topicalhub.com` and `www.topicalhub.com`) so both resolve; Cloudflare redirects the secondary one to the primary.

## 6. Verify after deploy

Open these in a browser after the first deployment and after any change to `src/config.ts`:

1. `https://topical-hub.pages.dev/` loads, shows the site name, the tagline and the twelve topics, and the footer disclaimer.
2. A topic page, for example `https://topical-hub.pages.dev/igcse/chemistry-0620/electrochemistry/`: questions render, clicking an MCQ option marks it, "Show mark scheme" opens a structured question's answer, the filters work, and the "Report an error" link opens a new tab with the question id filled in.
3. `https://topical-hub.pages.dev/robots.txt` allows everything and its `Sitemap:` line points at your `SITE_URL`.
4. `https://topical-hub.pages.dev/sitemap-index.xml` lists `sitemap-0.xml`, whose URLs start with your `SITE_URL` and include no `/print/` pages.
5. `https://topical-hub.pages.dev/this-does-not-exist/` shows the site's own 404 page (Cloudflare serves `dist/404.html`).
6. On a phone (or a 360 px wide browser window): no horizontal scrolling on a topic page, tables scroll inside their cards.
7. The browser tab title of a topic page reads `<Topic> — IGCSE Chemistry 0620 exam-style questions with answers | Topical Hub`.

If anything is wrong, the build log under **Deployments** is the first place to look; a failed `check-dist` lists each failing file and reason.
