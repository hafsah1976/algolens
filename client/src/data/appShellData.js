export const learningTracks = [
  {
    slug: 'arrays-two-pointers',
    navLabel: 'Arrays',
    title: 'Arrays / Two Pointers',
    description:
      'Build intuition for scans, pair finding, and moving windows without turning the lesson into a wall of text.',
    patterns: ['index movement', 'pair matching', 'window shrinking'],
    visualFocus: 'Pointers, windows, and ordered comparisons',
    progressLabel: '1 of 3 lessons complete',
    trackGoal: 'Learn how pointer movement changes the state of a sorted array over time.',
    concepts: ['sorted scans', 'pair sum', 'window contraction', 'in-place updates'],
    conceptPrimer: {
      intro:
        'Arrays keep values in a visible order. Two pointers means using two positions in the same array to ask a smarter question than checking every pair.',
      whatThisIs:
        'An array is a row of values with numbered positions called indexes. A pointer is just a variable that remembers one of those positions.',
      whyItHelps:
        'When the array is sorted, moving left or right changes the sum in a predictable way. That lets you shrink the search instead of restarting it.',
      pictureIt:
        'Picture two bookmarks in the same row of numbers. One starts on the left, one on the right, and each move makes the search space smaller.',
      commonMistake:
        'A pointer is not a special object here. It is only an index, and the real skill is deciding why one pointer should move while the other stays still.',
      traceMode:
        'Step by step mode will show both positions, the values they point to, the current sum, and the reason a pointer moves inward.',
      useItWhen:
        'Reach for this pattern when the data is already ordered, or when moving one boundary at a time can shrink the problem instead of restarting it.',
      tinyExample: {
        prompt: 'You need two numbers in `[2, 4, 7, 11, 15]` that add to `13`.',
        story:
          'Start with the widest pair: `2` and `15`. That sum is too large, so the right side must move left. The next pair is `2` and `11`, which matches the target.',
        takeaway:
          'Because the list is sorted, you never need to recheck the discarded part of the array.',
      },
      selfCheck: [
        'If the current sum is too large, which pointer should move and why?',
        'Why does sorting make pointer movement safer to reason about?',
        'What is the difference between an index and the value stored there?',
      ],
      vocabulary: [
        { term: 'Array', meaning: 'A list of values stored in order.' },
        { term: 'Index', meaning: 'The numbered position of a value in the array.' },
        { term: 'Pointer', meaning: 'A variable holding an index you want to track.' },
        { term: 'Sorted', meaning: 'Already arranged from small to large or large to small.' },
        { term: 'Target', meaning: 'The value or condition the algorithm is trying to reach.' },
      ],
    },
    miniExamples: [
      {
        title: 'Find a pair in a sorted row',
        pattern: 'Two pointers',
        scenario: 'You need two numbers in `[2, 4, 7, 11, 15]` that add to `13`.',
        whatChanges:
          'The right pointer moves left after `2 + 15` is too large, because a smaller right value can lower the sum.',
        lookFor:
          'Watch which pointer moves and whether the sum gets closer to the target.',
      },
      {
        title: 'Remove duplicates in place',
        pattern: 'Read and write pointers',
        scenario: 'You scan `[1, 1, 2, 2, 3]` and keep only the first copy of each value.',
        whatChanges:
          'One pointer reads every value, while another pointer marks where the next unique value should be written.',
        lookFor:
          'Notice that the write pointer moves only when a new value should stay.',
      },
      {
        title: 'Shrink a window',
        pattern: 'Moving edges',
        scenario: 'A window covers part of an array, and you need it to satisfy a rule such as a target sum.',
        whatChanges:
          'The left or right edge moves to make the window larger, smaller, or more useful.',
        lookFor:
          'Ask what changed inside the window after one edge moved.',
      },
    ],
    lessons: [
      {
        id: 'pair-sum-trace',
        title: 'Pair Sum with Two Pointers',
        duration: '12 min',
        stage: 'Step by step mode',
        summary:
          'Step through a sorted array and see why moving the left or right pointer changes the result.',
        goals: [
          'Track both pointers visually',
          'Explain why each move happens',
          'Connect pair sum to sorted order',
        ],
      },
      {
        id: 'container-window-preview',
        title: 'Read the Window Before It Moves',
        duration: '9 min',
        stage: 'Step by step mode',
        summary:
          'Practice reading a shrinking search space before deciding which edge should move.',
        goals: [
          'Notice width vs value tradeoffs',
          'Relate pointer movement to constraints',
        ],
      },
      {
        id: 'remove-duplicates-preview',
        title: 'In-Place Compression',
        duration: '8 min',
        stage: 'Step by step mode',
        summary:
          'See how one write pointer and one read pointer simplify repeated values in place.',
        goals: [
          'Differentiate read and write roles',
          'Visualize stable overwrites',
        ],
      },
    ],
  },
  {
    slug: 'hash-maps',
    navLabel: 'Hash Maps',
    title: 'Hash Maps',
    description:
      'See counts, complements, and lookups change live so each design choice feels concrete.',
    patterns: ['frequency tables', 'complements', 'constant-time lookup'],
    visualFocus: 'Key-value state changes and instant lookups',
    progressLabel: '1 of 3 lessons complete',
    trackGoal: 'Show how storing context turns repeated scanning into quick decisions.',
    concepts: ['complements', 'frequency counting', 'deduping', 'lookup timing'],
    conceptPrimer: {
      intro:
        'Hash maps are memory with labels. They help you remember what you have already seen so you stop rescanning the same data.',
      whatThisIs:
        'A hash map stores key-value pairs. The key is the label you look up, and the value is the fact you want back.',
      whyItHelps:
        'Instead of searching the whole list again, you store useful facts once and check them quickly later. That turns repeated work into direct lookup.',
      pictureIt:
        'Picture labeled cubbies. You do not open every cubby each time; you go straight to the one whose label matches the question.',
      commonMistake:
        'Beginners often store too much. Usually you only need the smallest helpful fact, such as a count, an index, or a complement you want to match.',
      traceMode:
        'Step by step mode will show keys appearing, counts changing, and lookups succeeding or failing as the lesson moves forward.',
      useItWhen:
        'Reach for a hash map when a later decision depends on remembering something you saw earlier, such as a count, a partner value, or a saved position.',
      tinyExample: {
        prompt: 'You want to know whether a list contains two numbers that add to `9`.',
        story:
          'Read `2` first and remember that you would need `7`. Later, when `7` appears, you do not scan the whole list again because the stored complement already tells you the pair exists.',
        takeaway:
          'The map is useful because it stores just enough memory to turn repeated searching into one quick lookup.',
      },
      selfCheck: [
        'What is the difference between a key and a value?',
        'Why might you store a complement instead of every possible pair?',
        'What small fact would you save if you needed frequency counts?',
      ],
      vocabulary: [
        { term: 'Key', meaning: 'The label used to store or retrieve information.' },
        { term: 'Value', meaning: 'The information attached to a key.' },
        { term: 'Lookup', meaning: 'Checking whether a key is already stored.' },
        { term: 'Complement', meaning: 'The value you still need in order to finish a pair.' },
        { term: 'Frequency', meaning: 'How many times something has appeared.' },
      ],
    },
    miniExamples: [
      {
        title: 'Remember the missing partner',
        pattern: 'Complement lookup',
        scenario: 'You read `2` while looking for a pair that adds to `9`.',
        whatChanges:
          'The map stores that `7` would complete the pair, so seeing `7` later becomes a quick lookup.',
        lookFor:
          'Watch whether the current number is already a key the map was waiting for.',
      },
      {
        title: 'Count letters in a word',
        pattern: 'Frequency table',
        scenario: 'You compare whether `listen` and `silent` use the same letters.',
        whatChanges:
          'Counts go up for one word and down for the other until every letter balances back to zero.',
        lookFor:
          'Focus on the count changes, not the whole word at once.',
      },
      {
        title: 'Find the first unique item',
        pattern: 'Count then scan',
        scenario: 'You need the first value that appears exactly once in `[4, 1, 4, 2, 1, 3]`.',
        whatChanges:
          'The first pass records counts, and the second pass uses those counts to make the decision.',
        lookFor:
          'Separate the memory-building step from the answer-finding step.',
      },
    ],
    lessons: [
      {
        id: 'two-sum-map-preview',
        title: 'Two Sum by Memory',
        duration: '10 min',
        stage: 'Step by step mode',
        summary:
          'Watch the complement table grow as the lesson explains what gets stored and why.',
        goals: ['Understand complements', 'Read the map after each insertion'],
      },
      {
        id: 'anagram-buckets-preview',
        title: 'Count What Matters',
        duration: '11 min',
        stage: 'Step by step mode',
        summary:
          'Compare two strings by watching counts rise and fall instead of reading a dense proof.',
        goals: ['Track count balance', 'Spot when state matches exactly'],
      },
      {
        id: 'first-unique-preview',
        title: 'Find the First Unique Value',
        duration: '7 min',
        stage: 'Step by step mode',
        summary:
          'Combine a pass for memory with a pass for decision making in one clean visual flow.',
        goals: ['Separate recording from checking', 'Use counts to support scanning'],
      },
    ],
  },
  {
    slug: 'stacks-queues',
    navLabel: 'Stacks',
    title: 'Stacks / Queues',
    description:
      'Visualize push, pop, enqueue, and dequeue behavior without forcing students to imagine hidden state.',
    patterns: ['LIFO vs FIFO', 'monotonic stacks', 'level-order flow'],
    visualFocus: 'Ordering, removal direction, and queue layers',
    progressLabel: '0 of 3 lessons complete',
    trackGoal: 'Make order and access direction feel visible instead of abstract.',
    concepts: ['last in first out', 'first in first out', 'monotonic structure', 'layered traversal'],
    conceptPrimer: {
      intro:
        'Stacks and queues are both about order. They answer the beginner question: which item gets handled next?',
      whatThisIs:
        'A stack removes the most recently added item first. A queue removes the oldest waiting item first.',
      whyItHelps:
        'Many problems depend less on the values themselves and more on the order work should happen in, especially when matching, delaying, or layering decisions.',
      pictureIt:
        'Picture a stack like plates in a pile: the last plate added is the first one you can take. Picture a queue like a line of people: the first person waiting goes first.',
      commonMistake:
        'Beginners often mix up the removal direction. If you forget which side comes out first, the whole algorithm story becomes confusing.',
      traceMode:
        'Step by step mode will show items entering, leaving, and waiting so the order is visible instead of hidden inside code.',
      useItWhen:
        'Reach for a stack when the newest unfinished work should be resolved first. Reach for a queue when work should be handled in arrival order or by layers.',
      tinyExample: {
        prompt: 'You are checking whether parentheses in a string close correctly.',
        story:
          'Each opening bracket gets pushed onto a stack. When a closing bracket arrives, the top of the stack must be the matching opener or the string is invalid.',
        takeaway:
          'The stack works because the most recent opener is always the first one that must be closed.',
      },
      selfCheck: [
        'What comes out first from a stack?',
        'What comes out first from a queue?',
        'Why would a queue help when you want to process a tree level by level?',
      ],
      vocabulary: [
        { term: 'Push', meaning: 'Add an item to the top of a stack.' },
        { term: 'Pop', meaning: 'Remove the top item from a stack.' },
        { term: 'Enqueue', meaning: 'Add an item to the back of a queue.' },
        { term: 'Dequeue', meaning: 'Remove the item at the front of a queue.' },
        { term: 'LIFO / FIFO', meaning: 'Short names for the two different removal orders.' },
      ],
    },
    miniExamples: [
      {
        title: 'Match parentheses',
        pattern: 'Stack',
        scenario: 'You read the string `([])` one character at a time.',
        whatChanges:
          'Opening brackets are pushed onto the stack, and closing brackets must match the most recent opener.',
        lookFor:
          'The newest unfinished opener is always the first one that needs to close.',
      },
      {
        title: 'Use a browser back button',
        pattern: 'Stack',
        scenario: 'You visit pages A, B, then C, and press back.',
        whatChanges:
          'The most recent page is removed first, so C comes off before B.',
        lookFor:
          'Notice how the last thing added is the first thing removed.',
      },
      {
        title: 'Visit tree levels',
        pattern: 'Queue',
        scenario: 'You want to visit a tree from top to bottom, level by level.',
        whatChanges:
          'Nodes wait in a queue so older nodes are handled before newer ones.',
        lookFor:
          'The front of the queue tells you what gets processed next.',
      },
    ],
    lessons: [
      {
        id: 'valid-parentheses-preview',
        title: 'Match Pairs with a Stack',
        duration: '8 min',
        stage: 'Step by step mode',
        summary:
          'See opening brackets stack up and collapse when matching closers arrive.',
        goals: ['Recognize stack shape', 'Explain mismatch moments'],
      },
      {
        id: 'daily-temperatures-preview',
        title: 'When a Monotonic Stack Helps',
        duration: '12 min',
        stage: 'Step by step mode',
        summary:
          'Track unresolved days and watch answers fill in only when warmer values appear.',
        goals: ['Read unresolved state', 'Understand deferred answers'],
      },
      {
        id: 'level-order-preview',
        title: 'Traverse by Queue Layers',
        duration: '10 min',
        stage: 'Step by step mode',
        summary:
          'Use a queue to see breadth-first order emerge layer by layer.',
        goals: ['Visualize enqueue and dequeue flow', 'Connect queue order to tree levels'],
      },
    ],
  },
  {
    slug: 'binary-search',
    navLabel: 'Binary Search',
    title: 'Binary Search',
    description:
      'Highlight low, high, and mid pointers clearly so interval updates stop feeling abstract.',
    patterns: ['search space', 'midpoint checks', 'answer boundaries'],
    visualFocus: 'Low, high, mid, and the remaining search interval',
    progressLabel: '1 of 3 lessons complete',
    trackGoal: 'Turn interval narrowing into a visual habit rather than a memorized trick.',
    concepts: ['sorted decisions', 'discarding halves', 'answer bounds', 'left vs right bias'],
    conceptPrimer: {
      intro:
        'Binary search is not about guessing fast. It is about removing half of the remaining possibilities after each check.',
      whatThisIs:
        'Binary search works on an ordered search space. You inspect the middle, then keep only the half that could still contain the answer.',
      whyItHelps:
        'Each correct decision throws away a large chunk of work, so you do not inspect every value one by one.',
      pictureIt:
        'Picture folding a large list in half again and again until only the useful section remains. Each fold keeps the possible answer area smaller.',
      commonMistake:
        'Beginners often think the goal is to find the middle value itself. The real goal is to keep correct left and right boundaries after every comparison.',
      traceMode:
        'Step by step mode will show low, high, mid, the remaining interval, and the exact reason one half disappears.',
      useItWhen:
        'Reach for binary search when the data or the answer space has a consistent left-versus-right rule that lets you safely throw half away.',
      tinyExample: {
        prompt: 'You are looking for `11` in `[2, 4, 7, 11, 15, 19, 24]`.',
        story:
          'Check the middle first. If the middle is smaller than `11`, the whole left half is too small. If it is larger, the whole right half is too large. Only one side can still be correct.',
        takeaway:
          'The power comes from discarding large sections with confidence, not from the middle check by itself.',
      },
      selfCheck: [
        'Why does the search space need an ordered rule?',
        'What do low and high really represent?',
        'After comparing with mid, how do you know which half is impossible?',
      ],
      vocabulary: [
        { term: 'Low', meaning: 'The left boundary of the current search space.' },
        { term: 'High', meaning: 'The right boundary of the current search space.' },
        { term: 'Mid', meaning: 'The position you inspect to make the next decision.' },
        { term: 'Boundary', meaning: 'An edge that defines what still could be true.' },
        { term: 'Sorted', meaning: 'Ordered in a way that makes half-discarding safe.' },
      ],
    },
    miniExamples: [
      {
        title: 'Find one number',
        pattern: 'Classic binary search',
        scenario: 'You search for `11` in `[2, 4, 7, 11, 15, 19, 24]`.',
        whatChanges:
          'After checking the middle, one half of the list becomes impossible and the boundaries move inward.',
        lookFor:
          'Ask which side can still contain the answer after the middle check.',
      },
      {
        title: 'Find the first true answer',
        pattern: 'Boundary search',
        scenario: 'You have a row of results like `false, false, false, true, true`.',
        whatChanges:
          'The search keeps the first possible true answer while discarding sections that cannot be first.',
        lookFor:
          'Watch whether the middle value becomes a candidate answer or gets thrown away.',
      },
      {
        title: 'Find an insert position',
        pattern: 'Answer boundary',
        scenario: 'You want to insert `8` into `[2, 4, 7, 11, 15]` without breaking order.',
        whatChanges:
          'The boundaries move until they reveal the first position where `8` could fit.',
        lookFor:
          'The answer may be a position, not a value already in the array.',
      },
    ],
    lessons: [
      {
        id: 'binary-search-basics-preview',
        title: 'Cut the Search Space in Half',
        duration: '9 min',
        stage: 'Step by step mode',
        summary:
          'See the interval shrink after each midpoint check and notice what never needs checking again.',
        goals: ['Track low, high, and mid', 'Explain why half the array disappears'],
      },
      {
        id: 'first-true-preview',
        title: 'Search for the First Valid Answer',
        duration: '10 min',
        stage: 'Step by step mode',
        summary:
          'Move from searching for a value to searching for a boundary that satisfies a condition.',
        goals: ['Spot monotonic conditions', 'Keep candidate answers visible'],
      },
      {
        id: 'search-in-rotated-preview',
        title: 'Read Structure Before Choosing a Half',
        duration: '11 min',
        stage: 'Step by step mode',
        summary:
          'Use segment structure to decide which half is safe to discard in a rotated array.',
        goals: ['Identify sorted halves', 'Explain conditional branching'],
      },
    ],
  },
  {
    slug: 'trees-traversals',
    navLabel: 'Trees',
    title: 'Trees / Traversals',
    description:
      'Show node visits, recursion order, and queue-backed traversal paths in a beginner-friendly way.',
    patterns: ['DFS order', 'BFS layers', 'subtree thinking'],
    visualFocus: 'Node visitation order and subtree boundaries',
    progressLabel: '1 of 3 lessons complete',
    trackGoal: 'Help learners see the order of visits instead of guessing from recursion alone.',
    concepts: ['preorder', 'inorder', 'postorder', 'breadth-first layers'],
    conceptPrimer: {
      intro:
        'Trees store data by connections instead of one straight line. Traversal is the rule that tells you what to visit next.',
      whatThisIs:
        'A tree starts at a root and branches into children. A traversal is a plan for the order in which those nodes should be visited.',
      whyItHelps:
        'Tree problems become easier when you can describe what information moves down a branch, what gets processed at a node, and what returns back up.',
      pictureIt:
        'Picture a family tree or a set of connected hallways. You need a rule for where to go next so you do not get lost or skip rooms.',
      commonMistake:
        'Beginners often focus on recursion syntax before understanding visit order. The order is the concept; recursion is only one way to express it.',
      traceMode:
        'Step by step mode will show the active node, the visit order, and whether the algorithm is going deeper or stepping back.',
      useItWhen:
        'Reach for tree thinking when information branches into smaller connected parts, and the order you visit those parts changes the meaning of the result.',
      tinyExample: {
        prompt: 'You want to print every node in a tree from top to bottom.',
        story:
          'Start at the root, then visit all children one level at a time. A queue keeps track of which nodes are waiting to be processed next.',
        takeaway:
          'Traversal is really a promise about visit order: depth-first and breadth-first answer different questions.',
      },
      selfCheck: [
        'What makes a node a leaf?',
        'Why is visit order more important than recursion syntax?',
        'When would level-by-level traversal feel more natural than going deep first?',
      ],
      vocabulary: [
        { term: 'Root', meaning: 'The starting node at the top of the tree.' },
        { term: 'Child', meaning: 'A node directly connected below another node.' },
        { term: 'Leaf', meaning: 'A node with no children below it.' },
        { term: 'Traversal', meaning: 'The order used to visit nodes.' },
        { term: 'Level', meaning: 'All nodes the same distance from the root.' },
      ],
    },
    miniExamples: [
      {
        title: 'Read root first',
        pattern: 'Preorder traversal',
        scenario: 'You visit a node before visiting its children.',
        whatChanges:
          'The current node gets handled first, then the traversal moves into the left and right branches.',
        lookFor:
          'Notice whether the node is processed before or after its children.',
      },
      {
        title: 'Visit one level at a time',
        pattern: 'Breadth-first traversal',
        scenario: 'You want every node at level 1 before any node at level 2.',
        whatChanges:
          'A queue holds the next nodes to visit so the tree unfolds layer by layer.',
        lookFor:
          'Watch the waiting list grow with children from the current level.',
      },
      {
        title: 'Carry a path sum',
        pattern: 'Path state',
        scenario: 'You walk from the root toward a leaf while adding values along the path.',
        whatChanges:
          'The running total changes as you go down, then resets when you backtrack to try another branch.',
        lookFor:
          'Separate the value carried on the current path from values in other branches.',
      },
    ],
    lessons: [
      {
        id: 'dfs-order-preview',
        title: 'Read a Tree Depth First',
        duration: '11 min',
        stage: 'Step by step mode',
        summary:
          'Watch the call stack shape the exact order in which nodes appear.',
        goals: ['Differentiate traversal orders', 'Visualize recursive return points'],
      },
      {
        id: 'bfs-layers-preview',
        title: 'Visit by Levels',
        duration: '9 min',
        stage: 'Step by step mode',
        summary:
          'Queue-based traversal turns the tree into visible layers of work.',
        goals: ['Connect queue state to layer order', 'Notice frontier changes'],
      },
      {
        id: 'path-sum-preview',
        title: 'Carry Information Down the Tree',
        duration: '10 min',
        stage: 'Step by step mode',
        summary:
          'See values accumulate as a path travels downward and resets on the way back.',
        goals: ['Track path context', 'Interpret branching decisions'],
      },
    ],
  },
];

