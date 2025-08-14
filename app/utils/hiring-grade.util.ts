type HiringBadgeStyle = {
  color: 'danger' | 'warning' | 'secondary' | 'success';
  text: string;
  recommendation?: 'Reject' | 'Borderline' | 'Hire' | 'Strong Hire'; // Optional actionable label
};

export class HiringGradeUtil {
  static RECOMMENDATION_LABELS: Array<'Reject' | 'Borderline' | 'Hire' | 'Strong Hire'> = ['Reject', 'Borderline', 'Hire', 'Strong Hire'];

  /**
   * Evaluates a candidate's score (0-100) and returns a hiring recommendation badge.
   * - 0-40: Reject
   * - 41-60: Borderline
   * - 61-85: Hire
   * - 86-100: Strong Hire
   */
  static getHiringRecommendation(score: number): HiringBadgeStyle {
    if (score <= 40) {
      return { color: 'danger', text: 'Weak Fit', recommendation: 'Reject' };
    } else if (score <= 60) {
      return { color: 'warning', text: 'Needs Review', recommendation: 'Borderline' };
    } else if (score <= 85) {
      return { color: 'secondary', text: 'Good Fit', recommendation: 'Hire' };
    } else {
      return { color: 'success', text: 'Excellent Fit', recommendation: 'Strong Hire' };
    }
  }

  /**
   * For technical assessments (stricter grading).
   * - 0-49: Reject (below minimum bar)
   * - 50-69: Borderline (weak but passable)
   * - 70-89: Hire (meets expectations)
   * - 90+: Strong Hire (exceptional)
   */
  static getTechnicalHiringGrade(score: number): HiringBadgeStyle {
    if (score < 50) return { color: 'danger', text: 'Low Proficiency', recommendation: 'Reject' };
    if (score < 70) return { color: 'secondary', text: 'Partial Proficiency', recommendation: 'Borderline' };
    if (score < 90) return { color: 'warning', text: 'Proficient', recommendation: 'Hire' };
    return { color: 'success', text: 'Highly Proficient', recommendation: 'Strong Hire' };
  }
}
