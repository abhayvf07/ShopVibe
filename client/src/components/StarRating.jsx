import { FiStar } from 'react-icons/fi';

/**
 * StarRating — visual star display from a numeric rating
 * Shows filled/empty/half stars based on rating value
 * 
 * @param {number} rating - Rating value (0-5)
 * @param {number} size - Star icon size in pixels (default: 14)
 */
function StarRating({ rating = 0, size = 14 }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      // Full star
      stars.push(
        <FiStar
          key={i}
          size={size}
          fill="#fbbf24"
          stroke="#fbbf24"
          className="star"
        />
      );
    } else if (i === fullStars + 1 && hasHalf) {
      // Half star — rendered as full for simplicity with different opacity
      stars.push(
        <FiStar
          key={i}
          size={size}
          fill="#fbbf24"
          stroke="#fbbf24"
          className="star half"
          style={{ opacity: 0.5 }}
        />
      );
    } else {
      // Empty star
      stars.push(
        <FiStar
          key={i}
          size={size}
          className="star empty"
        />
      );
    }
  }

  return (
    <div className="star-rating">
      {stars}
    </div>
  );
}

export default StarRating;
