require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5';
const API_KEY = process.env.ANTHROPIC_API_KEY;

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '..')));

// ============================================================================
// Band descriptor guides — paraphrased from the official IELTS "Writing Band
// Descriptors" (May 2023). Each band is split into POSITIVE features (what a
// script needs to fully satisfy to reach that band) and NEGATIVE features
// (limiting flaws described in the official document — shown there in bold —
// that cap the rating even if the positive features of a higher band are
// met). This split is what the scoring algorithm below is built on.
// ============================================================================

function band(positive, negative) {
  return { positive, negative };
}

const TASK1_TA_BANDS = {
  9: band(
    ['All requirements of the task are fully and appropriately satisfied, with at most extremely rare minor lapses in content.'],
    []
  ),
  8: band(
    ['The response covers all requirements appropriately, relevantly and sufficiently; key features are skilfully selected and clearly presented, highlighted and illustrated, with at most occasional minor omissions.'],
    []
  ),
  7: band(
    ['The response covers the requirements with relevant, accurate content (a few minor omissions/lapses are fine) in an appropriate format; key features are covered and clearly highlighted; a clear overview is present with data appropriately categorised and main trends/differences identified.'],
    []
  ),
  6: band(
    ['The response focuses on the requirements in an appropriate format; key features are covered and adequately highlighted; a relevant overview is attempted; figures/data are used to support the description.'],
    [
      'Some irrelevant, inappropriate or inaccurate information occurs in areas of detail or when illustrating/extending the main points.',
      'Some details are missing or excessive, and further extension or illustration is needed.',
    ]
  ),
  5: band(
    ['The response generally addresses the requirements; some key features are presented, even if the recounting of detail is mainly mechanical.'],
    [
      'The format may be inappropriate in places.',
      'Key features are not adequately covered.',
      'There may be no data at all to support the description.',
      'There is a tendency to focus on minor details without referring to the bigger picture.',
      'Irrelevant, inappropriate or inaccurate material appears in key areas, detracting from task achievement.',
      'There is only limited detail when extending or illustrating the main points.',
    ]
  ),
  4: band(
    ['The response is at least an attempt to address the task, with a few key features selected.'],
    [
      'The format may be inappropriate.',
      'Key features presented may be irrelevant, repetitive, inaccurate or inappropriate.',
    ]
  ),
  3: band(
    [],
    [
      'The response does not properly address the requirements, often because the chart/diagram/situation was misunderstood.',
      'Key features presented may be largely irrelevant.',
      'Only limited information is presented, and it may be used repetitively.',
    ]
  ),
  2: band(
    [],
    ['The content barely relates to the task.']
  ),
};

const TASK2_TR_BANDS = {
  9: band(
    ['The prompt is addressed and explored in depth, with a clear, fully developed position that directly answers the question(s); ideas are relevant, fully extended and well supported, with at most extremely rare lapses.'],
    []
  ),
  8: band(
    ['The prompt is appropriately and sufficiently addressed, with a clear, well-developed position; ideas are relevant, well extended and supported, with at most occasional minor omissions/lapses.'],
    []
  ),
  7: band(
    ['The main parts of the prompt are appropriately addressed with a clear, developed position; main ideas are extended and supported.'],
    [
      'There is a tendency to over-generalise, or a lack of focus/precision in the supporting ideas or material.',
    ]
  ),
  6: band(
    ['The main parts of the prompt are addressed (even if some more fully than others) in an appropriate format; a position directly relevant to the prompt is presented; main ideas are relevant.'],
    [
      'Conclusions drawn may be unclear, unjustified or repetitive.',
      'Some main ideas may be insufficiently developed or lack clarity, and supporting arguments/evidence may be less relevant or inadequate.',
    ]
  ),
  5: band(
    ['The main parts of the prompt are at least incompletely addressed; a position is expressed and some main ideas are put forward.'],
    [
      'The format may be inappropriate in places.',
      'The development of the position is not always clear.',
      'Main ideas are limited and not sufficiently developed, and/or contain irrelevant detail, possibly with noticeable repetition.',
    ]
  ),
  4: band(
    ['The prompt is tackled at least in a minimal way.'],
    [
      'The answer may be tangential, possibly from misunderstanding the prompt, and the format may be inappropriate.',
      "The writer's position is only discernible with careful reading.",
      'Main ideas are difficult to identify and may lack relevance, clarity or support.',
      'Large parts of the response may be repetitive.',
    ]
  ),
  3: band(
    [],
    [
      'No part of the prompt is adequately addressed, or the prompt has been misunderstood.',
      'No relevant position can be identified, and/or there is little direct response to the question(s).',
      'There are only a few ideas, which may be irrelevant or insufficiently developed.',
    ]
  ),
  2: band(
    [],
    ['The content is barely related to the prompt; no position can be identified; at most glimpses of one or two undeveloped ideas.']
  ),
};

