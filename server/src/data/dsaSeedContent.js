export const initialDsaTopics = [
  {
    title: 'Arrays',
    slug: 'arrays',
    description:
      'Learn how ordered values, indexes, and simple scans form the base of many DSA problems.',
    order: 1,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'What an Array Really Stores',
        slug: 'arrays-what-an-array-stores',
        summary: 'Understand arrays as ordered boxes with indexes before using faster patterns.',
        content:
          'An array is a row of values where every value has a position called an index. Beginners should first practice reading index and value separately: index 0 is the position, while the stored value is the data at that position. Most array problems become easier when you can say what the loop is looking at right now and what information has already been seen.',
        order: 1,
        estimatedMinutes: 6,
        visualizationType: 'none',
      },
      {
        title: 'Scanning Once with a Purpose',
        slug: 'arrays-scanning-once',
        summary: 'Practice moving left to right while keeping one useful piece of state.',
        content:
          'A scan is a single pass through an array. Instead of restarting work, keep one useful fact as you move, such as the largest value seen so far or the current count. The important habit is to update that fact after reading each value, then explain why the update is safe.',
        order: 2,
        estimatedMinutes: 7,
        visualizationType: 'none',
      },
    ],
  },
  {
    title: 'Strings',
    slug: 'strings',
    description:
      'Treat text as indexed characters and learn the small patterns behind matching, counting, and building output.',
    order: 2,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Strings Are Character Arrays',
        slug: 'strings-character-indexes',
        summary: 'See how indexes, characters, and length checks work in text problems.',
        content:
          'A string is text, but algorithmically it often behaves like an array of characters. You can read one character by index, compare neighboring characters, or build a new answer one step at a time. The first skill is knowing whether you need the character itself, its position, or both.',
        order: 1,
        estimatedMinutes: 6,
        visualizationType: 'none',
      },
      {
        title: 'Counting Characters',
        slug: 'strings-counting-characters',
        summary: 'Use small frequency maps to answer questions about letters and repeats.',
        content:
          'Many string problems ask whether characters appear the same number of times. A frequency map stores each character as a key and its count as the value. This lets you compare words, find repeated letters, or notice when a required character is missing.',
        order: 2,
        estimatedMinutes: 8,
        visualizationType: 'none',
      },
    ],
  },
  {
    title: 'Linked Lists',
    slug: 'linked-lists',
    description:
      'Build a beginner mental model for nodes, next pointers, and careful pointer rewiring.',
    order: 3,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Nodes and Next Pointers',
        slug: 'linked-lists-nodes-and-next',
        summary: 'Understand why linked lists move by following references instead of indexes.',
        content:
          'A linked list is made of nodes. Each node stores a value and a next pointer that leads to the following node. Unlike arrays, you do not jump directly to index 5. You walk from node to node, which makes pointer movement the central idea.',
        order: 1,
        estimatedMinutes: 7,
        visualizationType: 'none',
      },
      {
        title: 'Insert Without Losing the Chain',
        slug: 'linked-lists-safe-insert',
        summary: 'Learn the safe order for connecting a new node into a list.',
        content:
          'When inserting into a linked list, order matters. If you overwrite a next pointer too early, the rest of the list can become unreachable. A safe pattern is to point the new node at the old next node first, then connect the previous node to the new node.',
        order: 2,
        estimatedMinutes: 9,
        visualizationType: 'none',
      },
    ],
  },
  {
    title: 'Stacks',
    slug: 'stacks',
    description:
      'Use last-in, first-out ordering to solve matching, undo, and delayed-decision problems.',
    order: 4,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Last In, First Out',
        slug: 'stacks-last-in-first-out',
        summary: 'Learn why the newest item is the first one a stack removes.',
        content:
          'A stack behaves like a pile of plates. You add to the top and remove from the top. This last-in, first-out rule is useful when the newest unfinished thing should be handled first, such as matching brackets or undoing actions.',
        order: 1,
        estimatedMinutes: 6,
        visualizationType: 'stack',
      },
      {
        title: 'Matching Brackets with a Stack',
        slug: 'stacks-matching-brackets',
        summary: 'Use stack state to check whether closing symbols match the latest opener.',
        content:
          'For bracket matching, every opening bracket is pushed onto the stack. When a closing bracket appears, it must match the stack top. If it does not, the string is invalid. This works because the most recent opener must close before older openers.',
        order: 2,
        estimatedMinutes: 8,
        visualizationType: 'none',
      },
    ],
  },
  {
    title: 'Queues',
    slug: 'queues',
    description:
      'Practice first-in, first-out ordering for waiting lines, breadth-first search, and layered work.',
    order: 5,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'First In, First Out',
        slug: 'queues-first-in-first-out',
        summary: 'Understand queues as fair waiting lines where the oldest item leaves first.',
        content:
          'A queue behaves like a line at a store. New items enter at the back, and the oldest waiting item leaves from the front. This makes queues useful when work should happen in the same order it arrived.',
        order: 1,
        estimatedMinutes: 6,
        visualizationType: 'queue',
      },
      {
        title: 'Queues for Layers',
        slug: 'queues-for-layers',
        summary: 'See why queues help process a tree or graph one layer at a time.',
        content:
          'Layered traversal uses a queue to remember what should be visited next. Add neighbors or children to the back of the queue, then keep removing from the front. The queue preserves the order needed to finish one layer before moving deeper.',
        order: 2,
        estimatedMinutes: 8,
        visualizationType: 'none',
      },
    ],
  },
  {
    title: 'Recursion',
    slug: 'recursion',
    description:
      'Learn recursive thinking through base cases, smaller problems, and call-stack state.',
    order: 6,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Base Case First',
        slug: 'recursion-base-case-first',
        summary: 'Understand the stopping rule that keeps recursion from running forever.',
        content:
          'Recursion means a function solves a problem by calling itself on a smaller version. The base case is the stopping rule. Before trusting a recursive solution, ask what input is simple enough to answer immediately.',
        order: 1,
        estimatedMinutes: 7,
        visualizationType: 'none',
      },
      {
        title: 'Trust the Smaller Problem',
        slug: 'recursion-trust-smaller-problem',
        summary: 'Practice describing what one recursive call is responsible for solving.',
        content:
          'A recursive function should make progress toward a smaller problem. Instead of mentally expanding every call, state what the smaller call promises to return. Then combine that result with the current step.',
        order: 2,
        estimatedMinutes: 9,
        visualizationType: 'none',
      },
    ],
  },
  {
    title: 'Trees',
    slug: 'trees',
    description:
      'Visualize parent-child structure, traversal order, and how information moves through branches.',
    order: 7,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Root, Children, and Leaves',
        slug: 'trees-root-children-leaves',
        summary: 'Name the parts of a tree so traversal explanations become easier to follow.',
        content:
          'A tree starts at a root node. Each node can have children, and nodes with no children are leaves. When reading a tree problem, first identify what each node stores and which direction information needs to move.',
        order: 1,
        estimatedMinutes: 7,
        visualizationType: 'bfs',
      },
      {
        title: 'Depth-First vs Breadth-First',
        slug: 'trees-dfs-vs-bfs',
        summary: 'Compare going deep down one branch with visiting nodes layer by layer.',
        content:
          'Depth-first traversal follows one branch before backing up. Breadth-first traversal visits nodes by layers using a queue. The right choice depends on whether the problem cares about paths, depth, or the nearest level.',
        order: 2,
        estimatedMinutes: 9,
        visualizationType: 'dfs',
      },
    ],
  },
  {
    title: 'Graphs',
    slug: 'graphs',
    description:
      'Build intuition for nodes, edges, neighbors, visited sets, and traversal safety.',
    order: 8,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Nodes, Edges, and Neighbors',
        slug: 'graphs-nodes-edges-neighbors',
        summary: 'Understand graph vocabulary before adding traversal logic.',
        content:
          "A graph is a set of nodes connected by edges. A node's neighbors are the nodes directly connected to it. Graph problems often begin by asking what each node represents and how edges should be followed.",
        order: 1,
        estimatedMinutes: 7,
        visualizationType: 'none',
      },
      {
        title: 'Why Visited Sets Matter',
        slug: 'graphs-visited-sets',
        summary: 'Use a visited set to avoid loops and repeated work during traversal.',
        content:
          'Graphs can contain cycles, which means traversal can return to a node already seen. A visited set records nodes that have already been handled. This prevents infinite loops and keeps the algorithm from repeating the same work.',
        order: 2,
        estimatedMinutes: 8,
        visualizationType: 'none',
      },
    ],
  },
  {
    title: 'Sorting',
    slug: 'sorting',
    description:
      'Study ordering algorithms through comparison, swaps, and the reason sorted data helps later.',
    order: 9,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Why Sorting Helps',
        slug: 'sorting-why-sorting-helps',
        summary: 'Connect sorted order to easier searching, grouping, and pointer movement.',
        content:
          'Sorting puts values into a predictable order. Once values are ordered, patterns like binary search and two pointers become easier to reason about. The cost of sorting can be worth it when it makes the later decision much simpler.',
        order: 1,
        estimatedMinutes: 7,
        visualizationType: 'binary_search',
      },
      {
        title: 'Compare and Swap',
        slug: 'sorting-compare-and-swap',
        summary: 'Learn the basic action behind many beginner sorting explanations.',
        content:
          'Many sorting algorithms repeatedly compare two values and sometimes swap them. The beginner goal is not to memorize every sorting algorithm first. It is to see how local comparisons gradually move the data toward sorted order.',
        order: 2,
        estimatedMinutes: 8,
        visualizationType: 'bubble_sort',
      },
    ],
  },
  {
    title: 'Dynamic Programming',
    slug: 'dynamic-programming',
    description:
      'Start DP gently by recognizing repeated subproblems and storing answers for reuse.',
    order: 10,
    difficulty: 'beginner',
    lessons: [
      {
        title: 'Repeated Subproblems',
        slug: 'dynamic-programming-repeated-subproblems',
        summary: 'Notice when the same smaller question is being solved again and again.',
        content:
          'Dynamic programming helps when a problem repeats the same smaller questions. If you can name the repeated question, you can often store its answer and reuse it later instead of recalculating.',
        order: 1,
        estimatedMinutes: 8,
        visualizationType: 'none',
      },
      {
        title: 'Memoization as a Notebook',
        slug: 'dynamic-programming-memoization-notebook',
        summary: 'Think of memoization as writing down answers before you need them again.',
        content:
          'Memoization stores answers in a map or array after they are computed. The next time the same input appears, the algorithm checks the notebook first. This turns repeated recursive work into a faster lookup.',
        order: 2,
        estimatedMinutes: 9,
        visualizationType: 'none',
      },
    ],
  },
];

