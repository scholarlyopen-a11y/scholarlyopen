import { MetadataRoute } from 'next'
import { articles } from '@/lib/data/articles'
import { editors } from '@/lib/data/editors'
import { slugify } from '@/lib/utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.scholarlyopen.org'

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/aims-scope',
    '/apc-fees',
    '/archiving-indexing',
    '/author-guidelines',
    '/contact',
    '/editorial-board',
    '/editorial360',
    '/impressum',
    '/journals',
    '/open-access',
    '/peer-review',
    '/privacy',
    '/publication-ethics',
    '/submit',
    '/trainings',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Journal pages
  const journalSlugs = [
    'ai-safety-governance',
    'biology',
    'chemistry',
    'clinical-ai-digital-health',
    'data-science',
    'decarbonization-carbon-tech',
    'engineering',
    'environmental-science',
    'medicine',
    'quantum-engineering',
    'social-sciences-humanities',
    'social-sciences-open',
    'space-resources-orbital-economy',
    'synthetic-biology-bio-design',
  ]

  const journalPages = journalSlugs.map((slug) => ({
    url: `${baseUrl}/journals/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const journalArticleListPages = journalSlugs.map((slug) => ({
    url: `${baseUrl}/journals/${slug}/articles`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Article pages
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/journals/${article.journalSlug}/articles/${article.id}`,
    lastModified: new Date(article.publishedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Editor pages
  const editorPages = editors.map((editor) => ({
    url: `${baseUrl}/editors/${editor.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Topic pages
  const articleKeywords = articles.flatMap((a) => a.keywords)
  const editorExpertise = editors.flatMap((e) => e.expertise || [])
  const uniqueTopics = Array.from(new Set([...articleKeywords, ...editorExpertise]))

  const topicPages = uniqueTopics.map((topic) => ({
    url: `${baseUrl}/topics/${slugify(topic)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...journalPages,
    ...journalArticleListPages,
    ...articlePages,
    ...editorPages,
    ...topicPages,
  ]
}
