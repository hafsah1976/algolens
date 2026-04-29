const pairSumTraceLesson = {
  lessonId: 'pair-sum-trace',
  title: 'Pair Sum with Two Pointers',
  summary:
    'Use a sorted array to see why comparing the outer pair first gives us a fast way to move inward.',
  completionRecap: {
    pattern: 'Two pointers on a sorted array',
    changed:
      'The trace started with the widest pair, moved only the right pointer, and ended when 2 plus 11 matched the target.',
    learned:
      'You used two indexes to compare one pair at a time, then moved only the side that could make the sum better.',
    remember:
      'The sorted order is what makes each move trustworthy. Without that order, moving a pointer would just be a guess.',
    next:
      'Next, look for problems where two edges, two ends, or a shrinking window can reduce the amount of checking.',
    stop:
      'This is a good stopping point: you practiced the reason for the move, not just the motion.',
  },
  setup: {
    array: [2, 4, 7, 11, 15],
    target: 13,
  },
  algorithmSteps: [
    {
      id: 'inspect',
      label: 'Inspect the current pair',
      detail: 'Read the values at the left and right pointers before deciding anything.',
    },
    {
      id: 'compare',
      label: 'Compare the sum to the target',
      detail: 'Check whether the current pair is too small, too large, or exactly correct.',
    },
    {
      id: 'move',
      label: 'Move one pointer on purpose',
      detail: 'When the sum is too large, move right leftward. When it is too small, move left rightward.',
    },
    {
      id: 'finish',
      label: 'Stop when the pair works',
      detail: 'Once the sum matches the target, the search is complete.',
    },
  ],
  code: {
    title: 'Two pointer pair sum',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'left = 0; right = nums.length - 1' },
      { id: 'loop', text: 'while left < right:' },
      { id: 'sum', text: '  sum = nums[left] + nums[right]' },
      { id: 'found', text: '  if sum == target: return [left, right]' },
      { id: 'too-large', text: '  if sum > target: right -= 1' },
      { id: 'too-small', text: '  else: left += 1' },
    ],
  },
  frames: [
    {
      id: 'outer-pair',
      activeStepId: 'inspect',
      activeCodeLineIds: ['setup', 'sum'],
      title: 'Start with the outer pair',
      explanation:
        'Because the array is sorted, we begin at the widest possible pair: 2 on the left and 15 on the right.',
      comparisonText: 'Current sum: 17',
      decision: 'Read the current pair before moving a pointer.',
      status: 'Inspecting indices 0 and 4',
      prediction: {
        prompt: 'Before moving a pointer, what should we do with the two highlighted values?',
        correctOptionId: 'compare-sum',
        options: [
          {
            id: 'compare-sum',
            label: 'Compare their sum to the target',
            feedback: 'Yes. The sum tells us whether the pair is too small, too large, or just right.',
          },
          {
            id: 'move-left',
            label: 'Move the left pointer immediately',
            feedback: 'Not yet. Moving before comparing would turn the pointer move into a guess.',
          },
          {
            id: 'stop-now',
            label: 'Stop because we used both ends',
            feedback: 'Not quite. Using both ends is only the first check, not the finish condition.',
          },
        ],
      },
      mistake: {
        title: 'Moving before reading the pair',
        body: 'Beginners often move a pointer as soon as they see two ends highlighted.',
        fix: 'First calculate the current sum. The comparison is what gives the next move a reason.',
      },
      teaching: {
        beginnerNote:
          'The pointers are just two saved positions. Here, left points at index 0 and right points at index 4.',
        whyAllowed:
          'Starting at the two ends gives us the widest possible pair, which is a useful first comparison in a sorted array.',
        watchFor:
          'Watch the highlighted cells first, then read the sum. The pointer labels explain which two values are being compared.',
      },
      pointers: {
        left: 0,
        right: 4,
      },
      variables: [
        { label: 'left index', value: '0' },
        { label: 'right index', value: '4' },
        { label: 'left value', value: '2' },
        { label: 'right value', value: '15' },
        { label: 'sum', value: '17' },
        { label: 'target', value: '13' },
      ],
    },
    {
      id: 'compare-sum',
      activeStepId: 'compare',
      activeCodeLineIds: ['sum', 'too-large'],
      title: 'Notice that 17 is too large',
      explanation:
        'The sum is larger than the target, so this pair overshoots what we want.',
      comparisonText: '17 is greater than 13',
      decision: 'We need a smaller sum.',
      status: 'The pair is too large',
      prediction: {
        prompt: 'The sum is too large. Which pointer move can make the sum smaller?',
        correctOptionId: 'move-right-left',
        options: [
          {
            id: 'move-right-left',
            label: 'Move right leftward',
            feedback: 'Correct. In a sorted array, moving right leftward tries a smaller value.',
          },
          {
            id: 'move-left-right',
            label: 'Move left rightward',
            feedback: 'That would usually make the sum larger, because left would point to a bigger value.',
          },
          {
            id: 'move-both',
            label: 'Move both pointers',
            feedback: 'That skips a possible comparison. This trace keeps one clear reason for each move.',
          },
        ],
      },
      mistake: {
        title: 'Moving the smaller value when the sum is already too large',
        body: 'Moving left rightward would choose a bigger left value, which usually makes the sum even larger.',
        fix: 'When a sorted pair is too large, move the right pointer left to try a smaller value.',
      },
      teaching: {
        beginnerNote:
          'The current pair adds up to more than the target, so the algorithm needs a smaller number somewhere.',
        whyAllowed:
          'Because the array is sorted from small to large, moving the right pointer left is the move that can lower the sum.',
        watchFor:
          'Notice that the left pointer does not move. Keeping the smaller value lets us test the next smaller right-side value.',
      },
      pointers: {
        left: 0,
        right: 4,
      },
      variables: [
        { label: 'left index', value: '0' },
        { label: 'right index', value: '4' },
        { label: 'left value', value: '2' },
        { label: 'right value', value: '15' },
        { label: 'sum', value: '17' },
        { label: 'target', value: '13' },
      ],
    },
    {
      id: 'move-right',
      activeStepId: 'move',
      activeCodeLineIds: ['too-large'],
      title: 'Move the right pointer inward',
      explanation:
        'Since the sum is too large, we move the right pointer left to try a smaller value.',
      comparisonText: 'Right pointer moves from 15 to 11',
      decision: 'Keep the left pointer where it is and shrink the sum from the right side.',
      status: 'Right pointer moved to index 3',
      prediction: {
        prompt: 'Now the pair is 2 and 11. What should happen next?',
        correctOptionId: 'check-match',
        options: [
          {
            id: 'check-match',
            label: 'Check whether 2 + 11 equals 13',
            feedback: 'Exactly. After a pointer moves, the new pair must be compared again.',
          },
          {
            id: 'move-right-again',
            label: 'Move right again',
            feedback: 'Not before checking. The new sum may already be the answer.',
          },
          {
            id: 'restart',
            label: 'Restart from the ends',
            feedback: 'No need. The pointer move gave us a new useful pair to inspect.',
          },
        ],
      },
      mistake: {
        title: 'Moving again without checking the new pair',
        body: 'After one pointer moves, the new pair might already be the answer.',
        fix: 'Pause after every move and compare the new values before changing another pointer.',
      },
      teaching: {
        beginnerNote:
          'Only one pointer moves at a time. That makes it easier to connect the new visual state to the reason for the move.',
        whyAllowed:
          'Every value to the right of 11 has already been too large with 2, so we do not need to revisit that side.',
        watchFor:
          'Watch the right label move from index 4 to index 3, then compare how the sum changes from 17 to 13.',
      },
      pointers: {
        left: 0,
        right: 3,
      },
      variables: [
        { label: 'left index', value: '0' },
        { label: 'right index', value: '3' },
        { label: 'left value', value: '2' },
        { label: 'right value', value: '11' },
        { label: 'sum', value: '13' },
        { label: 'target', value: '13' },
      ],
    },
    {
      id: 'found-match',
      activeStepId: 'finish',
      activeCodeLineIds: ['sum', 'found'],
      title: 'The new pair matches the target',
      explanation:
        'Now 2 plus 11 equals 13, so the target pair is at indices 0 and 3.',
      comparisonText: '13 equals 13',
      decision: 'Stop here because the pair works exactly.',
      status: 'Match found',
      mistake: {
        title: 'Continuing after the goal is met',
        body: 'Once the pair matches the target, extra pointer moves can only distract from the answer.',
        fix: 'Stop when the condition is satisfied and return the highlighted pair.',
      },
      teaching: {
        beginnerNote:
          'A match means the two highlighted values satisfy the goal. The algorithm can stop because the target pair was found.',
        whyAllowed:
          'There is no need to keep moving once the current pair equals the target. More steps would only answer a different question.',
        watchFor:
          'The matching cells switch to the same highlight, showing that index 0 and index 3 are the final answer.',
      },
      pointers: {
        left: 0,
        right: 3,
      },
      matchedIndices: [0, 3],
      variables: [
        { label: 'left index', value: '0' },
        { label: 'right index', value: '3' },
        { label: 'left value', value: '2' },
        { label: 'right value', value: '11' },
        { label: 'sum', value: '13' },
        { label: 'target', value: '13' },
      ],
    },
  ],
};

const containerWindowTraceLesson = {
  lessonId: 'container-window-preview',
  title: 'Read the Window Before It Moves',
  summary:
    'Compare two container edges, calculate the current area, and see why the shorter side is the one that moves.',
  completionRecap: {
    pattern: 'Move the limiting edge',
    changed:
      'The window started as the whole array, moved away from the shorter edge, and preserved area 49 as the best result.',
    learned:
      'You compared two edges at a time and kept the best area while the window moved inward.',
    remember:
      'The shorter edge limits the container height, so moving the taller edge cannot fix the current limit.',
    next:
      'Look for problems where a current window has a score, then one edge moves to search for a better score.',
    stop:
      'Pause here with the rule in mind: the best answer can be remembered even after the window moves on.',
  },
  setup: {
    array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    target: 'largest area',
    targetLabel: 'Goal',
    visualMode: 'bars',
  },
  algorithmSteps: [
    {
      id: 'inspect',
      label: 'Inspect both edges',
      detail: 'Read the values at the left and right edges before calculating anything.',
    },
    {
      id: 'score',
      label: 'Score the current window',
      detail: 'Area is width times the shorter edge, because water can only rise as high as the lower side.',
    },
    {
      id: 'move',
      label: 'Move the limiting edge',
      detail: 'Move the shorter edge inward because it is the side that currently limits the area.',
    },
    {
      id: 'finish',
      label: 'Keep the best result',
      detail: 'The answer is the largest area seen across all useful windows.',
    },
  ],
  code: {
    title: 'Container window pattern',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'left = 0; right = heights.length - 1; best = 0' },
      { id: 'loop', text: 'while left < right:' },
      { id: 'area', text: '  area = (right - left) * min(heights[left], heights[right])' },
      { id: 'best', text: '  best = max(best, area)' },
      { id: 'move-left', text: '  if heights[left] < heights[right]: left += 1' },
      { id: 'move-right', text: '  else: right -= 1' },
      { id: 'return', text: 'return best' },
    ],
  },
  frames: [
    {
      id: 'wide-window',
      activeStepId: 'inspect',
      activeCodeLineIds: ['setup', 'area'],
      title: 'Start with the widest window',
      explanation:
        'The left edge starts at height 1 and the right edge starts at height 7. This gives the widest possible container first.',
      comparisonText: 'Width 8 x min height 1 = area 8',
      decision: 'Measure the current window before moving either edge.',
      status: 'Inspecting edges 0 and 8',
      prediction: {
        prompt: 'The left edge is height 1 and the right edge is height 7. Which side should move?',
        correctOptionId: 'move-left',
        options: [
          {
            id: 'move-left',
            label: 'Move the left edge',
            feedback: 'Right. The shorter edge limits the water height, so it is the side worth changing.',
          },
          {
            id: 'move-right',
            label: 'Move the right edge',
            feedback: 'That keeps the height limit stuck at 1 while making the width smaller.',
          },
          {
            id: 'save-and-stop',
            label: 'Save 8 and stop',
            feedback: 'We should save 8, but stopping would miss better windows.',
          },
        ],
      },
      mistake: {
        title: 'Moving the taller edge first',
        body: 'The taller edge is tempting because it looks important, but it is not limiting this container.',
        fix: 'Move the shorter edge because it controls the current water height.',
      },
      markers: [
        { index: 0, label: 'left', tone: 'accent' },
        { index: 8, label: 'right', tone: 'ink' },
      ],
      teaching: {
        beginnerNote:
          'A window is the part between two edges. Here, the window starts as the whole array.',
        whyAllowed:
          'Starting wide gives us the largest width, so every later move trades width for the chance at a taller edge.',
        watchFor:
          'Watch the width and the shorter height. Those two values decide the area.',
      },
      variables: [
        { label: 'left index', value: '0' },
        { label: 'right index', value: '8' },
        { label: 'width', value: '8' },
        { label: 'shorter height', value: '1' },
        { label: 'area', value: '8' },
        { label: 'best area', value: '8' },
      ],
    },
    {
      id: 'move-left-edge',
      activeStepId: 'move',
      activeCodeLineIds: ['move-left'],
      title: 'The left edge is limiting us',
      explanation:
        'The left edge has height 1, so the container cannot be taller than 1 no matter how tall the right edge is.',
      comparisonText: 'Left height 1 is smaller than right height 7',
      decision: 'Move the shorter left edge inward to look for a taller limit.',
      status: 'Left edge moves from index 0 to index 1',
      prediction: {
        prompt: 'After moving left to height 8, what should we calculate?',
        correctOptionId: 'score-window',
        options: [
          {
            id: 'score-window',
            label: 'Score the new window',
            feedback: 'Yes. Every new window gets measured before we decide whether it is the best.',
          },
          {
            id: 'move-left-again',
            label: 'Move left again',
            feedback: 'Not yet. We need to know whether the current window improved the answer.',
          },
          {
            id: 'clear-best',
            label: 'Clear the best area',
            feedback: 'The best area should be remembered, not erased.',
          },
        ],
      },
      mistake: {
        title: 'Forgetting to score the new window',
        body: 'A pointer move is only useful after we measure what changed.',
        fix: 'Every new left/right pair gets an area calculation before another move.',
      },
      markers: [
        { index: 0, label: 'old', tone: 'muted' },
        { index: 1, label: 'left', tone: 'accent' },
        { index: 8, label: 'right', tone: 'ink' },
      ],
      teaching: {
        beginnerNote:
          'Moving the taller side would only make the window narrower while the height stayed stuck at 1.',
        whyAllowed:
          'The shorter side is the only side that can improve the height limit for the next window.',
        watchFor:
          'Notice that the width gets smaller, but the possible height can get much better.',
      },
      variables: [
        { label: 'left index', value: '1' },
        { label: 'right index', value: '8' },
        { label: 'width', value: '7' },
        { label: 'shorter height', value: '7' },
        { label: 'area', value: '49' },
        { label: 'best area', value: '49' },
      ],
    },
    {
      id: 'new-best',
      activeStepId: 'score',
      activeCodeLineIds: ['area', 'best'],
      title: 'A much better window appears',
      explanation:
        'Now the left edge is 8 and the right edge is 7. The width is smaller, but the height limit is much taller.',
      comparisonText: 'Width 7 x min height 7 = area 49',
      decision: 'Record 49 as the best area seen so far.',
      status: 'Best area is now 49',
      prediction: {
        prompt: 'This window beats the old best. What should the trace remember?',
        correctOptionId: 'remember-best',
        options: [
          {
            id: 'remember-best',
            label: 'Save 49 as the best area',
            feedback: 'Correct. The algorithm keeps the best result seen so far.',
          },
          {
            id: 'forget-old',
            label: 'Forget all previous positions',
            feedback: 'We do not need every old position, but we do need the best score and where it came from.',
          },
          {
            id: 'stop-because-big',
            label: 'Stop because 49 is large',
            feedback: 'Large does not always mean final. A full solution keeps searching until the window is done.',
          },
        ],
      },
      mistake: {
        title: 'Assuming the current window is automatically final',
        body: 'A great score should be saved, but the full pattern keeps searching while the window still has room.',
        fix: 'Update best, then continue using the shorter-edge rule.',
      },
      markers: [
        { index: 1, label: 'left', tone: 'success' },
        { index: 8, label: 'right', tone: 'success' },
      ],
      teaching: {
        beginnerNote:
          'The best answer is not always the widest window. It is the best mix of width and height.',
        whyAllowed:
          'We keep this score because future windows may be worse, and we do not want to forget the best one.',
        watchFor:
          'Watch the best area variable. It changes only when the current area beats the previous best.',
      },
      variables: [
        { label: 'left index', value: '1' },
        { label: 'right index', value: '8' },
        { label: 'width', value: '7' },
        { label: 'shorter height', value: '7' },
        { label: 'area', value: '49' },
        { label: 'best area', value: '49' },
      ],
    },
    {
      id: 'move-right-edge',
      activeStepId: 'move',
      activeCodeLineIds: ['move-right'],
      title: 'Move the shorter right edge',
      explanation:
        'The right edge has height 7 and the left edge has height 8, so the right side is now the limiting edge.',
      comparisonText: 'Right height 7 is smaller than left height 8',
      decision: 'Move the right edge inward and keep the best area at 49.',
      status: 'Right edge moves from index 8 to index 7',
      prediction: {
        prompt: 'The new area is smaller than 49. What happens to the best area?',
        correctOptionId: 'keep-best',
        options: [
          {
            id: 'keep-best',
            label: 'Keep the best area at 49',
            feedback: 'Exactly. A worse current score does not replace the best score.',
          },
          {
            id: 'replace-with-18',
            label: 'Replace it with 18',
            feedback: 'Not this time. The best value only changes when the current area is larger.',
          },
          {
            id: 'move-both',
            label: 'Move both edges next',
            feedback: 'That loses the simple rule. Move the limiting side one step at a time.',
          },
        ],
      },
      mistake: {
        title: 'Replacing the best score with a worse score',
        body: 'The current area can go down while the best answer stays the same.',
        fix: 'Only update best when the current area is larger than the saved best.',
      },
      markers: [
        { index: 1, label: 'left', tone: 'accent' },
        { index: 7, label: 'right', tone: 'ink' },
        { index: 8, label: 'old', tone: 'muted' },
      ],
      teaching: {
        beginnerNote:
          'The rule is the same even though the side changed: move the shorter edge.',
        whyAllowed:
          'Keeping the shorter edge would only make future windows narrower with the same height limit.',
        watchFor:
          'Notice that the area drops, but the best area still remembers 49.',
      },
      variables: [
        { label: 'left index', value: '1' },
        { label: 'right index', value: '7' },
        { label: 'width', value: '6' },
        { label: 'shorter height', value: '3' },
        { label: 'area', value: '18' },
        { label: 'best area', value: '49' },
      ],
    },
    {
      id: 'best-window',
      activeStepId: 'finish',
      activeCodeLineIds: ['return'],
      title: 'Keep the best window found',
      explanation:
        'The best area in this short trace is still the window between indices 1 and 8.',
      comparisonText: 'Best area: 49',
      decision: 'Stop this teaching trace with the best recorded window highlighted.',
      status: 'Best window preserved',
      mistake: {
        title: 'Thinking the final pointer position must be the answer',
        body: 'The best answer may come from an earlier window, not the last one inspected.',
        fix: 'Trust the saved best result, because it remembers the strongest window seen so far.',
      },
      markers: [
        { index: 1, label: 'best', tone: 'success' },
        { index: 8, label: 'best', tone: 'success' },
      ],
      matchedIndices: [1, 8],
      teaching: {
        beginnerNote:
          'A shrinking window can test several possibilities while always remembering the best score so far.',
        whyAllowed:
          'The best answer is a saved result, not necessarily the final window the pointers touched.',
        watchFor:
          'The highlighted best edges show the answer that survived the trace.',
      },
      variables: [
        { label: 'best left', value: '1' },
        { label: 'best right', value: '8' },
        { label: 'best width', value: '7' },
        { label: 'best height', value: '7' },
        { label: 'best area', value: '49' },
        { label: 'pattern', value: 'shrink shorter side' },
      ],
    },
  ],
};