const SHARED_CC_BANDS = {
  9: band(
    ['The message is followed effortlessly; cohesion is used so naturally it rarely draws attention; any lapses are minimal; paragraphing is skilfully managed.'],
    []
  ),
  8: band(
    ['The message can be followed with ease; ideas are logically sequenced and cohesion is well managed; paragraphing is used sufficiently and appropriately, with at most occasional lapses.'],
    []
  ),
  7: band(
    ['Ideas are logically organised with a clear progression (minor lapses are fine); a good range of cohesive devices including reference/substitution is used flexibly; paragraphing is generally effective and logically sequenced within paragraphs.'],
    []
  ),
  6: band(
    ['Ideas are generally arranged coherently with a clear overall progression; cohesive devices are used to good effect.'],
    [
      'Cohesion within and/or between sentences may be faulty or mechanical due to misuse, overuse or omission.',
      'Reference and substitution may lack flexibility or clarity, resulting in some repetition or error.',
      'Paragraphing may not always be logical and/or the central topic may not always be clear.',
    ]
  ),
  5: band(
    ['Organisation is at least evident, with an underlying sense of coherence, and the relationship of ideas can still be followed.'],
    [
      'Overall progression may be lacking and organisation is not wholly logical.',
      'Sentences are not fluently linked to each other.',
      'Cohesive devices may be limited or overused, with some inaccuracy.',
      'The writing may be repetitive due to inadequate or inaccurate use of reference and substitution.',
      'Paragraphing may be inadequate or missing.',
    ]
  ),
  4: band(
    ['Ideas are at least evident in the response.'],
    [
      'Ideas are not arranged coherently and there is no clear progression.',
      'Relationships between ideas can be unclear or inadequately marked.',
      'Only basic cohesive devices are used, which may be inaccurate or repetitive.',
      'There is inaccurate use or a lack of substitution/referencing.',
      'There may be no paragraphing and/or no clear main topic within paragraphs.',
    ]
  ),
  3: band(
    [],
    [
      'There is no apparent logical organisation; ideas are discernible but difficult to relate to each other.',
      'There is minimal, ineffective use of sequencers or cohesive devices, and difficulty identifying referencing.',
      'Any attempts at paragraphing are unhelpful.',
    ]
  ),
  2: band(
    [],
    ['There is little relevant message, or the entire response may be off-topic, with little evidence of control of organisational features.']
  ),
};

