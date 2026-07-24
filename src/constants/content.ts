export const STUDY_COUNTRIES = [
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    universities: '60+',
    description:
      'Affordable tuition, strong research programs, and pathways into Europe’s job market.',
    highlights: ['Low tuition public universities', 'Post-study work options', 'Rich cultural experience'],
  },
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    universities: '50+',
    description:
      'World-class design, fashion, engineering, and medicine programs with competitive living costs.',
    highlights: ['Design & fashion excellence', 'Scholarship opportunities', 'Student-friendly cities'],
  },
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    universities: '70+',
    description:
      'Tuition-free public universities and strong STEM programs with excellent industry links.',
    highlights: ['Often tuition-free', 'STEM & engineering focus', '18-month job seeker visa'],
  },
  {
    id: 'finland',
    name: 'Finland',
    flag: '🇫🇮',
    universities: '25+',
    description:
      'High-quality education, English-taught programs, and a safe, innovative learning environment.',
    highlights: ['English-taught degrees', 'Innovation & tech', 'High quality of life'],
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    universities: '120+',
    description:
      'Globally ranked universities, shorter degree durations, and strong graduate employability.',
    highlights: ['1-year master’s programs', 'Graduate Route visa', 'World-ranked institutions'],
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    universities: '90+',
    description:
      'Welcoming immigration pathways, co-op programs, and high-quality public universities.',
    highlights: ['PGWP pathways', 'Co-op & internships', 'Multicultural campuses'],
  },
] as const

export const UNIVERSITIES = [
  { id: '1', name: 'Sorbonne University', country: 'France', ranking: 60, focus: 'Arts & Sciences' },
  { id: '2', name: 'Politecnico di Milano', country: 'Italy', ranking: 120, focus: 'Engineering & Design' },
  { id: '3', name: 'Technical University of Munich', country: 'Germany', ranking: 37, focus: 'STEM' },
  { id: '4', name: 'University of Helsinki', country: 'Finland', ranking: 110, focus: 'Research & Innovation' },
  { id: '5', name: 'University of Manchester', country: 'United Kingdom', ranking: 32, focus: 'Business & Sciences' },
  { id: '6', name: 'University of Toronto', country: 'Canada', ranking: 21, focus: 'Multi-disciplinary' },
  { id: '7', name: 'University of Bologna', country: 'Italy', ranking: 150, focus: 'Humanities & Law' },
  { id: '8', name: 'RWTH Aachen', country: 'Germany', ranking: 100, focus: 'Engineering' },
  { id: '9', name: 'Imperial College London', country: 'United Kingdom', ranking: 6, focus: 'STEM & Medicine' },
] as const

export const PACKAGES = [
  {
    name: 'Basic',
    price: '49,999',
    currency: 'PKR',
    features: ['University Shortlisting', 'Application Guidance', 'Document Checklist', 'Email Support'],
    popular: false,
  },
  {
    name: 'Premium',
    price: '99,999',
    currency: 'PKR',
    features: [
      'Everything in Basic',
      'SOP Review',
      'Visa Application Support',
      'Interview Preparation',
      'Priority Support',
    ],
    popular: true,
  },
  {
    name: 'Elite',
    price: '149,999',
    currency: 'PKR',
    features: [
      'Everything in Premium',
      'Dedicated Counsellor',
      'Scholarship Applications',
      'Accommodation Guidance',
      'Airport Pickup Coordination',
    ],
    popular: false,
  },
] as const

export const TESTIMONIALS = [
  {
    name: 'Sara Ahmed',
    university: 'University of Toronto',
    country: 'Canada',
    content:
      'Outstanding service! They helped me secure a scholarship and guided me through the entire visa process seamlessly.',
    rating: 5,
  },
  {
    name: 'Hassan Ali',
    university: 'Monash University',
    country: 'Australia',
    content:
      'Professional, knowledgeable, and always available. I highly recommend Primexium for anyone planning to study abroad.',
    rating: 5,
  },
  {
    name: 'Fatima Noor',
    university: 'TU Munich',
    country: 'Germany',
    content:
      'Their SOP writing service was exceptional. I received my admission letter within weeks of applying.',
    rating: 5,
  },
  {
    name: 'Ahmed Raza',
    university: 'University of Manchester',
    country: 'United Kingdom',
    content:
      'From eligibility check to visa approval, the team stayed with me at every step. Truly premium consultancy.',
    rating: 5,
  },
  {
    name: 'Ayesha Khan',
    university: 'Politecnico di Milano',
    country: 'Italy',
    content:
      'I never thought studying design in Italy was possible on my budget. Primexium made it happen.',
    rating: 5,
  },
  {
    name: 'Bilal Hussain',
    university: 'University of Helsinki',
    country: 'Finland',
    content:
      'Clear guidance on scholarships and documentation. My Finland admission process was stress-free.',
    rating: 5,
  },
] as const

export { BLOG_POSTS, getBlogPostBySlug } from '@/constants/blog'
export type { BlogPost, BlogSection } from '@/constants/blog'

export const FAQS = [
  {
    question: 'How long does the study abroad process usually take?',
    answer:
      'Most students need 3–6 months depending on the country, intake, and document readiness. We map a clear timeline after your first consultation.',
  },
  {
    question: 'Do I need IELTS for every country?',
    answer:
      'Not always. Some universities accept MOI or alternative tests like PTE, TOEFL, or Duolingo. We advise based on your target programs.',
  },
  {
    question: 'Can you help with scholarships?',
    answer:
      'Yes. Our Premium and Elite packages include scholarship shortlisting and application support to reduce tuition and living costs.',
  },
  {
    question: 'What documents are required to start?',
    answer:
      'Passport, academic transcripts, degree/certificates, CV, and English proof (if available). We provide a tailored checklist after assessment.',
  },
  {
    question: 'Do you offer visa support as well?',
    answer:
      'Yes. We handle student visa filing, interview preparation, and documentation review for high approval confidence.',
  },
  {
    question: 'Is the eligibility assessment free?',
    answer:
      'Yes. Our online eligibility checker is free and gives you an instant preliminary assessment with recommended countries and next steps.',
  },
] as const

export const ABOUT_STATS = [
  { value: '5000+', label: 'Students Placed' },
  { value: '25+', label: 'Countries' },
  { value: '98%', label: 'Visa Success' },
  { value: '200+', label: 'Partner Universities' },
] as const

export const ABOUT_VALUES = [
  {
    title: 'Student-First Guidance',
    description: 'Every recommendation is tailored to your academics, budget, and long-term goals.',
  },
  {
    title: 'Transparent Process',
    description: 'Clear timelines, honest assessments, and no hidden steps throughout your journey.',
  },
  {
    title: 'End-to-End Support',
    description: 'From shortlisting to visa and arrival — one dedicated team stays with you.',
  },
] as const

export const CONSULTATION_COUNTRIES = [
  'France',
  'Italy',
  'Germany',
  'Finland',
  'United Kingdom',
  'Canada',
  'Any Suitable Country',
] as const

export const CONSULTATION_DEGREES = ["Bachelor's", "Master's", 'PhD'] as const

export const CONSULTATION_INTAKES = ['September', 'January', 'May', 'Flexible'] as const
