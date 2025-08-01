import Section from "./components/Section";
import Markdown from 'react-markdown';


export default function Home() {

  const markdown = `

---
## 🎵 Welcome to Tune Gawd

Tune Gawd is the ultimate AI-powered music creation platform. We've harnessed the power of advanced AI technology to help you create professional-quality music in minutes, not hours.

Whether you're a seasoned producer, aspiring artist, or just someone with a musical idea, Tune Gawd makes music creation accessible to everyone.

Follow our journey on Github: [github.com/gcui-art/suno-api](https://github.com/gcui-art/suno-api) ⭐

## ✨ Why Choose Tune Gawd?

- **Professional Quality**: Generate studio-quality music with advanced AI
- **Lightning Fast**: Create complete songs in under 60 seconds
- **Full Creative Control**: Custom lyrics, genres, and musical styles
- **Easy to Use**: Intuitive interface designed for creators of all levels
- **Multiple Formats**: Download MP3s and shareable video content
- **API Integration**: Compatible with OpenAI's chat completions format
- **Open Source**: Built on open-source technology you can trust

## 🚀 Quick Start Guide

### 1. Get Your Suno.ai Account Ready

1. Visit [suno.com/create](https://suno.com/create) in your browser.
2. Open up the browser console: hit \`F12\` or access the \`Developer Tools\`.
3. Navigate to the \`Network\` tab.
4. Give the page a quick refresh.
5. Find the request containing \`client?_clerk_js_version\`.
6. Click on it and switch over to the \`Header\` tab.
7. Copy the \`Cookie\` value from the headers.
`;


  const markdown_part2 = `
### 2. Deploy Tune Gawd

You can choose your preferred deployment method:

#### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgcui-art%2Fsuno-api&env=SUNO_COOKIE&project-name=suno-api&repository-name=suno-api)

#### Run locally

\`\`\`bash
git clone https://github.com/gcui-art/tune-gawd.git
cd tune-gawd
npm install
\`\`\`

### 3. Configure Tune Gawd

- If deployed to Vercel, add the \`SUNO_COOKIE\` environment variable in your Vercel dashboard.

- If you’re running this locally, be sure to add the following to your \`.env\` file:

  \`\`\`bash
  SUNO_COOKIE=<your-cookie>
  \`\`\`

### 4. Launch Tune Gawd

- If you’ve deployed to Vercel:
  - Click Deploy in your Vercel dashboard and wait for completion.
  - Test with \`https://<your-domain>/api/get_limit\`.
- If running locally:
  - Run \`npm run dev\`.
  - Test with \`http://localhost:3000/api/get_limit\`.
- Success response:

  \`\`\`json
  {
    "credits_left": 50,
    "period": "day",
    "monthly_limit": 50,
    "monthly_usage": 50
  }
  \`\`\`

### 5. Start Creating Music

Visit the \`/create\` page to start generating your first tracks, or explore our comprehensive API documentation.

## 🎹 API Reference

Tune Gawd provides a comprehensive set of APIs for music generation:

\`\`\`bash
- \`/api/generate\`: Generate music
- \`/v1/chat/completions\`: OpenAI-compatible music generation
- \`/api/custom_generate\`: Custom mode with full creative control
- \`/api/generate_lyrics\`: Generate lyrics based on prompt
- \`/api/get\`: Retrieve your music library
- \`/api/get_limit\`: Check your usage and limits
- \`/api/extend_audio\`: Extend audio length
- \`/api/generate_stems\`: Create stem tracks
- \`/api/get_aligned_lyrics\`: Get lyric timestamps
- \`/api/concat\`: Combine audio extensions
\`\`\`

For complete API documentation and interactive testing:

👉 [Visit our API Documentation](/docs)

`;
  return (
    <>
      <Section className="">
        <div className="flex flex-col m-auto py-24 text-center items-center justify-center gap-6 my-12
        lg:px-24 px-6
        bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl border border-indigo-500/20 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
          
          <span className="relative px-6 py-2 text-xs font-medium border rounded-full 
          border-white/30 uppercase text-white/80 bg-white/10 backdrop-blur-sm">
            AI Music Studio
          </span>
          <h1 className="relative font-bold text-6xl lg:text-7xl text-white/95 tracking-tight">
            <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
              Tune Gawd
            </span>
          </h1>
          <p className="relative text-white/85 text-xl lg:text-2xl max-w-3xl leading-relaxed font-light">
            Create professional music with AI. Transform your ideas into chart-topping hits with our advanced music generation platform.
          </p>
          <div className="relative mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="/create"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl hover:bg-white/95 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 group"
            >
              <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Start Creating Music
              <svg className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/docs"
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
              <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View API Docs
            </a>
          </div>
        </div>
      </Section>
      
      <Section className="my-10">
        <article className="prose lg:prose-xl max-w-4xl prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm">
          <Markdown>
            {markdown}
          </Markdown>
          <video controls width="1024" className="w-full border border-slate-200 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            <source src="/get-cookie-demo.mp4" type="video/mp4" />
            Your browser does not support frames.
          </video>
          <Markdown>
            {markdown_part2}
          </Markdown>
        </article>
      </Section>
    </>
  );
}
