import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Star } from 'lucide-react';
import axios from 'axios';
import userService from '../../services/userService';

const ReviewForm = ({ companyId, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentUser = userService.getCurrentUser();
      const review = {
        id: `temp-${Date.now()}`,
        clientName: currentUser.name,
        rating,
        text
      };

      await axios.post(`http://localhost:8080/api/companies/${companyId}/reviews`, review);
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
              placeholder="Share your experience..."
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className={`bg-yellow-500 text-white px-6 py-2 rounded-md transition-colors
                ${
                  isSubmitting || rating === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-yellow-600'
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReviewForm.propTypes = {
  companyId: PropTypes.string.isRequired,
  onReviewSubmitted: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ReviewForm;