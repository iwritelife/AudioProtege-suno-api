import Section from "./components/Section";
import Markdown from 'react-markdown';


export default function Home() {

  const markdown = `

---
## 👋 Introduction

Suno.ai v3 is an amazing AI music service. Although the official API is not yet available, we couldn't wait to integrate its capabilities somewhere.

We discovered that some users have similar needs, so we decided to open-source this project, hoping you'll like it.

We update quickly, please star us on Github:  [github.com/gcui-art/suno-api](https://github.com/gcui-art/suno-api) ⭐

## 🌟 Features

- Perfectly implements the creation API from \`app.suno.ai\`
- Compatible with the format of OpenAI’s \`/v1/chat/completions\` API.
- Automatically keep the account active.
- Supports \`Custom Mode\`
- One-click deployment to Vercel
- In addition to the standard API, it also adapts to the API Schema of Agent platforms like GPTs and Coze, so you can use it as a tool/plugin/Action for LLMs and integrate it into any AI Agent.
- Permissive open-source license, allowing you to freely integrate and modify.

## 🚀 Getting Started

### 1. Obtain the cookie of your app.suno.ai account

1. Head over to [app.suno.ai](https://app.suno.ai) using your browser.
2. Open up the browser console: hit \`F12\` or access the \`Developer Tools\`.
3. Navigate to the \`Network tab\`.
4. Give the page a quick refresh.
5. Identify the request that includes the keyword \`client?_clerk_js_version\`.
6. Click on it and switch over to the \`Header\` tab.
7. Locate the \`Cookie\` section, hover your mouse over it, and copy the value of the Cookie.
`;


  const markdown_part2 = `
### 2. Clone and deploy this project

You can choose your preferred deployment method:

#### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgcui-art%2Fsuno-api&env=SUNO_COOKIE&project-name=suno-api&repository-name=suno-api)

#### Run locally

\`\`\`bash
git clone https://github.com/gcui-art/suno-api.git
cd suno-api
npm install
\`\`\`

### 3. Configure suno-api

- If deployed to Vercel, please add an environment variable \`SUNO_COOKIE\` in the Vercel dashboard, with the value of the cookie obtained in the first step.

- If you’re running this locally, be sure to add the following to your \`.env\` file:

  \`\`\`bash
  SUNO_COOKIE=<your-cookie>
  \`\`\`

### 4. Run suno-api

- If you’ve deployed to Vercel:
  - Please click on Deploy in the Vercel dashboard and wait for the deployment to be successful.
  - Visit the \`https://<vercel-assigned-domain>/api/get_limit\` API for testing.
- If running locally:
  - Run \`npm run dev\`.
  - Visit the \`http://localhost:3000/api/get_limit\` API for testing.
- If the following result is returned:

  \`\`\`json
  {
    "credits_left": 50,
    "period": "day",
    "monthly_limit": 50,
    "monthly_usage": 50
  }
  \`\`\`

it means the program is running normally.

### 5. Use Suno API

You can check out the detailed API documentation at [suno.gcui.ai/docs](https://suno.gcui.ai/docs).

## 📚 API Reference

Suno API currently mainly implements the following APIs:

\`\`\`bash
- \`/api/generate\`: Generate music
- \`/v1/chat/completions\`: Generate music - Call the generate API in a format 
  that works with OpenAI’s API.
- \`/api/custom_generate\`: Generate music (Custom Mode, support setting lyrics, 
  music style, title, etc.)
- \`/api/generate_lyrics\`: Generate lyrics based on prompt
- \`/api/get\`: Get music list
- \`/api/get?ids=\`: Get music Info by id, separate multiple id with ",".
- \`/api/get_limit\`: Get quota Info
- \`/api/extend_audio\`: Extend audio length
- \`/api/generate_stems\`: Make stem tracks (separate audio and music track)
- \`/api/get_aligned_lyrics\`: Get list of timestamps for each word in the lyrics
- \`/api/concat\`: Generate the whole song from extensions
\`\`\`

For more detailed documentation, please check out the demo site:

👉 [suno.gcui.ai/docs](https://suno.gcui.ai/docs)

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
            Unofficial
          </span>
          <h1 className="relative font-bold text-6xl lg:text-7xl text-white/95 tracking-tight">
            <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
              Suno AI API
            </span>
          </h1>
          <p className="relative text-white/85 text-xl lg:text-2xl max-w-3xl leading-relaxed font-light">
            Transform your musical ideas into reality with our powerful open-source Suno AI API integration
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
