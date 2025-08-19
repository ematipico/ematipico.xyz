import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { satoriAstroOG } from 'satori-astro';
import { html } from 'satori-html';

export const GET: APIRoute = async ({ params }) => {
  const route = params.route;
  
  if (!route) {
    return new Response('Route parameter missing', { status: 400 });
  }

  let title = 'Emanuele Stoppa';
  let subtitle = "Software Engineer";
  let description = "Personal website and blog";

  if (route === 'home') {
    title = 'Emanuele Stoppa';
    subtitle = 'Software Engineer';
    description = 'Personal website and blog about software development';
  } else if (route === 'blog') {
    title = 'Blog';
    subtitle = 'Emanuele Stoppa';
    description = 'Articles about software development, web technologies, and more';
  } else if (route === 'projects') {
    title = 'Projects';
    subtitle = 'Emanuele Stoppa';
    description = 'Open source projects and contributions';
  } else if (route.startsWith('blog/')) {
    const slug = route.replace('blog/', '');
    const posts = await getCollection('blog');
    const post = posts.find(p => p.slug === slug);
    
    if (post) {
      title = post.data.title;
      subtitle = 'ematipico.xyz';
      description = post.data.description;
    }
  }

  // Fetch font data
  const fontFile = await fetch(
    "https://og-playground.vercel.app/inter-latin-ext-700-normal.woff"
  );
  const fontData: ArrayBuffer = await fontFile.arrayBuffer();

  return await satoriAstroOG({
    template: html`
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 80px;
        font-family: Inter Latin, system-ui, sans-serif;
        color: #f9fafb;
      ">
        <div style="display: flex; flex-direction: column;">
          <div style="
            font-size: 72px;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 24px;
            color: #f9fafb;
          ">
            ${title}
          </div>
          <div style="
            font-size: 32px;
            color: #9ca3af;
            font-weight: 400;
            margin-bottom: 32px;
          ">
            ${subtitle}
          </div>
          <div style="
            font-size: 28px;
            color: #d1d5db;
            line-height: 1.4;
            max-width: 900px;
          ">
            ${description}
          </div>
        </div>
        
        <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <div style="
            font-size: 24px;
            color: #6b7280;
            font-weight: 500;
          ">
            ematipico.xyz
          </div>
          <div style="
            width: 60px;
            height: 60px;
            background: #3b82f6;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: 700;
            color: white;
          ">
            E
          </div>
        </div>
      </div>
    `,
    width: 1200,
    height: 630,
  }).toResponse({
    satori: {
      fonts: [
        {
          name: "Inter Latin",
          data: fontData,
          style: "normal",
        },
      ],
    },
  });
};

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const paths = [
    { params: { route: 'home' } },
    { params: { route: 'blog' } },
    { params: { route: 'projects' } },
    ...posts.map(post => ({ params: { route: `blog/${post.slug}` } }))
  ];

  return paths;
}