const removeDuplicatesTraceLesson = {
  lessonId: 'remove-duplicates-preview',
  title: 'In-Place Compression',
  summary:
    'Use a read pointer and a write pointer to keep one copy of each value without creating a new array.',
  completionRecap: {
    pattern: 'Read forward, write only when useful',
    changed:
      'The read pointer scanned every value, while the write pointer moved only when a new unique value deserved a saved slot.',
    learned:
      'You separated checking from writing, which is the heart of many in-place array problems.',
    remember:
      'The write pointer marks the next safe place to keep a value. It does not move for duplicates.',
    next:
      'Look for problems where one pointer explores and another pointer builds the cleaned-up result.',
    stop:
      'Pause here with the main rule: read everything, but only write what should stay.',
  },
  setup: {
    array: [1, 1, 2, 2, 3],
    target: 'first 3 cells become 1, 2, 3',
    targetLabel: 'Goal',
  },
  algorithmSteps: [
    {
      id: 'setup',
      label: 'Set up read and write',
      detail: 'Read scans every value. Write marks where the next unique value should be kept.',
    },
    {
      id: 'compare',
      label: 'Compare with the last kept value',
      detail: 'A value is a duplicate when it matches the value just before the write pointer.',
    },
    {
      id: 'write',
      label: 'Write only new values',
      detail: 'When read finds a new value, copy it into the write slot and move write forward.',
    },
    {
      id: 'finish',
      label: 'Return the kept length',
      detail: 'The useful part of the array is everything before the write pointer.',
    },
  ],
  code: {
    title: 'Remove duplicates in place',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'write = 1' },
      { id: 'loop', text: 'for read from 1 to nums.length - 1:' },
      { id: 'compare', text: '  if nums[read] != nums[write - 1]:' },
      { id: 'copy', text: '    nums[write] = nums[read]' },
      { id: 'advance', text: '    write += 1' },
      { id: 'return', text: 'return write' },
    ],
  },
  frames: [
    {
      id: 'keep-first',
      activeStepId: 'setup',
      activeCodeLineIds: ['setup', 'loop'],
      title: 'Keep the first value by default',
      explanation:
        'The first 1 is always useful because there is no earlier kept value to compare it with.',
      comparisonText: 'kept prefix: [1]',
      decision: 'Start write at index 1 because index 0 is already kept.',
      status: 'Read starts at index 1',
      prediction: {
        prompt: 'Why does the write pointer start at index 1?',
        correctOptionId: 'first-kept',
        options: [
          {
            id: 'first-kept',
            label: 'Index 0 is already kept',
            feedback: 'Correct. The first value is the beginning of the compressed prefix.',
          },
          {
            id: 'array-empty',
            label: 'The array is empty',
            feedback: 'Not here. The array has values, so the first one can stay.',
          },
          {
            id: 'skip-first',
            label: 'The first value is a duplicate',
            feedback: 'There is nothing before it yet, so it cannot be a duplicate in this scan.',
          },
        ],
      },
      mistake: {
        title: 'Starting both pointers at zero',
        body: 'If both pointers start at zero, it is easy to compare a value with itself and make the trace confusing.',
        fix: 'Treat the first value as kept, then start reading from index 1.',
      },
      markers: [
        { index: 0, label: 'kept', tone: 'success' },
        { index: 1, label: 'read/write', tone: 'accent' },
      ],
      teaching: {
        beginnerNote:
          'The kept prefix is the part of the array that already contains the cleaned-up answer.',
        whyAllowed:
          'A single first value is always unique relative to an empty kept prefix.',
        watchFor:
          'Read asks questions. Write points to the next place where a useful value can be saved.',
      },
      variables: [
        { label: 'read index', value: '1' },
        { label: 'write index', value: '1' },
        { label: 'last kept', value: '1' },
        { label: 'current value', value: '1' },
        { label: 'kept length', value: '1' },
        { label: 'goal', value: 'keep uniques' },
      ],
    },
    {
      id: 'skip-duplicate-one',
      activeStepId: 'compare',
      activeCodeLineIds: ['compare'],
      title: 'Skip the duplicate 1',
      explanation:
        'The read pointer sees another 1. It matches the last kept value, so writing it would not add anything new.',
      comparisonText: 'nums[read] equals nums[write - 1]',
      decision: 'Do not move write when the current value is a duplicate.',
      status: 'Duplicate skipped',
      prediction: {
        prompt: 'The current value equals the last kept value. What should write do?',
        correctOptionId: 'stay',
        options: [
          {
            id: 'stay',
            label: 'Stay where it is',
            feedback: 'Yes. Write waits until read finds a new value.',
          },
          {
            id: 'copy',
            label: 'Copy the duplicate',
            feedback: 'Copying the duplicate would keep two 1s in the compressed prefix.',
          },
          {
            id: 'move-back',
            label: 'Move backward',
            feedback: 'Write only moves forward in this pattern.',
          },
        ],
      },
      mistake: {
        title: 'Writing every value read sees',
        body: 'If every value gets written, the array is not being compressed at all.',
        fix: 'Only write when the current value is different from the last kept value.',
      },
      markers: [
        { index: 0, label: 'kept', tone: 'success' },
        { index: 1, label: 'read', tone: 'accent' },
      ],
      teaching: {
        beginnerNote:
          'Skipping does not delete the old value immediately. It simply means the useful part does not grow.',
        whyAllowed:
          'The kept prefix already has 1, so another 1 would not change the answer.',
        watchFor:
          'The write pointer does not move. That is the visual sign that no new value was kept.',
      },
      variables: [
        { label: 'read index', value: '1' },
        { label: 'write index', value: '1' },
        { label: 'last kept', value: '1' },
        { label: 'current value', value: '1' },
        { label: 'action', value: 'skip' },
        { label: 'kept length', value: '1' },
      ],
    },
    {
      id: 'find-new-two',
      activeStepId: 'write',
      activeCodeLineIds: ['compare', 'copy'],
      title: 'Read finds a new value',
      explanation:
        'The read pointer reaches 2. Since 2 is different from the last kept value, it should be copied into the write slot.',
      comparisonText: '2 is different from 1',
      decision: 'Copy nums[read] into nums[write].',
      status: 'Ready to write 2 into index 1',
      prediction: {
        prompt: 'Where should the new value 2 be written?',
        correctOptionId: 'write-slot',
        options: [
          {
            id: 'write-slot',
            label: 'Into the write slot at index 1',
            feedback: 'Correct. Index 1 is the next open spot in the kept prefix.',
          },
          {
            id: 'same-place',
            label: 'Back into read index 2',
            feedback: 'Read index 2 already has the value. The point is to compact it forward.',
          },
          {
            id: 'end',
            label: 'At the end of the array',
            feedback: 'That would not create a compressed prefix at the front.',
          },
        ],
      },
      mistake: {
        title: 'Confusing read with write',
        body: 'Read tells us what value we found. Write tells us where the answer prefix should grow.',
        fix: 'Use read for discovery and write for placement.',
      },
      markers: [
        { index: 0, label: 'kept', tone: 'success' },
        { index: 1, label: 'write', tone: 'ink' },
        { index: 2, label: 'read', tone: 'accent' },
      ],
      teaching: {
        beginnerNote:
          'This is the first real overwrite. We are allowed to replace a duplicate slot with a useful new value.',
        whyAllowed:
          'Index 1 is outside the kept prefix, so overwriting it will not destroy a value we still need.',
        watchFor:
          'The value at read moves into the write slot, then write advances.',
      },
      variables: [
        { label: 'read index', value: '2' },
        { label: 'write index', value: '1' },
        { label: 'last kept', value: '1' },
        { label: 'current value', value: '2' },
        { label: 'action', value: 'copy 2' },
        { label: 'kept length', value: '1 -> 2' },
      ],
    },
    {
      id: 'prefix-has-two',
      activeStepId: 'compare',
      activeCodeLineIds: ['advance', 'compare'],
      title: 'The kept prefix now has 1 and 2',
      explanation:
        'After copying, the front of the array reads 1, 2. The next 2 is a duplicate of the last kept value.',
      comparisonText: 'kept prefix: [1, 2]',
      decision: 'Advance write to index 2, then skip the next duplicate 2.',
      status: 'Write points to the next open slot',
      array: [1, 2, 2, 2, 3],
      prediction: {
        prompt: 'The next read value is another 2. What should happen?',
        correctOptionId: 'skip-two',
        options: [
          {
            id: 'skip-two',
            label: 'Skip it because 2 is already kept',
            feedback: 'Exactly. The prefix already ends with 2.',
          },
          {
            id: 'write-two-again',
            label: 'Write 2 again',
            feedback: 'That would create duplicate values in the kept prefix.',
          },
          {
            id: 'reset',
            label: 'Reset write to zero',
            feedback: 'Write keeps moving forward as the prefix grows.',
          },
        ],
      },
      mistake: {
        title: 'Letting duplicates grow the prefix',
        body: 'The kept prefix should contain one copy of each value in order.',
        fix: 'Compare with nums[write - 1], not just with the previous read position.',
      },
      markers: [
        { index: 0, label: 'kept', tone: 'success' },
        { index: 1, label: 'kept', tone: 'success' },
        { index: 2, label: 'write', tone: 'ink' },
        { index: 3, label: 'read', tone: 'accent' },
      ],
      teaching: {
        beginnerNote:
          'The array may still have old values after the kept prefix. That is okay; the returned length tells us what part matters.',
        whyAllowed:
          'The problem cares about the first part of the array after compression.',
        watchFor:
          'Only the prefix before write is considered clean.',
      },
      variables: [
        { label: 'read index', value: '3' },
        { label: 'write index', value: '2' },
        { label: 'last kept', value: '2' },
        { label: 'current value', value: '2' },
        { label: 'action', value: 'skip' },
        { label: 'kept length', value: '2' },
      ],
    },
    {
      id: 'finish-unique-prefix',
      activeStepId: 'finish',
      activeCodeLineIds: ['copy', 'advance', 'return'],
      title: 'Return the length of the unique prefix',
      explanation:
        'The final new value is 3, so it is written into index 2. The first three cells now hold the compressed result.',
      comparisonText: 'result prefix: [1, 2, 3]',
      decision: 'Return write because it is the length of the useful prefix.',
      status: 'Unique prefix complete',
      array: [1, 2, 3, 2, 3],
      mistake: {
        title: 'Reading the whole array after compression',
        body: 'Values after the returned length can be old leftovers and should not be treated as part of the answer.',
        fix: 'Use the returned length to read only the useful prefix.',
      },
      markers: [
        { index: 0, label: 'answer', tone: 'success' },
        { index: 1, label: 'answer', tone: 'success' },
        { index: 2, label: 'answer', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2],
      teaching: {
        beginnerNote:
          'The answer is not a brand-new array. It is the first part of the same array plus the length 3.',
        whyAllowed:
          'Everything before write is clean and ordered. Everything after write no longer matters.',
        watchFor:
          'The highlighted prefix is the final answer the caller should use.',
      },
      variables: [
        { label: 'read index', value: 'done' },
        { label: 'write index', value: '3' },
        { label: 'return value', value: '3' },
        { label: 'unique values', value: '1, 2, 3' },
        { label: 'ignored tail', value: 'indices 3+' },
        { label: 'pattern', value: 'read/write pointers' },
      ],
    },
  ],
};

const binarySearchTraceLesson = {
  lessonId: 'binary-search-basics-preview',
  title: 'Cut the Search Space in Half',
  summary:
    'Track low, high, and mid as the search keeps only the half that can still contain the target.',
  completionRecap: {
    pattern: 'Discard the impossible half',
    changed:
      'The search range moved from the whole array to one remaining index by using each middle value to remove a side.',
    learned:
      'You used a middle check to decide which part of the sorted array could still contain the answer.',
    remember:
      'Low and high are the current limits. Moving them is how binary search makes the remaining work smaller.',
    next:
      'Look for ordered yes/no decisions where one side can be safely ruled out.',
    stop:
      'Stop with the boundary idea fresh: binary search is about what remains possible.',
  },
  setup: {
    array: [2, 4, 7, 11, 15, 19, 24],
    target: 15,
  },
  algorithmSteps: [
    {
      id: 'choose-mid',
      label: 'Choose the middle',
      detail: 'Use low and high to find the middle index of the current search area.',
    },
    {
      id: 'compare',
      label: 'Compare with the target',
      detail: 'Decide whether the middle value is too small, too large, or correct.',
    },
    {
      id: 'discard',
      label: 'Discard one side',
      detail: 'Move low or high so the impossible half is no longer part of the search.',
    },
    {
      id: 'finish',
      label: 'Stop on the target',
      detail: 'When the middle value equals the target, the search is complete.',
    },
  ],
  code: {
    title: 'Binary search',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'low = 0; high = nums.length - 1' },
      { id: 'loop', text: 'while low <= high:' },
      { id: 'mid', text: '  mid = floor((low + high) / 2)' },
      { id: 'found', text: '  if nums[mid] == target: return mid' },
      { id: 'move-low', text: '  if nums[mid] < target: low = mid + 1' },
      { id: 'move-high', text: '  else: high = mid - 1' },
      { id: 'missing', text: 'return -1' },
    ],
  },
  frames: [
    {
      id: 'first-mid',
      activeStepId: 'choose-mid',
      activeCodeLineIds: ['setup', 'mid'],
      title: 'Check the middle first',
      explanation:
        'The full search runs from index 0 to index 6, so the middle index is 3.',
      comparisonText: 'mid index 3 holds value 11',
      decision: 'Read the middle value before moving any boundary.',
      status: 'Checking index 3',
      prediction: {
        prompt: 'The middle value is 11 and the target is 15. Which side can be ignored?',
        correctOptionId: 'ignore-left',
        options: [
          {
            id: 'ignore-left',
            label: 'Ignore the left side',
            feedback: 'Correct. In a sorted array, 11 and everything smaller cannot be 15.',
          },
          {
            id: 'ignore-right',
            label: 'Ignore the right side',
            feedback: 'That would remove the side where larger values live, including 15.',
          },
          {
            id: 'scan-all',
            label: 'Scan every value',
            feedback: 'That works slowly, but binary search is trying to remove half the work at once.',
          },
        ],
      },
      mistake: {
        title: 'Treating binary search like a normal scan',
        body: 'Checking values one by one misses the whole reason binary search is fast.',
        fix: 'Use the middle value to remove a whole impossible side at once.',
      },
      markers: [
        { index: 0, label: 'low', tone: 'accent' },
        { index: 3, label: 'mid', tone: 'success' },
        { index: 6, label: 'high', tone: 'ink' },
      ],
      teaching: {
        beginnerNote:
          'Low and high mark the part of the array that is still possible.',
        whyAllowed:
          'Because the array is sorted, the middle value can tell us which half is impossible.',
        watchFor:
          'Watch low, mid, and high together. They define the current search area.',
      },
      variables: [
        { label: 'low', value: '0' },
        { label: 'high', value: '6' },
        { label: 'mid', value: '3' },
        { label: 'mid value', value: '11' },
        { label: 'target', value: '15' },
        { label: 'range', value: '0 to 6' },
      ],
    },
    {
      id: 'too-small',
      activeStepId: 'compare',
      activeCodeLineIds: ['found', 'move-low'],
      title: 'The middle value is too small',
      explanation:
        'Value 11 is less than target 15, so the target cannot be at index 3 or anywhere to its left.',
      comparisonText: '11 is less than 15',
      decision: 'The answer must be on the right side.',
      status: 'Left half ruled out',
      prediction: {
        prompt: 'If the target must be to the right of mid, how should the range change?',
        correctOptionId: 'move-low',
        options: [
          {
            id: 'move-low',
            label: 'Move low to mid + 1',
            feedback: 'Yes. Low jumps to the first index that can still contain the target.',
          },
          {
            id: 'move-high',
            label: 'Move high to mid - 1',
            feedback: 'That would keep the smaller side and remove where 15 actually is.',
          },
          {
            id: 'keep-range',
            label: 'Keep the same range',
            feedback: 'Keeping the same range would repeat the same comparison.',
          },
        ],
      },
      mistake: {
        title: 'Keeping mid inside the next range',
        body: 'If mid is too small, checking it again would repeat known information.',
        fix: 'Move low to mid + 1 so the rejected value leaves the search range.',
      },
      markers: [
        { index: 0, label: 'old low', tone: 'muted' },
        { index: 3, label: 'mid', tone: 'muted' },
        { index: 6, label: 'high', tone: 'ink' },
      ],
      teaching: {
        beginnerNote:
          'Too small means every value before this middle is also too small.',
        whyAllowed:
          'Sorted order lets us discard many values with one comparison.',
        watchFor:
          'The left side stops being part of the active search.',
      },
      variables: [
        { label: 'low', value: '0' },
        { label: 'high', value: '6' },
        { label: 'mid', value: '3' },
        { label: 'mid value', value: '11' },
        { label: 'target', value: '15' },
        { label: 'decision', value: 'move low right' },
      ],
    },
    {
      id: 'right-half',
      activeStepId: 'discard',
      activeCodeLineIds: ['mid'],
      title: 'Search only the right half',
      explanation:
        'Low moves to index 4, leaving indices 4 through 6 as the remaining search area.',
      comparisonText: 'new range: 4 to 6, mid index 5',
      decision: 'Check the middle of the smaller range.',
      status: 'Checking index 5',
      prediction: {
        prompt: 'The new middle value is 19. What does that tell us about the target 15?',
        correctOptionId: 'target-left',
        options: [
          {
            id: 'target-left',
            label: 'The target is to the left',
            feedback: 'Right. Since 19 is too large, 15 must be on the smaller side.',
          },
          {
            id: 'target-right',
            label: 'The target is to the right',
            feedback: 'That side has even larger values, so it cannot contain 15.',
          },
          {
            id: 'found-19',
            label: '19 is the answer',
            feedback: 'Close to the action, but the answer must equal 15 exactly.',
          },
        ],
      },
      mistake: {
        title: 'Forgetting that sorted order works both ways',
        body: 'When 19 is too large, every value to its right is also too large.',
        fix: 'Use the comparison to choose the only side that can still contain the target.',
      },
      markers: [
        { index: 4, label: 'low', tone: 'accent' },
        { index: 5, label: 'mid', tone: 'success' },
        { index: 6, label: 'high', tone: 'ink' },
      ],
      teaching: {
        beginnerNote:
          'The algorithm did not move one step at a time. It jumped over the whole impossible side.',
        whyAllowed:
          'Everything left of index 4 is too small, so it no longer needs attention.',
        watchFor:
          'The active range is shorter now, and mid is recalculated from the new limits.',
      },
      variables: [
        { label: 'low', value: '4' },
        { label: 'high', value: '6' },
        { label: 'mid', value: '5' },
        { label: 'mid value', value: '19' },
        { label: 'target', value: '15' },
        { label: 'range', value: '4 to 6' },
      ],
    },
    {
      id: 'too-large',
      activeStepId: 'compare',
      activeCodeLineIds: ['found', 'move-high'],
      title: 'The new middle is too large',
      explanation:
        'Value 19 is greater than target 15, so the target must be to the left of index 5.',
      comparisonText: '19 is greater than 15',
      decision: 'Move high left to remove the too-large side.',
      status: 'Right side ruled out',
      prediction: {
        prompt: 'After removing the too-large side, where should low and high meet?',
        correctOptionId: 'index-four',
        options: [
          {
            id: 'index-four',
            label: 'At index 4',
            feedback: 'Correct. Index 4 is the only remaining possible position.',
          },
          {
            id: 'index-six',
            label: 'At index 6',
            feedback: 'Index 6 was on the too-large side, so it has been ruled out.',
          },
          {
            id: 'start-over',
            label: 'Back at index 0',
            feedback: 'No need to restart. The range has already narrowed safely.',
          },
        ],
      },
      mistake: {
        title: 'Moving the wrong boundary',
        body: 'If the middle value is too large, moving low would throw away the smaller side where the target lives.',
        fix: 'Move high left when mid is too large; move low right when mid is too small.',
      },
      markers: [
        { index: 4, label: 'low', tone: 'accent' },
        { index: 5, label: 'mid', tone: 'muted' },
        { index: 6, label: 'old high', tone: 'muted' },
      ],
      teaching: {
        beginnerNote:
          'Too large means this middle value and everything to its right are too large.',
        whyAllowed:
          'Sorted order gives the comparison meaning across a whole side of the array.',
        watchFor:
          'High moves left, making the remaining range even smaller.',
      },
      variables: [
        { label: 'low', value: '4' },
        { label: 'high', value: '4' },
        { label: 'mid', value: '5' },
        { label: 'mid value', value: '19' },
        { label: 'target', value: '15' },
        { label: 'decision', value: 'move high left' },
      ],
    },
    {
      id: 'found-target',
      activeStepId: 'finish',
      activeCodeLineIds: ['found'],
      title: 'Only the target remains',
      explanation:
        'Low and high now meet at index 4, where the value is 15.',
      comparisonText: '15 equals 15',
      decision: 'Stop because the middle value matches the target.',
      status: 'Target found at index 4',
      mistake: {
        title: 'Continuing after finding the target',
        body: 'Once nums[mid] equals the target, the search question is answered.',
        fix: 'Return the current index immediately instead of shrinking the range again.',
      },
      markers: [
        { index: 4, label: 'found', tone: 'success' },
      ],
      matchedIndices: [4],
      teaching: {
        beginnerNote:
          'The target was found after ruling out large pieces of the array.',
        whyAllowed:
          'Once the middle equals the target, no more boundary movement is needed.',
        watchFor:
          'Low, high, and mid have collapsed onto the same answer index.',
      },
      variables: [
        { label: 'low', value: '4' },
        { label: 'high', value: '4' },
        { label: 'mid', value: '4' },
        { label: 'value', value: '15' },
        { label: 'target', value: '15' },
        { label: 'result', value: 'index 4' },
      ],
    },
  ],
};