export const dashboardSnapshot = {
  learnerName: 'Maya',
  studyRhythm: 'One clear lesson, then stop.',
  focusWindow: '15-minute visual session',
  recentWin: 'Binary search intervals are starting to click.',
};

export const completionConcept = {
  title: 'You finished a clean study loop.',
  body: 'AlgoLens should help students leave with one solid insight, not bait them into another hour of scrolling.',
  takeaways: [
    'You tracked how pointer movement changes the search space.',
    'You connected the algorithm step to the visual state.',
    'You now have one clear next lesson instead of a noisy feed.',
  ],
};

export function getTrackProgress(track) {
  const completed = track.lessons.filter((lesson) => lesson.stage === 'Completed').length;
  const total = track.lessons.length;

  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

export function getOverallProgress() {
  const totals = learningTracks.reduce(
    (summary, track) => {
      const progress = getTrackProgress(track);

      return {
        completed: summary.completed + progress.completed,
        total: summary.total + progress.total,
      };
    },
    { completed: 0, total: 0 },
  );

  return {
    ...totals,
    percent: Math.round((totals.completed / totals.total) * 100),
  };
}

export function findTrackBySlug(slug) {
  return learningTracks.find((track) => track.slug === slug) ?? null;
}

export function findLessonById(lessonId) {
  for (const track of learningTracks) {
    const lesson = track.lessons.find((entry) => entry.id === lessonId);

    if (lesson) {
      return { track, lesson };
    }
  }

  return null;
}

