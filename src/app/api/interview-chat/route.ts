import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { buildFallbackReply } from '@/lib/interview-chat/build-fallback-reply'
import {
  buildInterviewSystemPrompt,
  type ChatLanguage,
  type InterviewProfile,
  type SchedulePayload,
} from '@/lib/interview-chat/build-system-prompt'

export const maxDuration = 30

const getOpenAIModel = (apiKey: string) =>
  createOpenAI({
    baseURL: 'https://aiproxy.moreshared.com/v1',
    apiKey,
  })('gpt-5.2')

function getMessageText(message: UIMessage) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text.trim())
    .filter(Boolean)
    .join('\n')
}

function buildConversationPrompt(messages: UIMessage[]) {
  const transcript = messages
    .map(message => {
      const text = getMessageText(message)

      if (!text) {
        return null
      }

      const speaker = message.role === 'assistant' ? 'Assistant' : 'Recruiter'

      return `[${speaker}]\n${text}`
    })
    .filter((entry): entry is string => Boolean(entry))
    .join('\n\n')

  if (!transcript) {
    return ''
  }

  return [
    'Conversation transcript:',
    transcript,
    'Respond as the assistant to the latest recruiter message only. Keep the answer concise, warm, and actionable.',
  ].join('\n\n')
}

function detectMessageLanguage(
  input: string | undefined,
  fallbackLocale: ChatLanguage,
): ChatLanguage {
  const text = input?.trim()

  if (!text) {
    return fallbackLocale
  }

  const normalizedText = text.toLowerCase()

  const hasVietnameseDiacritics =
    /[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(
      text,
    )

  const vietnameseSignalCount = [
    /\b(và|là|của|cho|với|không|mình|bạn|giúp|hãy|tôi|gì|nào|được|trong|cần|muốn|phỏng vấn|tiếng việt)\b/gi,
  ].reduce(
    (count, pattern) => count + (normalizedText.match(pattern)?.length || 0),
    0,
  )

  const englishSignalCount = [
    /\b(the|and|for|with|please|can|could|would|should|help|interview|english|reply|what|how|why)\b/gi,
  ].reduce(
    (count, pattern) => count + (normalizedText.match(pattern)?.length || 0),
    0,
  )

  if (hasVietnameseDiacritics || vietnameseSignalCount > englishSignalCount) {
    return 'vi'
  }

  if (englishSignalCount > vietnameseSignalCount) {
    return 'en'
  }

  return fallbackLocale
}

export async function POST(request: Request) {
  const {
    messages,
    locale,
    profile,
    schedule,
  }: {
    messages: UIMessage[]
    locale: 'en' | 'vi'
    profile?: InterviewProfile
    schedule?: SchedulePayload
  } = await request.json()

  const lastUserText = [...messages]
    .reverse()
    .find(message => message.role === 'user')
    ?.parts.find(part => part.type === 'text')

  const responseLanguage = detectMessageLanguage(lastUserText?.text, locale)

  const systemPrompt = buildInterviewSystemPrompt({
    locale: responseLanguage,
    profile,
    schedule,
  })

  const apiKey = process.env.AI_API_KEY
  const conversationPrompt = buildConversationPrompt(messages)

  if (apiKey) {
    try {
      const result = streamText({
        model: getOpenAIModel(apiKey),
        providerOptions: {
          openai: {
            store: true,
          },
        },
        system: systemPrompt,
        prompt: conversationPrompt,
      })

      return result.toUIMessageStreamResponse()
    } catch {
      const failureText =
        responseLanguage === 'vi'
          ? 'Mình không thể lấy phản hồi lúc này. Vui lòng thử lại sau.'
          : 'I could not respond right now. Please try again in a moment.'

      return createUIMessageStreamResponse({
        stream: createUIMessageStream({
          execute: ({ writer }) => {
            writer.write({ type: 'text-start', id: 'ai-error-reply' })
            writer.write({
              type: 'text-delta',
              id: 'ai-error-reply',
              delta: failureText,
            })
            writer.write({ type: 'text-end', id: 'ai-error-reply' })
          },
        }),
      })
    }
  }

  const fallbackText = buildFallbackReply({
    locale: responseLanguage,
    input: lastUserText?.text || '',
    profile,
    schedule: schedule || null,
  })

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'text-start', id: 'fallback-reply' })
        writer.write({
          type: 'text-delta',
          id: 'fallback-reply',
          delta: fallbackText,
        })
        writer.write({ type: 'text-end', id: 'fallback-reply' })
      },
    }),
  })
}
