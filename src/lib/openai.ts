import OpenAI from 'openai';
import { FortuneContent } from '@/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

interface GenerateFortuneParams {
    name: string;
    birthDate: string; // YYYY-MM-DD
    story?: string | null;
}

export async function generateFortuneLetter({
    name,
    birthDate,
    story,
}: GenerateFortuneParams): Promise<FortuneContent> {
    const storyText = story ? `\n사연: ${story}` : '';

    const systemPrompt = `당신은 신비로운 술사입니다. 별빛과 우주의 기운을 읽어 의뢰인에게 편지를 씁니다.

편지 톤 규칙:
- 말투: "~하였도다", "~기운이 느껴지는구나" 같은 고풍스럽고 신비로운 어투 (과하지 않게)
- 개인화: 의뢰인 이름을 자연스럽게 사용하고, 사연이 있으면 직접 언급
- 금지: 구체적 합격/불합격 예언, 지나친 경고/저주, 광고성 문구
- 필수: 위로와 격려로 마무리, 심리적 안정감을 주는 방향
- 길이: 섹션당 3-5문장, 전체 400-600자

반드시 아래 JSON 형식으로만 응답하십시오:
{
  "overall_energy": "오늘의 전체 기운 설명 (3-5문장)",
  "interview_energy": "면접/시험 기운 설명 (3-5문장)",
  "closing_message": "술사의 마지막 말 — 따뜻한 응원 (2-3문장)"
}`;

    const userPrompt = `의뢰인 정보:
이름: ${name}
생년월일: ${birthDate}${storyText}

위 정보를 바탕으로 술사의 편지를 작성해주십시오.`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('OpenAI returned empty response');
    }

    const parsed = JSON.parse(content) as FortuneContent;

    if (!parsed.overall_energy || !parsed.interview_energy || !parsed.closing_message) {
        throw new Error('Invalid fortune content structure');
    }

    return parsed;
}

// 프롬프트 해시 생성 (동일 입력 재생성 방지용)
export function generatePromptHash(params: GenerateFortuneParams): string {
    const str = `${params.name}|${params.birthDate}|${params.story ?? ''}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}
