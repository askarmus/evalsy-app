export type Recommendation = 'Weak Fit' | 'Needs Review' | 'Good Fit' | 'Excellent Fit';

type HiringBadgeStyle = {
  color: 'danger' | 'warning' | 'secondary' | 'success';
  text: string;
  recommendation: Recommendation;
};

type Band = {
  min: number;
  max: number;
  text: string;
  recommendation: Recommendation;
};

/**
 * Map new recommendation labels → chip colors
 */
const COLOR_BY_RECO: Record<Recommendation, HiringBadgeStyle['color']> = {
  'Weak Fit': 'danger', // 0–40
  'Needs Review': 'warning', // 41–60
  'Good Fit': 'secondary', // 61–85
  'Excellent Fit': 'success', // 86–100
};

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function pickBand(score: number, bands: Band[]): Band {
  const s = clampScore(score);
  return bands.find((b) => s >= b.min && s <= b.max)!;
}

export class HiringGradeUtil {
  static RECOMMENDATION_LABELS: Recommendation[] = ['Weak Fit', 'Needs Review', 'Good Fit', 'Excellent Fit'];

  // General hiring bands
  private static GENERAL_BANDS: Band[] = [
    { min: 0, max: 40, text: 'Weak Fit', recommendation: 'Weak Fit' },
    { min: 41, max: 60, text: 'Needs Review', recommendation: 'Needs Review' },
    { min: 61, max: 85, text: 'Good Fit', recommendation: 'Good Fit' },
    { min: 86, max: 100, text: 'Excellent Fit', recommendation: 'Excellent Fit' },
  ];

  // Technical hiring bands (stricter)
  private static TECHNICAL_BANDS: Band[] = [
    { min: 0, max: 49, text: 'Low Proficiency', recommendation: 'Weak Fit' },
    { min: 50, max: 69, text: 'Partial Proficiency', recommendation: 'Needs Review' },
    { min: 70, max: 89, text: 'Proficient', suggestion: 'Good Fit' } as any, // optional, ignore if not needed
    { min: 90, max: 100, text: 'Highly Proficient', recommendation: 'Excellent Fit' },
  ];

  /**
   * General hiring recommendation (0–100)
   */
  static getHiringRecommendation(score: number): HiringBadgeStyle {
    const band = pickBand(score, this.GENERAL_BANDS);
    return {
      color: COLOR_BY_RECO[band.recommendation],
      text: band.text,
      recommendation: band.recommendation,
    };
  }

  /**
   * Technical hiring recommendation (stricter)
   */
  static getTechnicalHiringGrade(score: number): HiringBadgeStyle {
    const band = pickBand(score, this.TECHNICAL_BANDS);
    return {
      color: COLOR_BY_RECO[band.recommendation],
      text: band.text,
      recommendation: band.recommendation,
    };
  }
}