const SHARED_LR_BANDS = {
  9: band(
    ['Full flexibility and precise word use are evident throughout; a wide range of vocabulary is used accurately with natural, sophisticated control; spelling/word-formation slips are extremely rare.'],
    []
  ),
  8: band(
    ['A wide resource is used fluently and flexibly to convey precise meaning, including skilful use of less-common/idiomatic items, with at most occasional minor inaccuracies and spelling/word-formation slips.'],
    []
  ),
  7: band(
    ['The resource is sufficient to allow some flexibility and precision, including some less-common/idiomatic items, with an awareness of style and collocation, and only a few spelling/word-formation errors that do not detract from clarity.'],
    []
  ),
  6: band(
    ['Vocabulary is generally adequate and appropriate for the task; meaning stays generally clear despite a restricted range or some imprecision in word choice.'],
    [
      'There are some errors in spelling and/or word formation.',
    ]
  ),
  5: band(
    ['Vocabulary is at least minimally adequate for the task; simple words may be used accurately.'],
    [
      'There are frequent lapses in the appropriacy of word choice, with a lack of flexibility shown through frequent simplification or repetition.',
      'Spelling and/or word-formation errors may be noticeable and cause some difficulty for the reader.',
    ]
  ),
  4: band(
    ['Some basic vocabulary relevant to the task is used.'],
    [
      'The resource is limited, inadequate for, or even unrelated to the task; vocabulary is basic and may be used repetitively.',
      'There may be inappropriate use of memorised or formulaic chunks, or language lifted from the input material.',
      'Inappropriate word choice and/or errors in word formation or spelling may impede meaning.',
    ]
  ),
  3: band(
    [],
    [
      'The resource is inadequate, often because the response is significantly underlength, with possible heavy over-dependence on input material or memorised language.',
      'Control of word choice and/or spelling is very limited, and errors predominate, possibly severely impeding meaning.',
    ]
  ),
  2: band(
    [],
    ['The resource is extremely limited, with few recognisable strings beyond memorised phrases, and no apparent control of word formation or spelling.']
  ),
};

const SHARED_GRA_BANDS = {
  9: band(
    ['A wide range of structures is used with full flexibility and control; punctuation and grammar are used appropriately throughout, with at most extremely rare minor errors.'],
    []
  ),
  8: band(
    ['A wide range of structures is used flexibly and accurately; the majority of sentences are error-free and punctuation is well managed, with only occasional non-systematic errors.'],
    []
  ),
  7: band(
    ['A variety of complex structures is used with some flexibility and accuracy; grammar and punctuation are generally well controlled with frequent error-free sentences, and any persisting errors do not impede communication.'],
    []
  ),
  6: band(
    ['A mix of simple and complex sentence forms is used.'],
    [
      'Flexibility with complex structures is limited, and they are not as accurate as simple structures.',
      'Errors in grammar and punctuation occur.',
    ]
  ),
  5: band(
    ['A range of structures is at least attempted, including some complex sentences.'],
    [
      'The range of structures is limited and rather repetitive.',
      'Complex sentences tend to be faulty, with the greatest accuracy achieved only on simple sentences.',
      'Grammatical errors may be frequent and cause the reader some difficulty, and punctuation may be faulty.',
    ]
  ),
  4: band(
    ['Some structures are produced accurately.'],
    [
      'Only a very limited range of structures is used, mostly simple sentences with rare subordinate clauses.',
      'Grammatical errors are frequent and may impede meaning.',
      'Punctuation is often faulty or inadequate.',
    ]
  ),
  3: band(
    [],
    [
      'Errors in grammar and punctuation predominate (outside of memorised or input-derived phrases), preventing most meaning from coming through.',
      'The response may be too short to provide evidence of control of sentence forms.',
    ]
  ),
  2: band(
    [],
    ['There is little or no evidence of sentence forms beyond memorised phrases.']
  ),
};

function renderBandGuide(title, bandsObj) {
  const lines = [`${title} — band-by-band positive/negative features (bands 9 down to 2):`];
  for (let b = 9; b >= 2; b -= 1) {
    const entry = bandsObj[b];
    if (!entry) continue;
    const pos = entry.positive.length ? entry.positive.map((p) => `    + ${p}`).join('\n') : '    (no new positive requirement beyond adjacent bands)';
    const neg = entry.negative.length ? entry.negative.map((n) => `    - ${n}`).join('\n') : '    (none)';
    lines.push(`  Band ${b}:\n  POSITIVE:\n${pos}\n  NEGATIVE:\n${neg}`);
  }
  return lines.join('\n');
}

