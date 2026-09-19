import type { Activity, Lesson, Question } from '../src/types';
export const algebraConcepts = [
  {
    id: 'algebra.signed-numbers',
    title: 'Signed numbers & order of operations',
    prerequisites: [],
    keywords: ['negative numbers', 'number line', 'order of operations'],
  },
  {
    id: 'algebra.ratios',
    title: 'Ratios, rates & percentages',
    prerequisites: ['algebra.fractions'],
    keywords: [
      'unit rate',
      'proportion',
      'percent',
      'multiplicative comparison',
    ],
  },
  {
    id: 'algebra.expressions',
    title: 'Expressions & equivalence',
    prerequisites: ['algebra.signed-numbers'],
    keywords: [
      'variable',
      'like terms',
      'distributive property',
      'substitution',
    ],
  },
  {
    id: 'algebra.inequalities',
    title: 'Inequalities & solution sets',
    prerequisites: ['algebra.equations'],
    keywords: ['inequality', 'negative multiplier', 'solution set'],
  },
  {
    id: 'algebra.functions',
    title: 'Functions & linear relationships',
    prerequisites: ['algebra.equations', 'algebra.ratios'],
    keywords: ['input', 'output', 'slope', 'intercept', 'domain'],
  },
];
export const algebraLessons: Lesson[] = [
  {
    id: 'pre-integers',
    objectives: ["Signed numbers specify positions relative to zero; absolute value measures distance from zero.", "Subtracting a number is equivalent to adding its opposite.", "Parentheses and operation precedence determine which calculations to perform first."],
    title: 'Signed numbers and order of operations',
    minutes: 30,
    concepts: ['algebra.signed-numbers'],
    sections: [
      {
        title: 'Number line, order, and absolute value',
        text: 'Positive and negative numbers describe positions relative to a chosen zero. On a number line, numbers increase to the right. Absolute value measures distance from zero, so it is nonnegative. The opposite of a number reverses its direction; it does not necessarily make the number negative.',
        math: String.raw`|-5|=5,\qquad -(-5)=5`,
        example:
          'A temperature of −7°C is lower than −2°C. Both are below zero, but −7 lies farther left. The distance between them is |−7−(−2)| = 5 degrees.',
      },
      {
        title: 'Addition combines changes',
        text: 'Adding a positive number moves right; adding a negative number moves left. Subtracting a number means adding its opposite. This rule is more dependable than “two negatives make a positive,” which can confuse subtraction with multiplication.',
        math: String.raw`a-b=a+(-b)`,
        example:
          '−4 + 7 = 3. Also, −4 − (−7) = −4 + 7 = 3, while −4 + (−7) = −11. Identify the operation before applying a sign rule.',
      },
      {
        title: 'Multiplication preserves arithmetic patterns',
        text: 'Distributivity explains the sign rules. Since 3(2 + (−2)) = 0, the values 3·2 and 3·(−2) must be opposites. Repeating that reasoning with a negative multiplier gives a positive product for two negative factors.',
        math: String.raw`(-3)(2)+(-3)(-2)=(-3)\cdot0=0`,
        example:
          'The first term is −6, so the second must be +6. This derives (−3)(−2) = 6 from distributivity rather than a slogan.',
      },
      {
        title: 'Read the structure of an expression',
        text: 'Evaluate parentheses, then powers, then multiplication and division from left to right, then addition and subtraction from left to right. Multiplication and division have equal priority. A minus sign outside a power is different from a negative base inside parentheses.',
        example:
          '18 ÷ 3 × 2 = 6 × 2 = 12. Also, −3² = −(3²) = −9, while (−3)² = 9. In 2 + 3(4 − 6), the result is 2 + 3(−2) = −4.',
      },
    ],
  },
  {
    id: 'pre-fractions',
    objectives: ["Equivalent fractions name the same value when numerator and denominator are scaled by the same nonzero factor.", "Adding or subtracting fractions requires a common denominator.", "Dividing by a nonzero fraction is equivalent to multiplying by its reciprocal."],
    title: 'Equivalent fractions and fraction operations',
    minutes: 35,
    concepts: ['algebra.fractions'],
    sections: [
      {
        title: 'Fractions and the reference whole',
        text: 'A fraction a/b is a divided by b, with b nonzero. The denominator describes the size of each equal part; the numerator counts those parts. Multiplying numerator and denominator by the same nonzero number changes the name, not the value.',
        math: String.raw`\frac{3}{4}=\frac{3\cdot2}{4\cdot2}=\frac{6}{8}`,
        example:
          'Six eighths of one pizza is three quarters of that same pizza. Comparing fractions of differently sized pizzas requires knowing the whole.',
      },
      {
        title: 'Add quantities measured in the same parts',
        text: 'You can combine numerators only after expressing both fractions with a common denominator. Adding denominators changes the unit instead of counting it. Reduce a fraction by dividing both numerator and denominator by a common nonzero factor.',
        math: String.raw`\frac{2}{3}+\frac{1}{4}=\frac{8}{12}+\frac{3}{12}=\frac{11}{12}`,
        example:
          '5/6 − 1/4 = 10/12 − 3/12 = 7/12. The incorrect answer 4/2 comes from subtracting denominators, which does not preserve the size of the parts.',
      },
      {
        title: 'Multiplication scales; division asks how many',
        text: 'Multiplying by 2/3 takes two thirds of a quantity. Dividing by a nonzero fraction reverses that scaling, so multiply by its reciprocal. Division by zero remains undefined. A product can be smaller than either positive factor when the factors lie between zero and one.',
        math: String.raw`\frac{3}{4}\div\frac{2}{5}=\frac{3}{4}\cdot\frac{5}{2}=\frac{15}{8}`,
        example:
          'There are three half-cups in 1½ cups: (3/2) ÷ (1/2) = 3. You invert the divisor, not the number being divided.',
      },
    ],
  },
  {
    id: 'pre-powers',
    objectives: ["Positive integer exponents count repeated factors; product and power rules follow from counting those factors.", "For a nonzero base, exponent zero gives 1 and a negative exponent gives a reciprocal.", "The square-root symbol gives the nonnegative root; x² = a can have two real solutions when a > 0."],
    title: 'Powers, roots & repeated multiplication',
    minutes: 30,
    concepts: ['algebra.fractions', 'algebra.signed-numbers'],
    sections: [
      {
        title: 'An exponent counts factors',
        text: 'For a positive integer n, aⁿ means n factors of a multiplied together. It does not mean a times n. When multiplying powers with the same base, combine their lists of factors. When raising a power to a power, repeat the whole list.',
        math: String.raw`a^m a^n=a^{m+n},\qquad (a^m)^n=a^{mn}`,
        example:
          '2³ · 2² = (2·2·2)(2·2) = 2⁵ = 32. By contrast, 2³ + 2² = 8 + 4 = 12; the product rule does not apply to addition.',
      },
      {
        title: 'Zero and negative exponents',
        text: 'For a nonzero base, reducing the exponent by one divides the value by the base. This gives a⁰ = 1 and a negative exponent as a reciprocal. A negative exponent does not mean a negative answer.',
        math: String.raw`a^0=1,\qquad a^{-n}=\frac{1}{a^n}\quad(a\ne0)`,
        example:
          '10² = 100, 10¹ = 10, 10⁰ = 1, and 10⁻² = 0.01. Scientific notation 3.2 × 10⁴ means 32,000. We do not apply these reciprocal rules to a base of zero.',
      },
      {
        title: 'Principal square roots and quadratic equations',
        text: 'The square-root symbol denotes the nonnegative root. Solving an equation is a different task: both 5 and −5 solve x² = 25. Because square roots return nonnegative values, √(x²) = |x| for real x.',
        math: String.raw`\sqrt{25}=5,\qquad x^2=25\Longrightarrow x=5\text{ or }x=-5`,
        example:
          '√((-7)²) = √49 = 7, not −7. Also, √(9+16) = √25 = 5, whereas √9 + √16 = 7. Square roots do not distribute over addition.',
      },
    ],
  },
  {
    id: 'pre-ratios',
    objectives: ["Equivalent ratios scale both quantities by the same factor.", "A proportional relationship has a constant unit rate and zero output at zero input.", "Percentage change is relative to a specified base and can be represented by a multiplier."],
    title: 'Ratios, rates, and percentages',
    minutes: 35,
    concepts: ['algebra.ratios', 'algebra.fractions'],
    sections: [
      {
        title: 'Ratios compare quantities',
        text: 'A ratio compares by division; a difference compares by subtraction. If a recipe uses 2 cups of oats for every 3 cups of milk, doubling both quantities preserves the ratio. Adding the same amount to each generally does not.',
        math: String.raw`\frac{2}{3}=\frac{4}{6}\ne\frac{3}{4}`,
        example:
          'For 9 cups of milk, multiply both parts of 2:3 by 3, giving 6 cups of oats. The fraction of the mixture that is oats is 2/(2+3) = 2/5, not 2/3.',
      },
      {
        title: 'A unit rate makes comparisons easier',
        text: 'A rate compares quantities with different units. Divide to obtain the amount per one unit. In a proportional relationship y = kx, k is constant and zero input gives zero output. A fixed starting fee breaks proportionality even when the variable rate is constant.',
        math: String.raw`y=kx`,
        example:
          'Six notebooks cost $15, so the price is $2.50 per notebook. At that constant unit price, ten cost $25. A taxi fare of $4 plus $2 per kilometer is linear but not proportional.',
      },
      {
        title: 'Percent means per hundred',
        text: 'Convert p percent to p/100 before multiplying. A percentage change is measured relative to a stated starting amount. Successive percentage changes use different bases, so equal increases and decreases do not usually cancel.',
        math: String.raw`\text{new amount}=\text{old amount}\,(1+r)`,
        example:
          'A $60 item discounted by 20% costs 60(0.8) = $48. If $100 increases by 10% and then decreases by 10%, the result is 100(1.1)(0.9) = $99.',
      },
    ],
  },
  {
    id: 'alg-expressions',
    objectives: ["Substitution evaluates an expression; an equation asserts equality between expressions.", "Like terms have the same variable part and combine by adding their coefficients.", "Distribution and factoring preserve the value of an expression for every allowed input."],
    title: 'Expressions, substitution, and equivalence',
    minutes: 35,
    concepts: ['algebra.expressions', 'algebra.signed-numbers'],
    sections: [
      {
        title: 'An expression is a rule for a value',
        text: 'A variable represents a number whose value may be unknown or may vary. An expression has a value once its variables are specified. An equation asserts that two expressions are equal. Substitution must preserve grouping, especially when substituting negative numbers.',
        math: String.raw`2x^2-3x\quad\text{at }x=-2:\quad2(-2)^2-3(-2)=14`,
        example:
          'The expression 3x + 7 does not itself ask you to find x. The equation 3x + 7 = 22 does. Parentheses prevent sign mistakes when evaluating an expression.',
      },
      {
        title: 'Like terms count the same thing',
        text: 'The terms 3x and 5x share the same variable part, so their coefficients add. Terms such as x and x² represent different quantities and cannot be combined into one like term. Constants combine with constants.',
        math: String.raw`3x+5x-2=8x-2`,
        example:
          '4x + 3 − 2x + 7 = 2x + 10. But 4x + 3x² stays as two terms. At x=2 it equals 20, while 7x³ would equal 56, so that proposed simplification fails.',
      },
      {
        title: 'Distribute to every term',
        text: 'Multiplication distributes over addition and subtraction. A negative sign before parentheses acts as multiplication by −1. Factoring reverses distribution by identifying a common multiplier.',
        math: String.raw`a(b+c)=ab+ac,\qquad 6x+9=3(2x+3)`,
        example:
          '−2(3x − 4) = −6x + 8. Also, 5 − (x + 2) = 5 − x − 2 = 3 − x. Testing a few values can disprove a proposed identity, but proving it for all values requires valid algebraic transformations.',
      },
    ],
  },
  {
    id: 'alg-equations',
    objectives: ["A solution is an allowed value that makes an equation true.", "Reversible operations on both sides preserve the solution set.", "A linear equation may have one solution, no solutions, or every real number as a solution."],
    title: 'Equivalent equations and solutions',
    minutes: 40,
    concepts: ['algebra.equations', 'algebra.expressions'],
    sections: [
      {
        title: 'Solutions make a statement true',
        text: 'Solving an equation means finding every allowed value that makes the equality true. Adding the same quantity to both sides or multiplying both sides by a nonzero number gives an equivalent equation. Do not divide by an expression that could be zero without considering that case.',
        math: String.raw`3x+7=22\Longleftrightarrow3x=15\Longleftrightarrow x=5`,
        example:
          'Check by substitution: 3(5) + 7 = 22. “Move 7 and change its sign” is shorthand for subtracting 7 from both sides; the balanced operation is the reason it works.',
      },
      {
        title: 'Solving linear equations',
        text: 'Distribute and collect like terms when needed. Then collect variable terms on one side and constants on the other. With fractions, multiplying every term on both sides by a common nonzero denominator can simplify the arithmetic.',
        math: String.raw`2(x-3)=x+5\Longleftrightarrow2x-6=x+5\Longleftrightarrow x=11`,
        example:
          'x/3 + 2 = 5 gives x/3 = 3 and x = 9. Alternatively, multiply every term by 3: x + 6 = 15. Multiplying only one term would change the equation.',
      },
      {
        title: 'Not every equation has one solution',
        text: 'If the variables cancel, inspect what remains. A true statement means every allowed real value is a solution. A false statement means there are no solutions. Neither case should be forced into “x = 0.”',
        example:
          '2(x+1) = 2x+2 reduces to 2 = 2, true for every real x. But 2(x+1) = 2x+5 reduces to 2 = 5, so there is no solution.',
      },
      {
        title: 'Translate a situation and check its meaning',
        text: 'Define the variable with its units before writing an equation. An algebraic answer must also fit the situation, including restrictions such as nonnegative counts or whole numbers.',
        example:
          'A membership costs $12 plus $4 per visit. If the total is $40, let v be visits: 12 + 4v = 40. Then v = 7, a valid nonnegative integer. Check: 12 + 4(7) = 40.',
      },
    ],
  },
  {
    id: 'alg-inequalities',
    objectives: ["An inequality describes a set of values; strict inequalities exclude the boundary.", "Multiplying or dividing both sides by a negative number reverses the inequality.", "A solution must also satisfy restrictions from the situation, such as nonnegative integer counts."],
    title: 'Inequalities and solution sets',
    minutes: 30,
    concepts: ['algebra.inequalities', 'algebra.equations'],
    sections: [
      {
        title: 'Strict and inclusive inequalities',
        text: 'An inequality describes a set of values. The symbols < and > exclude the boundary; ≤ and ≥ include it. On a number line, use an open endpoint for a strict inequality and a closed endpoint for an included boundary.',
        math: String.raw`x<3\quad\text{means every real value less than }3`,
        example:
          'Both 2 and −100 satisfy x < 3, but 3 does not. The solution is not just the largest integer below the boundary: real numbers such as 2.9 also qualify.',
      },
      {
        title: 'Negative scaling reverses order',
        text: 'Adding the same quantity preserves order. Multiplying or dividing by a positive number also preserves it. Multiplying or dividing by a negative number reverses order because it reflects the number line.',
        math: String.raw`-2x<6\Longleftrightarrow x>-3`,
        example:
          'Since 2 < 5, multiplying by −1 gives −2 > −5. For −2x < 6, test x=0: 0<6 is true. It belongs to x>−3, not x<−3.',
      },
      {
        title: 'Translate constraints precisely',
        text: '“At most” includes the maximum; “less than” excludes it. A real-valued solution set may need to be restricted to whole numbers in a counting problem. Test both a boundary value and a value away from it.',
        example:
          'A budget of $25 covers a $5 fee and $4 tickets. The inequality 5 + 4t ≤ 25 gives t ≤ 5. Since tickets are nonnegative whole numbers, the possible counts are 0,1,2,3,4,5.',
      },
    ],
  },
  {
    id: 'alg-functions',
    objectives: ["A function assigns exactly one output to each input in its domain.", "Slope is change in output divided by change in input; the intercept is the output at input zero.", "A linear relationship is proportional exactly when its intercept is zero."],
    title: 'Functions, slope, and intercept',
    minutes: 40,
    concepts: ['algebra.functions', 'algebra.equations', 'algebra.ratios'],
    sections: [
      {
        title: 'One output for each allowed input',
        text: 'A function assigns exactly one output to each input in its domain. Different inputs may share an output. The notation f(x) names the output produced by input x; it does not mean f multiplied by x.',
        math: String.raw`f(x)=2x+3,\qquad f(4)=11`,
        example:
          'The pairs {(1,4),(2,4),(3,7)} define a function on {1,2,3}. The pairs {(1,4),(1,6)} do not: input 1 has two outputs. A real function f(x)=1/x excludes zero from its domain.',
      },
      {
        title: 'Slope measures change per input unit',
        text: 'A linear function y = mx + b has constant slope m. Compute slope as the change in output divided by the corresponding nonzero change in input. Use the same point order in numerator and denominator. The intercept b is the output when x = 0.',
        math: String.raw`m=\frac{y_2-y_1}{x_2-x_1}\quad(x_2\ne x_1)`,
        example:
          'Through (2,7) and (5,13), m = (13−7)/(5−2) = 2. Substitute a point into y=2x+b: 7=4+b, so b=3. The rule is y=2x+3. A vertical line has zero input change, so its slope is undefined and it is not a function y of x.',
      },
      {
        title: 'Distinguish linear from proportional',
        text: 'A proportional relationship y = kx is a linear function with intercept zero. Constant rate alone does not make a relationship proportional. Interpret the slope and intercept in the units of the situation.',
        example:
          'A tank starts with 8 liters and fills at 3 liters per minute: V(t)=8+3t for t≥0 while the model remains valid. The slope is 3 liters per minute, and the intercept is the starting 8 liters. The relationship is linear but not proportional.',
      },
      {
        title: 'Move between rule, table, and graph',
        text: 'A graph is a set of input-output pairs. Evaluate a rule to build a table, and plot those pairs to see the relationship. Equal input steps produce equal output changes for a linear function. A finite table can suggest a rule, but does not uniquely determine every unobserved value unless a model class is specified.',
        example:
          'For y=2x+3, inputs −1,0,1,2 give outputs 1,3,5,7. Plot (−1,1),(0,3),(1,5),(2,7); all lie on a line. The output increases by 2 each time the input increases by 1.',
      },
    ],
  },
];
// Each activity has independently authored items; IDs are permanent learning-record keys.
const n = (
  id: string,
  prompt: string,
  answer: number,
  concept: string,
  solution: string,
  misconceptions?: Record<string, string>,
): Question => ({
  id,
  prompt,
  answer,
  concept,
  solution,
  misconceptions,
  kind: 'number',
  category: 'calculation',
  tolerance: Math.min(0.001, Math.abs(answer) * 0.001 || 0.000001),
  hint: 'Write the operation or relationship explicitly. Keep signs, units, and grouping visible.',
});
const c = (
  id: string,
  prompt: string,
  options: string[],
  answer: string,
  concept: string,
  solution: string,
  misconceptions?: Record<string, string>,
): Question => ({
  id,
  prompt,
  options,
  answer,
  concept,
  solution,
  misconceptions,
  kind: 'choice',
  category: 'interpretation',
  hint: 'Try a simple example, then check the definition or rule.',
});
const w = (
  id: string,
  prompt: string,
  concept: string,
  solution: string,
  rubric: string[],
): Question => ({
  id,
  prompt,
  concept,
  solution,
  rubric,
  kind: 'written',
  category: 'reasoning',
  hint: 'State the rule, justify it, and use an example to make the reasoning visible.',
});
const a = (
  id: string,
  title: string,
  kind: Activity['kind'],
  questions: Question[],
): Activity => ({
  id,
  title,
  kind,
  questions,
  description: `${questions.length} questions · ${kind === 'diagnostic' ? 'Ungraded starting-point check. No passing score.' : kind === 'quiz' ? 'About 15 minutes. Close your notes; all questions have equal weight.' : kind === 'challenge' ? 'Show your reasoning, then assess it against the rubric.' : 'Work at your own pace. Enter numbers as decimals or simple fractions.'}`,
});
const I = 'algebra.signed-numbers',
  F = 'algebra.fractions',
  R = 'algebra.ratios',
  E = 'algebra.expressions',
  Q = 'algebra.equations',
  N = 'algebra.inequalities',
  U = 'algebra.functions';
