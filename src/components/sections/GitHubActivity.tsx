import { person } from '@/lib/data'
import GitHubHeatmap, { type ContributionDay } from './GitHubHeatmap'

const USERNAME = 'prusotamkrydv78'

/* Public, token-free contributions source. Fetched on the server and cached
   for a day (ISR). On any failure we return null and the client view falls
   back to a generated pattern, so the build/render never breaks. */
async function fetchContributions(): Promise<{ days: ContributionDay[]; total: number } | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const json = (await res.json()) as {
      total?: { lastYear?: number }
      contributions?: ContributionDay[]
    }
    const days = json.contributions ?? []
    if (!days.length) return null
    return { days, total: json.total?.lastYear ?? person.stats.contributions }
  } catch {
    return null
  }
}

export default async function GitHubActivity() {
  const data = await fetchContributions()
  return (
    <GitHubHeatmap
      days={data?.days ?? null}
      total={data?.total ?? person.stats.contributions}
    />
  )
}