const SCORING_ALGORITHM = `SCORING ALGORITHM — apply this exact procedure separately for EACH of the 4 criteria. Do not assign a band from general impression; follow these steps mechanically:

1. Reading from band 9 downward, find the HIGHEST band whose POSITIVE features are ALL genuinely satisfied by the essay. Call this the "ceiling band".
2. Then examine EVERY band BELOW the ceiling band (not just the one directly below — all of them, down to band 2) and check whether the essay matches ANY of that band's NEGATIVE features.
3. If the essay matches at least one negative feature in one or more bands below the ceiling, the final score for that criterion = the LOWEST-numbered band among ALL the bands where a negative feature was matched (i.e. the worst one found, even if it is several bands below the ceiling — not just the first one you notice).
4. If no negative feature is matched in any band below the ceiling, the final score = the ceiling band itself.
5. Hard overrides (apply before the steps above, and skip the rest of the algorithm if triggered): if the essay is 20 words or fewer, score that criterion at band 1; if the content is wholly unrelated/off-topic, in a language other than English throughout, or is a memorised/copied response, score at band 1 (or 0 only for a totally blank/unattempted/fully memorised response, which you will not normally see here).
6. The score for each criterion MUST be a whole integer band (e.g. 4, 5, 6, 7, 8) — NEVER a half band like 6.5. Only the final combined overall average (computed separately, not by you) may contain a fraction.
7. In your "explanation" for each criterion, briefly state: (a) the ceiling band it initially qualified for and why, and (b) if the score was pulled down, exactly which negative feature(s) and which band caused the drop. If no drop occurred, say so explicitly.`;

const SCANNING_PROCEDURE = `Before applying the scoring algorithm, scan the essay in this order to gather evidence (do not let grammar/spelling distract you during step 1):
Step 1 — Content & structure scan:
- Check the word count. Task 1: the ideal target is 150 words; the response MUST be at least 135 words (10% under the benchmark) — falling short of 135 is a real Task Achievement problem, and it SHOULD NOT exceed about 165 words (10% over), though going a little above that is only a minor concern, not a hard violation. Task 2: the response MUST be at least 250 words.
- Task 1 only: Does the introduction paraphrase the prompt AND state the year(s)/categories/unit of measurement shown in the chart? Does the overview state the main trend(s) and the highest/lowest figures? Do body paragraphs select data consistent with a sensible plan, in a logical order?
- Task 2 only: Does the introduction paraphrase the prompt and preview the writer's two main ideas/position? Do body paragraphs develop and logically link arguments (not ramble off-topic), with examples that directly support the argument being made? Does the conclusion restate the two main ideas without introducing new, unsupported information?
Step 2 — Grammar scan: look specifically for tense errors, verb conjugation / subject-verb agreement mistakes, wrong word class (e.g. a noun used where an adjective is needed), wrong collocations, missing prepositions, and overuse of short simple sentences that should be combined into complex sentences (e.g. with relative clauses).
Step 3 — Word choice & spelling scan: look for inappropriate or unnatural synonyms (e.g. "amount of people" instead of "number of people"), awkward/unidiomatic phrases, and spelling mistakes.`;

const FEEDBACK_STYLE = `Feedback style rules:
- Always acknowledge genuine strengths as well as errors — include at least 1-2 "positive" annotations pointing at phrases/sentences the candidate wrote well (good structure, good vocabulary, effective linking, etc.).
- Calibrate the ambition of your suggestions to the candidate's current level: if they are around band 5, give practical, achievable improvements aimed at the next band — not advice that only makes sense for a band 8 candidate.
- The four criteria are NOT independent in practice: frequent grammar errors can also make ideas harder to follow (hurting Coherence & Cohesion) or obscure the point being made (hurting Task Achievement/Response); a limited vocabulary often forces repetition that hurts Coherence too. Weigh these interactions when deciding each band and mention them in your explanation when relevant, instead of scoring each criterion in total isolation.
- Each criterion's "explanation" must cite specific evidence from THIS essay (paraphrase or quote a short fragment) and name which descriptor feature was or wasn't met — never give a generic, essay-independent explanation.`;

