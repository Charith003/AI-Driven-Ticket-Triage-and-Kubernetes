// NLP-based text classification for complaint validation and priority assignment

export interface ClassificationResult {
  isRelevant: boolean;
  priority: 'High' | 'Medium' | 'Low';
  confidence: number;
  reason: string;
  category?: string;
}

// Keywords for different priority levels
const highPriorityKeywords = [
  'urgent', 'critical', 'emergency', 'severe', 'serious', 'major',
  'not working', 'broken', 'crashed', 'error', 'failed', 'unable',
  'billing issue', 'charged', 'payment', 'account locked', 'hacked',
  'security', 'data loss', 'cannot access', 'down', 'outage'
];

const mediumPriorityKeywords = [
  'problem', 'issue', 'difficult', 'slow', 'delayed', 'bug',
  'incorrect', 'missing', 'confused', 'help needed', 'question',
  'feature', 'improvement', 'enhancement', 'request'
];

const lowPriorityKeywords = [
  'suggestion', 'feedback', 'inquiry', 'general', 'information',
  'wondering', 'could you', 'would like', 'minor', 'cosmetic'
];

// Spam/irrelevant indicators
const irrelevantIndicators = [
  'asdfasdf', 'qwerty', 'test', 'testing', '123', 'aaaaa',
  'lorem ipsum', 'sample', 'demo', 'random', 'gibberish',
  'hahaha', 'lol', 'xyz', 'blah', 'fake'
];

// Category-specific keywords
const categoryKeywords: Record<string, string[]> = {
  'Technical Issue': ['not working', 'error', 'bug', 'crash', 'broken', 'failed', 'glitch', 'freeze'],
  'Billing & Payment': ['billing', 'payment', 'charged', 'refund', 'invoice', 'subscription', 'credit card'],
  'Account Access': ['login', 'password', 'access', 'locked', 'cannot sign in', 'authentication', 'verify'],
  'Feature Request': ['feature', 'add', 'improvement', 'enhancement', 'suggestion', 'would like', 'wish'],
  'Product Quality': ['quality', 'defective', 'damaged', 'poor', 'broken product', 'malfunctioning'],
  'Customer Service': ['service', 'support', 'representative', 'agent', 'response', 'communication'],
};

/**
 * Analyzes text to determine if it's a valid complaint and assigns priority
 */
export function classifyComplaint(text: string, selectedCategory?: string): ClassificationResult {
  if (!text || text.trim().length < 10) {
    return {
      isRelevant: false,
      priority: 'Low',
      confidence: 0,
      reason: 'Text is too short to be a valid complaint (minimum 10 characters required).'
    };
  }

  const lowerText = text.toLowerCase().trim();
  
  // Check for irrelevant/spam content
  const hasIrrelevantContent = irrelevantIndicators.some(indicator => 
    lowerText.includes(indicator) || 
    isGibberish(lowerText)
  );

  if (hasIrrelevantContent) {
    return {
      isRelevant: false,
      priority: 'Low',
      confidence: 85,
      reason: 'The complaint appears to contain spam, test data, or irrelevant content. Please provide a genuine complaint.'
    };
  }

  // Check if text has meaningful words
  const wordCount = lowerText.split(/\s+/).filter(word => word.length > 2).length;
  if (wordCount < 5) {
    return {
      isRelevant: false,
      priority: 'Low',
      confidence: 80,
      reason: 'Complaint is too vague or lacks sufficient detail. Please provide more information.'
    };
  }

  // Calculate priority based on keyword matching
  let highPriorityScore = 0;
  let mediumPriorityScore = 0;
  let lowPriorityScore = 0;

  highPriorityKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) highPriorityScore += 2;
  });

  mediumPriorityKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) mediumPriorityScore += 1.5;
  });

  lowPriorityKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) lowPriorityScore += 1;
  });

  // Determine priority
  let priority: 'High' | 'Medium' | 'Low' = 'Low';
  let confidence = 60;
  let reason = '';

  if (highPriorityScore >= 2) {
    priority = 'High';
    confidence = Math.min(85 + highPriorityScore * 2, 98);
    reason = 'Detected critical keywords indicating an urgent issue requiring immediate attention.';
  } else if (mediumPriorityScore >= 1.5 || highPriorityScore >= 1) {
    priority = 'Medium';
    confidence = Math.min(75 + mediumPriorityScore * 2, 95);
    reason = 'Identified as a standard issue that needs timely resolution.';
  } else {
    priority = 'Low';
    confidence = Math.min(65 + lowPriorityScore * 2, 90);
    reason = 'Categorized as a general inquiry or minor issue.';
  }

  // Enhanced priority if category matches high-priority categories
  if (selectedCategory === 'Technical Issue' || 
      selectedCategory === 'Billing & Payment' || 
      selectedCategory === 'Account Access') {
    if (priority === 'Medium') priority = 'High';
    confidence = Math.min(confidence + 5, 98);
  }

  // Detect category from text if not provided
  let detectedCategory = selectedCategory;
  if (!detectedCategory) {
    let maxScore = 0;
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      const score = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedCategory = category;
      }
    });
  }

  return {
    isRelevant: true,
    priority,
    confidence,
    reason,
    category: detectedCategory
  };
}

/**
 * Checks if text is gibberish using simple heuristics
 */
function isGibberish(text: string): boolean {
  // Check for repeated characters
  const repeatedChars = /(.)\1{4,}/g;
  if (repeatedChars.test(text)) return true;

  // Check for lack of vowels
  const vowels = text.match(/[aeiou]/gi);
  const consonants = text.match(/[bcdfghjklmnpqrstvwxyz]/gi);
  
  if (consonants && vowels) {
    const ratio = vowels.length / consonants.length;
    // English typically has a vowel to consonant ratio between 0.3 and 0.8
    if (ratio < 0.2 || ratio > 1.5) return true;
  }

  // Check for random keyboard patterns
  const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', '123456', 'abcdef'];
  const hasPattern = keyboardPatterns.some(pattern => text.includes(pattern));
  
  return hasPattern;
}

/**
 * Validates complaint description in real-time
 */
export function validateComplaintText(text: string): {
  isValid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'success';
} {
  if (text.length < 10) {
    return {
      isValid: false,
      message: 'Please provide at least 10 characters',
      severity: 'warning'
    };
  }

  if (text.length < 20) {
    return {
      isValid: true,
      message: 'Add more details for better analysis',
      severity: 'warning'
    };
  }

  const lowerText = text.toLowerCase();
  
  // Check for spam indicators
  const hasSpam = irrelevantIndicators.some(indicator => lowerText.includes(indicator));
  if (hasSpam || isGibberish(lowerText)) {
    return {
      isValid: false,
      message: 'Text appears to be spam or irrelevant',
      severity: 'error'
    };
  }

  return {
    isValid: true,
    message: 'Looking good! Ready for AI analysis',
    severity: 'success'
  };
}
