import React from 'react';
import Swagger from '../components/Swagger';
import spec from './swagger-suno-api.json'; // 直接导入JSON文件
import Section from '../components/Section';
import Markdown from 'react-markdown';


export default function Docs() {
    return (
        <>
            <Section className="my-10">
                <article className="prose lg:prose-lg max-w-3xl pt-10">
                    <h1 className=' text-center text-indigo-900'>
                        Tune Gawd API Documentation
                    </h1>
                    <Markdown>
                        {`                     
---
\`Tune Gawd\` provides comprehensive APIs for AI music generation:

\`\`\`bash
- \`/api/generate\`: Generate music
- \`/v1/chat/completions\`: OpenAI-compatible music generation endpoint
- \`/api/custom_generate\`: Custom mode with full creative control (lyrics, style, title)
- \`/api/generate_lyrics\`: Generate lyrics based on prompt
- \`/api/get\`: Retrieve music by ID or get your complete library
- \`/api/get_limit\`: Check usage limits and remaining credits
- \`/api/extend_audio\`: Extend audio length
- \`/api/generate_stems\`: Create separate audio and music tracks
- \`/api/get_aligned_lyrics\`: Get word-level lyric timestamps
- \`/api/clip\`: Get detailed clip information
- \`/api/concat\`: Combine audio extensions into full songs
- \`/api/persona\`: Access persona-based music generation
\`\`\`

Explore detailed parameters and test all endpoints interactively below.
                        `}
                    </Markdown>
                </article>
            </Section>
            <Section className="my-10">
                <article className='prose lg:prose-lg max-w-3xl py-10'>
                    <h2 className='text-center'>
                        Interactive API Testing & Documentation
                    </h2>
                    <p className='text-red-800 italic'>
                        Demo environment with rate limits. Please use responsibly to ensure availability for all users.
                    </p>
                </article>

                <div className=' border p-4 rounded-2xl shadow-xl hover:shadow-none duration-200'>
                    <Swagger spec={spec} />
                </div>

            </Section>
        </>

    );
}
