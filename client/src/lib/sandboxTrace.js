const MAX_SANDBOX_VALUES = 10;

function formatArray(values) {
  return `[${values.join(', ')}]`;
}

function isSortedAscending(values) {
  return values.every((value, index) => index === 0 || values[index - 1] <= value);
}

export function parseSandboxNumbers(input) {
  const values = input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map(Number);

  if (values.length < 2) {
    return {
      error: 'Enter at least two numbers separated by commas.',
      values: [],
    };
  }

  if (values.length > MAX_SANDBOX_VALUES) {
    return {
      error: `Keep the lab to ${MAX_SANDBOX_VALUES} numbers or fewer so the trace stays readable.`,
      values: [],
    };
  }

  if (values.some((value) => !Number.isFinite(value))) {
    return {
      error: 'Use numbers only. Example: 2, 4, 7, 11, 15',
      values: [],
    };
  }

  return {
    error: null,
    values,
  };
}

export function parseSandboxTarget(input) {
  const target = Number(input);

  if (!Number.isFinite(target)) {
    return {
      error: 'Enter a numeric target value.',
      target: null,
    };
  }

  return {
    error: null,
    target,
  };
}

function buildPrediction({ direction, left, right, sum, target }) {
  if (direction === 'match') {
    return {
      correctOptionId: 'stop',
      prompt: `The sum is ${sum}, which matches ${target}. What should happen next?`,
      options: [
        {
          id: 'stop',
          label: 'Stop and return this pair',
          feedback: 'Exactly. The condition is satisfied, so more pointer movement would only lose the answer.',
        },
        {
          id: 'move-left',
          label: 'Move left anyway',
          feedback: 'That would skip a valid pair after already finding it.',
        },
        {
          id: 'move-right',
          label: 'Move right anyway',
          feedback: 'That would also move away from the pair that already works.',
        },
      ],
    };
  }

  if (direction === 'left') {
    return {
      correctOptionId: 'move-left',
      prompt: `The sum is ${sum}, which is smaller than ${target}. Which pointer should move?`,
      options: [
        {
          id: 'move-left',
          label: `Move left from index ${left}`,
          feedback: 'Correct. On a sorted array, moving left rightward is the move that can make the sum larger.',
        },
        {
          id: 'move-right',
          label: `Move right from index ${right}`,
          feedback: 'Moving right leftward would usually make the sum even smaller.',
        },
        {
          id: 'restart',
          label: 'Restart the search',
          feedback: 'No restart is needed. The sorted order tells us how to shrink the search.',
        },
      ],
    };
  }

  return {
    correctOptionId: 'move-right',
    prompt: `The sum is ${sum}, which is larger than ${target}. Which pointer should move?`,
    options: [
      {
        id: 'move-left',
        label: `Move left from index ${left}`,
        feedback: 'Moving left rightward would usually make the sum even larger.',
      },
      {
        id: 'move-right',
        label: `Move right from index ${right}`,
        feedback: 'Correct. On a sorted array, moving right leftward is the move that can make the sum smaller.',
      },
      {
        id: 'restart',
        label: 'Restart the search',
        feedback: 'No restart is needed. The current comparison already tells us which side to discard.',
      },
    ],
  };
}

function buildFrame({ direction, index, left, right, sortedValues, sum, target }) {
  const leftValue = sortedValues[left];
  const rightValue = sortedValues[right];
  const isMatch = direction === 'match';
  const directionCopy =
    direction === 'match'
      ? 'The pair matches the target, so the search can stop.'
      : direction === 'left'
        ? 'The sum is too small, so move the left pointer toward a larger value.'
        : 'The sum is too large, so move the right pointer toward a smaller value.';
  const status =
    direction === 'match'
      ? `Match found: ${leftValue} + ${rightValue} = ${target}.`
      : `${leftValue} + ${rightValue} = ${sum}. ${directionCopy}`;

  return {
    activeCodeLineIds:
      direction === 'match'
        ? ['check-match']
        : direction === 'left'
          ? ['sum-too-small', 'move-left']
          : ['sum-too-large', 'move-right'],
    activeStepId:
      direction === 'match' ? 'found' : direction === 'left' ? 'move-left' : 'move-right',
    comparisonText: `${leftValue} + ${rightValue} = ${sum}`,
    decision: directionCopy,
    explanation:
      'The lab reads the current outer pair first, then uses the sorted order to decide which side can be discarded.',
    id: `sandbox-frame-${index}`,
    markers: [
      { index: left, label: 'left', tone: 'accent' },
      { index: right, label: 'right', tone: 'ink' },
    ],
    matchedIndices: isMatch ? [left, right] : [],
    prediction: buildPrediction({ direction, left, right, sum, target }),
    status,
    teaching: {
      beginnerNote:
        'A pointer is just an index. The important question is why this index should stay or move.',
      watchFor:
        direction === 'left'
          ? 'Moving left rightward raises the left value in a sorted array.'
          : direction === 'right'
            ? 'Moving right leftward lowers the right value in a sorted array.'
            : 'Once the condition is true, the algorithm should stop.',
      whyAllowed:
        'Sorted order makes one side predictable. That is what lets the trace safely ignore values outside the new window.',
    },
    title:
      direction === 'match'
        ? 'The current pair works'
        : direction === 'left'
          ? 'Current sum is too small'
          : 'Current sum is too large',
    variables: [
      { label: 'left index', value: left },
      { label: 'right index', value: right },
      { label: 'current sum', value: sum },
      { label: 'target', value: target },
    ],
  };
}

