type Recommendation = 'Reject' | 'Borderline' | 'Hire' | 'Strong Hire';

type HiringBadgeStyle = {
  color: 'danger' | 'warning' | 'secondary' | 'success';
  text: string;
  recommendation?: Recommendation;
};

type Band = {
  min: number; // inclusive
  max: number; // inclusive
  text: string;
  recommendation: Recommendation;
};

const COLOR_BY_RECO: Record<Recommendation, HiringBadgeStyle['color']> = {
  Reject: 'danger',
  Borderline: 'warning',
  Hire: 'secondary',
  'Strong Hire': 'success',
};

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  if (score < 0) return 0;
  if (score > 100) return 100;
  return Math.round(score); // optional: round to nearest int
}

function pickBand(score: number, bands: Band[]): Band {
  const s = clampScore(score);
  // Assumes non-overlapping, inclusive bands covering 0–100
  return bands.find((b) => s >= b.min && s <= b.max)!;
}

export class HiringGradeUtil {
  static RECOMMENDATION_LABELS: Recommendation[] = ['Reject', 'Borderline', 'Hire', 'Strong Hire'];

  // General assessments
  private static GENERAL_BANDS: Band[] = [
    { min: 0, max: 40, text: 'Weak Fit', recommendation: 'Reject' },
    { min: 41, max: 60, text: 'Needs Review', recommendation: 'Borderline' },
    { min: 61, max: 85, text: 'Good Fit', recommendation: 'Hire' },
    { min: 86, max: 100, text: 'Excellent Fit', recommendation: 'Strong Hire' },
  ];

  // Technical assessments (stricter)
  private static TECHNICAL_BANDS: Band[] = [
    { min: 0, max: 49, text: 'Low Proficiency', recommendation: 'Reject' },
    { min: 50, max: 69, text: 'Partial Proficiency', recommendation: 'Borderline' },
    { min: 70, max: 89, text: 'Proficient', recommendation: 'Hire' },
    { min: 90, max: 100, text: 'Highly Proficient', recommendation: 'Strong Hire' },
  ];

  /**
   * General hiring recommendation (0–100)
   * - 0–40: Reject
   * - 41–60: Borderline
   * - 61–85: Hire
   * - 86–100: Strong Hire
   */
  static getHiringRecommendation(score: number): HiringBadgeStyle {
    const band = pickBand(score, this.GENERAL_BANDS);
    return { color: COLOR_BY_RECO[band.recommendation], text: band.text, recommendation: band.recommendation };
  }

  /**
   * Technical hiring recommendation (stricter, 0–100)
   * - 0–49: Reject
   * - 50–69: Borderline
   * - 70–89: Hire
   * - 90–100: Strong Hire
   */
  static getTechnicalHiringGrade(score: number): HiringBadgeStyle {
    const band = pickBand(score, this.TECHNICAL_BANDS);
    return { color: COLOR_BY_RECO[band.recommendation], text: band.text, recommendation: band.recommendation };
  }
}