export const algebraActivities: Activity[] = [
  a('pre-diagnostic', 'Pre-algebra · Prerequisite diagnostic', 'diagnostic', [
    n(
      'pd1',
      'Evaluate −3 + 8.',
      5,
      I,
      'Move 8 places right from −3 to reach 5.',
    ),
    n('pd2', 'Evaluate 6 − 2 × 2.', 2, I, 'Multiply first: 6−4=2.'),
    n('pd3', 'Evaluate 1/2 + 1/4.', 0.75, F, '2/4+1/4=3/4.'),
    n('pd4', 'Evaluate 3².', 9, F, '3² means 3×3=9, not 3×2.'),
    n('pd5', 'Find 10% of 80.', 8, R, '10/100×80=8.'),
    n(
      'pd6',
      'Four identical pens cost $6. What is the price of one pen?',
      1.5,
      R,
      'Divide the total price by 4: $1.50 per pen.',
    ),
  ]),
  a('pre-practice-1', 'Pre-algebra · Signed numbers & fractions', 'worksheet', [
    n('pw1', 'Evaluate −7 − (−2).', -5, I, 'Subtracting −2 adds 2: −7+2=−5.', {
      '-9': 'subtracting-negative',
    }),
    n(
      'pw2',
      'Evaluate (−4)(−6).',
      24,
      I,
      'Two negative factors have a positive product: 24.',
    ),
    n(
      'pw3',
      'Evaluate 18 ÷ 3 × 2.',
      12,
      I,
      'Division and multiplication have equal priority; proceed left to right: 6×2=12.',
      { '3': 'multiplication-before-division' },
    ),
    n('pw4', 'Evaluate |−12|.', 12, I, 'Distance from zero is 12.'),
    n('pw5', 'Evaluate 2/3 + 1/6.', 5 / 6, F, 'Use sixths: 4/6+1/6=5/6.'),
    n(
      'pw6',
      'Evaluate 5/6 − 1/4.',
      7 / 12,
      F,
      'Use twelfths: 10/12−3/12=7/12.',
    ),
    n(
      'pw7',
      'Evaluate (3/4) × (2/5).',
      0.3,
      F,
      'Multiply numerators and denominators: 6/20=3/10.',
    ),
    n(
      'pw8',
      'Evaluate (3/4) ÷ (1/2).',
      1.5,
      F,
      'Multiply by the reciprocal of the divisor: (3/4)×2=3/2.',
      { '.375': 'multiply-instead-of-divide' },
    ),
  ]),
  a('pre-quiz-1', 'Pre-algebra · Checkpoint 1', 'quiz', [
    n('pq1', 'Evaluate −9 + 4 − (−3).', -2, I, '−9+4+3=−2.'),
    n('pq2', 'Evaluate 20 ÷ 5 × 3 − 2.', 10, I, '4×3−2=10.'),
    n('pq3', 'Evaluate 3/5 + 1/4.', 17 / 20, F, '12/20+5/20=17/20.'),
    n('pq4', 'Evaluate (2/3) ÷ (4/9).', 1.5, F, '(2/3)×(9/4)=18/12=3/2.'),
    w(
      'pq5',
      'Why must fractions have a common denominator before their numerators are added?',
      F,
      'The denominator identifies the size of the parts. Rewrite each fraction using equally sized parts before counting them together. For example 1/2+1/3=3/6+2/6=5/6.',
      [
        'Explain what the denominator represents.',
        'Use equally sized parts in an example.',
        'Add numerators while keeping that common denominator.',
      ],
    ),
  ]),
  a(
    'pre-practice-2',
    'Pre-algebra · Powers, ratios & percentages',
    'worksheet',
    [
      n('pw9', 'Evaluate 2³ × 2⁴.', 128, F, 'Same base: 2⁷=128.'),
      n('pw10', 'Evaluate 5⁰.', 1, F, 'A nonzero base to power zero equals 1.'),
      n(
        'pw11',
        'Evaluate 10⁻³.',
        0.001,
        F,
        'The negative exponent gives 1/1000.',
      ),
      n(
        'pw12',
        'Evaluate √81.',
        9,
        F,
        'The square-root symbol gives the nonnegative root, 9.',
      ),
      n(
        'pw13',
        'A ratio is 3 cups flour to 2 cups water. How much flour for 8 cups water?',
        12,
        R,
        'Scale both quantities by 4: 3×4=12 cups.',
      ),
      n(
        'pw14',
        'Five notebooks cost $17.50. What is the unit price?',
        3.5,
        R,
        '17.50÷5=$3.50 per notebook.',
      ),
      n(
        'pw15',
        'An $80 item is discounted by 25%. What is the new price?',
        60,
        R,
        '80×0.75=60; the discount itself is $20.',
        { '20': 'confusing-discount-with-price' },
      ),
      n(
        'pw16',
        'A quantity rises from 40 to 50. What is the percent increase? Enter the percent number.',
        25,
        R,
        'The increase is 10, relative to the initial 40: 10/40×100=25.',
        { '20': 'wrong-percent-base' },
      ),
    ],
  ),
  a('pre-quiz-2', 'Pre-algebra · Checkpoint 2', 'quiz', [
    n('pq6', 'Evaluate (3²)².', 81, F, '(3²)²=3⁴=81.'),
    n('pq7', 'Evaluate 2⁻³.', 0.125, F, '1/2³=1/8.'),
    n(
      'pq8',
      'A drink mixes juice and water in ratio 2:5. For 15 cups of water, how many cups of juice?',
      6,
      R,
      'Scale 5 to 15 by 3; juice is 2×3=6.',
    ),
    n(
      'pq9',
      'A $50 bill increases by 12%. What is the new amount?',
      56,
      R,
      '50×1.12=56.',
    ),
    c(
      'pq10',
      'Which relationship is proportional?',
      ['y = 4x', 'y = 4x + 3', 'y = x²'],
      'y = 4x',
      R,
      'A proportional relationship has a constant y/x for nonzero x and passes through the origin.',
    ),
  ]),
  a('pre-challenge', 'Pre-algebra · Explain the rules', 'challenge', [
    w(
      'pc1',
      'Use the distributive property to explain why (−2)(−3)=6.',
      I,
      'Because (−2)(3+(−3))=0, we have −6+(−2)(−3)=0. The remaining product must therefore be 6.',
      [
        'Start from a sum equal to zero.',
        'Distribute −2 across both terms.',
        'Use the known product −6 to deduce the other product.',
      ],
    ),
    w(
      'pc2',
      'Explain why increasing a positive price by 20% and then decreasing it by 20% does not restore it.',
      R,
      'The multipliers are 1.2 and 0.8, so the final price is 0.96 times the original. The decrease is applied to the higher price; the final amount is 4% below the original.',
      [
        'Use the multipliers 1.2 and 0.8.',
        'Explain that the second percentage has a different base.',
        'Obtain 0.96 of the starting price and interpret it.',
      ],
    ),
  ]),
  a('pre-review', 'Pre-algebra · Fresh retrieval practice', 'review', [
    n('pr1', 'Evaluate −5(2−6).', 20, I, 'First 2−6=−4; then (−5)(−4)=20.'),
    n('pr2', 'Evaluate 7/8 − 1/3.', 13 / 24, F, '21/24−8/24=13/24.'),
    n('pr3', 'Evaluate 4⁻¹.', 0.25, F, '4⁻¹=1/4.'),
    n(
      'pr4',
      'A model uses 1 cm for 5 m. What real distance in meters does 7 cm represent?',
      35,
      R,
      'Multiply 7 by the constant rate 5 m per cm.',
    ),
    n('pr5', 'Find 15% of 60.', 9, R, '0.15×60=9.'),
    c(
      'pr6',
      'Which is true?',
      ['√(9+16)=7', '√25=5', 'The only solution of x²=25 is 5'],
      '√25=5',
      F,
      'The principal square root is 5. The equation has solutions ±5, and √(9+16)=5.',
    ),
  ]),
  a('alg-diagnostic', 'Algebra I · Prerequisite diagnostic', 'diagnostic', [
    n('ad1', 'Evaluate −6 + 10.', 4, I, 'Move 10 units right from −6.'),
    n('ad2', 'Evaluate 3/4 − 1/2.', 0.25, F, '3/4−2/4=1/4.'),
    n('ad3', 'Evaluate 2x+3 at x=4.', 11, E, 'Substitute 4: 8+3=11.'),
    n('ad4', 'Solve x + 7 = 12.', 5, Q, 'Subtract 7 from both sides.'),
    n(
      'ad5',
      'Three tickets cost $21 at a constant unit price. What is the price of one?',
      7,
      R,
      '21÷3=7.',
    ),
    c(
      'ad6',
      'Which is an equation?',
      ['3x + 2', '3x + 2 = 11', '3x'],
      '3x + 2 = 11',
      E,
      'An equation states that two expressions have equal values.',
    ),
  ]),
  a('alg-practice-1', 'Algebra I · Expressions & equations', 'worksheet', [
    n('aw1', 'Evaluate 2x²−3x when x=−2.', 14, E, '2(−2)²−3(−2)=8+6=14.'),
    c(
      'aw2',
      'Simplify 4x + 3 − 2x + 7.',
      ['2x + 10', '2x + 4', '12x'],
      '2x + 10',
      E,
      'Combine x terms and constants separately: (4−2)x+(3+7).',
    ),
    c(
      'aw3',
      'Expand −3(2x−5).',
      ['−6x−15', '−6x+15', '−6x+5'],
      '−6x+15',
      E,
      'Multiply every term by −3; (−3)(−5)=15.',
      { '−6x−15': 'negative-distribution' },
    ),
    n('aw4', 'Solve 3x+7=25.', 6, Q, 'Subtract 7: 3x=18. Divide by 3: x=6.'),
    n(
      'aw5',
      'Solve 2(x−3)=x+5.',
      11,
      Q,
      '2x−6=x+5; subtract x and add 6 to obtain x=11.',
    ),
    n('aw6', 'Solve x/4+2=7.', 20, Q, 'Subtract 2, then multiply by 4: x=20.'),
    c(
      'aw7',
      'How many real solutions does 3(x+2)=3x+6 have?',
      ['None', 'Exactly one', 'Every real number'],
      'Every real number',
      Q,
      'Both sides are identical after expansion.',
    ),
    n(
      'aw8',
      'A service costs $8 plus $3 per use. A bill totals $29. How many uses?',
      7,
      Q,
      '8+3u=29, so 3u=21 and u=7.',
    ),
  ]),
  a('alg-quiz-1', 'Algebra I · Checkpoint 1', 'quiz', [
    n('aq1', 'Evaluate 3x²+2 at x=−3.', 29, E, '3×9+2=29.'),
    c(
      'aq2',
      'Simplify 7−(2x+4).',
      ['3−2x', '11−2x', '3+2x'],
      '3−2x',
      E,
      'Distribute the minus sign: 7−2x−4=3−2x.',
    ),
    n(
      'aq3',
      'Solve 5x−4=2x+11.',
      5,
      Q,
      'Subtract 2x, add 4, then divide by 3: 3x=15.',
    ),
    c(
      'aq4',
      'How many real solutions does 2x+3=2x−1 have?',
      ['None', 'Exactly one', 'Every real number'],
      'None',
      Q,
      'Subtracting 2x gives 3=−1, a false statement.',
    ),
    w(
      'aq5',
      'Explain why subtracting 7 from both sides of 3x+7=22 preserves its solutions.',
      Q,
      'Equal quantities remain equal after subtracting the same number. The operation can be reversed by adding 7 to both sides, so it neither loses nor introduces solutions.',
      [
        'Apply the same operation to both sides.',
        'Explain preservation of equality.',
        'Explain reversibility or check the resulting solution.',
      ],
    ),
  ]),
  a('alg-practice-2', 'Algebra I · Inequalities & functions', 'worksheet', [
    c(
      'aw9',
      'Solve −3x ≤ 12.',
      ['x ≤ −4', 'x ≥ −4', 'x ≥ 4'],
      'x ≥ −4',
      N,
      'Divide both sides by −3 and reverse the inequality.',
      { 'x ≤ −4': 'inequality-direction' },
    ),
    c(
      'aw10',
      'Which value does NOT satisfy x < 2?',
      ['−4', '1.9', '2'],
      '2',
      N,
      'A strict inequality excludes its boundary.',
    ),
    n(
      'aw11',
      'A $6 fee plus $4 per ticket must total at most $30. What is the greatest whole number of tickets?',
      6,
      N,
      '6+4t≤30 gives t≤6; 6 is an allowed integer.',
    ),
    n('aw12', 'For f(x)=−2x+5, find f(3).', -1, U, '−2×3+5=−1.'),
    n(
      'aw13',
      'Find the slope through (1,4) and (4,10).',
      2,
      U,
      '(10−4)/(4−1)=6/3=2.',
      {
        '.5': 'reciprocal-slope',
      },
    ),
    n(
      'aw14',
      'A line has slope 3 and passes through (2,11). Find its y-intercept.',
      5,
      U,
      '11=3×2+b, so b=5.',
    ),
    c(
      'aw15',
      'Which relation is a function of its first coordinate?',
      ['{(1,2),(1,3)}', '{(1,2),(2,2)}'],
      '{(1,2),(2,2)}',
      U,
      'Each input has one output; distinct inputs may share an output.',
    ),
    c(
      'aw16',
      'A taxi fare is C(d)=4+2d. What does 4 mean?',
      ['Cost per kilometer', 'Starting fee', 'Maximum distance'],
      'Starting fee',
      U,
      'C(0)=4, the charge before traveling any distance.',
    ),
  ]),
  a('alg-quiz-2', 'Algebra I · Checkpoint 2', 'quiz', [
    c(
      'aq6',
      'Solve −2x > 8.',
      ['x > −4', 'x < −4', 'x < 4'],
      'x < −4',
      N,
      'Dividing by −2 reverses the direction.',
      { 'x > −4': 'inequality-direction' },
    ),
    n('aq7', 'For g(x)=3x−7, find g(5).', 8, U, '15−7=8.'),
    n(
      'aq8',
      'Find the slope through (−1,6) and (2,0).',
      -2,
      U,
      '(0−6)/(2−(−1))=−6/3=−2.',
    ),
    c(
      'aq9',
      'Which function describes a proportional relationship?',
      ['f(x)=5x', 'f(x)=5x+1', 'f(x)=x²'],
      'f(x)=5x',
      U,
      'A proportional relationship has a constant multiplier and zero intercept.',
    ),
    w(
      'aq10',
      'A tank starts with 10 liters and gains 2 liters each minute. State a function for its volume and interpret both numbers.',
      U,
      'V(t)=10+2t for t≥0 while the model applies. Ten liters is the starting amount; 2 liters per minute is the rate.',
      [
        'Write V(t)=10+2t with t in minutes.',
        'Interpret the intercept with units.',
        'Interpret the slope with units and acknowledge the time domain or model limits.',
      ],
    ),
  ]),
  a('alg-challenge', 'Algebra I · Equivalence and proportionality', 'challenge', [
    w(
      'ac1',
      'Prove that 2(x+3)−x and x+6 are equal for every real x. Explain why checking one value alone is insufficient.',
      E,
      'Distribution gives 2x+6−x=x+6 for arbitrary real x. One matching value does not guarantee equality elsewhere; x and x² agree at 1 but differ at 2.',
      [
        'Distribute and collect terms correctly.',
        'Explain why the steps hold for arbitrary x.',
        'Explain or illustrate why one example does not prove an identity.',
      ],
    ),
    w(
      'ac2',
      'Explain why a line with equation y=mx+b is proportional precisely when b=0.',
      U,
      'If b=0 then y=mx has constant multiplier m. Conversely, a proportional rule y=kx gives y=0 at x=0, but the line gives y=b there, so b must be 0.',
      [
        'Connect b=0 with a constant multiplier.',
        'Evaluate the rule at x=0.',
        'Explain both directions of the statement.',
      ],
    ),
  ]),
  a('alg-review', 'Algebra I · Fresh retrieval practice', 'review', [
    n('ar1', 'Evaluate 4−2x at x=−3.', 10, E, '4−2(−3)=4+6=10.'),
    n('ar2', 'Solve 4(x+1)=20.', 4, Q, 'Divide by 4, then subtract 1: x=4.'),
    c(
      'ar3',
      'Solve −5x ≥ 15.',
      ['x ≥ −3', 'x ≤ −3', 'x ≤ 3'],
      'x ≤ −3',
      N,
      'Divide by −5 and reverse the inequality.',
      { 'x ≥ −3': 'inequality-direction' },
    ),
    n(
      'ar4',
      'Find the slope through (0,−2) and (4,10).',
      3,
      U,
      '(10−(−2))/(4−0)=12/4=3.',
    ),
    n('ar5', 'For h(x)=x/2+3, find h(8).', 7, U, '8/2+3=7.'),
    c(
      'ar6',
      'Which input is excluded from the real domain of f(x)=1/x?',
      ['−1', '0', '1'],
      '0',
      U,
      'Division by zero is undefined.',
    ),
  ]),
];
