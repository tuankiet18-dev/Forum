// src/constants/problem.constants.ts

export const CATEGORIES = [
  { value: 'Algebra', label: 'Algebra (Đại số)' },
  { value: 'Calculus', label: 'Calculus (Giải tích)' },
  { value: 'Geometry', label: 'Geometry (Hình học)' },
  { value: 'Number Theory', label: 'Number Theory (Lý thuyết số)' },
  { value: 'Combinatorics', label: 'Combinatorics (Tổ hợp)' },
  { value: 'Logic', label: 'Logic & Set Theory (Logic & Tập hợp)' },
  { value: 'Probability', label: 'Probability & Statistics (Xác suất thống kê)' },
  { value: 'Linear Algebra', label: 'Linear Algebra (Đại số tuyến tính)' },
  { value: 'Differential Equations', label: 'Differential Equations (Phương trình vi phân)' },
  { value: 'Real Analysis', label: 'Real Analysis (Giải tích thực)' },
  { value: 'Complex Analysis', label: 'Complex Analysis (Giải tích phức)' },
  { value: 'Topology', label: 'Topology (Topo)' },
  { value: 'Applied Math', label: 'Applied Math (Toán ứng dụng)' },
  { value: 'Other', label: 'Other' },
];

export const LEVELS = [
  { 
    value: 'Middle School', 
    label: 'Middle School (Grades 6-9)',
    description: 'Basic mathematics for middle school students'
  },
  { 
    value: 'High School', 
    label: 'High School (Grades 10-12)',
    description: 'Advanced high school mathematics'
  },
  { 
    value: 'Undergraduate', 
    label: 'Undergraduate',
    description: 'University level mathematics'
  },
  { 
    value: 'Graduate', 
    label: 'Graduate',
    description: 'Master\'s and PhD level'
  },
  { 
    value: 'Competition', 
    label: 'Competition/Olympiad',
    description: 'Math competitions and olympiads'
  },
  { 
    value: 'Research', 
    label: 'Research',
    description: 'Advanced research problems'
  },
];

export const DIFFICULTIES = [
  { 
    value: 'Easy', 
    label: 'Easy',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20'
  },
  { 
    value: 'Medium', 
    label: 'Medium',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  { 
    value: 'Hard', 
    label: 'Hard',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
];

// Pre-defined tags grouped by category
export const PREDEFINED_TAGS: Record<string, string[]> = {
  'Algebra': [
    'polynomials', 'inequalities', 'functions', 'logarithms', 
    'complex-numbers', 'systems-of-equations', 'sequences-series', 'groups', 'rings', 'fields'
  ],
  'Calculus': [
    'limits', 'derivatives', 'integrals', 'continuity', 
    'series', 'sequences', 'multivariable', 'optimization', 'taylor-series'
  ],
  'Geometry': [
    'euclidean', 'triangles', 'circles', 'conics', 
    'trigonometry', 'vectors', 'coordinate-geometry', '3d-geometry', 'transformations'
  ],
  'Number Theory': [
    'primes', 'divisibility', 'modular-arithmetic', 'diophantine-equations', 
    'congruences', 'arithmetic-functions', 'cryptography'
  ],
  'Combinatorics': [
    'permutations', 'combinations', 'graph-theory', 'counting', 
    'probability', 'generating-functions', 'pigeonhole-principle', 'recursion'
  ],
  'Logic': [
    'set-theory', 'propositional-logic', 'proof-writing', 
    'boolean-algebra', 'relations', 'functions', 'cardinality'
  ],
  'Probability': [
    'distributions', 'random-variables', 'expectation', 'variance', 
    'bayes-theorem', 'hypothesis-testing', 'stochastic-processes', 'regression'
  ],
  'Linear Algebra': [
    'matrices', 'determinants', 'eigenvalues-eigenvectors', 
    'vector-spaces', 'linear-transformations', 'inner-product', 'orthogonality'
  ],
  'Differential Equations': [
    'ode', 'pde', 'initial-value-problems', 'boundary-value-problems', 
    'laplace-transform', 'fourier-series', 'stability'
  ],
  'Real Analysis': [
    'metric-spaces', 'sequences', 'convergence', 'measure-theory', 
    'lebesgue-integration', 'normed-spaces'
  ],
  'Complex Analysis': [
    'analytic-functions', 'cauchy-theorem', 'residues', 
    'conformal-mapping', 'holomorphic-functions', 'riemann-surfaces'
  ],
  'Topology': [
    'point-set', 'compactness', 'connectedness', 'homotopy', 
    'fundamental-group', 'manifolds', 'knots'
  ],
  'Applied Math': [
    'physics', 'mechanics', 'fluid-dynamics', 'optimization', 
    'numerical-methods', 'game-theory', 'cryptography'
  ],
  'Other': [
    'history', 'education', 'puzzle', 'contest-math', 'general'
  ]
};

// Common general tags useful across categories
export const COMMON_TAGS = [
    'proof', 'generalization', 'counter-example', 'open-problem', 'definition'
];