const firstTrueTraceLesson = {
  lessonId: 'first-true-preview',
  title: 'Search for the First Valid Answer',
  summary:
    'Use binary search to find the first true value in a sorted yes/no pattern without losing the earliest candidate.',
  completionRecap: {
    pattern: 'Keep a candidate and search left',
    changed:
      'The search skipped false values, saved true values as candidates, and kept moving left until it found the first true position.',
    learned:
      'You used binary search for a boundary, not just for a value that equals a target.',
    remember:
      'When mid is true, save it and keep searching left because an earlier true may exist.',
    next:
      'Use this idea for lower bounds, first passing version, first valid answer, and insert positions.',
    stop:
      'Pause here with the boundary rule: true can be a candidate, but first true may still be earlier.',
  },
  setup: {
    array: ['F', 'F', 'F', 'T', 'T', 'T'],
    target: 'first T',
    targetLabel: 'Boundary',
  },
  algorithmSteps: [
    {
      id: 'choose-mid',
      label: 'Choose the middle',
      detail: 'Read the middle of the remaining search range.',
    },
    {
      id: 'discard-false',
      label: 'Discard false values',
      detail: 'If mid is false, the first true must be to the right.',
    },
    {
      id: 'save-candidate',
      label: 'Save true candidates',
      detail: 'If mid is true, remember it and search left for an earlier true.',
    },
    {
      id: 'finish',
      label: 'Return the saved boundary',
      detail: 'When the range closes, the best saved candidate is the first true.',
    },
  ],
  code: {
    title: 'First true boundary',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'low = 0; high = values.length - 1; answer = none' },
      { id: 'loop', text: 'while low <= high:' },
      { id: 'mid', text: '  mid = floor((low + high) / 2)' },
      { id: 'false-case', text: '  if values[mid] is false: low = mid + 1' },
      { id: 'true-case', text: '  else: answer = mid; high = mid - 1' },
      { id: 'return-answer', text: 'return answer' },
    ],
  },
  frames: [
    {
      id: 'first-true-mid-false',
      activeStepId: 'discard-false',
      activeCodeLineIds: ['setup', 'loop', 'mid', 'false-case'],
      title: 'The first middle is false',
      explanation:
        'The middle at index 2 is false. Since the pattern is false values followed by true values, the first true must be to the right.',
      comparisonText: 'index 2 is F',
      decision: 'Move low to index 3 and ignore everything at index 2 or left of it.',
      status: 'False side discarded',
      prediction: {
        prompt: 'If mid is false in a false-then-true pattern, where can the first true be?',
        correctOptionId: 'right-side',
        options: [
          {
            id: 'right-side',
            label: 'To the right of mid',
            feedback: 'Correct. False means this position and earlier positions cannot be the first true.',
          },
          {
            id: 'left-side',
            label: 'To the left of mid',
            feedback: 'The left side is also false or earlier false territory in this pattern.',
          },
          {
            id: 'same-mid',
            label: 'At mid',
            feedback: 'Mid is false, so it cannot be the first true.',
          },
        ],
      },
      mistake: {
        title: 'Treating false as a possible answer',
        body: 'The boundary asks for the first true value, so a false mid can never be saved as the answer.',
        fix: 'Move low right when mid is false.',
      },
      markers: [
        { index: 0, label: 'low', tone: 'muted' },
        { index: 2, label: 'mid F', tone: 'accent' },
        { index: 5, label: 'high', tone: 'ink' },
      ],
      teaching: {
        beginnerNote:
          'This search works because the values have a clear shape: false first, then true.',
        whyAllowed:
          'If index 2 is still false, no earlier index can be the first true.',
        watchFor:
          'Low jumps to the first position that might still be true.',
      },
      variables: [
        { label: 'low', value: '0' },
        { label: 'high', value: '5' },
        { label: 'mid', value: '2' },
        { label: 'mid value', value: 'F' },
        { label: 'candidate', value: 'none' },
        { label: 'next low', value: '3' },
      ],
    },
    {
      id: 'first-true-save-candidate',
      activeStepId: 'save-candidate',
      activeCodeLineIds: ['mid', 'true-case'],
      title: 'A true value becomes a candidate',
      explanation:
        'The new middle at index 4 is true. It might be the first true, so we save it before searching left.',
      comparisonText: 'candidate answer = index 4',
      decision: 'Save index 4, then move high left to look for an earlier true.',
      status: 'Candidate saved',
      prediction: {
        prompt: 'Why do we keep searching after finding true at index 4?',
        correctOptionId: 'earlier-true',
        options: [
          {
            id: 'earlier-true',
            label: 'There might be an earlier true',
            feedback: 'Exactly. The goal is first true, not any true.',
          },
          {
            id: 'true-is-wrong',
            label: 'True means the value is wrong',
            feedback: 'True is valid. It just may not be the earliest valid value.',
          },
          {
            id: 'need-right',
            label: 'We need a later true',
            feedback: 'Later true values are not first, so the search should move left.',
          },
        ],
      },
      mistake: {
        title: 'Stopping on any true',
        body: 'Classic binary search may stop on equality, but boundary search often needs the first valid position.',
        fix: 'Save true as a candidate and keep searching left.',
      },
      markers: [
        { index: 3, label: 'low', tone: 'accent' },
        { index: 4, label: 'mid T', tone: 'success' },
        { index: 5, label: 'high', tone: 'ink' },
      ],
      matchedIndices: [4],
      teaching: {
        beginnerNote:
          'Candidate means possible answer. It is saved, but it can still be improved.',
        whyAllowed:
          'All values to the right are true too, but they cannot be earlier than index 4.',
        watchFor:
          'High moves left even though mid was valid.',
      },
      variables: [
        { label: 'low', value: '3' },
        { label: 'high', value: '5' },
        { label: 'mid', value: '4' },
        { label: 'mid value', value: 'T' },
        { label: 'candidate', value: '4' },
        { label: 'next high', value: '3' },
      ],
    },
    {
      id: 'first-true-better-candidate',
      activeStepId: 'save-candidate',
      activeCodeLineIds: ['mid', 'true-case'],
      title: 'Search left for a better candidate',
      explanation:
        'Index 3 is also true. Since it is earlier than index 4, it becomes the better candidate.',
      comparisonText: 'candidate improves from 4 to 3',
      decision: 'Save index 3 and move high left again.',
      status: 'Earlier candidate found',
      prediction: {
        prompt: 'If index 3 is true and it is earlier than the saved index 4, what should happen?',
        correctOptionId: 'replace-candidate',
        options: [
          {
            id: 'replace-candidate',
            label: 'Replace the candidate with index 3',
            feedback: 'Correct. Earlier true is better for first true.',
          },
          {
            id: 'keep-four',
            label: 'Keep index 4 forever',
            feedback: 'Index 4 was only the best candidate until an earlier true appeared.',
          },
          {
            id: 'move-right',
            label: 'Move right to later true values',
            feedback: 'Later true values cannot be the first true.',
          },
        ],
      },
      mistake: {
        title: 'Not updating the candidate',
        body: 'A saved answer should improve when a better earlier valid position appears.',
        fix: 'Replace the candidate whenever true is found at a smaller index.',
      },
      markers: [
        { index: 3, label: 'better T', tone: 'success' },
        { index: 4, label: 'old candidate', tone: 'muted' },
      ],
      matchedIndices: [3],
      teaching: {
        beginnerNote:
          'Boundary search is a careful tightening process, not a single lucky hit.',
        whyAllowed:
          'Index 3 is valid and earlier, so it is now the best known answer.',
        watchFor:
          'The search keeps moving left until no earlier positions remain.',
      },
      variables: [
        { label: 'low', value: '3' },
        { label: 'high', value: '3' },
        { label: 'mid', value: '3' },
        { label: 'mid value', value: 'T' },
        { label: 'old candidate', value: '4' },
        { label: 'new candidate', value: '3' },
      ],
    },
    {
      id: 'first-true-finish',
      activeStepId: 'finish',
      activeCodeLineIds: ['return-answer'],
      title: 'The boundary is locked in',
      explanation:
        'High moves left of low, so the search is finished. The saved candidate index 3 is the first true.',
      comparisonText: 'answer index: 3',
      decision: 'Return the saved candidate because no earlier true remains possible.',
      status: 'First true found',
      mistake: {
        title: 'Returning low without understanding why',
        body: 'Some versions return low, but that can feel magical if the candidate idea is missing.',
        fix: 'Track the saved true candidate so the result has a clear story.',
      },
      markers: [
        { index: 0, label: 'false', tone: 'muted' },
        { index: 1, label: 'false', tone: 'muted' },
        { index: 2, label: 'false', tone: 'muted' },
        { index: 3, label: 'first true', tone: 'success' },
      ],
      matchedIndices: [3],
      teaching: {
        beginnerNote:
          'The first true is the boundary where the pattern changes from false to true.',
        whyAllowed:
          'Every earlier position was ruled out as false, and index 3 was saved as true.',
        watchFor:
          'The answer is a position, not a target value already named in the input.',
      },
      variables: [
        { label: 'low', value: '3' },
        { label: 'high', value: '2' },
        { label: 'candidate', value: '3' },
        { label: 'answer value', value: 'T' },
        { label: 'result', value: 'index 3' },
        { label: 'pattern', value: 'boundary search' },
      ],
    },
  ],
};

const rotatedSearchTraceLesson = {
  lessonId: 'search-in-rotated-preview',
  title: 'Read Structure Before Choosing a Half',
  summary:
    'Search a rotated sorted array by first identifying which half is sorted, then deciding whether the target can live there.',
  completionRecap: {
    pattern: 'Find the sorted half first',
    changed:
      'The search used the sorted right half to move low, then repeated the same structure check until the target was found.',
    learned:
      'You did not guess which side to keep. You checked structure first, then safely discarded the impossible half.',
    remember:
      'In a rotated array, one side around mid is still sorted. Use that side as your anchor.',
    next:
      'Use this when a sorted array has been rotated but still contains local sorted sections.',
    stop:
      'Pause here with the rule: identify the sorted half before moving a boundary.',
  },
  setup: {
    array: [6, 7, 1, 2, 3, 4, 5],
    target: 5,
    targetLabel: 'Target',
  },
  algorithmSteps: [
    {
      id: 'choose-mid',
      label: 'Choose the middle',
      detail: 'Read low, mid, and high inside the rotated array.',
    },
    {
      id: 'read-structure',
      label: 'Find the sorted half',
      detail: 'Decide whether the left half or right half is sorted.',
    },
    {
      id: 'discard',
      label: 'Discard the impossible half',
      detail: 'Keep the sorted half only if the target fits inside its values.',
    },
    {
      id: 'finish',
      label: 'Stop when target is found',
      detail: 'When nums[mid] equals the target, return the index.',
    },
  ],
  code: {
    title: 'Search rotated sorted array',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'low = 0; high = nums.length - 1' },
      { id: 'mid', text: 'mid = floor((low + high) / 2)' },
      { id: 'found', text: 'if nums[mid] == target: return mid' },
      { id: 'left-sorted', text: 'if nums[low] <= nums[mid]: left side is sorted' },
      { id: 'right-sorted', text: 'else: right side is sorted' },
      { id: 'move-boundary', text: 'keep the side where target can fit' },
    ],
  },
  frames: [
    {
      id: 'rotated-first-mid',
      activeStepId: 'choose-mid',
      activeCodeLineIds: ['setup', 'mid', 'found'],
      title: 'Start at the rotated middle',
      explanation:
        'The middle value is 2 at index 3. It is not the target 5, so the next job is to read which half is sorted.',
      comparisonText: 'mid value 2 is not target 5',
      decision: 'Do not move a boundary until the sorted half is identified.',
      status: 'Checking index 3',
      prediction: {
        prompt: 'Before discarding a side in a rotated array, what should we identify first?',
        correctOptionId: 'sorted-half',
        options: [
          {
            id: 'sorted-half',
            label: 'Which half is sorted',
            feedback: 'Correct. The sorted half tells us whether the target can fit there.',
          },
          {
            id: 'bigger-half',
            label: 'Which half has more items',
            feedback: 'Both halves can have useful sizes. Structure matters more than size.',
          },
          {
            id: 'random-half',
            label: 'Any half to discard',
            feedback: 'Guessing breaks binary search. The discard needs a reason.',
          },
        ],
      },
      mistake: {
        title: 'Using normal binary search too quickly',
        body: 'A rotated array is not globally sorted from low to high, so normal left/right comparison is not enough.',
        fix: 'First find which side around mid is sorted.',
      },
      markers: [
        { index: 0, label: 'low', tone: 'accent' },
        { index: 3, label: 'mid', tone: 'success' },
        { index: 6, label: 'high', tone: 'ink' },
      ],
      teaching: {
        beginnerNote:
          'Rotated means the sorted list was cut and wrapped around. Some local halves are still sorted.',
        whyAllowed:
          'Reading low, mid, and high gives enough structure to choose a safe side.',
        watchFor:
          'The value 2 alone does not tell the whole story. The half structure matters.',
      },
      variables: [
        { label: 'low', value: '0' },
        { label: 'mid', value: '3' },
        { label: 'high', value: '6' },
        { label: 'mid value', value: '2' },
        { label: 'target', value: '5' },
        { label: 'result', value: 'not found yet' },
      ],
    },
    {
      id: 'rotated-right-sorted',
      activeStepId: 'read-structure',
      activeCodeLineIds: ['left-sorted', 'right-sorted'],
      title: 'The right half is sorted',
      explanation:
        'The left side from 6 to 2 crosses the rotation break, but the right side 2, 3, 4, 5 is sorted.',
      comparisonText: 'right half: [2, 3, 4, 5]',
      decision: 'Use the sorted right half to test whether target 5 fits there.',
      status: 'Right half identified',
      prediction: {
        prompt: 'Does target 5 fit inside the sorted right half from 2 to 5?',
        correctOptionId: 'fits-right',
        options: [
          {
            id: 'fits-right',
            label: 'Yes, keep the right half',
            feedback: 'Correct. 5 is within the sorted right-half values.',
          },
          {
            id: 'fits-left',
            label: 'No, keep the left half',
            feedback: 'The left half crosses the rotation break, and 5 fits the sorted right side.',
          },
          {
            id: 'stop-now',
            label: 'Stop immediately',
            feedback: 'Mid is 2, not 5, so the target has not been found yet.',
          },
        ],
      },
      mistake: {
        title: 'Ignoring the sorted half range',
        body: 'Finding a sorted half is only useful if you check whether the target value belongs inside it.',
        fix: 'Compare target with the sorted half endpoints before moving low or high.',
      },
      markers: [
        { index: 3, label: 'sorted start', tone: 'accent' },
        { index: 4, label: 'sorted', tone: 'success' },
        { index: 5, label: 'sorted', tone: 'success' },
        { index: 6, label: 'sorted end', tone: 'ink' },
      ],
      matchedIndices: [3, 4, 5, 6],
      teaching: {
        beginnerNote:
          'A sorted half gives a clean range check: is target between the first and last value of that half?',
        whyAllowed:
          'Since 2 through 5 is sorted and includes target 5, the left half can be discarded.',
        watchFor:
          'The sorted half may include mid. That is okay; mid will be removed when the boundary moves.',
      },
      variables: [
        { label: 'left side', value: '6, 7, 1, 2' },
        { label: 'right side', value: '2, 3, 4, 5' },
        { label: 'sorted side', value: 'right' },
        { label: 'target', value: '5' },
        { label: 'fits sorted side?', value: 'yes' },
        { label: 'next low', value: '4' },
      ],
    },
    {
      id: 'rotated-second-mid',
      activeStepId: 'discard',
      activeCodeLineIds: ['move-boundary', 'mid', 'found'],
      title: 'Search the kept half',
      explanation:
        'Low moves to index 4, so the remaining range is 3, 4, 5. The new middle is value 4 at index 5.',
      comparisonText: 'new mid value 4 is below target 5',
      decision: 'Read structure again instead of assuming normal search is back.',
      status: 'Checking smaller range',
      prediction: {
        prompt: 'The new mid value is 4. The target is 5. What should we still check before moving?',
        correctOptionId: 'structure-again',
        options: [
          {
            id: 'structure-again',
            label: 'Which side of the new range is sorted',
            feedback: 'Correct. Keep using the rotated-array rule each round.',
          },
          {
            id: 'whole-array',
            label: 'The whole original array',
            feedback: 'The discarded side is no longer part of the active search.',
          },
          {
            id: 'no-check',
            label: 'Nothing; guess right',
            feedback: 'The move should still be justified by sorted structure.',
          },
        ],
      },
      mistake: {
        title: 'Forgetting to repeat the structure check',
        body: 'Rotated search is a loop. Each smaller range still needs a safe reason before discarding a side.',
        fix: 'At every mid, identify the sorted half again.',
      },
      markers: [
        { index: 4, label: 'low', tone: 'accent' },
        { index: 5, label: 'mid', tone: 'success' },
        { index: 6, label: 'high', tone: 'ink' },
      ],
      teaching: {
        beginnerNote:
          'Binary search is repetitive on purpose. The same small checklist runs each round.',
        whyAllowed:
          'The previous range cut was safe because target fit the sorted right side.',
        watchFor:
          'The active range is now only three cells.',
      },
      variables: [
        { label: 'low', value: '4' },
        { label: 'mid', value: '5' },
        { label: 'high', value: '6' },
        { label: 'mid value', value: '4' },
        { label: 'target', value: '5' },
        { label: 'range', value: '4 to 6' },
      ],
    },
    {
      id: 'rotated-final-target',
      activeStepId: 'finish',
      activeCodeLineIds: ['move-boundary', 'mid', 'found'],
      title: 'The final middle is the target',
      explanation:
        'After moving low to index 6, the middle value is 5. That matches the target.',
      comparisonText: 'nums[6] equals 5',
      decision: 'Return index 6 because the target has been found.',
      status: 'Target found',
      mistake: {
        title: 'Discarding the target side',
        body: 'If the target fits inside the sorted half, discarding that half removes the answer.',
        fix: 'Only discard a sorted half when the target cannot fit within its endpoint values.',
      },
      markers: [
        { index: 6, label: 'found', tone: 'success' },
      ],
      matchedIndices: [6],
      teaching: {
        beginnerNote:
          'The rotated version still ends like normal binary search: mid equals target.',
        whyAllowed:
          'All earlier discards kept the side where 5 could still exist.',
        watchFor:
          'The final answer is an index, while the target is the value 5.',
      },
      variables: [
        { label: 'low', value: '6' },
        { label: 'mid', value: '6' },
        { label: 'high', value: '6' },
        { label: 'value', value: '5' },
        { label: 'target', value: '5' },
        { label: 'result', value: 'index 6' },
      ],
    },
  ],
};

