export const RatingDisplay: React.FC<{ rating: number; maxStars?: number }> = ({ rating, maxStars = 5 }) => {
  const stars = Array.from({ length: maxStars }, (_, index) => (index < rating ? "★" : "☆"));

  return <span className='text-yellow-500 text-sm'>{stars.join(" ")}</span>;
};
