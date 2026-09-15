import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  User,
  Share2,
} from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | ASRONIX TECH Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

const categoryColors: Record<string, string> = {
  "AI Solutions": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Web Development": "bg-accent/10 text-accent border-accent/20",
  Branding: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  General: "bg-muted/10 text-muted border-muted/20",
};

// Custom MDX components styled for the dark theme
const mdxComponents = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-12 mb-4 text-2xl font-bold text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed text-muted">{children}</p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-muted">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:text-accent-cyan hover:decoration-accent-cyan/30"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="my-6 border-l-4 border-accent/30 bg-accent/5 py-3 pl-6 italic text-muted/80">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="rounded-md bg-white/5 px-1.5 py-0.5 text-sm text-accent-cyan">
      {children}
    </code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-white/5 bg-surface p-6 text-sm leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="border-b border-white/5 bg-surface-light">{children}</thead>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-4 py-3 text-left font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-4 py-3 text-muted">{children}</td>
  ),
  hr: () => <hr className="my-8 border-white/5" />,
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Asronix Tech",
      url: "https://asronixtechagency.publicvm.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://asronixtechagency.publicvm.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <Header />
      <main id="main-content" className="pt-28 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article className="mx-auto max-w-3xl px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            {/* Category */}
            <span
              className={`mb-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
                categoryColors[post.category] || categoryColors["General"]
              }`}
            >
              {post.category}
            </span>

            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="mb-6 text-lg text-muted">{post.excerpt}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 border-t border-white/5 pt-6 text-sm text-muted/60">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose-custom">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-2 border-t border-white/5 pt-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Share */}
          <div className="mt-8 flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-muted/60">
              <Share2 className="h-4 w-4" />
              Share this article
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://asronixtechagency.publicvm.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted transition-all hover:border-accent/30 hover:text-foreground"
              aria-label="Share on Twitter"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-3xl border border-white/5 bg-surface p-8 text-center sm:p-12">
            <h3 className="mb-3 text-xl font-bold text-foreground">
              Need Help With Your Project?
            </h3>
            <p className="mb-6 text-sm text-muted">
              We build AI-powered solutions, modern web apps, and brand identities
              that drive real results.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              Book a Free Consultation
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