const twoSumMapTraceLesson = {
  lessonId: 'two-sum-map-preview',
  title: 'Two Sum by Memory',
  summary:
    'Watch a hash map remember the missing partner value so the answer appears as a lookup instead of a rescan.',
  completionRecap: {
    pattern: 'Remember the missing partner',
    changed:
      'The map started empty, saved that 7 would complete the first value, then used that memory when 7 appeared.',
    learned:
      'You saved the value needed later, then used a lookup to find the matching pair quickly.',
    remember:
      'A hash map is useful when the current decision depends on something seen earlier.',
    next:
      'Look for problems where saving one small fact can avoid searching the same list again.',
    stop:
      'Let this one settle: the map only worked because it remembered the right small fact.',
  },
  setup: {
    array: [2, 7, 11, 15],
    target: 9,
    targetLabel: 'Target sum',
  },
  algorithmSteps: [
    {
      id: 'read',
      label: 'Read the current value',
      detail: 'Look at one value at a time instead of trying every pair.',
    },
    {
      id: 'need',
      label: 'Calculate what is missing',
      detail: 'Find the complement, which is the value that would complete the target sum.',
    },
    {
      id: 'lookup',
      label: 'Check memory',
      detail: 'Ask whether the current value is something the map was waiting for.',
    },
    {
      id: 'finish',
      label: 'Return the pair',
      detail: 'When the lookup succeeds, the stored value and current value form the answer.',
    },
  ],
  code: {
    title: 'Two sum with memory',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'needed = new Map()' },
      { id: 'loop', text: 'for each value and index:' },
      { id: 'lookup', text: '  if needed has value:' },
      { id: 'return-pair', text: '    return [needed.get(value), index]' },
      { id: 'complement', text: '  complement = target - value' },
      { id: 'save-need', text: '  needed.set(complement, index)' },
    ],
  },
  frames: [
    {
      id: 'read-two',
      activeStepId: 'read',
      activeCodeLineIds: ['setup', 'loop', 'complement'],
      title: 'Start with the first value',
      explanation:
        'The current value is 2. To reach target 9, we would need to find 7 later.',
      comparisonText: '9 - 2 = 7',
      decision: 'Calculate the missing partner before saving anything.',
      status: 'Reading index 0',
      prediction: {
        prompt: 'If the current value is 2 and the target is 9, what value should memory wait for?',
        correctOptionId: 'wait-for-seven',
        options: [
          {
            id: 'wait-for-seven',
            label: 'Wait for 7',
            feedback: 'Correct. 2 needs 7 because 2 + 7 equals 9.',
          },
          {
            id: 'wait-for-two',
            label: 'Wait for another 2',
            feedback: 'Another 2 would make 4, not the target 9.',
          },
          {
            id: 'wait-for-nine',
            label: 'Wait for 9',
            feedback: '9 is the target sum, not the missing partner for 2.',
          },
        ],
      },
      mistake: {
        title: 'Saving the current value instead of the needed value',
        body: 'For this trace, memory is most helpful when it stores what would complete the pair later.',
        fix: 'Calculate target minus current value, then save that needed value as the lookup key.',
      },
      markers: [
        { index: 0, label: 'current', tone: 'accent' },
      ],
      memory: {
        label: 'Map memory',
        description: 'The map stores values we want to find later.',
        emptyText: 'Nothing saved yet. The first value is still being read.',
        entries: [],
      },
      teaching: {
        beginnerNote:
          'The complement is the number that would complete the target sum.',
        whyAllowed:
          'If 2 needs a partner, saving the needed value lets a future lookup answer quickly.',
        watchFor:
          'Watch the needed value, not only the current value.',
      },
      variables: [
        { label: 'current index', value: '0' },
        { label: 'current value', value: '2' },
        { label: 'target', value: '9' },
        { label: 'needed value', value: '7' },
        { label: 'map size', value: '0' },
        { label: 'status', value: 'not found yet' },
      ],
    },
    {
      id: 'save-seven',
      activeStepId: 'need',
      activeCodeLineIds: ['save-need'],
      title: 'Save the value we need',
      explanation:
        'The map records that value 7 would pair with the 2 at index 0.',
      comparisonText: 'Save key 7 -> index 0',
      decision: 'Store the missing partner so a future value can be checked directly.',
      status: 'Waiting for 7',
      prediction: {
        prompt: 'The next array value is 7. What should we do before saving anything new?',
        correctOptionId: 'check-memory',
        options: [
          {
            id: 'check-memory',
            label: 'Check whether 7 is in memory',
            feedback: 'Yes. Lookup comes before saving the current value.',
          },
          {
            id: 'save-current-first',
            label: 'Save 7 first',
            feedback: 'Saving first can hide the important idea: current values should check existing memory.',
          },
          {
            id: 'scan-backward',
            label: 'Scan backward through the array',
            feedback: 'The map is here so we do not need to manually scan previous values.',
          },
        ],
      },
      mistake: {
        title: 'Saving before checking memory',
        body: 'If you save first, you blur the key idea: the current value should ask whether it was already needed.',
        fix: 'Check memory first. Only save a new need if the lookup does not find a pair.',
      },
      markers: [
        { index: 0, label: 'saved', tone: 'muted' },
      ],
      memory: {
        label: 'Map memory',
        description: 'The saved key is the value that would complete the pair.',
        emptyText: 'Nothing saved yet.',
        entries: [
          { key: '7', value: 'pairs with index 0', note: 'If 7 appears, combine it with 2.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The map does not store every pair. It stores just the one value that would complete this current number.',
        whyAllowed:
          'A later lookup can ask for key 7 in one step instead of scanning backward.',
        watchFor:
          'The memory table now has one saved key.',
      },
      variables: [
        { label: 'current index', value: '0' },
        { label: 'current value', value: '2' },
        { label: 'target', value: '9' },
        { label: 'saved key', value: '7' },
        { label: 'map size', value: '1' },
        { label: 'status', value: 'waiting' },
      ],
    },
    {
      id: 'read-seven',
      activeStepId: 'lookup',
      activeCodeLineIds: ['lookup'],
      title: 'The next value is 7',
      explanation:
        'Now the current value is 7. That is exactly the key already saved in memory.',
      comparisonText: 'Map contains key 7',
      decision: 'The lookup succeeds, so the pair is found.',
      status: 'Lookup succeeds',
      prediction: {
        prompt: 'Memory already contains key 7. What does that mean?',
        correctOptionId: 'pair-found',
        options: [
          {
            id: 'pair-found',
            label: 'The saved index and current index form the pair',
            feedback: 'Exactly. The current 7 completes the 2 that was saved earlier.',
          },
          {
            id: 'keep-searching',
            label: 'Ignore it and keep searching',
            feedback: 'A successful lookup is the signal that the target pair has been found.',
          },
          {
            id: 'delete-memory',
            label: 'Delete the saved key',
            feedback: 'No deletion is needed for this beginner trace. The saved key explains the answer.',
          },
        ],
      },
      mistake: {
        title: 'Ignoring a successful lookup',
        body: 'A map hit is not just interesting information; it means the matching partner was already seen.',
        fix: 'When the current value matches a saved key, return the saved index and current index.',
      },
      markers: [
        { index: 0, label: 'saved pair', tone: 'muted' },
        { index: 1, label: 'current', tone: 'success' },
      ],
      memory: {
        label: 'Map memory',
        description: 'The current value matches a saved key.',
        emptyText: 'Nothing saved yet.',
        entries: [
          { key: '7', value: 'pairs with index 0', note: 'Current value 7 completes the pair.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The current value is not saved first. We check memory before deciding what to store next.',
        whyAllowed:
          'The map already knows that 7 was needed by index 0.',
        watchFor:
          'The current cell and the saved memory entry now point to the same value.',
      },
      variables: [
        { label: 'current index', value: '1' },
        { label: 'current value', value: '7' },
        { label: 'target', value: '9' },
        { label: 'lookup key', value: '7' },
        { label: 'saved partner', value: 'index 0' },
        { label: 'status', value: 'found' },
      ],
    },
    {
      id: 'return-pair',
      activeStepId: 'finish',
      activeCodeLineIds: ['return-pair'],
      title: 'Return the matching pair',
      explanation:
        'The saved 2 at index 0 and the current 7 at index 1 add to 9.',
      comparisonText: '2 + 7 = 9',
      decision: 'Stop because the pair has been found.',
      status: 'Answer is indices 0 and 1',
      mistake: {
        title: 'Returning the values but losing the indices',
        body: 'Many coding problems ask for positions, not just the two numbers that add up correctly.',
        fix: 'Keep the saved index in memory so the final answer can return indices 0 and 1.',
      },
      markers: [
        { index: 0, label: 'match', tone: 'success' },
        { index: 1, label: 'match', tone: 'success' },
      ],
      matchedIndices: [0, 1],
      memory: {
        label: 'Map memory',
        description: 'The memory table explains why the pair was found quickly.',
        emptyText: 'Nothing saved yet.',
        entries: [
          { key: '7', value: 'pairs with index 0', note: 'Matched by current index 1.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The pair is found because one value was remembered before the other value appeared.',
        whyAllowed:
          'Once the current value matches a saved key, the stored index and current index form the answer.',
        watchFor:
          'The highlighted cells show the final pair, while the map shows how we remembered it.',
      },
      variables: [
        { label: 'first index', value: '0' },
        { label: 'second index', value: '1' },
        { label: 'first value', value: '2' },
        { label: 'second value', value: '7' },
        { label: 'sum', value: '9' },
        { label: 'target', value: '9' },
      ],
    },
  ],
};

const anagramBucketsTraceLesson = {
  lessonId: 'anagram-buckets-preview',
  title: 'Count What Matters',
  summary:
    'Compare two words by letting counts rise for the first word and fall for the second word until every letter balances.',
  completionRecap: {
    pattern: 'Balance the same keys',
    changed:
      'The map started empty, counted each letter in listen, then subtracted each letter in silent until every saved count returned to zero.',
    learned:
      'You used one frequency table to prove that both words contain the same letters the same number of times.',
    remember:
      'For anagrams, the exact order can change, but the letter counts must match.',
    next:
      'Use this pattern whenever two collections need the same ingredients, even if their order is different.',
    stop:
      'Pause here with the main idea: a balanced count table is easier to trust than rereading both words over and over.',
  },
  setup: {
    array: ['l', 'i', 's', 't', 'e', 'n', 's', 'i', 'l', 'e', 'n', 't'],
    target: 'all counts return to 0',
    targetLabel: 'Anagram check',
  },
  algorithmSteps: [
    {
      id: 'build',
      label: 'Count the first word',
      detail: 'Each letter in the first word adds one to its saved count.',
    },
    {
      id: 'subtract',
      label: 'Subtract the second word',
      detail: 'Each letter in the second word removes one from the same saved count.',
    },
    {
      id: 'check',
      label: 'Look for imbalance',
      detail: 'A nonzero count means one word has an extra or missing letter.',
    },
    {
      id: 'finish',
      label: 'Accept only if balanced',
      detail: 'If every count is zero, the words use the same letters.',
    },
  ],
  code: {
    title: 'Valid anagram with counts',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'counts = new Map()' },
      { id: 'count-first', text: 'for char in firstWord: counts[char] += 1' },
      { id: 'subtract-second', text: 'for char in secondWord: counts[char] -= 1' },
      { id: 'check-zero', text: 'for count in counts.values():' },
      { id: 'reject', text: '  if count != 0: return false' },
      { id: 'accept', text: 'return true' },
    ],
  },
  frames: [
    {
      id: 'count-first-letter',
      activeStepId: 'build',
      activeCodeLineIds: ['setup', 'count-first'],
      title: 'Start by counting the first letter',
      explanation:
        'The first word begins with l. The map saves that l has appeared once.',
      comparisonText: 'l count goes 0 -> 1',
      decision: 'Add one to the count for the current letter.',
      status: 'Building the first word table',
      prediction: {
        prompt: 'After reading the first l in listen, what should the saved count for l be?',
        correctOptionId: 'l-one',
        options: [
          {
            id: 'l-one',
            label: '1',
            feedback: 'Correct. The letter l has appeared once so far.',
          },
          {
            id: 'l-zero',
            label: '0',
            feedback: 'Zero would mean l has not appeared, but we just read it.',
          },
          {
            id: 'l-six',
            label: '6',
            feedback: 'Six is the word length, not the count for one letter.',
          },
        ],
      },
      mistake: {
        title: 'Counting the whole word as one thing',
        body: 'An anagram check needs counts for each letter, not just the length of the word.',
        fix: 'Use the letter as the key and its count as the value.',
      },
      markers: [
        { index: 0, label: 'current', tone: 'accent' },
      ],
      memory: {
        label: 'Frequency map',
        description: 'The table stores one count per letter.',
        countLabel: 'letters',
        emptyText: 'No letters have been counted yet.',
        entries: [
          { key: 'l', value: 'count 1', note: 'The first letter has appeared once.' },
        ],
      },
      teaching: {
        beginnerNote:
          'A frequency count answers the question: how many times have I seen this exact thing?',
        whyAllowed:
          'The key l gives us one direct place to update the count for l.',
        watchFor:
          'The map is not storing positions. It is storing how many times each letter appears.',
      },
      variables: [
        { label: 'word', value: 'listen' },
        { label: 'current letter', value: 'l' },
        { label: 'current index', value: '0' },
        { label: 'count before', value: '0' },
        { label: 'count after', value: '1' },
        { label: 'phase', value: 'add counts' },
      ],
    },
    {
      id: 'first-word-counted',
      activeStepId: 'build',
      activeCodeLineIds: ['count-first'],
      title: 'The first word fills the table',
      explanation:
        'After reading listen, every letter in that word has count 1 because each one appeared once.',
      comparisonText: 'listen gives six saved counts',
      decision: 'Finish building memory before comparing the second word.',
      status: 'First word counted',
      prediction: {
        prompt: 'What does count 1 mean for each saved letter right now?',
        correctOptionId: 'appeared-once',
        options: [
          {
            id: 'appeared-once',
            label: 'That letter appeared once in listen',
            feedback: 'Exactly. Each saved count describes the first word so far.',
          },
          {
            id: 'already-balanced',
            label: 'The words are already balanced',
            feedback: 'Not yet. We still have to subtract the second word.',
          },
          {
            id: 'wrong-letter',
            label: 'That letter is not allowed',
            feedback: 'The count does not reject letters by itself. It records what appeared.',
          },
        ],
      },
      mistake: {
        title: 'Stopping after the first word',
        body: 'A filled frequency table only describes one word. It does not prove the second word matches yet.',
        fix: 'Use the second word to subtract from the same table.',
      },
      markers: [
        { index: 0, label: 'counted', tone: 'success' },
        { index: 1, label: 'counted', tone: 'success' },
        { index: 2, label: 'counted', tone: 'success' },
        { index: 3, label: 'counted', tone: 'success' },
        { index: 4, label: 'counted', tone: 'success' },
        { index: 5, label: 'counted', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2, 3, 4, 5],
      memory: {
        label: 'Frequency map',
        description: 'The first word is now represented as letter counts.',
        countLabel: 'letters',
        emptyText: 'No letters have been counted yet.',
        entries: [
          { key: 'l', value: 'count 1', note: 'One l in listen.' },
          { key: 'i', value: 'count 1', note: 'One i in listen.' },
          { key: 's', value: 'count 1', note: 'One s in listen.' },
          { key: 't', value: 'count 1', note: 'One t in listen.' },
          { key: 'e', value: 'count 1', note: 'One e in listen.' },
          { key: 'n', value: 'count 1', note: 'One n in listen.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Think of this as making an ingredient list for the first word.',
        whyAllowed:
          'The second word can now use this same table to cancel matching letters.',
        watchFor:
          'The next phase should reuse the same keys, not create a separate unrelated table.',
      },
      variables: [
        { label: 'first word', value: 'listen' },
        { label: 'letters counted', value: '6' },
        { label: 'map size', value: '6' },
        { label: 'all counts', value: '1' },
        { label: 'next word', value: 'silent' },
        { label: 'phase', value: 'subtract next' },
      ],
    },
    {
      id: 'subtract-first-match',
      activeStepId: 'subtract',
      activeCodeLineIds: ['subtract-second'],
      title: 'The second word cancels matching letters',
      explanation:
        'The second word starts with s. Since s was counted once from listen, subtracting s brings its count back to zero.',
      comparisonText: 's count goes 1 -> 0',
      decision: 'Subtract one from the count for the current second-word letter.',
      status: 'Subtracting from memory',
      prediction: {
        prompt: 'Why do we subtract for letters in the second word?',
        correctOptionId: 'cancel-match',
        options: [
          {
            id: 'cancel-match',
            label: 'To cancel matching letters from the first word',
            feedback: 'Correct. Matching letters should balance back to zero.',
          },
          {
            id: 'make-negative',
            label: 'To make every count negative',
            feedback: 'Negative counts are only a warning sign when the second word has too many of a letter.',
          },
          {
            id: 'sort-word',
            label: 'To sort the word',
            feedback: 'No sorting is happening here. The map only changes counts.',
          },
        ],
      },
      mistake: {
        title: 'Using a new table for the second word',
        body: 'Two separate tables can work, but beginners often forget to compare them carefully.',
        fix: 'For this trace, use one table so matching letters visibly cancel to zero.',
      },
      markers: [
        { index: 2, label: 'saved s', tone: 'muted' },
        { index: 6, label: 'current s', tone: 'accent' },
      ],
      memory: {
        label: 'Frequency map',
        description: 'The current letter from silent cancels one saved count.',
        countLabel: 'letters',
        emptyText: 'No letters have been counted yet.',
        entries: [
          { key: 's', value: 'count 0', note: 'The s from silent cancels the s from listen.' },
          { key: 'l', value: 'count 1', note: 'Still waiting to be matched.' },
          { key: 'i', value: 'count 1', note: 'Still waiting to be matched.' },
          { key: 't', value: 'count 1', note: 'Still waiting to be matched.' },
          { key: 'e', value: 'count 1', note: 'Still waiting to be matched.' },
          { key: 'n', value: 'count 1', note: 'Still waiting to be matched.' },
        ],
      },
      teaching: {
        beginnerNote:
          'A zero count is calming: it means this letter is balanced so far.',
        whyAllowed:
          'The same key s was created by the first word, so the second word can update that exact count.',
        watchFor:
          'Counts move toward zero when the second word has matching letters.',
      },
      variables: [
        { label: 'second word', value: 'silent' },
        { label: 'current letter', value: 's' },
        { label: 'current index', value: '6' },
        { label: 'count before', value: '1' },
        { label: 'count after', value: '0' },
        { label: 'phase', value: 'subtract counts' },
      ],
    },
    {
      id: 'one-count-left',
      activeStepId: 'check',
      activeCodeLineIds: ['subtract-second', 'check-zero'],
      title: 'Only one letter is still waiting',
      explanation:
        'After subtracting s, i, l, e, and n, the only count still above zero is t.',
      comparisonText: 't is still count 1',
      decision: 'Keep reading because one unmatched count does not mean failure until the scan is done.',
      status: 'One letter remains unmatched',
      prediction: {
        prompt: 'If t is still count 1 before the final letter is read, what should happen?',
        correctOptionId: 'keep-reading',
        options: [
          {
            id: 'keep-reading',
            label: 'Keep reading the second word',
            feedback: 'Yes. The final t may still cancel the count.',
          },
          {
            id: 'reject-now',
            label: 'Reject immediately',
            feedback: 'Too early. There is still one letter left to process.',
          },
          {
            id: 'reset-counts',
            label: 'Reset the whole map',
            feedback: 'Resetting would throw away the useful memory we built.',
          },
        ],
      },
      mistake: {
        title: 'Judging before the scan finishes',
        body: 'A temporary nonzero count can be normal while letters are still being processed.',
        fix: 'Only make the final decision after every letter in both words has been counted.',
      },
      markers: [
        { index: 3, label: 'waiting t', tone: 'ink' },
        { index: 11, label: 'next t', tone: 'accent' },
      ],
      memory: {
        label: 'Frequency map',
        description: 'Most letters have balanced. One saved count is still waiting.',
        countLabel: 'letters',
        emptyText: 'No letters have been counted yet.',
        entries: [
          { key: 'l', value: 'count 0', note: 'Balanced.' },
          { key: 'i', value: 'count 0', note: 'Balanced.' },
          { key: 's', value: 'count 0', note: 'Balanced.' },
          { key: 'e', value: 'count 0', note: 'Balanced.' },
          { key: 'n', value: 'count 0', note: 'Balanced.' },
          { key: 't', value: 'count 1', note: 'Waiting for the final t.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The map can look unfinished in the middle. That is normal during a trace.',
        whyAllowed:
          'There is still an unread letter that may balance the last saved count.',
        watchFor:
          'Do not confuse an intermediate state with the final answer.',
      },
      variables: [
        { label: 'letters balanced', value: '5' },
        { label: 'letter waiting', value: 't' },
        { label: 'count for t', value: '1' },
        { label: 'letters left', value: '1' },
        { label: 'next letter', value: 't' },
        { label: 'decision', value: 'continue' },
      ],
    },
    {
      id: 'all-counts-balanced',
      activeStepId: 'finish',
      activeCodeLineIds: ['subtract-second', 'check-zero', 'accept'],
      title: 'Every count returns to zero',
      explanation:
        'The final t cancels the last saved count. All counts are zero, so the two words are anagrams.',
      comparisonText: 'all counts are 0',
      decision: 'Return true because no letter is extra or missing.',
      status: 'Anagram confirmed',
      mistake: {
        title: 'Checking only that both words have the same length',
        body: 'Words can have the same length but different letters, so length alone is not enough.',
        fix: 'Use counts to prove the actual contents match.',
      },
      markers: [
        { index: 0, label: 'balanced', tone: 'success' },
        { index: 1, label: 'balanced', tone: 'success' },
        { index: 2, label: 'balanced', tone: 'success' },
        { index: 3, label: 'balanced', tone: 'success' },
        { index: 4, label: 'balanced', tone: 'success' },
        { index: 5, label: 'balanced', tone: 'success' },
        { index: 6, label: 'balanced', tone: 'success' },
        { index: 7, label: 'balanced', tone: 'success' },
        { index: 8, label: 'balanced', tone: 'success' },
        { index: 9, label: 'balanced', tone: 'success' },
        { index: 10, label: 'balanced', tone: 'success' },
        { index: 11, label: 'balanced', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      memory: {
        label: 'Frequency map',
        description: 'No saved count is left unmatched.',
        countLabel: 'letters',
        emptyText: 'No letters have been counted yet.',
        entries: [
          { key: 'l', value: 'count 0', note: 'Balanced.' },
          { key: 'i', value: 'count 0', note: 'Balanced.' },
          { key: 's', value: 'count 0', note: 'Balanced.' },
          { key: 't', value: 'count 0', note: 'Balanced.' },
          { key: 'e', value: 'count 0', note: 'Balanced.' },
          { key: 'n', value: 'count 0', note: 'Balanced.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Zero is the proof here: every letter added by the first word was removed by the second word.',
        whyAllowed:
          'If every count is zero after both words are processed, the words have the same letters.',
        watchFor:
          'The map is empty in meaning even if the keys are still displayed with zero values.',
      },
      variables: [
        { label: 'first word', value: 'listen' },
        { label: 'second word', value: 'silent' },
        { label: 'nonzero counts', value: '0' },
        { label: 'result', value: 'true' },
        { label: 'pattern', value: 'frequency balance' },
        { label: 'decision', value: 'accept' },
      ],
    },
  ],
};

const firstUniqueTraceLesson = {
  lessonId: 'first-unique-preview',
  title: 'Find the First Unique Value',
  summary:
    'Use one pass to count every value, then scan again to choose the first value whose count is exactly one.',
  completionRecap: {
    pattern: 'Count first, decide second',
    changed:
      'The map first learned how many times each value appeared, then the second pass used those counts to reject repeats and accept the first unique value.',
    learned:
      'You separated memory building from answer selection so the final scan can make simple decisions.',
    remember:
      'A count map is most useful after it has seen the whole input.',
    next:
      'Use this pattern when the right answer depends on knowing whether each item repeats later.',
    stop:
      'Let this one settle: the first pass gathers facts, and the second pass uses those facts calmly.',
  },
  setup: {
    array: [4, 1, 4, 2, 1, 3],
    target: 'first count of 1',
    targetLabel: 'Goal',
  },
  algorithmSteps: [
    {
      id: 'count',
      label: 'Count every value',
      detail: 'Build a map that records how many times each value appears.',
    },
    {
      id: 'scan',
      label: 'Scan in original order',
      detail: 'Read the array again from left to right so first still means first.',
    },
    {
      id: 'reject',
      label: 'Skip repeated values',
      detail: 'A value with count greater than one cannot be the first unique answer.',
    },
    {
      id: 'finish',
      label: 'Return the first count of one',
      detail: 'The first value with count one is the answer.',
    },
  ],
  code: {
    title: 'First unique value',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'counts = new Map()' },
      { id: 'count-loop', text: 'for value in nums: counts[value] += 1' },
      { id: 'scan-loop', text: 'for value in nums:' },
      { id: 'check-one', text: '  if counts[value] == 1:' },
      { id: 'return-value', text: '    return value' },
      { id: 'fallback', text: 'return no unique value' },
    ],
  },
  frames: [
    {
      id: 'count-first-four',
      activeStepId: 'count',
      activeCodeLineIds: ['setup', 'count-loop'],
      title: 'Start by counting values',
      explanation:
        'The first value is 4, so the map records that 4 has appeared once.',
      comparisonText: '4 count goes 0 -> 1',
      decision: 'Add one to the count for the current value.',
      status: 'Counting index 0',
      prediction: {
        prompt: 'Why do we count values before choosing the answer?',
        correctOptionId: 'need-full-memory',
        options: [
          {
            id: 'need-full-memory',
            label: 'We need to know which values repeat later',
            feedback: 'Correct. A value can look unique until the same value appears again.',
          },
          {
            id: 'first-is-answer',
            label: 'The first value is always the answer',
            feedback: 'Not always. The first value could repeat later.',
          },
          {
            id: 'sort-first',
            label: 'Counting sorts the array',
            feedback: 'Counting records totals. It does not sort the original order.',
          },
        ],
      },
      mistake: {
        title: 'Returning too early',
        body: 'At index 0, value 4 looks possible, but another 4 appears later.',
        fix: 'Build the full count table before deciding which value is unique.',
      },
      markers: [
        { index: 0, label: 'current', tone: 'accent' },
      ],
      memory: {
        label: 'Count map',
        description: 'The map stores how many times each value appears.',
        countLabel: 'values',
        emptyText: 'No values have been counted yet.',
        entries: [
          { key: '4', value: 'count 1', note: 'Value 4 has appeared once so far.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Unique means appears exactly once in the whole array, not just once so far.',
        whyAllowed:
          'A map gives one direct place to update the count for value 4.',
        watchFor:
          'This first pass is about facts, not final decisions.',
      },
      variables: [
        { label: 'current index', value: '0' },
        { label: 'current value', value: '4' },
        { label: 'count before', value: '0' },
        { label: 'count after', value: '1' },
        { label: 'phase', value: 'counting' },
        { label: 'answer', value: 'not decided' },
      ],
    },
    {
      id: 'full-counts-ready',
      activeStepId: 'count',
      activeCodeLineIds: ['count-loop'],
      title: 'The full count table is ready',
      explanation:
        'After the first pass, the map shows that 4 and 1 repeat, while 2 and 3 appear once.',
      comparisonText: '4:2, 1:2, 2:1, 3:1',
      decision: 'Use these counts in a second pass to preserve the original order.',
      status: 'Counting pass complete',
      prediction: {
        prompt: 'Why not return 2 immediately from the map table?',
        correctOptionId: 'need-order',
        options: [
          {
            id: 'need-order',
            label: 'We still need the first unique in original order',
            feedback: 'Exactly. The map tells counts, but the array order tells which unique value comes first.',
          },
          {
            id: 'two-repeats',
            label: '2 repeats later',
            feedback: '2 does not repeat. The issue is proving it is the first unique value.',
          },
          {
            id: 'map-empty',
            label: 'The map is empty',
            feedback: 'The map is full of useful counts now.',
          },
        ],
      },
      mistake: {
        title: 'Letting map order choose the answer',
        body: 'Hash map display order is not the same idea as original array order.',
        fix: 'Scan the original array again and ask the map for each value count.',
      },
      markers: [
        { index: 0, label: 'counted', tone: 'success' },
        { index: 1, label: 'counted', tone: 'success' },
        { index: 2, label: 'counted', tone: 'success' },
        { index: 3, label: 'counted', tone: 'success' },
        { index: 4, label: 'counted', tone: 'success' },
        { index: 5, label: 'counted', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2, 3, 4, 5],
      memory: {
        label: 'Count map',
        description: 'The first pass has recorded the whole array.',
        countLabel: 'values',
        emptyText: 'No values have been counted yet.',
        entries: [
          { key: '4', value: 'count 2', note: 'Repeats at indices 0 and 2.' },
          { key: '1', value: 'count 2', note: 'Repeats at indices 1 and 4.' },
          { key: '2', value: 'count 1', note: 'Unique candidate.' },
          { key: '3', value: 'count 1', note: 'Unique candidate.' },
        ],
      },
      teaching: {
        beginnerNote:
          'A candidate is not automatically the answer. The answer must be the first candidate in the array.',
        whyAllowed:
          'The full count table now knows which values repeat anywhere in the input.',
        watchFor:
          'The next pass starts back at index 0, not at the first count of one in the table.',
      },
      variables: [
        { label: 'counted values', value: '6' },
        { label: 'map size', value: '4' },
        { label: 'repeat counts', value: '4 and 1' },
        { label: 'unique candidates', value: '2 and 3' },
        { label: 'next phase', value: 'scan order' },
        { label: 'answer', value: 'not decided' },
      ],
    },
    {
      id: 'reject-repeated-four',
      activeStepId: 'reject',
      activeCodeLineIds: ['scan-loop', 'check-one'],
      title: 'The first value repeats',
      explanation:
        'The second pass starts at index 0. Value 4 has count 2, so it cannot be unique.',
      comparisonText: 'count[4] is 2',
      decision: 'Skip 4 and keep scanning in the original order.',
      status: 'Rejecting index 0',
      prediction: {
        prompt: 'Value 4 has count 2. What should the scan do?',
        correctOptionId: 'skip-four',
        options: [
          {
            id: 'skip-four',
            label: 'Skip it and keep scanning',
            feedback: 'Correct. Count 2 means 4 is repeated.',
          },
          {
            id: 'return-four',
            label: 'Return 4 because it appears first',
            feedback: 'It appears first, but it is not unique.',
          },
          {
            id: 'delete-four',
            label: 'Delete 4 from the array',
            feedback: 'No deletion is needed. The trace only needs to choose an answer.',
          },
        ],
      },
      mistake: {
        title: 'Confusing first with unique',
        body: 'The first value in the array is not always the first unique value.',
        fix: 'Check the count first, then decide whether to accept or skip.',
      },
      markers: [
        { index: 0, label: 'scan', tone: 'accent' },
        { index: 2, label: 'repeat', tone: 'muted' },
      ],
      memory: {
        label: 'Count map',
        description: 'The lookup for 4 explains why the scan should skip it.',
        countLabel: 'values',
        emptyText: 'No values have been counted yet.',
        entries: [
          { key: '4', value: 'count 2', note: 'Not unique, so skip.' },
          { key: '1', value: 'count 2', note: 'Also repeats.' },
          { key: '2', value: 'count 1', note: 'Unique candidate.' },
          { key: '3', value: 'count 1', note: 'Unique candidate.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The second pass is very simple because the hard memory work already happened.',
        whyAllowed:
          'Count 2 proves another 4 exists, so this 4 cannot be the unique answer.',
        watchFor:
          'The scan still moves left to right so the final answer respects original order.',
      },
      variables: [
        { label: 'scan index', value: '0' },
        { label: 'current value', value: '4' },
        { label: 'lookup count', value: '2' },
        { label: 'is unique?', value: 'no' },
        { label: 'action', value: 'skip' },
        { label: 'answer', value: 'not decided' },
      ],
    },
    {
      id: 'reject-repeated-one',
      activeStepId: 'reject',
      activeCodeLineIds: ['scan-loop', 'check-one'],
      title: 'The next value repeats too',
      explanation:
        'At index 1, value 1 also has count 2. It appeared again later, so it is skipped.',
      comparisonText: 'count[1] is 2',
      decision: 'Skip 1 because unique values must have count exactly one.',
      status: 'Rejecting index 1',
      prediction: {
        prompt: 'What count does a value need in order to be unique?',
        correctOptionId: 'count-one',
        options: [
          {
            id: 'count-one',
            label: 'Exactly 1',
            feedback: 'Yes. Unique means it appears once in the whole array.',
          },
          {
            id: 'count-two',
            label: 'Exactly 2',
            feedback: 'A count of 2 means the value repeats.',
          },
          {
            id: 'any-count',
            label: 'Any positive count',
            feedback: 'Any positive count means it exists, but unique specifically means count 1.',
          },
        ],
      },
      mistake: {
        title: 'Accepting values that merely exist',
        body: 'Every value in the array exists, but only values with count one are unique.',
        fix: 'Use the exact condition counts[value] == 1.',
      },
      markers: [
        { index: 1, label: 'scan', tone: 'accent' },
        { index: 4, label: 'repeat', tone: 'muted' },
      ],
      memory: {
        label: 'Count map',
        description: 'The lookup for 1 says this value repeats.',
        countLabel: 'values',
        emptyText: 'No values have been counted yet.',
        entries: [
          { key: '4', value: 'count 2', note: 'Already skipped.' },
          { key: '1', value: 'count 2', note: 'Not unique, so skip.' },
          { key: '2', value: 'count 1', note: 'Unique candidate.' },
          { key: '3', value: 'count 1', note: 'Unique candidate.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The word exactly matters. Count one is unique; count two is repeated.',
        whyAllowed:
          'The map has already counted the later 1, so the scan can reject this one immediately.',
        watchFor:
          'The answer is getting closer because repeated values are being ruled out in order.',
      },
      variables: [
        { label: 'scan index', value: '1' },
        { label: 'current value', value: '1' },
        { label: 'lookup count', value: '2' },
        { label: 'is unique?', value: 'no' },
        { label: 'action', value: 'skip' },
        { label: 'next candidate', value: '2' },
      ],
    },
    {
      id: 'return-first-unique',
      activeStepId: 'finish',
      activeCodeLineIds: ['scan-loop', 'check-one', 'return-value'],
      title: 'Return the first unique value',
      explanation:
        'At index 3, value 2 has count 1. Because the scan reached it before value 3, 2 is the first unique value.',
      comparisonText: 'count[2] is 1',
      decision: 'Return 2 and stop the scan.',
      status: 'First unique found',
      mistake: {
        title: 'Returning every unique candidate',
        body: 'The question asks for the first unique value, so the scan should stop at the first count of one.',
        fix: 'Return as soon as the left-to-right scan finds count one.',
      },
      markers: [
        { index: 0, label: 'rejected', tone: 'muted' },
        { index: 1, label: 'rejected', tone: 'muted' },
        { index: 3, label: 'answer', tone: 'success' },
        { index: 5, label: 'later unique', tone: 'accent' },
      ],
      matchedIndices: [3],
      memory: {
        label: 'Count map',
        description: 'The current value has count one, so it is the first valid answer.',
        countLabel: 'values',
        emptyText: 'No values have been counted yet.',
        entries: [
          { key: '4', value: 'count 2', note: 'Rejected earlier.' },
          { key: '1', value: 'count 2', note: 'Rejected earlier.' },
          { key: '2', value: 'count 1', note: 'First unique in original order.' },
          { key: '3', value: 'count 1', note: 'Unique too, but appears later.' },
        ],
      },
      teaching: {
        beginnerNote:
          'There can be more than one unique value. The original order decides which one is first.',
        whyAllowed:
          'The scan already checked all earlier values and rejected them as repeats.',
        watchFor:
          'The later 3 is unique, but it is not the first unique value.',
      },
      variables: [
        { label: 'scan index', value: '3' },
        { label: 'current value', value: '2' },
        { label: 'lookup count', value: '1' },
        { label: 'is unique?', value: 'yes' },
        { label: 'result', value: '2' },
        { label: 'pattern', value: 'count then scan' },
      ],
    },
  ],
};

const dailyTemperaturesTraceLesson = {
  lessonId: 'daily-temperatures-preview',
  title: 'When a Monotonic Stack Helps',
  summary:
    'Track days that are still waiting for a warmer temperature, then resolve them when a warmer day finally appears.',
  completionRecap: {
    pattern: 'Keep unresolved work on a stack',
    changed:
      'Cooler waiting days stayed on the stack until a warmer current day arrived and filled their answers.',
    learned:
      'You used the stack to delay decisions safely instead of guessing answers too early.',
    remember:
      'A monotonic stack keeps useful unresolved items in an order that makes the next comparison easy.',
    next:
      'Look for problems where earlier items wait until a stronger later value appears.',
    stop:
      'Pause here with the core idea: unresolved days wait, and warmer days resolve them from newest to oldest.',
  },
  setup: {
    array: [73, 74, 75, 71, 69, 72, 76],
    target: 'days until warmer',
    targetLabel: 'Goal',
    visualMode: 'bars',
  },
  algorithmSteps: [
    {
      id: 'read',
      label: 'Read the current day',
      detail: 'Look at one temperature and compare it with the newest unresolved day.',
    },
    {
      id: 'resolve',
      label: 'Resolve cooler waiting days',
      detail: 'If the current day is warmer, pop waiting days and fill their answers.',
    },
    {
      id: 'push',
      label: 'Save unresolved current day',
      detail: 'If the current day still needs a warmer future day, push it onto the stack.',
    },
    {
      id: 'finish',
      label: 'Leave no-warmer days as zero',
      detail: 'Any day still waiting at the end has no warmer day to the right.',
    },
  ],
  code: {
    title: 'Daily temperatures',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'answers = array filled with 0' },
      { id: 'stack', text: 'stack = []  // unresolved day indices' },
      { id: 'loop', text: 'for current from 0 to temps.length - 1:' },
      { id: 'while-warmer', text: '  while stack not empty and temps[current] > temps[stack.top]:' },
      { id: 'fill-answer', text: '    previous = stack.pop(); answers[previous] = current - previous' },
      { id: 'push-current', text: '  stack.push(current)' },
    ],
  },
  frames: [
    {
      id: 'push-first-day',
      activeStepId: 'push',
      activeCodeLineIds: ['setup', 'stack', 'loop', 'push-current'],
      title: 'The first day has to wait',
      explanation:
        'Day 0 is 73 degrees. There is no future day yet, so it waits on the stack.',
      comparisonText: '73 has no warmer day yet',
      decision: 'Push day 0 because its answer is unresolved.',
      status: 'Day 0 waiting',
      prediction: {
        prompt: 'Why does day 0 go onto the stack?',
        correctOptionId: 'wait-future',
        options: [
          {
            id: 'wait-future',
            label: 'It needs a warmer future day',
            feedback: 'Correct. We cannot answer day 0 until we see a warmer day later.',
          },
          {
            id: 'already-answer',
            label: 'Its answer is already known',
            feedback: 'Not yet. No later temperature has been read.',
          },
          {
            id: 'is-hottest',
            label: 'It is definitely the hottest day',
            feedback: 'We do not know that from the first value alone.',
          },
        ],
      },
      mistake: {
        title: 'Guessing before reading the future',
        body: 'A day may need to wait because the answer depends on a later warmer day.',
        fix: 'Store unresolved day indices on the stack until a warmer temperature appears.',
      },
      markers: [
        { index: 0, label: 'waiting', tone: 'accent' },
      ],
      memory: {
        label: 'Unresolved stack',
        description: 'Days wait here until a warmer temperature resolves them.',
        countLabel: 'waiting',
        emptyText: 'No unresolved days yet.',
        entries: [
          { key: 'day 0', value: '73 degrees', note: 'Waiting for a warmer future day.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The stack stores day indices, not just temperatures, because the answer is a distance in days.',
        whyAllowed:
          'Saving day 0 lets a future warmer day fill answer[0] immediately.',
        watchFor:
          'The stack means unresolved, not wrong.',
      },
      variables: [
        { label: 'current day', value: '0' },
        { label: 'temperature', value: '73' },
        { label: 'stack top', value: 'day 0' },
        { label: 'answer[0]', value: '0 for now' },
        { label: 'phase', value: 'waiting' },
        { label: 'stack size', value: '1' },
      ],
    },
    {
      id: 'resolve-day-zero',
      activeStepId: 'resolve',
      activeCodeLineIds: ['loop', 'while-warmer', 'fill-answer', 'push-current'],
      title: 'A warmer day resolves the wait',
      explanation:
        'Day 1 is 74 degrees, which is warmer than day 0. Day 0 waited one day.',
      comparisonText: '74 > 73, so answer[0] = 1',
      decision: 'Pop day 0, fill its answer, then push day 1 as the new unresolved day.',
      status: 'Day 0 resolved',
      prediction: {
        prompt: 'If day 1 resolves day 0, what value should answer[0] receive?',
        correctOptionId: 'one-day',
        options: [
          {
            id: 'one-day',
            label: '1 day',
            feedback: 'Correct. Day 1 is one index after day 0.',
          },
          {
            id: 'same-day',
            label: '0 days',
            feedback: 'Zero means no warmer day was found, but 74 is warmer than 73.',
          },
          {
            id: 'temperature',
            label: '74',
            feedback: 'The answer stores days waited, not the warmer temperature itself.',
          },
        ],
      },
      mistake: {
        title: 'Saving the warmer temperature as the answer',
        body: 'The problem asks how many days to wait, not what the warmer value is.',
        fix: 'Use current index minus previous index.',
      },
      markers: [
        { index: 0, label: 'resolved', tone: 'success' },
        { index: 1, label: 'current', tone: 'accent' },
      ],
      matchedIndices: [0],
      memory: {
        label: 'Unresolved stack',
        description: 'Day 0 is resolved, and day 1 now waits for its own warmer day.',
        countLabel: 'waiting',
        emptyText: 'No unresolved days yet.',
        entries: [
          { key: 'day 1', value: '74 degrees', note: 'Now waiting for a warmer future day.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Pop means this waiting day has received its answer and no longer needs to stay on the stack.',
        whyAllowed:
          'Because 74 is warmer than 73, day 1 is the first warmer day for day 0.',
        watchFor:
          'The current day may resolve old days and then become unresolved itself.',
      },
      variables: [
        { label: 'current day', value: '1' },
        { label: 'current temp', value: '74' },
        { label: 'resolved day', value: '0' },
        { label: 'days waited', value: '1' },
        { label: 'answer[0]', value: '1' },
        { label: 'stack after', value: '[1]' },
      ],
    },
    {
      id: 'cooler-days-stack-up',
      activeStepId: 'push',
      activeCodeLineIds: ['loop', 'while-warmer', 'push-current'],
      title: 'Cooler days stack up while waiting',
      explanation:
        'After day 2 reaches 75, days 3 and 4 are cooler. They cannot resolve day 2, so they wait on top of it.',
      comparisonText: '71 and 69 are not warmer than 75',
      decision: 'Push cooler days because they still need a warmer future day.',
      status: 'Multiple days waiting',
      prediction: {
        prompt: 'Why does day 4 with 69 degrees sit above day 3 with 71 degrees?',
        correctOptionId: 'newest-top',
        options: [
          {
            id: 'newest-top',
            label: 'It was added more recently',
            feedback: 'Correct. A stack checks the newest unresolved day first.',
          },
          {
            id: 'hottest-top',
            label: 'It is hotter',
            feedback: '69 is cooler than 71. The top is about stack order, not being hottest.',
          },
          {
            id: 'answer-known',
            label: 'Its answer is known',
            feedback: 'No. It is waiting because no warmer future day has appeared yet.',
          },
        ],
      },
      mistake: {
        title: 'Thinking the stack is sorted hottest first',
        body: 'The stack has a useful temperature pattern, but it is still a stack of unresolved indices.',
        fix: 'Read the top as newest unresolved work that should be checked first.',
      },
      markers: [
        { index: 2, label: 'waiting', tone: 'muted' },
        { index: 3, label: 'waiting', tone: 'ink' },
        { index: 4, label: 'top', tone: 'accent' },
      ],
      memory: {
        label: 'Unresolved stack',
        description: 'Cooler days are waiting for a warmer day to appear later.',
        countLabel: 'waiting',
        emptyText: 'No unresolved days yet.',
        entries: [
          { key: 'bottom day 2', value: '75 degrees', note: 'Still waiting.' },
          { key: 'day 3', value: '71 degrees', note: 'Waiting above day 2.' },
          { key: 'top day 4', value: '69 degrees', note: 'Newest unresolved day.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Several days can be unresolved at the same time. The stack keeps them in an order that is cheap to check.',
        whyAllowed:
          'No warmer day has appeared for these days yet, so keeping them is necessary.',
        watchFor:
          'When a warmer day appears, it may resolve more than one waiting day.',
      },
      variables: [
        { label: 'latest day', value: '4' },
        { label: 'latest temp', value: '69' },
        { label: 'waiting days', value: '2, 3, 4' },
        { label: 'stack top', value: 'day 4' },
        { label: 'answers filled', value: '0 and 1' },
        { label: 'phase', value: 'waiting' },
      ],
    },
    {
      id: 'resolve-two-cooler-days',
      activeStepId: 'resolve',
      activeCodeLineIds: ['loop', 'while-warmer', 'fill-answer', 'push-current'],
      title: 'One warmer day can resolve a chain',
      explanation:
        'Day 5 is 72 degrees. It is warmer than 69 and 71, so it resolves days 4 and 3 before it waits.',
      comparisonText: '72 > 69 and 72 > 71',
      decision: 'Pop each cooler waiting day and fill the distance to day 5.',
      status: 'Days 4 and 3 resolved',
      prediction: {
        prompt: 'Why does day 5 resolve day 4 before day 3?',
        correctOptionId: 'top-first',
        options: [
          {
            id: 'top-first',
            label: 'Day 4 is on top of the stack',
            feedback: 'Correct. The stack always resolves the top item first.',
          },
          {
            id: 'top-first-hotter',
            label: 'Day 4 is hotter than day 3',
            feedback: 'Day 4 is cooler. It resolves first because it is on top.',
          },
          {
            id: 'random-order',
            label: 'The order does not matter',
            feedback: 'The stack order matters because only the top item can be popped next.',
          },
        ],
      },
      mistake: {
        title: 'Only resolving one waiting day',
        body: 'A single current temperature may be warmer than several unresolved days.',
        fix: 'Keep popping while the current temperature is warmer than the stack top.',
      },
      markers: [
        { index: 3, label: 'resolved', tone: 'success' },
        { index: 4, label: 'resolved', tone: 'success' },
        { index: 5, label: 'current', tone: 'accent' },
      ],
      matchedIndices: [3, 4],
      memory: {
        label: 'Unresolved stack',
        description: 'Day 5 resolved two cooler days, then joined the stack.',
        countLabel: 'waiting',
        emptyText: 'No unresolved days yet.',
        entries: [
          { key: 'bottom day 2', value: '75 degrees', note: '72 is not warmer than 75, so day 2 still waits.' },
          { key: 'top day 5', value: '72 degrees', note: 'Current day now waits for something warmer.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The while loop is the important part. It keeps resolving until the top is no longer cooler.',
        whyAllowed:
          'Both 69 and 71 found their first warmer day at index 5.',
        watchFor:
          'Day 2 stays because 72 is not warmer than 75.',
      },
      variables: [
        { label: 'current day', value: '5' },
        { label: 'current temp', value: '72' },
        { label: 'answer[4]', value: '1' },
        { label: 'answer[3]', value: '2' },
        { label: 'still waiting', value: 'day 2' },
        { label: 'stack after', value: '[2, 5]' },
      ],
    },
    {
      id: 'finish-warmer-chain',
      activeStepId: 'finish',
      activeCodeLineIds: ['while-warmer', 'fill-answer', 'push-current'],
      title: 'The hottest day resolves the rest',
      explanation:
        'Day 6 is 76 degrees. It resolves day 5 and day 2, then no future day exists for day 6.',
      comparisonText: 'final answers: [1, 1, 4, 2, 1, 1, 0]',
      decision: 'Fill the remaining resolved answers and leave the final day as zero.',
      status: 'Temperature answers complete',
      mistake: {
        title: 'Forgetting the zero at the end',
        body: 'The last day has no future day after it, so it cannot have a warmer future temperature.',
        fix: 'Leave unresolved days as zero after the scan finishes.',
      },
      markers: [
        { index: 2, label: 'resolved', tone: 'success' },
        { index: 5, label: 'resolved', tone: 'success' },
        { index: 6, label: 'no future', tone: 'accent' },
      ],
      matchedIndices: [0, 1, 2, 3, 4, 5],
      memory: {
        label: 'Unresolved stack',
        description: 'The final day waits, but no warmer future day exists.',
        countLabel: 'waiting',
        emptyText: 'No unresolved days yet.',
        entries: [
          { key: 'day 6', value: '76 degrees', note: 'No later day exists, so answer stays 0.' },
        ],
      },
      teaching: {
        beginnerNote:
          'A zero answer does not mean the day was ignored. It means no warmer future day was found.',
        whyAllowed:
          'The scan has reached the end, so unresolved days have no future warmer value.',
        watchFor:
          'The stack explains both resolved answers and final zero answers.',
      },
      variables: [
        { label: 'current day', value: '6' },
        { label: 'current temp', value: '76' },
        { label: 'answer[5]', value: '1' },
        { label: 'answer[2]', value: '4' },
        { label: 'answer[6]', value: '0' },
        { label: 'result', value: '[1, 1, 4, 2, 1, 1, 0]' },
      ],
    },
  ],
};

const levelOrderTraceLesson = {
  lessonId: 'level-order-preview',
  title: 'Traverse by Queue Layers',
  summary:
    'Use a queue to visit a tree from top to bottom, keeping older waiting nodes ahead of newer children.',
  completionRecap: {
    pattern: 'Oldest waiting node goes next',
    changed:
      'The queue started with root A, then each visited node added its children to the back so the traversal stayed level by level.',
    learned:
      'You used FIFO order to make breadth-first traversal visible and predictable.',
    remember:
      'A queue is right when arrival order matters: first in, first out.',
    next:
      'Use this pattern for shortest paths, level-order tree traversal, and spreading processes.',
    stop:
      'Pause here with the queue rule: process the front, add new work to the back.',
  },
  setup: {
    array: ['A', 'B', 'C', 'D', 'E', 'F'],
    target: 'A, B, C, D, E, F',
    targetLabel: 'Level order',
  },
  algorithmSteps: [
    {
      id: 'enqueue',
      label: 'Enqueue the root',
      detail: 'Start the queue with the first node that should be visited.',
    },
    {
      id: 'dequeue',
      label: 'Dequeue from the front',
      detail: 'The oldest waiting node is always processed next.',
    },
    {
      id: 'children',
      label: 'Add children to the back',
      detail: 'Children wait behind nodes that were already in the queue.',
    },
    {
      id: 'finish',
      label: 'Finish when the queue is empty',
      detail: 'An empty queue means no nodes are waiting to be visited.',
    },
  ],
  code: {
    title: 'Level-order traversal',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'queue = [root]' },
      { id: 'while-queue', text: 'while queue is not empty:' },
      { id: 'dequeue', text: '  node = queue.shift()' },
      { id: 'visit', text: '  visit node' },
      { id: 'enqueue-children', text: '  enqueue each child at the back' },
      { id: 'done', text: 'return visited order' },
    ],
  },
  frames: [
    {
      id: 'queue-root',
      activeStepId: 'enqueue',
      activeCodeLineIds: ['setup'],
      title: 'Start with the root node',
      explanation:
        'The traversal begins at A, so A is placed at the front of the queue.',
      comparisonText: 'queue: [A]',
      decision: 'Enqueue A so it becomes the first node processed.',
      status: 'Root waiting in queue',
      prediction: {
        prompt: 'Which node should be visited first in level-order traversal?',
        correctOptionId: 'visit-a',
        options: [
          {
            id: 'visit-a',
            label: 'A, the root',
            feedback: 'Correct. Level order starts at the root.',
          },
          {
            id: 'visit-d',
            label: 'D, a lower node',
            feedback: 'Lower nodes wait until earlier levels are handled.',
          },
          {
            id: 'visit-f',
            label: 'F, the last node',
            feedback: 'F is not reached until its parent has been visited.',
          },
        ],
      },
      mistake: {
        title: 'Starting from a leaf',
        body: 'Level order is about moving from top to bottom, so starting at a leaf loses the structure.',
        fix: 'Start with the root, then let the queue reveal each next layer.',
      },
      markers: [
        { index: 0, label: 'front', tone: 'accent' },
      ],
      memory: {
        label: 'Queue state',
        description: 'The queue stores nodes waiting to be visited.',
        countLabel: 'waiting',
        emptyText: 'The queue is empty before the root is added.',
        entries: [
          { key: 'front', keyLabel: 'Position', value: 'A', note: 'First node waiting.' },
        ],
      },
      teaching: {
        beginnerNote:
          'A queue is like a line. The first thing waiting is the first thing served.',
        whyAllowed:
          'The root is the first level of the tree, so it must be processed first.',
        watchFor:
          'The front of the queue tells you what gets visited next.',
      },
      variables: [
        { label: 'front', value: 'A' },
        { label: 'back', value: 'A' },
        { label: 'visited', value: 'none yet' },
        { label: 'queue size', value: '1' },
        { label: 'current level', value: '0' },
        { label: 'rule', value: 'FIFO' },
      ],
    },
    {
      id: 'visit-root-add-children',
      activeStepId: 'children',
      activeCodeLineIds: ['while-queue', 'dequeue', 'visit', 'enqueue-children'],
      title: 'Visit A and add its children',
      explanation:
        'A leaves the front of the queue. Its children B and C are added to the back, in left-to-right order.',
      comparisonText: 'visited: A, queue: [B, C]',
      decision: 'Visit the front node, then enqueue its children behind existing work.',
      status: 'First layer complete',
      prediction: {
        prompt: 'After visiting A, why does B come before C?',
        correctOptionId: 'left-to-right',
        options: [
          {
            id: 'left-to-right',
            label: 'B was enqueued before C',
            feedback: 'Correct. Queue order preserves the order children were added.',
          },
          {
            id: 'alphabetical',
            label: 'Queues sort alphabetically',
            feedback: 'Queues do not sort. They preserve arrival order.',
          },
          {
            id: 'deeper-first',
            label: 'B is deeper than C',
            feedback: 'B and C are on the same level. B comes first because it entered first.',
          },
        ],
      },
      mistake: {
        title: 'Adding children to the front',
        body: 'Adding children to the front would make newer work jump ahead and break level order.',
        fix: 'Dequeue from the front, enqueue children at the back.',
      },
      markers: [
        { index: 0, label: 'visited', tone: 'success' },
        { index: 1, label: 'front', tone: 'accent' },
        { index: 2, label: 'back', tone: 'ink' },
      ],
      matchedIndices: [0],
      memory: {
        label: 'Queue state',
        description: 'B and C are waiting after A has been visited.',
        countLabel: 'waiting',
        emptyText: 'No nodes are waiting.',
        entries: [
          { key: 'front', keyLabel: 'Position', value: 'B', note: 'Oldest waiting child.' },
          { key: 'back', keyLabel: 'Position', value: 'C', note: 'Added after B.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Visiting and enqueuing are different actions: visit records the node, enqueue saves future work.',
        whyAllowed:
          'B and C are the next layer, so they wait after A is processed.',
        watchFor:
          'The queue now holds the full next level.',
      },
      variables: [
        { label: 'visited order', value: 'A' },
        { label: 'dequeued', value: 'A' },
        { label: 'enqueued', value: 'B, C' },
        { label: 'front', value: 'B' },
        { label: 'back', value: 'C' },
        { label: 'queue size', value: '2' },
      ],
    },
    {
      id: 'visit-b-add-children',
      activeStepId: 'children',
      activeCodeLineIds: ['dequeue', 'visit', 'enqueue-children'],
      title: 'Visit B before moving across the level',
      explanation:
        'B is at the front, so B is visited next. Its children D and E join the back behind C.',
      comparisonText: 'visited: A, B; queue: [C, D, E]',
      decision: 'Keep C ahead of the new children because C was already waiting.',
      status: 'B visited, children waiting',
      prediction: {
        prompt: 'Why does C stay ahead of D and E?',
        correctOptionId: 'older-work-first',
        options: [
          {
            id: 'older-work-first',
            label: 'C was already waiting in the queue',
            feedback: 'Correct. Older waiting work stays at the front.',
          },
          {
            id: 'children-first',
            label: 'Children should jump ahead',
            feedback: 'That would move deeper before finishing the current level.',
          },
          {
            id: 'remove-c',
            label: 'C should be removed',
            feedback: 'C has not been visited yet, so it must stay in the queue.',
          },
        ],
      },
      mistake: {
        title: 'Letting children cut the line',
        body: 'If D and E jump ahead of C, the traversal becomes depth-first-ish instead of breadth-first.',
        fix: 'New children go to the back of the queue.',
      },
      markers: [
        { index: 1, label: 'visited', tone: 'success' },
        { index: 2, label: 'front', tone: 'accent' },
        { index: 3, label: 'new', tone: 'ink' },
        { index: 4, label: 'new', tone: 'ink' },
      ],
      matchedIndices: [0, 1],
      memory: {
        label: 'Queue state',
        description: 'C is older waiting work, while D and E were just added.',
        countLabel: 'waiting',
        emptyText: 'No nodes are waiting.',
        entries: [
          { key: 'front', keyLabel: 'Position', value: 'C', note: 'Already waiting before B children were added.' },
          { key: 'middle', keyLabel: 'Position', value: 'D', note: 'Child of B.' },
          { key: 'back', keyLabel: 'Position', value: 'E', note: 'Child of B.' },
        ],
      },
      teaching: {
        beginnerNote:
          'This is the heart of BFS: finish older same-level work before deeper new work.',
        whyAllowed:
          'Queue order preserves the promise that first waiting means first processed.',
        watchFor:
          'The queue can contain nodes from more than one level during transitions.',
      },
      variables: [
        { label: 'visited order', value: 'A, B' },
        { label: 'dequeued', value: 'B' },
        { label: 'enqueued', value: 'D, E' },
        { label: 'front', value: 'C' },
        { label: 'back', value: 'E' },
        { label: 'queue size', value: '3' },
      ],
    },
    {
      id: 'visit-c-add-f',
      activeStepId: 'children',
      activeCodeLineIds: ['dequeue', 'visit', 'enqueue-children'],
      title: 'Visit C, then add F behind the line',
      explanation:
        'C is visited before D and E because it was waiting first. Its child F goes to the back.',
      comparisonText: 'visited: A, B, C; queue: [D, E, F]',
      decision: 'Finish the current level before processing deeper nodes.',
      status: 'Second layer complete',
      prediction: {
        prompt: 'Which node is at the front after C adds F?',
        correctOptionId: 'front-d',
        options: [
          {
            id: 'front-d',
            label: 'D',
            feedback: 'Correct. D was already waiting before F was added.',
          },
          {
            id: 'front-f',
            label: 'F',
            feedback: 'F was just added to the back, so it cannot be front yet.',
          },
          {
            id: 'front-a',
            label: 'A',
            feedback: 'A was already visited and removed from the queue.',
          },
        ],
      },
      mistake: {
        title: 'Forgetting that visited nodes leave the queue',
        body: 'Once a node is dequeued and visited, it should not stay in the waiting line.',
        fix: 'Remove from the front, visit it, then add only unvisited children to the back.',
      },
      markers: [
        { index: 2, label: 'visited', tone: 'success' },
        { index: 3, label: 'front', tone: 'accent' },
        { index: 5, label: 'new back', tone: 'ink' },
      ],
      matchedIndices: [0, 1, 2],
      memory: {
        label: 'Queue state',
        description: 'D, E, and F are waiting in the order they were enqueued.',
        countLabel: 'waiting',
        emptyText: 'No nodes are waiting.',
        entries: [
          { key: 'front', keyLabel: 'Position', value: 'D', note: 'First lower-level node waiting.' },
          { key: 'middle', keyLabel: 'Position', value: 'E', note: 'Waiting after D.' },
          { key: 'back', keyLabel: 'Position', value: 'F', note: 'Child of C, added last.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The queue makes the next step visible. You do not have to guess which node comes next.',
        whyAllowed:
          'C was older than D and E only until it was visited; then D becomes the oldest waiting node.',
        watchFor:
          'The visited order now has the first two levels: A, then B and C.',
      },
      variables: [
        { label: 'visited order', value: 'A, B, C' },
        { label: 'dequeued', value: 'C' },
        { label: 'enqueued', value: 'F' },
        { label: 'front', value: 'D' },
        { label: 'back', value: 'F' },
        { label: 'queue size', value: '3' },
      ],
    },
    {
      id: 'finish-level-order',
      activeStepId: 'finish',
      activeCodeLineIds: ['while-queue', 'dequeue', 'visit', 'done'],
      title: 'Finish when no nodes are waiting',
      explanation:
        'D, E, and F are visited in queue order. Once the queue is empty, the level-order traversal is complete.',
      comparisonText: 'output: A, B, C, D, E, F',
      decision: 'Return the visited order after the queue has no waiting nodes.',
      status: 'Traversal complete',
      mistake: {
        title: 'Stopping while the queue still has nodes',
        body: 'If anything is still waiting in the queue, the traversal is not finished.',
        fix: 'Continue until the queue is empty.',
      },
      markers: [
        { index: 0, label: '1st', tone: 'success' },
        { index: 1, label: '2nd', tone: 'success' },
        { index: 2, label: '3rd', tone: 'success' },
        { index: 3, label: '4th', tone: 'success' },
        { index: 4, label: '5th', tone: 'success' },
        { index: 5, label: '6th', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2, 3, 4, 5],
      memory: {
        label: 'Queue state',
        description: 'All nodes have been visited, so no work remains.',
        countLabel: 'waiting',
        emptyText: 'Queue empty: traversal complete.',
        entries: [],
      },
      teaching: {
        beginnerNote:
          'An empty queue is the finish signal because there is no saved future work left.',
        whyAllowed:
          'Every node that entered the queue was eventually dequeued and visited.',
        watchFor:
          'The final order follows layers, not one long branch.',
      },
      variables: [
        { label: 'visited order', value: 'A, B, C, D, E, F' },
        { label: 'queue size', value: '0' },
        { label: 'front', value: 'none' },
        { label: 'levels visited', value: '3' },
        { label: 'result', value: 'level order' },
        { label: 'rule', value: 'FIFO' },
      ],
    },
  ],
};

const validParenthesesTraceLesson = {
  lessonId: 'valid-parentheses-preview',
  title: 'Match Pairs with a Stack',
  summary:
    'Watch opening brackets wait on a stack, then see each closing bracket match the most recent opener first.',
  completionRecap: {
    pattern: 'Last opener closes first',
    changed:
      'The stack started empty, held two open brackets, then removed them in reverse order as matching closers appeared.',
    learned:
      'You used a stack to remember unfinished opening brackets and checked each closer against the newest opener.',
    remember:
      'A stack is useful when the most recent unfinished thing must be resolved before older things.',
    next:
      'Look for problems where work opens, waits, and must close in the reverse order.',
    stop:
      'This is a good place to pause: the whole lesson is the idea that the top of the stack is the next thing that must close.',
  },
  setup: {
    array: ['(', '[', ']', ')'],
    target: 'valid bracket order',
    targetLabel: 'Goal',
  },
  algorithmSteps: [
    {
      id: 'read',
      label: 'Read one character',
      detail: 'Move through the string from left to right and focus on one bracket at a time.',
    },
    {
      id: 'push',
      label: 'Push opening brackets',
      detail: 'Opening brackets wait on the stack until a matching closer appears.',
    },
    {
      id: 'match',
      label: 'Match the newest opener',
      detail: 'A closing bracket must match the top item of the stack, not any older opener.',
    },
    {
      id: 'finish',
      label: 'Finish with an empty stack',
      detail: 'The string is valid only if every opener was closed and nothing is left waiting.',
    },
  ],
  code: {
    title: 'Valid parentheses',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'stack = []' },
      { id: 'loop', text: 'for each char in string:' },
      { id: 'push', text: '  if char is an opener: stack.push(char)' },
      { id: 'check-top', text: '  else if top matches char: stack.pop()' },
      { id: 'invalid', text: '  else: return false' },
      { id: 'finish', text: 'return stack is empty' },
    ],
  },
  frames: [
    {
      id: 'read-open-paren',
      activeStepId: 'read',
      activeCodeLineIds: ['setup', 'loop', 'push'],
      title: 'Read the first opener',
      explanation:
        'The first character is `(`. It opens a group, so it needs to wait until a matching `)` appears later.',
      comparisonText: '`(` is an opener',
      decision: 'Push this opener onto the stack so we remember it.',
      status: 'Reading index 0',
      prediction: {
        prompt: 'The current bracket is an opener. What should happen next?',
        correctOptionId: 'push-opener',
        options: [
          {
            id: 'push-opener',
            label: 'Push it onto the stack',
            feedback: 'Correct. Openers wait on the stack until their matching closer appears.',
          },
          {
            id: 'ignore-opener',
            label: 'Ignore it',
            feedback: 'If we ignore it, we will forget that it still needs to be closed.',
          },
          {
            id: 'return-valid',
            label: 'Return valid immediately',
            feedback: 'Not yet. One opener does not prove the whole string is valid.',
          },
        ],
      },
      mistake: {
        title: 'Forgetting to save openers',
        body: 'An opener creates unfinished work. If it is not saved, the closer has nothing reliable to match against.',
        fix: 'Push every opener so the stack remembers what still needs to close.',
      },
      markers: [
        { index: 0, label: 'current', tone: 'accent' },
      ],
      memory: {
        label: 'Stack state',
        description: 'Open brackets wait here until their matching closer appears.',
        countLabel: 'waiting',
        emptyText: 'The stack is empty before the first opener is pushed.',
        entries: [],
      },
      teaching: {
        beginnerNote:
          'A stack is like a pile. The newest item goes on top and is the first one you can remove.',
        whyAllowed:
          'Opening brackets do not finish anything yet, so saving them is the only useful action.',
        watchFor:
          'Watch the stack panel. It shows which openers are still waiting to be closed.',
      },
      variables: [
        { label: 'index', value: '0' },
        { label: 'char', value: '(' },
        { label: 'action', value: 'push opener' },
        { label: 'stack size', value: '0 -> 1' },
        { label: 'top after action', value: '(' },
        { label: 'status', value: 'waiting for )' },
      ],
    },
    {
      id: 'push-bracket',
      activeStepId: 'push',
      activeCodeLineIds: ['push'],
      title: 'Push the nested opener',
      explanation:
        'The next character is `[`. It opens a smaller group inside the parentheses, so it goes on top of the stack.',
      comparisonText: '`[` is now the newest opener',
      decision: 'Push `[` above `(` because it must close first.',
      status: 'Stack has two waiting openers',
      prediction: {
        prompt: 'The next character will be `]`. Which opener should it try to match?',
        correctOptionId: 'match-top',
        options: [
          {
            id: 'match-top',
            label: 'The top opener `[`',
            feedback: 'Exactly. The newest opener must close before the older `(`.',
          },
          {
            id: 'match-bottom',
            label: 'The older opener `(`',
            feedback: 'That would skip over the nested opener. Stacks resolve the newest unfinished item first.',
          },
          {
            id: 'match-any',
            label: 'Any opener in the stack',
            feedback: 'Close, but order matters. A closer must match the top item, not just any saved item.',
          },
        ],
      },
      mistake: {
        title: 'Matching against any saved opener',
        body: 'A valid string depends on order. Matching a closer with an older opener can hide broken nesting.',
        fix: 'Always compare a closer with the top of the stack.',
      },
      markers: [
        { index: 0, label: 'waiting', tone: 'muted' },
        { index: 1, label: 'current', tone: 'accent' },
      ],
      memory: {
        label: 'Stack state',
        description: 'The newest opener is on top and must be closed first.',
        countLabel: 'waiting',
        emptyText: 'No openers are waiting.',
        entries: [
          { key: 'bottom', keyLabel: 'Position', value: '(', note: 'Older opener waiting underneath.' },
          { key: 'top', keyLabel: 'Position', value: '[', note: 'Newest opener, so it must close first.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Nested brackets create a stack shape because the inner bracket must finish before the outer bracket.',
        whyAllowed:
          'Pushing the new opener keeps the exact order of unfinished work.',
        watchFor:
          'The top item changed from `(` to `[`. That top item controls the next close check.',
      },
      variables: [
        { label: 'index', value: '1' },
        { label: 'char', value: '[' },
        { label: 'action', value: 'push opener' },
        { label: 'stack bottom', value: '(' },
        { label: 'stack top', value: '[' },
        { label: 'status', value: 'nested opener waiting' },
      ],
    },
    {
      id: 'match-bracket',
      activeStepId: 'match',
      activeCodeLineIds: ['check-top'],
      title: 'Match the closing bracket',
      explanation:
        'The current character is `]`. It matches the top of the stack, which is `[`, so the top opener can be removed.',
      comparisonText: '`]` matches top `[`',
      decision: 'Pop `[` because its matching closer has arrived.',
      status: 'Inner pair is closed',
      prediction: {
        prompt: 'After `[` is popped, what is now on top of the stack?',
        correctOptionId: 'paren-top',
        options: [
          {
            id: 'paren-top',
            label: '`(` becomes the top',
            feedback: 'Correct. Removing the newest opener reveals the older opener underneath.',
          },
          {
            id: 'bracket-stays',
            label: '`[` stays on top',
            feedback: 'No. A successful match removes the top opener from the stack.',
          },
          {
            id: 'stack-empty',
            label: 'The stack is empty',
            feedback: 'Not yet. The outer `(` is still waiting for its closer.',
          },
        ],
      },
      mistake: {
        title: 'Leaving matched openers on the stack',
        body: 'If a matched opener stays in memory, the algorithm will think it still needs to be closed.',
        fix: 'Pop the stack after a correct match so only unfinished openers remain.',
      },
      markers: [
        { index: 1, label: 'matched', tone: 'muted' },
        { index: 2, label: 'current', tone: 'success' },
      ],
      matchedIndices: [1, 2],
      memory: {
        label: 'Stack state',
        description: '`[` matched `]`, so only the outer opener remains waiting.',
        countLabel: 'waiting',
        emptyText: 'No openers are waiting.',
        entries: [
          { key: 'top', keyLabel: 'Position', value: '(', note: 'Still waiting for `)`.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Pop means remove the top item. Here, the top item was handled successfully.',
        whyAllowed:
          'The closer matched the newest opener, so the nested pair is complete.',
        watchFor:
          'The stack gets smaller after the match. That is how the algorithm records progress.',
      },
      variables: [
        { label: 'index', value: '2' },
        { label: 'char', value: ']' },
        { label: 'top before match', value: '[' },
        { label: 'action', value: 'pop top' },
        { label: 'stack top after', value: '(' },
        { label: 'status', value: 'inner pair closed' },
      ],
    },
    {
      id: 'match-paren',
      activeStepId: 'match',
      activeCodeLineIds: ['check-top'],
      title: 'Close the outer pair',
      explanation:
        'The final character is `)`. The top of the stack is `(`, so this closing bracket matches the remaining opener.',
      comparisonText: '`)` matches top `(`',
      decision: 'Pop `(` because the outer pair is now closed.',
      status: 'All openers have matched closers',
      prediction: {
        prompt: 'The input is finished and the stack is empty. What result should we return?',
        correctOptionId: 'return-valid',
        options: [
          {
            id: 'return-valid',
            label: 'Return valid',
            feedback: 'Yes. Every opener found a matching closer in the correct order.',
          },
          {
            id: 'return-invalid',
            label: 'Return invalid',
            feedback: 'There is no mismatch and nothing left waiting, so this string is valid.',
          },
          {
            id: 'push-closer',
            label: 'Push the closer',
            feedback: 'Closers do not wait on the stack in this pattern. They resolve saved openers.',
          },
        ],
      },
      mistake: {
        title: 'Pushing closing brackets',
        body: 'A closing bracket is not unfinished work. It is a request to finish the newest opener.',
        fix: 'Use closers to check and pop the stack, not to add more waiting items.',
      },
      markers: [
        { index: 0, label: 'matched', tone: 'muted' },
        { index: 3, label: 'current', tone: 'success' },
      ],
      matchedIndices: [0, 3],
      memory: {
        label: 'Stack state',
        description: 'The final match removes the last waiting opener.',
        countLabel: 'waiting',
        emptyText: 'The stack is empty after the outer pair closes.',
        entries: [],
      },
      teaching: {
        beginnerNote:
          'The outer opener had to wait until the inner pair finished. That is why the stack order matters.',
        whyAllowed:
          'The closer matches the current top item, so the last opener can be safely removed.',
        watchFor:
          'The stack is empty now. Empty means there are no unfinished openers left.',
      },
      variables: [
        { label: 'index', value: '3' },
        { label: 'char', value: ')' },
        { label: 'top before match', value: '(' },
        { label: 'action', value: 'pop top' },
        { label: 'stack size', value: '1 -> 0' },
        { label: 'status', value: 'all pairs closed' },
      ],
    },
    {
      id: 'valid-result',
      activeStepId: 'finish',
      activeCodeLineIds: ['finish'],
      title: 'The stack is empty, so the string is valid',
      explanation:
        'Every opening bracket was matched by the correct closing bracket, and nothing is left waiting on the stack.',
      comparisonText: 'stack is empty',
      decision: 'Return valid because the string closed in the correct order.',
      status: 'Valid bracket string',
      mistake: {
        title: 'Only checking that counts are equal',
        body: 'A string can have the same number of openers and closers but still be in the wrong order.',
        fix: 'Use the stack to verify order, then accept only when the stack is empty at the end.',
      },
      markers: [
        { index: 0, label: 'valid', tone: 'success' },
        { index: 1, label: 'valid', tone: 'success' },
        { index: 2, label: 'valid', tone: 'success' },
        { index: 3, label: 'valid', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2, 3],
      memory: {
        label: 'Stack state',
        description: 'No unfinished openers remain.',
        countLabel: 'waiting',
        emptyText: 'Empty stack: every opener was closed correctly.',
        entries: [],
      },
      teaching: {
        beginnerNote:
          'The stack ending empty is the final proof that no opener was left unmatched.',
        whyAllowed:
          'Every closer matched the top item at the time it appeared, so the nesting order was correct.',
        watchFor:
          'The final highlight shows the whole string as valid, while the stack shows nothing left to resolve.',
      },
      variables: [
        { label: 'input', value: '([])' },
        { label: 'stack size', value: '0' },
        { label: 'unmatched openers', value: 'none' },
        { label: 'mismatches', value: 'none' },
        { label: 'result', value: 'valid' },
        { label: 'pattern', value: 'last opener closes first' },
      ],
    },
  ],
};

const dfsOrderTraceLesson = {
  lessonId: 'dfs-order-preview',
  title: 'Read a Tree Depth First',
  summary:
    'Follow a depth-first traversal as the call stack goes down one branch, returns, and then explores the next branch.',
  completionRecap: {
    pattern: 'Go deep, then return',
    changed:
      'The traversal visited A first, followed the left branch through B, D, and E, then returned to visit C and F.',
    learned:
      'You used the call stack to understand why depth-first order is about unfinished recursive calls, not just node labels.',
    remember:
      'DFS keeps going down a branch until it cannot go farther, then it backs up to the most recent unfinished node.',
    next:
      'Compare preorder, inorder, and postorder by changing when the visit happens relative to the child calls.',
    stop:
      'Pause here with the image of the call stack: it remembers where to return after a branch finishes.',
  },
  setup: {
    array: ['A', 'B', 'D', 'E', 'C', 'F'],
    target: 'A, B, D, E, C, F',
    targetLabel: 'Preorder',
  },
  algorithmSteps: [
    {
      id: 'visit',
      label: 'Visit the node',
      detail: 'In preorder, the current node is handled before its children.',
    },
    {
      id: 'go-left',
      label: 'Explore the left child',
      detail: 'DFS follows one branch deeper before moving sideways.',
    },
    {
      id: 'return',
      label: 'Return to unfinished work',
      detail: 'When a branch ends, the call stack shows where to continue.',
    },
    {
      id: 'finish',
      label: 'Finish after every call returns',
      detail: 'The traversal is complete when no calls are waiting.',
    },
  ],
  code: {
    title: 'Preorder DFS',
    language: 'pseudocode',
    lines: [
      { id: 'function', text: 'dfs(node):' },
      { id: 'base', text: '  if node is empty: return' },
      { id: 'visit', text: '  visit(node)' },
      { id: 'left', text: '  dfs(node.left)' },
      { id: 'right', text: '  dfs(node.right)' },
      { id: 'done', text: 'return visited order' },
    ],
  },
  frames: [
    {
      id: 'dfs-visit-root',
      activeStepId: 'visit',
      activeCodeLineIds: ['function', 'base', 'visit'],
      title: 'Visit the root first',
      explanation:
        'Preorder starts by visiting A before moving to either child.',
      comparisonText: 'output starts: A',
      decision: 'Record A, then prepare to go down the left branch.',
      status: 'Root visited',
      prediction: {
        prompt: 'In preorder traversal, when do we visit the current node?',
        correctOptionId: 'before-children',
        options: [
          {
            id: 'before-children',
            label: 'Before its children',
            feedback: 'Correct. Preorder means node first, then child calls.',
          },
          {
            id: 'after-children',
            label: 'After both children',
            feedback: 'That describes postorder, not preorder.',
          },
          {
            id: 'only-leaves',
            label: 'Only if it is a leaf',
            feedback: 'Preorder visits every node, including the root.',
          },
        ],
      },
      mistake: {
        title: 'Thinking DFS always means left node first',
        body: 'DFS describes going deep. Preorder, inorder, and postorder describe when the node is visited.',
        fix: 'Name both ideas: this trace is DFS with preorder visit timing.',
      },
      markers: [
        { index: 0, label: 'current', tone: 'success' },
      ],
      matchedIndices: [0],
      memory: {
        label: 'Call stack',
        description: 'Recursive calls wait here until their child work finishes.',
        countLabel: 'calls',
        emptyText: 'No recursive calls are waiting.',
        entries: [
          { key: 'top', keyLabel: 'Frame', value: 'dfs(A)', note: 'Currently visiting the root.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The call stack is the breadcrumb trail that tells recursion where to return.',
        whyAllowed:
          'Preorder chooses to process the node before starting either child branch.',
        watchFor:
          'The output changes when visit(node) runs, not when a child call is scheduled.',
      },
      variables: [
        { label: 'current node', value: 'A' },
        { label: 'output', value: 'A' },
        { label: 'next call', value: 'dfs(B)' },
        { label: 'stack size', value: '1' },
        { label: 'traversal', value: 'preorder' },
        { label: 'phase', value: 'visit root' },
      ],
    },
    {
      id: 'dfs-left-chain',
      activeStepId: 'go-left',
      activeCodeLineIds: ['left', 'function', 'visit'],
      title: 'Go deep before moving sideways',
      explanation:
        'DFS moves from A to B, then down to D before visiting E or C.',
      comparisonText: 'output: A, B, D',
      decision: 'Keep following the left branch while there is a child to visit.',
      status: 'Left branch active',
      prediction: {
        prompt: 'Why does D appear before E and C?',
        correctOptionId: 'deeper-first',
        options: [
          {
            id: 'deeper-first',
            label: 'DFS keeps going deeper first',
            feedback: 'Correct. D is reached by following the left branch before returning.',
          },
          {
            id: 'alphabetical',
            label: 'D is alphabetically earlier',
            feedback: 'Traversal follows tree links, not alphabet order.',
          },
          {
            id: 'queue-order',
            label: 'A queue puts D first',
            feedback: 'This lesson uses the call stack, not a queue.',
          },
        ],
      },
      mistake: {
        title: 'Jumping to the sibling too early',
        body: 'If you visit E before finishing D, you are not following the left branch to its end.',
        fix: 'Let the active recursive call finish before returning to a sibling.',
      },
      markers: [
        { index: 0, label: 'ancestor', tone: 'muted' },
        { index: 1, label: 'parent', tone: 'ink' },
        { index: 2, label: 'current', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2],
      memory: {
        label: 'Call stack',
        description: 'The newest call is on top, and it must finish before older calls continue.',
        countLabel: 'calls',
        emptyText: 'No recursive calls are waiting.',
        entries: [
          { key: 'bottom', keyLabel: 'Frame', value: 'dfs(A)', note: 'Waiting for the left subtree to finish.' },
          { key: 'middle', keyLabel: 'Frame', value: 'dfs(B)', note: 'Waiting for child calls.' },
          { key: 'top', keyLabel: 'Frame', value: 'dfs(D)', note: 'Current leaf call.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Depth-first means the newest deeper call gets attention before a sibling branch.',
        whyAllowed:
          'B has a left child D, so the traversal follows it before trying B right child E.',
        watchFor:
          'The stack grows as the trace goes deeper.',
      },
      variables: [
        { label: 'current node', value: 'D' },
        { label: 'output', value: 'A, B, D' },
        { label: 'parent waiting', value: 'B' },
        { label: 'root waiting', value: 'A' },
        { label: 'stack size', value: '3' },
        { label: 'next action', value: 'return from D' },
      ],
    },
    {
      id: 'dfs-return-to-sibling',
      activeStepId: 'return',
      activeCodeLineIds: ['right', 'function', 'visit'],
      title: 'Return to B, then visit E',
      explanation:
        'D has no children, so its call returns. The stack brings us back to B, where the right child E is still waiting.',
      comparisonText: 'output: A, B, D, E',
      decision: 'Use the call stack to resume the most recent unfinished node.',
      status: 'Sibling visited after return',
      prediction: {
        prompt: 'After D finishes, which node tells the traversal what to do next?',
        correctOptionId: 'return-b',
        options: [
          {
            id: 'return-b',
            label: 'B, the parent call',
            feedback: 'Correct. B was waiting underneath D on the call stack.',
          },
          {
            id: 'return-c',
            label: 'C, the root sibling',
            feedback: 'C waits until the whole B subtree is finished.',
          },
          {
            id: 'return-none',
            label: 'No node; traversal stops',
            feedback: 'Not yet. B still has right child E.',
          },
        ],
      },
      mistake: {
        title: 'Losing the return point',
        body: 'Without the stack idea, recursion can feel like it teleports after a leaf.',
        fix: 'Read the call stack as the list of paused places to resume.',
      },
      markers: [
        { index: 1, label: 'resumed', tone: 'ink' },
        { index: 2, label: 'done', tone: 'muted' },
        { index: 3, label: 'current', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2, 3],
      memory: {
        label: 'Call stack',
        description: 'B resumed after D returned, then called E.',
        countLabel: 'calls',
        emptyText: 'No recursive calls are waiting.',
        entries: [
          { key: 'bottom', keyLabel: 'Frame', value: 'dfs(A)', note: 'Still waiting for B subtree to finish.' },
          { key: 'middle', keyLabel: 'Frame', value: 'dfs(B)', note: 'Resumed and moved to right child.' },
          { key: 'top', keyLabel: 'Frame', value: 'dfs(E)', note: 'Current leaf call.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Returning is not going backward randomly. It means the current call ended and the previous call continues.',
        whyAllowed:
          'B cannot finish until both its left and right child calls finish.',
        watchFor:
          'DFS finishes an entire subtree before moving to the next subtree.',
      },
      variables: [
        { label: 'current node', value: 'E' },
        { label: 'output', value: 'A, B, D, E' },
        { label: 'returned from', value: 'D' },
        { label: 'resumed at', value: 'B' },
        { label: 'stack size', value: '3' },
        { label: 'next action', value: 'finish B subtree' },
      ],
    },
    {
      id: 'dfs-finish-right-subtree',
      activeStepId: 'finish',
      activeCodeLineIds: ['right', 'visit', 'done'],
      title: 'Finish with the right subtree',
      explanation:
        'After B is complete, the traversal returns to A and explores C, then C child F.',
      comparisonText: 'final output: A, B, D, E, C, F',
      decision: 'Finish when every recursive call has returned.',
      status: 'DFS traversal complete',
      mistake: {
        title: 'Stopping after the left subtree',
        body: 'A node can still have right-side work waiting after the left branch returns.',
        fix: 'After dfs(left), run dfs(right) before the parent call finishes.',
      },
      markers: [
        { index: 0, label: '1st', tone: 'success' },
        { index: 1, label: '2nd', tone: 'success' },
        { index: 2, label: '3rd', tone: 'success' },
        { index: 3, label: '4th', tone: 'success' },
        { index: 4, label: '5th', tone: 'success' },
        { index: 5, label: '6th', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2, 3, 4, 5],
      memory: {
        label: 'Call stack',
        description: 'No recursive calls are waiting.',
        countLabel: 'calls',
        emptyText: 'Stack empty: traversal complete.',
        entries: [],
      },
      teaching: {
        beginnerNote:
          'The full output is the history of visit(node) calls.',
        whyAllowed:
          'Both subtrees of every visited node have completed.',
        watchFor:
          'The stack ending empty is the signal that recursion has fully returned.',
      },
      variables: [
        { label: 'output', value: 'A, B, D, E, C, F' },
        { label: 'stack size', value: '0' },
        { label: 'left subtree', value: 'complete' },
        { label: 'right subtree', value: 'complete' },
        { label: 'result', value: 'preorder DFS' },
        { label: 'phase', value: 'done' },
      ],
    },
  ],
};

const bfsLayersTraceLesson = {
  lessonId: 'bfs-layers-preview',
  title: 'Visit by Levels',
  summary:
    'Watch breadth-first traversal use a queue to finish each tree level before moving deeper.',
  completionRecap: {
    pattern: 'Process one layer at a time',
    changed:
      'The queue held the current frontier, then replaced it with the next layer until all nodes were visited.',
    learned:
      'You used queue order to make top-to-bottom traversal visible.',
    remember:
      'BFS visits older waiting nodes first, which naturally groups a tree by levels.',
    next:
      'Use this for level averages, shortest path in unweighted graphs, and spreading simulations.',
    stop:
      'Pause here with the frontier idea: the queue is the visible edge of what will be visited next.',
  },
  setup: {
    array: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    target: 'levels: A | B C | D E F G',
    targetLabel: 'Layer goal',
  },
  algorithmSteps: [
    {
      id: 'queue-root',
      label: 'Queue the root',
      detail: 'Start with the root as the only node in the first frontier.',
    },
    {
      id: 'visit-level',
      label: 'Visit the current level',
      detail: 'Process the nodes that were already waiting for this layer.',
    },
    {
      id: 'build-next',
      label: 'Build the next frontier',
      detail: 'Children are added to the back of the queue for the next layer.',
    },
    {
      id: 'finish',
      label: 'Finish when the frontier is empty',
      detail: 'No waiting nodes means every reachable node was visited.',
    },
  ],
  code: {
    title: 'Tree BFS by layers',
    language: 'pseudocode',
    lines: [
      { id: 'setup', text: 'queue = [root]' },
      { id: 'while-queue', text: 'while queue is not empty:' },
      { id: 'level-size', text: '  levelSize = queue.length' },
      { id: 'process-level', text: '  repeat levelSize times: node = queue.shift(); visit(node)' },
      { id: 'enqueue-children', text: '  enqueue node children for the next level' },
      { id: 'done', text: 'return levels' },
    ],
  },
  frames: [
    {
      id: 'bfs-root-frontier',
      activeStepId: 'queue-root',
      activeCodeLineIds: ['setup'],
      title: 'The root is the first frontier',
      explanation:
        'BFS begins with only A in the queue because A is the whole first level.',
      comparisonText: 'level 0: A',
      decision: 'Queue A so the traversal starts at the top.',
      status: 'Level 0 waiting',
      prediction: {
        prompt: 'What does the queue contain before BFS visits anything?',
        correctOptionId: 'only-root',
        options: [
          {
            id: 'only-root',
            label: 'Only the root A',
            feedback: 'Correct. The root is the first frontier.',
          },
          {
            id: 'all-nodes',
            label: 'Every node at once',
            feedback: 'BFS discovers children after visiting their parent.',
          },
          {
            id: 'leaves-first',
            label: 'Only the leaves',
            feedback: 'Leaves are lower in the tree and are discovered later.',
          },
        ],
      },
      mistake: {
        title: 'Starting with every node',
        body: 'BFS grows outward from the root. It does not need all nodes in the queue at the beginning.',
        fix: 'Queue the root first, then discover children as their parents are visited.',
      },
      markers: [
        { index: 0, label: 'frontier', tone: 'accent' },
      ],
      memory: {
        label: 'Queue frontier',
        description: 'The frontier is the set of nodes waiting to be visited next.',
        countLabel: 'waiting',
        emptyText: 'No nodes are waiting.',
        entries: [
          { key: 'front', keyLabel: 'Position', value: 'A', note: 'Only node in level 0.' },
        ],
      },
      teaching: {
        beginnerNote:
          'A frontier is the visible edge of the traversal: what is waiting right now.',
        whyAllowed:
          'The root has no parent, so it is the natural first node.',
        watchFor:
          'The queue will grow after A reveals its children.',
      },
      variables: [
        { label: 'current level', value: '0' },
        { label: 'queue', value: 'A' },
        { label: 'visited', value: 'none' },
        { label: 'level size', value: '1' },
        { label: 'next level', value: 'unknown' },
        { label: 'rule', value: 'FIFO' },
      ],
    },
    {
      id: 'bfs-build-level-one',
      activeStepId: 'build-next',
      activeCodeLineIds: ['level-size', 'process-level', 'enqueue-children'],
      title: 'Visit A, then reveal level one',
      explanation:
        'A is visited and its children B and C are added to the back of the queue.',
      comparisonText: 'visited: A; next frontier: B, C',
      decision: 'Complete level 0 before moving to B and C.',
      status: 'Level 1 discovered',
      prediction: {
        prompt: 'Why are B and C grouped together?',
        correctOptionId: 'same-level',
        options: [
          {
            id: 'same-level',
            label: 'They are both children of A',
            feedback: 'Correct. They are the next level below the root.',
          },
          {
            id: 'same-value',
            label: 'They have the same value',
            feedback: 'The labels are different. They are grouped by level.',
          },
          {
            id: 'leaf-only',
            label: 'They are both leaves',
            feedback: 'In this sample, B and C still have children.',
          },
        ],
      },
      mistake: {
        title: 'Mixing levels too early',
        body: 'If grandchildren are visited before C, the traversal no longer feels level by level.',
        fix: 'Use the queue to finish B and C before visiting D, E, F, or G.',
      },
      markers: [
        { index: 0, label: 'visited', tone: 'success' },
        { index: 1, label: 'level 1', tone: 'accent' },
        { index: 2, label: 'level 1', tone: 'accent' },
      ],
      matchedIndices: [0],
      memory: {
        label: 'Queue frontier',
        description: 'The next level is waiting in queue order.',
        countLabel: 'waiting',
        emptyText: 'No nodes are waiting.',
        entries: [
          { key: 'front', keyLabel: 'Position', value: 'B', note: 'First child of A.' },
          { key: 'back', keyLabel: 'Position', value: 'C', note: 'Second child of A.' },
        ],
      },
      teaching: {
        beginnerNote:
          'BFS creates layers because children wait behind nodes already in the queue.',
        whyAllowed:
          'A has been visited, so its direct children become the next frontier.',
        watchFor:
          'The queue now contains exactly level 1.',
      },
      variables: [
        { label: 'visited', value: 'A' },
        { label: 'current level done?', value: 'yes' },
        { label: 'queue', value: 'B, C' },
        { label: 'next level size', value: '2' },
        { label: 'front', value: 'B' },
        { label: 'back', value: 'C' },
      ],
    },
    {
      id: 'bfs-build-level-two',
      activeStepId: 'build-next',
      activeCodeLineIds: ['level-size', 'process-level', 'enqueue-children'],
      title: 'Level one creates level two',
      explanation:
        'B and C are visited before any grandchild. Their children D, E, F, and G become the next frontier.',
      comparisonText: 'visited: A, B, C; queue: D, E, F, G',
      decision: 'Use the saved level size to avoid mixing the current level with the next one.',
      status: 'Level 2 discovered',
      prediction: {
        prompt: 'Why does BFS remember the level size before processing B and C?',
        correctOptionId: 'separate-levels',
        options: [
          {
            id: 'separate-levels',
            label: 'To separate this level from the next one',
            feedback: 'Correct. New children should form the next layer.',
          },
          {
            id: 'sort-children',
            label: 'To sort the children',
            feedback: 'The queue preserves order; it does not sort.',
          },
          {
            id: 'skip-leaves',
            label: 'To skip leaf nodes',
            feedback: 'Leaves are still visited. They just add no children.',
          },
        ],
      },
      mistake: {
        title: 'Letting new children extend the current level',
        body: 'If you keep processing newly enqueued children in the same level pass, layer boundaries disappear.',
        fix: 'Capture the queue length at the start of each level.',
      },
      markers: [
        { index: 1, label: 'visited', tone: 'success' },
        { index: 2, label: 'visited', tone: 'success' },
        { index: 3, label: 'level 2', tone: 'accent' },
        { index: 4, label: 'level 2', tone: 'accent' },
        { index: 5, label: 'level 2', tone: 'accent' },
        { index: 6, label: 'level 2', tone: 'accent' },
      ],
      matchedIndices: [0, 1, 2],
      memory: {
        label: 'Queue frontier',
        description: 'The queue now holds the full next layer.',
        countLabel: 'waiting',
        emptyText: 'No nodes are waiting.',
        entries: [
          { key: 'front', keyLabel: 'Position', value: 'D', note: 'First node in level 2.' },
          { key: '2', keyLabel: 'Position', value: 'E', note: 'Second node in level 2.' },
          { key: '3', keyLabel: 'Position', value: 'F', note: 'Third node in level 2.' },
          { key: 'back', keyLabel: 'Position', value: 'G', note: 'Fourth node in level 2.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The queue can hold the next level while the current level is finishing.',
        whyAllowed:
          'B and C were already waiting before their children were added.',
        watchFor:
          'Level size is the guardrail that keeps layers clean.',
      },
      variables: [
        { label: 'visited', value: 'A, B, C' },
        { label: 'processed level', value: '1' },
        { label: 'new frontier', value: 'D, E, F, G' },
        { label: 'next level size', value: '4' },
        { label: 'queue front', value: 'D' },
        { label: 'queue back', value: 'G' },
      ],
    },
    {
      id: 'bfs-finish-layers',
      activeStepId: 'finish',
      activeCodeLineIds: ['process-level', 'done'],
      title: 'Leaves finish the traversal',
      explanation:
        'D, E, F, and G are visited in order. They have no children, so the queue becomes empty.',
      comparisonText: 'levels: A | B C | D E F G',
      decision: 'Stop when no nodes are waiting in the frontier.',
      status: 'BFS layers complete',
      mistake: {
        title: 'Expecting leaves to enqueue more work',
        body: 'Leaves have no children, so they finish without adding anything to the queue.',
        fix: 'Visit leaves, add no children, and let the queue shrink to empty.',
      },
      markers: [
        { index: 0, label: 'level 0', tone: 'success' },
        { index: 1, label: 'level 1', tone: 'success' },
        { index: 2, label: 'level 1', tone: 'success' },
        { index: 3, label: 'level 2', tone: 'success' },
        { index: 4, label: 'level 2', tone: 'success' },
        { index: 5, label: 'level 2', tone: 'success' },
        { index: 6, label: 'level 2', tone: 'success' },
      ],
      matchedIndices: [0, 1, 2, 3, 4, 5, 6],
      memory: {
        label: 'Queue frontier',
        description: 'Every node has been visited.',
        countLabel: 'waiting',
        emptyText: 'Queue empty: all levels are complete.',
        entries: [],
      },
      teaching: {
        beginnerNote:
          'An empty queue means there is no next frontier.',
        whyAllowed:
          'Every child discovered from every visited node has also been visited.',
        watchFor:
          'The final output is grouped by distance from the root.',
      },
      variables: [
        { label: 'level 0', value: 'A' },
        { label: 'level 1', value: 'B, C' },
        { label: 'level 2', value: 'D, E, F, G' },
        { label: 'queue size', value: '0' },
        { label: 'result', value: '3 levels' },
        { label: 'pattern', value: 'BFS' },
      ],
    },
  ],
};

const pathSumTraceLesson = {
  lessonId: 'path-sum-preview',
  title: 'Carry Information Down the Tree',
  summary:
    'Track a running path sum as the traversal moves from the root toward leaves and backtracks between branches.',
  completionRecap: {
    pattern: 'Carry path state',
    changed:
      'The running sum grew down the left branch, rejected an unfinished path, then included leaf 2 to reach the target 22.',
    learned:
      'You kept path state separate from global tree state, which is why backtracking is safe.',
    remember:
      'A path sum only counts values on the current root-to-leaf path.',
    next:
      'Use this idea for path sums, path strings, ancestor lists, and any tree problem with carried context.',
    stop:
      'Pause here with the path rule: carry information down, then let it reset when that branch returns.',
  },
  setup: {
    array: [5, 4, 8, 11, 13, 4, 2],
    target: 22,
    targetLabel: 'Target sum',
  },
  algorithmSteps: [
    {
      id: 'carry',
      label: 'Carry the running sum',
      detail: 'Each node adds its value to the current path only.',
    },
    {
      id: 'branch',
      label: 'Choose a child branch',
      detail: 'The path follows one branch at a time.',
    },
    {
      id: 'check-leaf',
      label: 'Check only at leaves',
      detail: 'A valid path must end at a leaf, not halfway down the tree.',
    },
    {
      id: 'finish',
      label: 'Return when a path matches',
      detail: 'If a root-to-leaf path reaches the target, the search succeeds.',
    },
  ],
  code: {
    title: 'Root-to-leaf path sum',
    language: 'pseudocode',
    lines: [
      { id: 'function', text: 'hasPathSum(node, running):' },
      { id: 'base', text: '  if node is empty: return false' },
      { id: 'add', text: '  running += node.value' },
      { id: 'leaf-check', text: '  if node is leaf: return running == target' },
      { id: 'recurse', text: '  return left path works or right path works' },
      { id: 'done', text: 'return result' },
    ],
  },
  frames: [
    {
      id: 'path-start-root',
      activeStepId: 'carry',
      activeCodeLineIds: ['function', 'add'],
      title: 'Start the path at the root',
      explanation:
        'The path begins at 5, so the running sum is 5.',
      comparisonText: 'running sum: 5',
      decision: 'Carry 5 downward and keep looking for a root-to-leaf total of 22.',
      status: 'Root path started',
      prediction: {
        prompt: 'What does the running sum include at the root?',
        correctOptionId: 'only-root',
        options: [
          {
            id: 'only-root',
            label: 'Only the root value 5',
            feedback: 'Correct. The path has not moved to a child yet.',
          },
          {
            id: 'only-leaves',
            label: 'Only leaf values',
            feedback: 'The path starts at the root and eventually reaches a leaf.',
          },
          {
            id: 'whole-tree',
            label: 'Every value in the tree',
            feedback: 'A path sum uses one branch, not the whole tree.',
          },
        ],
      },
      mistake: {
        title: 'Adding the whole tree',
        body: 'Path sum means one connected root-to-leaf path, not all nodes combined.',
        fix: 'Only add nodes on the current branch.',
      },
      markers: [
        { index: 0, label: 'path', tone: 'success' },
      ],
      matchedIndices: [0],
      memory: {
        label: 'Current path',
        description: 'Only nodes on this branch contribute to the running sum.',
        countLabel: 'nodes',
        emptyText: 'No path nodes selected yet.',
        entries: [
          { key: 'root', keyLabel: 'Node', value: '5', note: 'Running sum is 5.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Carried state is information that travels with the current recursive path.',
        whyAllowed:
          'Every root-to-leaf path must start at the root.',
        watchFor:
          'The running sum belongs to this path, not every path.',
      },
      variables: [
        { label: 'current node', value: '5' },
        { label: 'running sum', value: '5' },
        { label: 'target', value: '22' },
        { label: 'path', value: '5' },
        { label: 'is leaf?', value: 'no' },
        { label: 'remaining', value: '17' },
      ],
    },
    {
      id: 'path-go-left',
      activeStepId: 'branch',
      activeCodeLineIds: ['recurse', 'add'],
      title: 'Go down the left branch',
      explanation:
        'Moving from 5 to 4 adds 4 to the carried sum, making 9.',
      comparisonText: '5 + 4 = 9',
      decision: 'Continue down this branch because 4 is not a leaf yet.',
      status: 'Left branch active',
      prediction: {
        prompt: 'When the path moves from 5 to 4, what happens to the running sum?',
        correctOptionId: 'add-four',
        options: [
          {
            id: 'add-four',
            label: 'It becomes 9',
            feedback: 'Correct. 5 plus 4 equals 9.',
          },
          {
            id: 'reset-zero',
            label: 'It resets to 0',
            feedback: 'It does not reset while moving deeper on the same path.',
          },
          {
            id: 'replace-five',
            label: 'It becomes only 4',
            feedback: 'The path carries previous nodes too, so 5 stays included.',
          },
        ],
      },
      mistake: {
        title: 'Replacing instead of adding',
        body: 'A running sum should include the earlier path values, not just the current node.',
        fix: 'Pass running + node.value into the child call.',
      },
      markers: [
        { index: 0, label: 'path', tone: 'success' },
        { index: 1, label: 'current', tone: 'success' },
      ],
      matchedIndices: [0, 1],
      memory: {
        label: 'Current path',
        description: 'The path state grows as the traversal moves downward.',
        countLabel: 'nodes',
        emptyText: 'No path nodes selected yet.',
        entries: [
          { key: '1', keyLabel: 'Step', value: '5', note: 'Root value.' },
          { key: '2', keyLabel: 'Step', value: '4', note: 'Left child, running sum 9.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The path is like a backpack. Each node on this branch adds one value to it.',
        whyAllowed:
          'The branch from 5 to 4 is connected, so both values belong to the same path.',
        watchFor:
          'The sum should grow only along the active branch.',
      },
      variables: [
        { label: 'current node', value: '4' },
        { label: 'running sum', value: '9' },
        { label: 'target', value: '22' },
        { label: 'path', value: '5 -> 4' },
        { label: 'is leaf?', value: 'no' },
        { label: 'remaining', value: '13' },
      ],
    },
    {
      id: 'path-check-eleven',
      activeStepId: 'check-leaf',
      activeCodeLineIds: ['add', 'leaf-check'],
      title: 'A partial sum is not enough',
      explanation:
        'The path reaches 11, making the running sum 20. That is close to 22, but 11 is not the leaf answer yet in this sample path.',
      comparisonText: '5 + 4 + 11 = 20',
      decision: 'Keep going because the path still needs a leaf and two more points.',
      status: 'Path still incomplete',
      prediction: {
        prompt: 'Why should the algorithm not accept sum 20 at node 11?',
        correctOptionId: 'not-target-leaf',
        options: [
          {
            id: 'not-target-leaf',
            label: 'It is not the target and the path can continue',
            feedback: 'Correct. We need a root-to-leaf path that equals 22.',
          },
          {
            id: 'close-enough',
            label: '20 is close enough',
            feedback: 'Path sum needs an exact target, not a close value.',
          },
          {
            id: 'ignore-leaf',
            label: 'Leaf status never matters',
            feedback: 'Leaf status matters because the path must end at a leaf.',
          },
        ],
      },
      mistake: {
        title: 'Accepting a partial path',
        body: 'Some tree problems ask for any prefix, but this one asks for a root-to-leaf path.',
        fix: 'Check the target condition at a leaf, or keep moving if children remain.',
      },
      markers: [
        { index: 0, label: 'path', tone: 'success' },
        { index: 1, label: 'path', tone: 'success' },
        { index: 3, label: 'current', tone: 'accent' },
      ],
      matchedIndices: [0, 1, 3],
      memory: {
        label: 'Current path',
        description: 'The active branch is close to the target but not finished.',
        countLabel: 'nodes',
        emptyText: 'No path nodes selected yet.',
        entries: [
          { key: '1', keyLabel: 'Step', value: '5', note: 'Running sum 5.' },
          { key: '2', keyLabel: 'Step', value: '4', note: 'Running sum 9.' },
          { key: '3', keyLabel: 'Step', value: '11', note: 'Running sum 20.' },
        ],
      },
      teaching: {
        beginnerNote:
          'Close does not count in exact target problems.',
        whyAllowed:
          'There is still a child that can complete the root-to-leaf path.',
        watchFor:
          'The remaining amount is 2, so a child value 2 would complete the target.',
      },
      variables: [
        { label: 'current node', value: '11' },
        { label: 'running sum', value: '20' },
        { label: 'target', value: '22' },
        { label: 'path', value: '5 -> 4 -> 11' },
        { label: 'remaining', value: '2' },
        { label: 'decision', value: 'continue' },
      ],
    },
    {
      id: 'path-found-leaf',
      activeStepId: 'finish',
      activeCodeLineIds: ['add', 'leaf-check', 'done'],
      title: 'The leaf completes the target',
      explanation:
        'Adding leaf 2 makes the path sum 22. The path 5 -> 4 -> 11 -> 2 is a valid root-to-leaf path.',
      comparisonText: '5 + 4 + 11 + 2 = 22',
      decision: 'Return true because the target was reached at a leaf.',
      status: 'Path sum found',
      mistake: {
        title: 'Letting another branch change this path',
        body: 'Values from the right subtree do not belong to the left path that already reached the target.',
        fix: 'Keep each recursive branch state separate as calls return.',
      },
      markers: [
        { index: 0, label: 'path', tone: 'success' },
        { index: 1, label: 'path', tone: 'success' },
        { index: 3, label: 'path', tone: 'success' },
        { index: 6, label: 'leaf', tone: 'success' },
      ],
      matchedIndices: [0, 1, 3, 6],
      memory: {
        label: 'Current path',
        description: 'This root-to-leaf branch reaches the target exactly.',
        countLabel: 'nodes',
        emptyText: 'No path nodes selected yet.',
        entries: [
          { key: '1', keyLabel: 'Step', value: '5', note: 'Root.' },
          { key: '2', keyLabel: 'Step', value: '4', note: 'Left child.' },
          { key: '3', keyLabel: 'Step', value: '11', note: 'Path continues.' },
          { key: '4', keyLabel: 'Step', value: '2', note: 'Leaf completes 22.' },
        ],
      },
      teaching: {
        beginnerNote:
          'The answer is not just the sum. It is the path that proves the sum.',
        whyAllowed:
          'The current node is a leaf and the running sum equals the target.',
        watchFor:
          'Other branches are not mixed into this path after the match is found.',
      },
      variables: [
        { label: 'current node', value: '2' },
        { label: 'running sum', value: '22' },
        { label: 'target', value: '22' },
        { label: 'path', value: '5 -> 4 -> 11 -> 2' },
        { label: 'is leaf?', value: 'yes' },
        { label: 'result', value: 'true' },
      ],
    },
  ],
};

const traceLessons = [
  pairSumTraceLesson,
  containerWindowTraceLesson,
  removeDuplicatesTraceLesson,
  binarySearchTraceLesson,
  firstTrueTraceLesson,
  rotatedSearchTraceLesson,
  twoSumMapTraceLesson,
  anagramBucketsTraceLesson,
  firstUniqueTraceLesson,
  dailyTemperaturesTraceLesson,
  levelOrderTraceLesson,
  validParenthesesTraceLesson,
  dfsOrderTraceLesson,
  bfsLayersTraceLesson,
  pathSumTraceLesson,
];

export function findTraceLessonById(lessonId) {
  return traceLessons.find((lesson) => lesson.lessonId === lessonId) ?? null;
}