export function buildTwoPointerSandboxTrace({ target, values }) {
  const sortedValues = [...values].sort((left, right) => left - right);
  const wasAlreadySorted = isSortedAscending(values);
  const frames = [];
  let left = 0;
  let right = sortedValues.length - 1;

  while (left < right && frames.length < MAX_SANDBOX_VALUES) {
    const sum = sortedValues[left] + sortedValues[right];
    const direction = sum === target ? 'match' : sum < target ? 'left' : 'right';

    frames.push(
      buildFrame({
        direction,
        index: frames.length,
        left,
        right,
        sortedValues,
        sum,
        target,
      }),
    );

    if (direction === 'match') {
      break;
    }

    if (direction === 'left') {
      left += 1;
    } else {
      right -= 1;
    }
  }

  if (frames.length === 0 || !frames.at(-1).matchedIndices.length) {
    frames.push({
      activeCodeLineIds: ['no-match'],
      activeStepId: 'done',
      comparisonText: left >= right ? 'No unchecked pair remains' : 'Search stopped',
      decision:
        'The pointers crossed without finding a pair, so this sorted input has no two values that hit the target.',
      explanation:
        'When left and right meet or cross, every useful pair has already been considered or discarded.',
      id: `sandbox-frame-${frames.length}`,
      markers: Number.isInteger(left)
        ? [{ index: Math.min(left, sortedValues.length - 1), label: 'left', tone: 'muted' }]
        : [],
      matchedIndices: [],
      status: 'No pair found for this target.',
      teaching: {
        beginnerNote:
          'No match is still a useful result. It means the shrinking search space has been exhausted.',
        watchFor: 'The stopping condition is left >= right.',
        whyAllowed:
          'Every move discarded a side that could not lead to the target under sorted order.',
      },
      title: 'The search space is empty',
      variables: [
        { label: 'left index', value: Math.min(left, sortedValues.length - 1) },
        { label: 'right index', value: Math.max(right, 0) },
        { label: 'target', value: target },
        { label: 'result', value: 'no pair' },
      ],
    });
  }

  return {
    algorithmSteps: [
      {
        detail: 'Start with the smallest and largest values in the sorted array.',
        id: 'setup',
        label: 'Place both pointers',
      },
      {
        detail: 'Compare the current pair to the target.',
        id: 'compare',
        label: 'Read the sum',
      },
      {
        detail: 'Move left when the sum is too small.',
        id: 'move-left',
        label: 'Raise the sum',
      },
      {
        detail: 'Move right when the sum is too large.',
        id: 'move-right',
        label: 'Lower the sum',
      },
      {
        detail: 'Stop when a pair is found or the window is empty.',
        id: 'found',
        label: 'Return the result',
      },
      {
        detail: 'If the pointers cross, no pair is available.',
        id: 'done',
        label: 'End the lab',
      },
    ],
    code: {
      language: 'pseudocode',
      lines: [
        { id: 'setup', text: 'left = 0, right = array.length - 1' },
        { id: 'compare', text: 'while left < right: compare array[left] + array[right]' },
        { id: 'check-match', text: 'if sum == target: return the pair' },
        { id: 'sum-too-small', text: 'if sum < target: the sum needs to grow' },
        { id: 'move-left', text: 'left = left + 1' },
        { id: 'sum-too-large', text: 'if sum > target: the sum needs to shrink' },
        { id: 'move-right', text: 'right = right - 1' },
        { id: 'no-match', text: 'return no pair found' },
      ],
      title: 'Two pointer lab algorithm',
    },
    completionRecap: {
      changed:
        'The lab used your input, sorted it for the two-pointer pattern, and moved one pointer after each comparison.',
      learned:
        'You practiced reading the current sum before deciding which pointer should move.',
      next:
        'Try a target that does not exist, then explain why the pointers eventually cross.',
      pattern: 'Custom two-pointer trace',
      remember:
        'On sorted data, too small moves left rightward; too large moves right leftward.',
      stop:
        'The sandbox is for experimentation. One custom walkthrough is enough before returning to the guided lessons.',
    },
    frames,
    lessonId: 'sandbox-two-pointers',
    setup: {
      array: sortedValues,
      target,
      targetLabel: 'Target',
    },
    summary: wasAlreadySorted
      ? `Your sorted input ${formatArray(sortedValues)} is ready for a two-pointer trace.`
      : `Your input was sorted into ${formatArray(sortedValues)} so the two-pointer rule is safe to use.`,
    title: 'Algo-Sandbox: Two Pointers Lab',
  };
}
