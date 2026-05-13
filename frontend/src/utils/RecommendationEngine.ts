import { toast } from 'react-hot-toast';

/**
 * TITAN-X AI RECOMMENDATION ENGINE
 * Analyzes user history and state to suggest optimal next-steps.
 */

export interface UserState {
  credits: number;
  lastAction?: string;
  activeProject?: any;
}

export const getAIRecommendations = (state: UserState) => {
  const recommendations: string[] = [];

  // 1. Credit-Based Growth Hack
  if (state.credits < 10) {
    recommendations.push("You're on a roll! Use code STARBOY for a 20% discount on more credits.");
  }

  // 2. Action-Based Suggestion
  if (state.lastAction === 'upload_complete') {
    recommendations.push("Neural Suggestion: Use Voice Lab to clone your identity for this project.");
  } else if (state.lastAction === 'dub_complete') {
    recommendations.push("Want to extract clear vocals? Try our AI Neural Extraction tool.");
  }

  return recommendations;
};

export const showAIRecommendationToast = (state: UserState) => {
  const recs = getAIRecommendations(state);
  if (recs.length > 0) {
    const randomRec = recs[Math.floor(Math.random() * recs.length)];
    
    // Starboy-themed toast notification
    toast.success(randomRec, {
      duration: 6000,
      icon: '🚀',
      style: {
        background: '#0A0A0B',
        color: '#fff',
        border: '1px solid #CCFF0033',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }
    });
  }
};
