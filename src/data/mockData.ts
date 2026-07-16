/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Document, Category, Comment } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.j@edu.org',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Associate Professor of Computer Science. Researching Quantum Algorithms and Deep Learning architectures. Author of multiple textbooks.',
    role: 'user',
    followersCount: 1420,
    followingCount: 380,
    followers: ['user_2', 'user_3'],
    following: ['user_2'],
    createdAt: '2024-01-15T08:30:00Z'
  },
  {
    id: 'user_2',
    name: 'Marcus Chen',
    email: 'marcus.chen@tech.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Product Designer & Business Strategist. Helping startups scale with solid growth frameworks and UX strategies.',
    role: 'user',
    followersCount: 890,
    followingCount: 412,
    followers: ['user_1'],
    following: ['user_1', 'user_3'],
    createdAt: '2024-03-22T10:15:00Z'
  },
  {
    id: 'user_3',
    name: 'Elena Rostova',
    email: 'elena.r@history.net',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Historical Researcher & Archival Specialist. Passionate about bringing ancient history to life through comprehensive docu-essays.',
    role: 'user',
    followersCount: 2150,
    followingCount: 156,
    followers: ['user_1', 'user_2'],
    following: ['user_1'],
    createdAt: '2023-11-05T14:45:00Z'
  },
  {
    id: 'user_4',
    name: 'Alex Rivera',
    email: 'alex.rivera@eng.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Structural Engineer & AutoCAD consultant. Sharing practical templates and design handbooks.',
    role: 'user',
    followersCount: 640,
    followingCount: 220,
    followers: [],
    following: [],
    createdAt: '2024-05-10T11:20:00Z'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat_edu', name: 'Education', slug: 'education', icon: 'GraduationCap', count: 9600 },
  { id: 'cat_tech', name: 'Technology', slug: 'technology', icon: 'Laptop', count: 8500 },
  { id: 'cat_prog', name: 'Programming', slug: 'programming', icon: 'Code', count: 4850 },
  { id: 'cat_eng', name: 'Engineering', slug: 'engineering', icon: 'Cpu', count: 4100 },
  { id: 'cat_sci', name: 'Science', slug: 'science', icon: 'Atom', count: 3200 },
  { id: 'cat_math', name: 'Mathematics', slug: 'mathematics', icon: 'Calculator', count: 2100 },
  { id: 'cat_med', name: 'Medical', slug: 'medical', icon: 'HeartPulse', count: 1950 },
  { id: 'cat_biz', name: 'Business', slug: 'business', icon: 'TrendingUp', count: 12400 },
  { id: 'cat_fin', name: 'Finance', slug: 'finance', icon: 'Coins', count: 5400 },
  { id: 'cat_law', name: 'Law', slug: 'law', icon: 'Scale', count: 1800 },
  { id: 'cat_lit', name: 'Literature', slug: 'literature', icon: 'BookOpen', count: 3100 },
  { id: 'cat_hist', name: 'History', slug: 'history', icon: 'Library', count: 2800 },
  { id: 'cat_psych', name: 'Psychology', slug: 'psychology', icon: 'Brain', count: 1500 },
  { id: 'cat_lang', name: 'Language Learning', slug: 'language-learning', icon: 'Languages', count: 2200 },
  { id: 'cat_res', name: 'Research Papers', slug: 'research-papers', icon: 'FileText', count: 6700 },
  { id: 'cat_comp', name: 'Competitive Exams', slug: 'competitive-exams', icon: 'Award', count: 4300 },
  { id: 'cat_gov', name: 'Government Exams', slug: 'government-exams', icon: 'Building', count: 3900 },
  { id: 'cat_self', name: 'Self Help', slug: 'self-help', icon: 'Compass', count: 2900 },
  { id: 'cat_bio', name: 'Biography', slug: 'biography', icon: 'User', count: 1400 },
  { id: 'cat_fic', name: 'Fiction', slug: 'fiction', icon: 'Sparkles', count: 3500 },
  { id: 'cat_nfic', name: 'Non-Fiction', slug: 'non-fiction', icon: 'FileDigit', count: 4100 },
  { id: 'cat_pres', name: 'Presentations', slug: 'presentations', icon: 'Presentation', count: 1600 },
  { id: 'cat_man', name: 'Manuals', slug: 'manuals', icon: 'Wrench', count: 1100 },
  { id: 'cat_rep', name: 'Reports', slug: 'reports', icon: 'BarChart2', count: 2400 },
  { id: 'cat_life', name: 'Lifestyle', slug: 'lifestyle', icon: 'Smile', count: 2000 }
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc_1',
    title: 'Introduction to Quantum Computing & Algorithms',
    slug: 'introduction-to-quantum-computing-algorithms',
    description: 'A comprehensive foundational lecture notes set detailing qubits, quantum superposition, entanglement, Deutsch-Jozsa algorithm, and an overview of Shor’s and Grover’s algorithms for computer science graduate students.',
    category: 'science',
    tags: ['quantum', 'computing', 'physics', 'algorithms', 'lecture-notes'],
    language: 'English',
    coverImage: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    fileType: 'pdf',
    fileSize: '4.2 MB',
    totalPages: 5,
    views: 1240,
    downloads: 382,
    likes: 85,
    likedBy: ['user_2'],
    visibility: 'public',
    uploadedBy: 'user_1',
    authorName: 'Dr. Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T12:00:00-07:00',
    updatedAt: '2026-01-10T12:00:00-07:00',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pages: [
      `LECTURE 1: FOUNDATIONS OF QUANTUM SYSTEMS
- Definition of a Qubit: Representing state as |ψ⟩ = α|0⟩ + β|1⟩, where α, β ∈ C and |α|² + |β|² = 1.
- Visualizing state on the Bloch Sphere: Representation with polar angles θ and φ.
- Dirac Notation (Bra-Ket): Bra ⟨φ| as conjugate transpose of Ket |ψ⟩.
- State Superposition: Quantum parallel computing using Hadamard gate H |0⟩ = (|0⟩ + |1⟩)/√2.
- Measurement: Collapse of superposition with probability corresponding to state coefficients.`,

      `LECTURE 2: QUANTUM ENTAGLEMENT & OPERATORS
- Concept of Spooky Action at a Distance: Bell States (EPR pairs) representing maximally entangled two-qubit systems.
- Bell State: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2. Measuring one qubit instantly determines the state of the other.
- Quantum Logic Gates:
  * Pauli Gates (X, Y, Z) - rotational operations.
  * Hadamard Gate (H) - creation of superposition.
  * CNOT Gate - conditional inversion, crucial for entanglement creation.
- Quantum circuit diagrams and matrix representations of multi-qubit systems.`,

      `LECTURE 3: DEUTSCH-JOZSA ALGORITHM
- Problem definition: Determine whether a hidden black-box function f: {0,1}ⁿ → {0,1} is constant (same for all inputs) or balanced (exactly half return 0 and half return 1).
- Classical complexity: Requires O(2ⁿ⁻¹) queries in the worst case to be 100% certain.
- Quantum complexity: Solved using exactly 1 query to the quantum oracle.
- Step-by-step mathematical derivation of state transformations through Hadamard gates and oracle queries.`,

      `LECTURE 4: SHOR'S FACTORING ALGORITHM
- Prime Factorization Problem: Finding prime factors of integer N. Core of classical RSA cryptography.
- Classical complexity: General Number Field Sieve runs in sub-exponential time.
- Quantum complexity: Shor's algorithm runs in O((log N)³) polynomial time.
- Mathematical reduction: Reducing factorization to the period-finding problem of function f(x) = a^x mod N.
- Quantum Fourier Transform (QFT): Dynamic implementation in the circuit to extract the period r efficiently.`,

      `LECTURE 5: GROVER'S SEARCH ALGORITHM
- Unstructured Search Problem: Finding a target item in an unsorted database of size N.
- Classical complexity: Average O(N) operations.
- Quantum complexity: Grover's algorithm achieves quadratic speedup, running in O(√N) iterations.
- Core Operators:
  * Oracle Reflector: Inverts the sign of the target state.
  * Diffusion Operator (Grover operator): Performs inversion about the mean state.
- Geometric visualization: Rotation of the state vector towards the target state in a 2D subspace.`
    ]
  },
  {
    id: 'doc_2',
    title: 'E-Commerce Growth Strategies 2026',
    slug: 'ecommerce-growth-strategies-2026',
    description: 'A visual pitch deck presentation detailing omnichannel expansion, conversion rate optimization (CRO) hacks, retaining high lifetime-value customers (LTV), and leveraging AI personalizations in modern retail.',
    category: 'business',
    tags: ['ecommerce', 'marketing', 'growth', 'business-strategy', 'presentation'],
    language: 'English',
    coverImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    fileType: 'pptx',
    fileSize: '8.4 MB',
    totalPages: 4,
    views: 3120,
    downloads: 940,
    likes: 194,
    likedBy: ['user_1', 'user_3'],
    visibility: 'public',
    uploadedBy: 'user_2',
    authorName: 'Marcus Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-18T14:30:00-07:00',
    updatedAt: '2026-02-18T14:30:00-07:00',
    pages: [
      `[SLIDE 1: COVER]
E-COMMERCE GROWTH STRATEGIES 2026
Navigating the Next Era of Digital Retail

Presented by: Marcus Chen, Principal Strategist
Key Pillars:
1. Omnichannel Commerce integration
2. Hyper-Personalization Engine with AI
3. Sustainable Shipping & Return Optimization`,

      `[SLIDE 2: THE CURRENT LANDSCAPE]
THE RETAIL SHIFT IN 2026
- Ad Costs (CAC) have increased by 45% year-over-year. Traditional paid search is saturated.
- Consumer trust in display ads is at an all-time low (less than 18%).
- Customers demand absolute fulfillment speed: Same-day delivery is no longer premium, it's expected.
- Solution: Transitioning from transactional acquisition to high LTV brand affinity.`,

      `[SLIDE 3: REVENUE OPTIMIZATION FRAMEWORK]
CONVERSION RATE OPTIMIZATION (CRO) PILLARS
1. Micro-Copy and Instant Checkout: Reducing checkout steps to 1 click (e.g. Shop Pay / Apple Pay).
2. Dynamic Search Grounding: Natural language search interfaces (e.g., "warm jacket for rainy winter hiking").
3. Social Proof integration: Verified video reviews embedded directly on PDPs.
4. Exit-Intent personalizations based on scroll speed and cart value.`,

      `[SLIDE 4: KEY TAKEAWAYS & ACTION PLANS]
THE 30-60-90 DAY PLAN
- Day 1-30: Audit checkout funnel bottlenecks; implement instant one-click payment gateways.
- Day 31-60: Deploy AI-driven product recommendations widget on Product Detail Pages (PDP).
- Day 61-90: Re-engage inactive customers with segmented automated email flows highlighting community reviews.`
    ]
  },
  {
    id: 'doc_3',
    title: 'Deep Learning & Neural Networks Guide',
    slug: 'deep-learning-neural-networks-guide',
    description: 'A detailed handbook introducing Feedforward Networks, Backpropagation equations, Convolutional Neural Networks (CNNs) for vision, and Recurrent Neural Networks (RNNs/Transformers) for sequence modeling.',
    category: 'programming',
    tags: ['deep-learning', 'machine-learning', 'neural-networks', 'ai', 'handbook'],
    language: 'English',
    coverImage: 'linear-gradient(135deg, #111827 0%, #312e81 100%)',
    fileType: 'pdf',
    fileSize: '6.7 MB',
    totalPages: 4,
    views: 4500,
    downloads: 1450,
    likes: 310,
    likedBy: ['user_2', 'user_4'],
    visibility: 'public',
    uploadedBy: 'user_1',
    authorName: 'Dr. Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-11-05T09:10:00-07:00',
    updatedAt: '2025-11-05T09:10:00-07:00',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pages: [
      `CHAPTER 1: THE MATHEMATICS OF PERCEPTRONS
- The biological inspiration: Synapses, dendrites, and action potentials.
- Artificial Perceptron: y = f(∑ wᵢxᵢ + b), where w are weights, x are inputs, b is bias, and f is an activation function.
- Crucial Activation Functions:
  * Sigmoid: σ(z) = 1 / (1 + e⁻ᶻ) - maps inputs to (0, 1).
  * Hyperbolic Tangent (tanh): maps inputs to (-1, 1).
  * Rectified Linear Unit (ReLU): f(z) = max(0, z) - solves vanishing gradient problem in deep layers.`,

      `CHAPTER 2: STOCHASTIC GRADIENT DESCENT & BACKPROPAGATION
- Loss function optimization: Mean Squared Error (MSE) and Cross-Entropy loss.
- Gradient Descent: w ← w - η(∂L/∂w), where η is the learning rate.
- Backpropagation algorithm: Relying on the mathematical Chain Rule to compute error gradients relative to weights in hidden layers.
- Analytical derivation of δˡ = (wˡ⁺¹ᵀ δˡ⁺¹) ⊙ f'(zˡ) representing error in layer l.`,

      `CHAPTER 3: CONVOLUTIONAL NEURAL NETWORKS (CNN) FOR COMPUTER VISION
- Spatial local connectivity: Receptive fields and parameter sharing.
- Key layers in CNN:
  * Convolutional Layer: Applying kernels (filters) to extract edges, textures, and high-level features.
  * Pooling Layer (Max Pooling): Downsampling spatial resolution to reduce compute load and build translation invariance.
  * Fully Connected (FC) Layer: Flattening output vectors to perform classification.
- Famous architectures: LeNet, AlexNet, VGG, ResNet (Residual learning skips).`,

      `CHAPTER 4: TRANSFORMATIVES & ATTENTION MECHANISMS
- Limitations of Recurrent Networks: Vanishing gradients, lack of parallel processing across long text sequences.
- Self-Attention Core Formula: Attention(Q, K, V) = softmax(Q Kᵀ / √dₖ) V.
- Key, Query, Value vectors: Derived from projecting token representations into distinct spaces.
- Multi-Head Attention: Computing attention weights multiple times in parallel to capture distinct context paths.
- Transformer encoder-decoder stacks: Heart of modern LLMs (GPT, Gemini).`
    ]
  },
  {
    id: 'doc_4',
    title: 'The Fall of the Roman Republic',
    slug: 'the-fall-of-the-roman-republic',
    description: 'An elegant scholarly essay analyzing the socio-political dynamics of first-century BCE Rome, the Gracchi land reforms, the Marius military innovations, Sulla’s dictatorship, and Julius Caesar’s crossing of the Rubicon.',
    category: 'history',
    tags: ['rome', 'republic', 'julius-caesar', 'ancient-history', 'essay'],
    language: 'English',
    coverImage: 'linear-gradient(135deg, #7c2d12 0%, #b45309 100%)',
    fileType: 'docx',
    fileSize: '1.8 MB',
    totalPages: 3,
    views: 890,
    downloads: 145,
    likes: 42,
    likedBy: ['user_3'],
    visibility: 'public',
    uploadedBy: 'user_3',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-01T10:00:00-07:00',
    updatedAt: '2026-03-01T10:00:00-07:00',
    pages: [
      `ESSAY: AGRARIAN CRISIS AND THE GRACCHI REFORMS (133 - 121 BCE)
The fall of the Roman Republic was not a sudden catastrophe, but a slow erosion of institutional norms and social structures over a century.
- The Rise of Latifundia: Post-Punic war conquests flooded Rome with wealth and enslaved laborers, leading to massive, slave-run patrician agricultural estates.
- Displaced Plebeians: Smallholder Roman farmers, who formed the backbone of the army, returned from campaigns to find their land bought out or seized, leading to urban overcrowding and unrest.
- Tiberius and Gaius Gracchus: The brothers bypassed the conservative Senate to appeal directly to the Plebeian Assembly for land redistributions. Their subsequent political assassinations introduced political violence into the Republic.`,

      `MILITARY REFORMS OF MARIUS AND THE PERSONALIZED LEGIONS (107 BCE)
Gaius Marius revolutionized the Roman military structure, permanently altering the relationship between general, soldier, and state.
- Elimination of Property Requirements: Marius permitted the landless urban poor (capite censi) to enlist.
- Professional Standing Army: Enlistees received standardized equipment, training, and pension promises of land upon retirement.
- Shift of Loyalty: Because the Senate consistently refused to fund veteran land grants, soldiers relied on their generals (e.g. Marius, Sulla, Pompey) to secure their retirement. Legions became loyal to individual warlords rather than the Senate.`,

      `THE DICTATORSHIP OF SULLA AND THE CROSSING OF THE RUBICON
The culmination of personalized loyalty led to direct military confrontation inside Rome.
- Sulla's March on Rome (88 BCE): The first general to lead legions against his own capital. Sulla instituted the proscriptions and assumed the office of Dictator to restore traditional senatorial power.
- The First Triumvirate (60 BCE): An extra-legal alliance between Pompey, Crassus, and Julius Caesar to bypass senatorial blockades.
- Crossing the Rubicon (49 BCE): Julius Caesar, facing prosecution and political eclipse upon the end of his Gallic governorship, marched his legion (Legio XIII Gemina) over the boundary river Rubicon, triggering the final civil war that ended the Republic.`
    ]
  },
  {
    id: 'doc_5',
    title: 'Financial Statement Analysis Template',
    slug: 'financial-statement-analysis-template',
    description: 'A structural financial Excel template demonstrating balance sheet calculations, income statements, cash flow ratios, and return metrics (ROE/ROIC) for tech-enabled manufacturing startups.',
    category: 'business',
    tags: ['finance', 'excel', 'startup', 'spreadsheet', 'accounting'],
    language: 'English',
    coverImage: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    fileType: 'xlsx',
    fileSize: '1.2 MB',
    totalPages: 3,
    views: 1890,
    downloads: 820,
    likes: 95,
    likedBy: ['user_2'],
    visibility: 'public',
    uploadedBy: 'user_2',
    authorName: 'Marcus Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-04-12T08:00:00-07:00',
    updatedAt: '2026-04-12T08:00:00-07:00',
    pages: [
      `[SHEET 1: INCOME STATEMENT (FY2025 - FY2026)]
---------------------------------------------------------------------
Line Item                  | FY2025 (Actual)  | FY2026 (Projected)
---------------------------------------------------------------------
Revenue                    | $4,500,000       | $8,200,000
Cost of Goods Sold (COGS)  | ($1,800,000)     | ($3,100,000)
---------------------------------------------------------------------
Gross Profit               | $2,700,000 (60%) | $5,100,000 (62.2%)
Research & Development     | ($850,000)       | ($1,400,000)
Sales & Marketing          | ($1,200,000)     | ($1,950,000)
General & Administrative   | ($450,000)       | ($680,000)
---------------------------------------------------------------------
Operating Income (EBIT)    | $200,000 (4.4%)  | $1,070,000 (13%)
Tax Expense (21%)          | ($42,000)        | ($224,700)
---------------------------------------------------------------------
Net Income                 | $158,000         | $845,300`,

      `[SHEET 2: BALANCE SHEET (As of Dec 31)]
---------------------------------------------------------------------
ASSETS                      | FY2025           | FY2026
---------------------------------------------------------------------
Cash & Equivalents          | $1,250,000       | $2,100,000
Accounts Receivable         | $320,000         | $580,000
Inventory                   | $410,000         | $750,000
Total Current Assets        | $1,980,000       | $3,430,000
Property, Plant, Equip (Net)| $850,000         | $1,200,000
---------------------------------------------------------------------
TOTAL ASSETS                | $2,830,000       | $4,630,000

LIABILITIES & EQUITY        |                  |
Accounts Payable            | $240,000         | $410,000
Short-term Debt             | $150,000         | $100,000
Total Current Liabilities   | $390,000         | $510,000
Long-term Debt              | $600,000         | $500,000
Shareholders Equity         | $1,840,000       | $3,620,000
---------------------------------------------------------------------
TOTAL LIABILITIES & EQUITY  | $2,830,000       | $4,630,000`,

      `[SHEET 3: KEY RATIOS & RATIO ANALYSIS]
---------------------------------------------------------------------
Ratio                       | Formula           | FY2025  | FY2026
---------------------------------------------------------------------
Current Ratio               | Curr. Assets/Liab | 5.08x   | 6.73x
Quick Ratio                 | (Cash+AR)/Liab    | 4.03x   | 5.25x
Inventory Turnover          | COGS/Avg Inv      | 4.39x   | 4.13x
Debt to Equity              | Total Debt/Equity | 0.41x   | 0.17x
Return on Equity (ROE)      | Net Income/Equity | 8.59%   | 23.35%
---------------------------------------------------------------------
Comments: Startup liquidity remains exceptionally strong with low leverage.
Growth projections suggest an expansion in ROE driven by operational scale.`
    ]
  },
  {
    id: 'doc_6',
    title: 'Structural Design of Cable-Stayed Bridges',
    slug: 'structural-design-of-cable-stayed-bridges',
    description: 'An engineering design handbook outlining stress-load distributions, aerodynamic wind flutter prevention, tensioning mechanisms of stay-cables, and foundation concrete calculations.',
    category: 'engineering',
    tags: ['bridge', 'structural-engineering', 'autocad', 'aerodynamics', 'handbook'],
    language: 'English',
    coverImage: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
    fileType: 'pdf',
    fileSize: '5.1 MB',
    totalPages: 3,
    views: 950,
    downloads: 180,
    likes: 38,
    likedBy: ['user_4'],
    visibility: 'public',
    uploadedBy: 'user_4',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-15T09:40:00-07:00',
    updatedAt: '2026-03-15T09:40:00-07:00',
    pages: [
      `SECTION 1: GEOMETRIC LAYOUT & STRUCTURAL PARTS
- General Layout: Cable-stayed bridges feature one or more towers (pylons) from which stay cables support the girder deck.
- Tower Configurations: H-shape, A-shape, Single-column pylon, and inverted Y-shape.
- Cable Arrangements:
  * Harp Arrangement: Cables run parallel to each other, connecting at varying heights on the pylon.
  * Fan Arrangement: All cables connect at or near the top of the tower, providing a steeper angle of inclination.
  * Semi-fan Arrangement: Compromise design spacing cable anchorages at the tower top to prevent crowding.`,

      `SECTION 2: STAY CABLE STRESS & PRE-TENSIONING
- Material Composition: High-strength, low-relaxation 7-wire steel strands, wrapped in HDPE sheathing to resist atmospheric corrosion.
- Tension Calculations: Stay forces calculated using static equilibrium of deck sections. T_i = W_i / (2 * sin θ_i).
- Pre-tensioning sequence: Tensioning is performed symmetrically in incremental phases during cantilever construction to minimize bending moments in pylons.
- Sag effect: Solved using Ernst formula adjusting the modulus of elasticity for long cables: E_eq = E / (1 + (w*L)²*E / (12*σ³)).`,

      `SECTION 3: WIND STABILITY & FLUTTER CONTROLS
- Aerodynamic Challenges: Wind tunnel testing is vital to analyze vortex-induced vibrations and aerodynamic flutter.
- Bridge Deck Cross-Section: Streamlined steel box-girders behave like inverted airfoils, creating negative lift that stabilizes the deck in high winds.
- Dynamic Dampers: Implementing Tuned Mass Dampers (TMD) inside the girders to absorb seismic and wind-induced oscillations.`
    ]
  },
  {
    id: 'doc_7',
    title: 'HTML5 & CSS3 Masterclass Syllabus',
    slug: 'html5-css3-masterclass-syllabus',
    description: 'An educational curriculum outlining structural semantics, CSS Flexbox and Grid layouts, responsive designs, custom variables, animations, and accessibility rules.',
    category: 'education',
    tags: ['web-development', 'html', 'css', 'design', 'curriculum'],
    language: 'English',
    coverImage: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    fileType: 'doc',
    fileSize: '950 KB',
    totalPages: 3,
    views: 1100,
    downloads: 320,
    likes: 56,
    likedBy: ['user_1'],
    visibility: 'public',
    uploadedBy: 'user_1',
    authorName: 'Dr. Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-05-01T15:20:00-07:00',
    updatedAt: '2026-05-01T15:20:00-07:00',
    pages: [
      `COURSE INTRODUCTION: HTML5 SEMANTICS & ACCESSIBILITY
- Understanding Semantic Elements: Replacing generic <div> boxes with <header>, <nav>, <main>, <article>, <section>, <aside>, and <footer>.
- Accessibility Standards (WCAG 2.1):
  * Proper use of alt attributes on images.
  * Maintaining heading hierarchy (H1 -> H2 -> H3) for screen readers.
  * Aria-label and role attributes for interactive custom components.
  * Keyboard navigation focus outline strategies.`,

      `UNIT 2: MODERN LAYOUTS - FLEXBOX AND GRID
- CSS Box Model: Margin, Border, Padding, and Content. Box-sizing: border-box reset.
- CSS Flexbox: One-dimensional layouts.
  * justify-content: alignment along the main axis.
  * align-items: alignment along the cross axis.
  * flex-grow, flex-shrink, and flex-basis sizing rules.
- CSS Grid: Two-dimensional layouts.
  * grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)).
  * grid-gap, grid-row, and area positioning.`,

      `UNIT 3: RESPONSIVE DESIGN & CUSTOM ANIMATIONS
- Media Queries: Mobile-first development using min-width breakpoints.
- CSS Custom Variables: Declaring variables on :root and dynamic scoping.
- CSS Transitions and Animations:
  * transition: all 0.3s ease-in-out.
  * @keyframes declarations for smooth entering slides, rotating loaders, and faded modals.`
    ]
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comm_1',
    userId: 'user_2',
    userName: 'Marcus Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    documentId: 'doc_1',
    message: 'This lecture series is incredibly clean. The explanation of Shor’s algorithm is the most straightforward I have seen anywhere! Highly recommended.',
    createdAt: '2026-01-12T15:30:00-07:00'
  },
  {
    id: 'comm_2',
    userId: 'user_3',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    documentId: 'doc_1',
    message: 'Fascinating lecture notes! The Bloch sphere visualizations are really helpful. Do you plan to add quantum cryptography notes soon?',
    createdAt: '2026-01-14T10:15:00-07:00'
  },
  {
    id: 'comm_3',
    userId: 'user_1',
    userName: 'Dr. Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    documentId: 'doc_2',
    message: 'The Slide deck layout is extremely elegant, Marcus. The CRO segment is extremely practical for our web architecture students.',
    createdAt: '2026-02-20T11:45:00-07:00'
  }
];
