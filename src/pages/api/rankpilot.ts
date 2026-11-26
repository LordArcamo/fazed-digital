export const prerender = false;

// Rankpilot webhook (Settings → Integrations → Webhook / API on rankpilot.dev).
// · integration.test → 200 so Rankpilot marks the connection as working
// · content.publish  → the article is saved as src/data/rankpilot/<slug>.json in GitHub:
//     status "publish" and clean → committed to main, Vercel rebuilds, live at /blog/<slug>
//     status "draft", or content that would break the build → a pull request to review and merge
// Needs (Vercel env): RANKPILOT_WEBHOOK_SECRET, GITHUB_TOKEN (contents + pull requests: write on the repo).
import type { APIRoute } from 'astro';
import { verifySignature, slugify, toPost, contentProblems, type RankpilotPayload, type BlogPost } from '../../lib/rankpilot';
import postsIndex from '../../data/.generated/posts.json';
import { SITE_URL } from '../../data/site';

const SECRET = import.meta.env.RANKPILOT_WEBHOOK_SECRET ?? '';
const TOKEN = import.meta.env.GITHUB_TOKEN ?? '';
const REPO = import.meta.env.RANKPILOT_GITHUB_REPO ?? 'LordArcamo/fazed-digital';
const BASE = 'main';
const DIR = 'src/data/rankpilot';

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

async function gh(path: string, init: RequestInit = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'fazed-rankpilot-webhook',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  const body = res.status === 204 ? null : await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body: body as any };
}

/** The saved file at `slug` on `ref`, or null. */
async function readPost(slug: string, ref: string): Promise<{ sha: string; post: BlogPost } | null> {
  const r = await gh(`/contents/${DIR}/${slug}.json?ref=${encodeURIComponent(ref)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub read ${r.status}`);
  return { sha: r.body.sha, post: JSON.parse(Buffer.from(r.body.content, 'base64').toString('utf8')) };
}

async function writePost(post: BlogPost, branch: string, sha: string | undefined, message: string) {
  const r = await gh(`/contents/${DIR}/${post.slug}.json`, {
    method: 'PUT',
    body: JSON.stringify({ message, branch, sha, content: Buffer.from(JSON.stringify(post, null, 2) + '\n').toString('base64') }),
  });
  if (!r.ok) throw new Error(`GitHub write ${r.status}: ${r.body?.message ?? ''}`);
}

async function openReview(post: BlogPost, sha: string | undefined, reasons: string[]): Promise<string> {
  const branch = `rankpilot/${post.slug}`;
  const head = await gh(`/git/ref/heads/${BASE}`);
  if (!head.ok) throw new Error(`GitHub ref ${head.status}`);
  const made = await gh('/git/refs', { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: head.body.object.sha }) });
  if (!made.ok && made.status !== 422) throw new Error(`GitHub branch ${made.status}`);
  const onBranch = await readPost(post.slug, branch);
  await writePost(post, branch, onBranch?.sha ?? sha, `blog: Rankpilot draft "${post.title}"`);
  const why = reasons.length ? reasons.map((r) => `- ${r}`).join('\n') : '- Rankpilot sent it as a draft';
  const pr = await gh('/pulls', {
    method: 'POST',
    body: JSON.stringify({
      title: `Blog (Rankpilot): ${post.title}`,
      head: branch, base: BASE,
      body: `Rankpilot article waiting for review. Merge to publish at ${SITE_URL}/blog/${post.slug}; close to drop it.\n\nWhy it is not live yet:\n${why}\n\nBefore merging, check every number, client name, price and claim against src/data/proof.ts: AI articles can invent them.`,
    }),
  });
  if (pr.ok) return pr.body.html_url;
  if (pr.status === 422) {
    const open = await gh(`/pulls?state=open&head=${REPO.split('/')[0]}:${encodeURIComponent(branch)}`);
    if (open.ok && open.body?.[0]) return open.body[0].html_url;
  }
  throw new Error(`GitHub PR ${pr.status}`);
}

export const POST: APIRoute = async ({ request }) => {
  if (!SECRET) return json({ error: 'Webhook not configured' }, 503);
  const raw = await request.text();
  if (!verifySignature(raw, request.headers.get('x-rankpilot-signature'), SECRET)) return json({ error: 'Bad signature' }, 401);

  let p: RankpilotPayload;
  try { p = JSON.parse(raw); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const event = p.event || request.headers.get('x-rankpilot-event') || '';

  if (event === 'integration.test') return json({ ok: true });
  if (event !== 'content.publish') return json({ error: `Unknown event "${event}"` }, 422);
  if (!TOKEN) return json({ error: 'GitHub token not configured' }, 503);
  if (!p.title?.trim() || !p.html?.trim()) return json({ error: 'title and html are required' }, 422);
  if ((p.type ?? 'blog') !== 'blog') return json({ error: `Unsupported type "${p.type}"` }, 422);
  if ((p.language ?? 'en').toLowerCase() !== 'en') return json({ error: 'This site publishes English articles only' }, 422);

  try {
    // pick a slug that is not one of our existing posts; reuse it when Rankpilot re-sends the same article
    const taken = new Set((postsIndex as { slug: string }[]).filter((x: any) => x.source !== 'rankpilot').map((x) => x.slug));
    const base = slugify(p.title) || `article-${Date.now()}`;
    let slug = base, existing: Awaited<ReturnType<typeof readPost>> = null;
    for (let n = 2; n < 20; n++) {
      if (!taken.has(slug)) {
        existing = await readPost(slug, BASE);
        if (!existing || (p.contentItemId && existing.post.contentItemId === p.contentItemId)) break;
      }
      slug = `${base}-${n}`;
      existing = null;
    }

    const post = toPost(p, slug);
    if (existing) post.date = existing.post.date; // an update keeps its first publish date
    const problems = contentProblems(post.content);

    if (p.status === 'publish' && !problems.length) {
      await writePost(post, BASE, existing?.sha, `blog: ${existing ? 'update' : 'add'} ${post.title} (Rankpilot)`);
      return json({ id: slug, url: `${SITE_URL}/blog/${slug}` });
    }
    const prUrl = await openReview(post, existing?.sha, problems);
    return json({ id: slug, url: prUrl });
  } catch (e) {
    console.error('[rankpilot]', e);
    return json({ error: 'Could not save the article' }, 502);
  }
};

export const GET: APIRoute = () => json({ error: 'POST only' }, 405);
