import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface PolicyInput {
  companyName: string
  industry: string
  companySize: string
  description: string
}

export async function generatePolicy(
  policyType: string,
  input: PolicyInput
): Promise<string> {
  const prompt = `Generate a professional SOC 2 ${policyType} policy document for a company named "${input.companyName}" in the ${input.industry} industry with ${input.companySize} employees. 

Company description: ${input.description}

Requirements:
- Write in formal business/technical English
- Include clear sections, roles, and responsibilities
- Reference specific controls and procedures
- Length: 800-1200 words
- Format with Markdown headings

Generate the complete policy document:`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert compliance consultant specializing in SOC 2, ISO 27001, and information security governance. You write clear, actionable policies.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2500,
  })

  return response.choices[0]?.message?.content || 'Error generating policy'
}

export async function generateControlsMapping(
  input: PolicyInput
): Promise<string> {
  const prompt = `Generate a SOC 2 Trust Services Criteria controls mapping for "${input.companyName}" (${input.industry}, ${input.companySize} employees).

For each of the 5 Trust Services Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy), list:
1. Common Criteria number (e.g., CC1.1, CC6.1)
2. Control description
3. Implementation responsibility
4. Evidence needed
5. Review frequency

Format as a structured Markdown table and summary. Be specific and actionable.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a SOC 2 auditor and compliance architect. You create detailed controls mappings for audit readiness.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 3000,
  })

  return response.choices[0]?.message?.content || 'Error generating controls'
}