const ANNOTATION_INSTRUCTIONS = `You must also produce an "annotations" array used to highlight the essay for the student. Rules for annotations:
- "quote" MUST be an EXACT, character-for-character substring copied from the candidate's essay (3 to 15 words long). Do not paraphrase it, truncate it with "...", or fix its errors — copy it exactly as written, typos included. This is critical: the app uses this exact string to locate and highlight the text, so an inexact quote will fail to highlight anything.
- "category" must be exactly one of: "task" (content/idea issues — Task Achievement/Response), "coherence" (organisation, linking, paragraphing), "lexical" (word choice, collocation, spelling), "grammar" (tense, agreement, sentence structure, articles, prepositions), "positive" (something done well — any category).
- "issue": one short sentence explaining why it's a problem (or why it's good, for "positive"), referencing the underlying rule.
- "suggestion": a corrected/improved version of that exact phrase, or null for "positive" annotations.
- Produce roughly 6-14 annotations per essay depending on length and number of issues — enough to be genuinely useful without overwhelming the student. Spread them across the essay rather than clustering all in one paragraph. Do not create two annotations with the same "quote".`;

function buildSystemPrompt(taskType) {
  const taBandsGuide = taskType === 'task1'
    ? renderBandGuide('Task Achievement (Task 1)', TASK1_TA_BANDS)
    : renderBandGuide('Task Response (Task 2)', TASK2_TR_BANDS);
  const taKey = taskType === 'task1' ? 'taskAchievement' : 'taskResponse';

  return `You are a certified, experienced IELTS Writing examiner and tutor. You grade strictly and mechanically according to the official public IELTS Writing band descriptors, split below into POSITIVE features (required to reach a band) and NEGATIVE features (limiting flaws that cap the rating). You also give the kind of practical, example-grounded feedback a skilled human tutor would write by hand.

${taBandsGuide}

${renderBandGuide('Coherence & Cohesion', SHARED_CC_BANDS)}

${renderBandGuide('Lexical Resource', SHARED_LR_BANDS)}

${renderBandGuide('Grammatical Range & Accuracy', SHARED_GRA_BANDS)}

${SCANNING_PROCEDURE}

${SCORING_ALGORITHM}

${FEEDBACK_STYLE}

${ANNOTATION_INSTRUCTIONS}

Respond with ONLY a single valid JSON object (no markdown fences, no commentary before or after) matching exactly this shape:

{
  "criteria": {
    "${taKey}": { "band": <WHOLE INTEGER, 0-9, e.g. 6 — never 6.5>, "explanation": "<ceiling band + any negative-feature drop, citing specific evidence from this essay>" },
    "coherenceCohesion": { "band": <integer>, "explanation": "<...>" },
    "lexicalResource": { "band": <integer>, "explanation": "<...>" },
    "grammaticalRange": { "band": <integer>, "explanation": "<...>" }
  },
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "suggestions": ["...", "..."],
  "generalComment": "<2-3 sentence encouraging but honest overall summary>",
  "annotations": [
    { "quote": "<exact substring>", "category": "task|coherence|lexical|grammar|positive", "issue": "<why>", "suggestion": "<fix or null>" }
  ]
}`;
}

function buildUserPrompt(taskType, question, essay) {
  const taskLabel = taskType === 'task1' ? 'IELTS Writing Task 1' : 'IELTS Writing Task 2';
  const lengthRule = taskType === 'task1'
    ? 'ideal target ~150 words; MANDATORY minimum 135 words (10% under); SHOULD NOT exceed ~165 words (10% over), though a little more is only a minor concern'
    : 'ideal target ~250-275 words; MANDATORY minimum 250 words; avoid excessive length (300+) that risks losing focus';
  return `Task type: ${taskLabel} (expected length: ${lengthRule})

Question / prompt given to the candidate:
"""
${question}
"""

Candidate's essay (verbatim, including any typos):
"""
${essay}
"""

Follow the scanning procedure, then apply the scoring algorithm step by step for each criterion, then respond with the JSON object only.`;
}

