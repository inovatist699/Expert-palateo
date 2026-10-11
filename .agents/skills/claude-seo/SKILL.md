---
name: claude-seo
description: Technical SEO, Generative Engine Optimization (GEO), and Search Visibility analysis inspired by Claude SEO. Use when auditing web pages, generating JSON-LD structured data, optimizing metadata, improving Core Web Vitals, and implementing semantic HTML.
---

# Claude SEO: Technical SEO & Generative Engine Optimization (GEO)

Claude SEO automates technical SEO audits, schema generation, and search engine optimization workflows for web applications and public landing pages.

## Core Capabilities

### 1. Structured Data (JSON-LD) Generation
Automatically produce valid Schema.org structured data tailored to the application context:

#### Restaurant / Food Establishment Schema (for Palateo)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "The Artisan Bistro",
  "image": "https://palateo.in/images/venues/artisan-bistro.jpg",
  "servesCuisine": ["Modern European", "Artisanal"],
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bengaluru",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  }
}
</script>
```

### 2. Social Meta & OpenGraph Tags
Ensure every public page exports complete metadata:
- Primary meta: `<title>`, `<meta name="description">`, `<link rel="canonical">`
- OpenGraph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`

### 3. Generative Engine Optimization (GEO) & AEO
- **Entity Density**: Structure page headings (`<h1>`–`<h3>`) around clear topical entities and user search intents.
- **Answer-Engine Readiness**: Provide concise, factual 40–60 word summaries under key headings that AI answer engines (ChatGPT Search, Perplexity, Gemini) can parse as direct answers.
- **Core Web Vitals**: Minimize Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) by preloading fonts, providing explicit image dimensions, and avoiding render-blocking scripts.
