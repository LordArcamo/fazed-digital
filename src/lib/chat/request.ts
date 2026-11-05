// One chat request, shared by the live route and scripts/chat-eval.mjs, so the test set runs exactly what visitors get.
import type Anthropic from '@anthropic-ai/sdk';
import { RULES, sharedKnowledge, marketKnowledge, type Market } from './knowledge';

// Sonnet 5.5: follows the "never claim" rules closely in English and Taglish, at sales-chat speed with thinking off.
// CHAT_MODEL=claude-haiku-5-5 swaps it with no code change.
export const DEFAULT_MODEL = 'claude-sonnet-5-5';
const MAX_REPLY_TOKENS = 500;

export const FORM_TOOL: Anthropic.Tool = {
  name: 'show_lead_form',
  description: 'Opens a short form in the chat where the visitor types their own name, email and phone for the team. Only call this after the visitor agreed to leave their details, directly asked to be contacted, or said they are ready to go ahead.',
  input_schema: { type: 'object', properties: {}, additionalProperties: false },
};

export const END_TOOL: Anthropic.Tool = {
  name: 'end_chat',
  description: 'Ends this chat and resets it to the start. Call it right after a one-sentence goodbye when the visitor says they are done or need nothing else.',
  input_schema: { type: 'object', properties: {}, additionalProperties: false },
};

// Two cache points: rules + knowledge are shared by everyone, the market block by that market. The live note stays after them.
const shared = `${RULES}\n\n${sharedKnowledge()}`;
const market = { ph: marketKnowledge('ph'), intl: marketKnowledge('intl') };

export function chatRequest(model: string, mkt: Market, note: string, messages: Anthropic.MessageParam[]): Anthropic.MessageCreateParamsNonStreaming {
  return {
    model,
    max_tokens: MAX_REPLY_TOKENS,
    thinking: (model === DEFAULT_MODEL ? { type: 'between_tools' } : { type: 'disabled' }) as unknown as Anthropic.ThinkingConfigParam,
    output_config: { effort: 'low' },
    tools: [FORM_TOOL, END_TOOL],
    system: [
      { type: 'text', text: shared, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: market[mkt], cache_control: { type: 'ephemeral' } },
      { type: 'text', text: note },
    ],
    messages,
  };
}