export const initialDsaQuizzes = [
  {
    topicSlug: 'arrays',
    title: 'Arrays Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'In AlgoLens Trace Mode, what is the difference between an index and a value?',
        options: [
          'An index is the position; a value is the data stored there.',
          'An index is always larger than the value.',
          'A value is the position; an index is the data stored there.',
        ],
        correctAnswer: 'An index is the position; a value is the data stored there.',
        explanation:
          'Trace Mode labels positions and stored values separately because pointer movement changes positions, not the values themselves.',
        difficulty: 'beginner',
      },
      {
        type: 'true_false',
        prompt: 'A single scan usually means reading the array from left to right once.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'A scan is one pass. The useful part is deciding which state to keep as the scan moves.',
        difficulty: 'beginner',
      },
      {
        type: 'fill_blank',
        prompt: 'The variable that remembers a position in an array is often called a ____.',
        options: [],
        correctAnswer: ['pointer', 'index'],
        explanation:
          'In beginner array lessons, a pointer is usually just an index saved in a variable.',
        difficulty: 'beginner',
      },
    ],
  },
  {
    topicSlug: 'strings',
    title: 'Strings Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'Why can many string problems be treated like array problems?',
        options: [
          'Strings can be read as ordered characters with indexes.',
          'Strings always contain numbers.',
          'Strings cannot be looped through.',
        ],
        correctAnswer: 'Strings can be read as ordered characters with indexes.',
        explanation:
          'A string has character positions, so many array habits transfer directly to text.',
        difficulty: 'beginner',
      },
      {
        type: 'code_output',
        prompt: "What character is at index 1 in the string 'cat'?",
        options: ['c', 'a', 't'],
        correctAnswer: 'a',
        explanation: 'Indexes start at 0, so index 0 is c and index 1 is a.',
        difficulty: 'beginner',
      },
      {
        type: 'fill_blank',
        prompt: 'A map that stores how many times each character appears is a ____ table.',
        options: [],
        correctAnswer: ['frequency', 'count'],
        explanation:
          'Frequency tables make repeated character counts visible, which matches AlgoLens map-state visuals.',
        difficulty: 'beginner',
      },
    ],
  },
  {
    topicSlug: 'linked-lists',
    title: 'Linked Lists Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'What does a linked-list node usually store?',
        options: ['A value and a next pointer', 'Only an array index', 'Every value in the list'],
        correctAnswer: 'A value and a next pointer',
        explanation: 'Linked lists move by following next pointers from one node to another.',
        difficulty: 'beginner',
      },
      {
        type: 'true_false',
        prompt: 'In a linked list, you can always jump directly to index 10 as quickly as an array.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'A linked list must usually walk node by node to reach later nodes.',
        difficulty: 'beginner',
      },
      {
        type: 'mcq',
        prompt: 'When inserting a node, why does the order of pointer updates matter?',
        options: [
          'Updating too early can disconnect the rest of the list.',
          'Pointer order never matters.',
          'Linked lists do not use pointers.',
        ],
        correctAnswer: 'Updating too early can disconnect the rest of the list.',
        explanation:
          'Beginner traces should show the chain before and after each pointer assignment.',
        difficulty: 'beginner',
      },
    ],
  },
  {
    topicSlug: 'stacks',
    title: 'Stacks Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'Which item leaves a stack first?',
        options: ['The newest item', 'The oldest item', 'A random item'],
        correctAnswer: 'The newest item',
        explanation:
          'Stacks are last in, first out. Trace Mode stack lessons highlight the top item.',
        difficulty: 'beginner',
      },
      {
        type: 'true_false',
        prompt: 'Bracket matching uses the most recent opener first.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'The latest opener is on top of the stack, so it must match the next closer.',
        difficulty: 'beginner',
      },
      {
        type: 'code_output',
        prompt: 'Push 2, push 5, then pop. What value is popped?',
        options: ['2', '5', '7'],
        correctAnswer: '5',
        explanation: 'The last value pushed was 5, so it is popped first.',
        difficulty: 'beginner',
      },
    ],
  },
  {
    topicSlug: 'queues',
    title: 'Queues Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'Which item leaves a queue first?',
        options: ['The oldest waiting item', 'The newest item', 'The largest item'],
        correctAnswer: 'The oldest waiting item',
        explanation: 'Queues are first in, first out. This is why they work well for layers.',
        difficulty: 'beginner',
      },
      {
        type: 'true_false',
        prompt: 'Breadth-first traversal commonly uses a queue.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'A queue preserves the next layer of work in arrival order.',
        difficulty: 'beginner',
      },
      {
        type: 'fill_blank',
        prompt: 'A queue removes from the front and adds new work to the ____.',
        options: [],
        correctAnswer: ['back', 'rear', 'end'],
        explanation: 'Adding at the back and removing from the front keeps FIFO order visible.',
        difficulty: 'beginner',
      },
    ],
  },
  {
    topicSlug: 'recursion',
    title: 'Recursion Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'What does the base case do?',
        options: [
          'Stops recursion on the simplest input',
          'Makes recursion run forever',
          'Deletes the function call',
        ],
        correctAnswer: 'Stops recursion on the simplest input',
        explanation:
          'The base case is the stopping rule that keeps recursive calls from continuing forever.',
        difficulty: 'beginner',
      },
      {
        type: 'true_false',
        prompt: 'A recursive call should move toward a smaller or simpler problem.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Without progress toward the base case, recursion cannot safely finish.',
        difficulty: 'beginner',
      },
      {
        type: 'fill_blank',
        prompt: 'The stack of unfinished function calls is called the call ____.',
        options: [],
        correctAnswer: 'stack',
        explanation: 'The call stack is the hidden state recursion learners need to visualize.',
        difficulty: 'beginner',
      },
    ],
  },
  {
    topicSlug: 'trees',
    title: 'Trees Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'What is the top starting node of a tree called?',
        options: ['Root', 'Leaf', 'Edge'],
        correctAnswer: 'Root',
        explanation: 'Tree traversals usually begin at the root and move through child links.',
        difficulty: 'beginner',
      },
      {
        type: 'mcq',
        prompt: 'Which traversal visits one branch deeply before backing up?',
        options: ['Depth-first search', 'Breadth-first search', 'Linear scan'],
        correctAnswer: 'Depth-first search',
        explanation: 'DFS follows a path down before returning to explore another branch.',
        difficulty: 'beginner',
      },
      {
        type: 'true_false',
        prompt: 'Breadth-first traversal visits a tree layer by layer.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'BFS uses a queue to make each layer visible before moving deeper.',
        difficulty: 'beginner',
      },
    ],
  },
  {
    topicSlug: 'graphs',
    title: 'Graphs Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'What does an edge represent in a graph?',
        options: ['A connection between nodes', 'The first array index', 'A sorted value'],
        correctAnswer: 'A connection between nodes',
        explanation: 'Graphs are made of nodes and edges. Traversal follows those connections.',
        difficulty: 'beginner',
      },
      {
        type: 'true_false',
        prompt: 'A visited set helps avoid infinite loops in graphs with cycles.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'Visited state prevents the traversal from repeating nodes it has already handled.',
        difficulty: 'beginner',
      },
      {
        type: 'fill_blank',
        prompt: 'Nodes directly connected to the current node are called ____.',
        options: [],
        correctAnswer: ['neighbors', 'neighbours'],
        explanation: 'Neighbor lists are the graph state a traversal reads at each step.',
        difficulty: 'beginner',
      },
    ],
  },
  {
    topicSlug: 'sorting',
    title: 'Sorting Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'Why can sorting make later algorithm decisions easier?',
        options: [
          'Order makes comparisons more predictable.',
          'Sorting removes every duplicate automatically.',
          'Sorting changes every value to zero.',
        ],
        correctAnswer: 'Order makes comparisons more predictable.',
        explanation:
          'Sorted order is why binary search and pointer movement can make safe decisions.',
        difficulty: 'beginner',
      },
      {
        type: 'true_false',
        prompt: 'Compare-and-swap is a basic action used in many sorting explanations.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation:
          'Many beginner sorting traces show two values being compared, then swapped if needed.',
        difficulty: 'beginner',
      },
      {
        type: 'complexity',
        prompt: 'Which complexity is commonly associated with comparing every pair in a simple nested-loop sort?',
        options: ['O(log n)', 'O(n)', 'O(n^2)'],
        correctAnswer: 'O(n^2)',
        explanation: 'Nested loops over the same list often create quadratic work.',
        difficulty: 'beginner',
      },
    ],
  },
  {
    topicSlug: 'dynamic-programming',
    title: 'Dynamic Programming Concept Check',
    questions: [
      {
        type: 'mcq',
        prompt: 'What repeated pattern suggests dynamic programming may help?',
        options: [
          'The same smaller problem appears again.',
          'The input has no structure.',
          'Every answer is guessed randomly.',
        ],
        correctAnswer: 'The same smaller problem appears again.',
        explanation: 'DP becomes useful when repeated subproblems can be stored and reused.',
        difficulty: 'beginner',
      },
      {
        type: 'fill_blank',
        prompt: 'Memoization stores answers so the algorithm can ____ them later.',
        options: [],
        correctAnswer: ['reuse', 'use', 'look up'],
        explanation: 'The mental model is a notebook: write an answer once, then reuse it.',
        difficulty: 'beginner',
      },
      {
        type: 'complexity',
        prompt: 'If memoization prevents solving the same subproblem many times, what usually improves?',
        options: ['Time complexity', 'Variable names', 'Screen color'],
        correctAnswer: 'Time complexity',
        explanation: 'Caching repeated results usually reduces the amount of repeated work.',
        difficulty: 'beginner',
      },
    ],
  },
];

