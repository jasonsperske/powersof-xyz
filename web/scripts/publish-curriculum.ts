import { writeFileSync } from 'node:fs';
import { activities, concepts, lessons, courses } from '../courses';
writeFileSync(
  'public/curriculum.json',
  JSON.stringify(
    {
      format: 'powersof-curriculum',
      version: '1.1',
      courses,
      concepts,
      lessons,
      activities,
    },
    null,
    2,
  ) + '\n',
);
const assessment = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'powersof external assessment',
  type: 'object',
  additionalProperties: false,
  required: ['format', 'version', 'assessedConcepts'],
  properties: {
    format: { const: 'powersof-assessment' },
    version: { const: '1.0' },
    assessedConcepts: {
      type: 'array',
      minItems: 1,
      maxItems: concepts.length,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'concept',
          'result',
          'confidence',
          'evidence',
          'misconceptions',
        ],
        properties: {
          concept: { enum: concepts.map((c) => c.id) },
          result: { enum: ['developing', 'mastered', 'needs-work'] },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          evidence: {
            type: 'array',
            minItems: 1,
            items: { type: 'string', maxLength: 30000 },
          },
          misconceptions: {
            type: 'array',
            items: { type: 'string', maxLength: 30000 },
          },
        },
      },
    },
  },
};
writeFileSync(
  'public/assessment.schema.json',
  JSON.stringify(assessment, null, 2) + '\n',
);
const contextSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'powersof learning context',
  type: 'object',
  required: [
    'format',
    'version',
    'generatedAt',
    'mode',
    'learner',
    'courses',
    'evidence',
    'externalAssessments',
    'successfulWork',
    'assessmentRequest',
    'methodology',
  ],
  properties: {
    format: { const: 'powersof-learning-context' },
    version: { const: '1.0' },
    generatedAt: { type: 'string', format: 'date-time' },
    mode: { enum: ['compact', 'full', 'assessment-only'] },
    learner: {
      type: 'object',
      properties: { displayName: { type: ['string', 'null'] } },
    },
    courses: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'title', 'url', 'manifest', 'objectives'],
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          manifest: { type: 'string', format: 'uri' },
          objectives: {
            type: 'array',
            items: {
              type: 'object',
              required: [
                'id',
                'title',
                'prerequisites',
                'attempts',
                'status',
                'mastery',
                'resources',
              ],
              properties: {
                id: { enum: concepts.map((c) => c.id) },
                title: { type: 'string' },
                prerequisites: { type: 'array', items: { type: 'string' } },
                attempts: { type: 'integer', minimum: 0 },
                status: {
                  enum: [
                    'Not started',
                    'Developing',
                    'Needs practice',
                    'Mastered',
                  ],
                },
                mastery: { type: ['number', 'null'], minimum: 0, maximum: 1 },
                resources: { type: 'object' },
              },
            },
          },
        },
      },
    },
    evidence: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'id',
          'activityId',
          'questionId',
          'concept',
          'answer',
          'score',
          'maxScore',
          'grading',
          'at',
        ],
        properties: {
          id: { type: 'string' },
          activityId: { type: 'string' },
          questionId: { type: 'string' },
          concept: { enum: concepts.map((c) => c.id) },
          answer: { type: 'string' },
          score: { type: 'number', minimum: 0, maximum: 1 },
          maxScore: { const: 1 },
          grading: { enum: ['automatic', 'self'] },
          at: { type: 'string', format: 'date-time' },
        },
      },
    },
    externalAssessments: { type: 'array' },
    successfulWork: { type: 'array' },
    assessmentRequest: {
      type: 'object',
      required: ['goal', 'instructionsUrl', 'schemaUrl'],
    },
    methodology: { type: 'string' },
    content: { type: 'object', required: ['lessons', 'activities'] },
    notes: { type: 'object', additionalProperties: { type: 'string' } },
  },
  allOf: [
    {
      if: { properties: { mode: { const: 'full' } } },
      then: { required: ['content', 'notes'] },
    },
  ],
};
writeFileSync(
  'public/learning-context.schema.json',
  JSON.stringify(contextSchema, null, 2) + '\n',
);