function parseJsonFromText(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('Không parse được kết quả JSON trả về từ AI.');
  }
  return JSON.parse(match[0]);
}

function countWords(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

// Each component score must be a whole band (0-9) — never a half band.
function clampBandInteger(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return 0;
  return Math.min(9, Math.max(0, Math.round(num)));
}

// Per-task overall band = average of the 4 (whole-number) criteria scores, then
// ALWAYS rounded DOWN to the nearest 0.5 — per the grading rule requested:
// x.25 -> x.0, x.75 -> x.5 (this is the opposite of the usual IELTS round-up
// convention, and is used deliberately only for this per-task average).
function floorToHalfBand(avg) {
  return Math.floor(avg * 2) / 2;
}

// Official IELTS-style rounding, used ONLY for combining Task 1 + Task 2 into
// one Mock Test Writing band: .25 rounds up to the next .5, .75 rounds up to
// the next whole band.
function roundIELTS(avg) {
  const whole = Math.floor(avg);
  const rem = avg - whole;
  if (rem < 0.25) return whole;
  if (rem < 0.75) return whole + 0.5;
  return whole + 1;
}

async function gradeEssay(taskType, question, essay) {
  if (!API_KEY) {
    throw new Error('ANTHROPIC_API_KEY chưa được cấu hình trên server. Hãy tạo file server/.env từ server/.env.example.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: buildSystemPrompt(taskType),
      messages: [{ role: 'user', content: buildUserPrompt(taskType, question, essay) }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API lỗi (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textContent = (data.content || []).map((block) => block.text || '').join('');
  const parsed = parseJsonFromText(textContent);

  // Normalize + compute the overall band ourselves rather than trusting model arithmetic.
  const criteria = parsed.criteria || {};
  Object.keys(criteria).forEach((key) => {
    if (criteria[key] && typeof criteria[key].band !== 'undefined') {
      criteria[key].band = clampBandInteger(criteria[key].band);
    }
  });
  const bands = Object.values(criteria).map((c) => c.band).filter((n) => typeof n === 'number');
  const overallBand = bands.length ? floorToHalfBand(bands.reduce((a, b) => a + b, 0) / bands.length) : null;

  const annotations = Array.isArray(parsed.annotations) ? parsed.annotations.filter((a) => a && a.quote && essay.includes(a.quote)) : [];

  return {
    wordCount: countWords(essay),
    criteria,
    overallBand,
    strengths: parsed.strengths || [],
    weaknesses: parsed.weaknesses || [],
    suggestions: parsed.suggestions || [],
    generalComment: parsed.generalComment || '',
    annotations,
  };
}

app.post('/api/grade', async (req, res) => {
  const { task1, task2 } = req.body || {};

  try {
    const result = {};

    if (task1 && task1.essay && task1.essay.trim().length > 0) {
      result.task1 = await gradeEssay('task1', task1.question, task1.essay);
    }
    if (task2 && task2.essay && task2.essay.trim().length > 0) {
      result.task2 = await gradeEssay('task2', task2.question, task2.essay);
    }

    if (!result.task1 && !result.task2) {
      return res.status(400).json({ ok: false, error: 'Không có bài làm nào để chấm.' });
    }

    if (result.task1 && result.task2) {
      result.overallWritingBand = roundIELTS((result.task1.overallBand + result.task2.overallBand * 2) / 3);
    }

    res.json({ ok: true, result });
  } catch (err) {
    console.error('Grading error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`IELTS Writing grader running at http://localhost:${PORT}`);
    if (!API_KEY) {
      console.warn('⚠️  ANTHROPIC_API_KEY is not set. Grading requests will fail until you configure server/.env');
    }
  });
}

module.exports = { app, floorToHalfBand, roundIELTS, clampBandInteger, countWords, parseJsonFromText, gradeEssay };