export const initialCodingProblems = [
  {
    topicSlug: 'arrays',
    title: 'Find the Maximum Value',
    slug: 'find-maximum-value',
    difficulty: 'beginner',
    statement:
      'Given an array of numbers, return the largest value. Practice one clean scan and keep the best value seen so far.',
    examples: [
      {
        input: '[3, 8, 2, 5]',
        output: '8',
        explanation: '8 is larger than every other value in the array.',
      },
      {
        input: '[-4, -1, -9]',
        output: '-1',
        explanation: '-1 is the largest number even though all values are negative.',
      },
    ],
    constraints: ['The array has at least one number.', 'Numbers may be positive, zero, or negative.'],
    starterCode: [
      {
        language: 'javascript',
        code: 'function findMax(nums) {\n  // Keep the best value seen so far.\n  return null;\n}',
      },
      {
        language: 'python',
        code: 'def find_max(nums):\n    # Keep the best value seen so far.\n    return None',
      },
    ],
    testCases: [
      { input: [3, 8, 2, 5], expectedOutput: 8, isHidden: false },
      { input: [-4, -1, -9], expectedOutput: -1, isHidden: false },
      { input: [42], expectedOutput: 42, isHidden: true },
    ],
  },
  {
    topicSlug: 'strings',
    title: 'Count a Character',
    slug: 'count-a-character',
    difficulty: 'beginner',
    statement:
      'Given a string and a target character, return how many times the target appears. This reinforces scanning text one character at a time.',
    examples: [
      {
        input: '"banana", "a"',
        output: '3',
        explanation: 'The character a appears three times in banana.',
      },
      {
        input: '"level", "z"',
        output: '0',
        explanation: 'z does not appear in level.',
      },
    ],
    constraints: ['The target is one character.', 'The string may be empty.'],
    starterCode: [
      {
        language: 'javascript',
        code: 'function countChar(text, target) {\n  // Scan each character and count matches.\n  return 0;\n}',
      },
      {
        language: 'python',
        code: 'def count_char(text, target):\n    # Scan each character and count matches.\n    return 0',
      },
    ],
    testCases: [
      { input: { text: 'banana', target: 'a' }, expectedOutput: 3, isHidden: false },
      { input: { text: 'level', target: 'z' }, expectedOutput: 0, isHidden: false },
      { input: { text: '', target: 'a' }, expectedOutput: 0, isHidden: true },
    ],
  },
  {
    topicSlug: 'stacks',
    title: 'Valid Parentheses Lite',
    slug: 'valid-parentheses-lite',
    difficulty: 'beginner',
    statement:
      'Given a string containing only parentheses, return true when every opening parenthesis is closed in the correct order.',
    examples: [
      {
        input: '"(())"',
        output: 'true',
        explanation: 'The most recent opener closes first.',
      },
      {
        input: '"(()"',
        output: 'false',
        explanation: 'One opening parenthesis is never closed.',
      },
    ],
    constraints: ['The string contains only ( and ).', 'Use stack-style thinking even if you track a count first.'],
    starterCode: [
      {
        language: 'javascript',
        code: 'function isValidParentheses(text) {\n  // Track open parentheses.\n  return false;\n}',
      },
      {
        language: 'python',
        code: 'def is_valid_parentheses(text):\n    # Track open parentheses.\n    return False',
      },
    ],
    testCases: [
      { input: '(())', expectedOutput: true, isHidden: false },
      { input: '(()', expectedOutput: false, isHidden: false },
      { input: ')(', expectedOutput: false, isHidden: true },
    ],
  },
  {
    topicSlug: 'queues',
    title: 'Serve the Queue',
    slug: 'serve-the-queue',
    difficulty: 'beginner',
    statement:
      'Given a list of names in arrival order and a number k, return the first k names served by the queue.',
    examples: [
      {
        input: '["Maya", "Noah", "Iris"], 2',
        output: '["Maya", "Noah"]',
        explanation: 'The oldest waiting names leave first.',
      },
      {
        input: '["Ari"], 3',
        output: '["Ari"]',
        explanation: 'You cannot serve more people than the queue contains.',
      },
    ],
    constraints: ['k is zero or greater.', 'Names should remain in arrival order.'],
    starterCode: [
      {
        language: 'javascript',
        code: 'function serveQueue(names, k) {\n  // Return the first k names in FIFO order.\n  return [];\n}',
      },
      {
        language: 'python',
        code: 'def serve_queue(names, k):\n    # Return the first k names in FIFO order.\n    return []',
      },
    ],
    testCases: [
      { input: { names: ['Maya', 'Noah', 'Iris'], k: 2 }, expectedOutput: ['Maya', 'Noah'], isHidden: false },
      { input: { names: ['Ari'], k: 3 }, expectedOutput: ['Ari'], isHidden: false },
      { input: { names: ['A', 'B'], k: 0 }, expectedOutput: [], isHidden: true },
    ],
  },
  {
    topicSlug: 'sorting',
    title: 'Is Sorted Ascending',
    slug: 'is-sorted-ascending',
    difficulty: 'beginner',
    statement:
      'Given an array of numbers, return true if every value is less than or equal to the value after it.',
    examples: [
      {
        input: '[1, 2, 2, 5]',
        output: 'true',
        explanation: 'No neighboring pair is out of order.',
      },
      {
        input: '[1, 4, 3]',
        output: 'false',
        explanation: '4 appears before 3, so the array is not sorted ascending.',
      },
    ],
    constraints: ['The array may contain duplicates.', 'An empty or single-value array is sorted.'],
    starterCode: [
      {
        language: 'javascript',
        code: 'function isSortedAscending(nums) {\n  // Compare neighboring values.\n  return false;\n}',
      },
      {
        language: 'python',
        code: 'def is_sorted_ascending(nums):\n    # Compare neighboring values.\n    return False',
      },
    ],
    testCases: [
      { input: [1, 2, 2, 5], expectedOutput: true, isHidden: false },
      { input: [1, 4, 3], expectedOutput: false, isHidden: false },
      { input: [], expectedOutput: true, isHidden: true },
    ],
  },
  {
    topicSlug: 'dynamic-programming',
    title: 'Climb Small Stairs',
    slug: 'climb-small-stairs',
    difficulty: 'beginner',
    statement:
      'You can climb 1 or 2 steps at a time. Given n, return how many distinct ways there are to reach the top.',
    examples: [
      {
        input: '3',
        output: '3',
        explanation: 'The ways are 1+1+1, 1+2, and 2+1.',
      },
      {
        input: '4',
        output: '5',
        explanation: 'Each answer can reuse the two smaller stair counts.',
      },
    ],
    constraints: ['0 <= n <= 20 for starter practice.', 'Think of memoization as a notebook of smaller answers.'],
    starterCode: [
      {
        language: 'javascript',
        code: 'function climbStairs(n) {\n  // Reuse smaller stair counts.\n  return 0;\n}',
      },
      {
        language: 'python',
        code: 'def climb_stairs(n):\n    # Reuse smaller stair counts.\n    return 0',
      },
    ],
    testCases: [
      { input: 3, expectedOutput: 3, isHidden: false },
      { input: 4, expectedOutput: 5, isHidden: false },
      { input: 0, expectedOutput: 1, isHidden: true },
    ],
  },
];

export function getSeedLessonCount() {
  return initialDsaTopics.reduce((count, topic) => count + topic.lessons.length, 0);
}

export function getSeedQuizCount() {
  return initialDsaQuizzes.length;
}

export function getSeedCodingProblemCount() {
  return initialCodingProblems.length;
}
