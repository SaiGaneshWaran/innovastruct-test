import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Star, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';
import ReviewForm from './ReviewForm';
import userService from '../../services/userService';
import { useLocation } from 'react-router-dom';

const ClientReviews = ({ reviews, companyId, onReviewAdded }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const currentUser = userService.getCurrentUser();
  const isClient = currentUser?.role === 'CLIENT';
  const location = useLocation();
  const isClientView = location.pathname.includes('/client/');

  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return {
      totalReviews,
      averageRating,
      ratingDistribution
    };
  }, [reviews]);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const difference = star - rating;
          let starColor = '';

          if (difference <= 0) {
            // Full star
            starColor = 'text-yellow-400';
          } else if (difference > 0 && difference < 1) {
            // Half star
            return (
              <div key={star} className="relative">
                <Star className="w-5 h-5 text-gray-300" fill="currentColor" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                </div>
              </div>
            );
          } else {
            // Empty star
            starColor = 'text-gray-300';
          }

          return (
            <Star
              key={star}
              className={`w-5 h-5 ${starColor}`}
              fill="currentColor"
            />
          );
        })}
      </div>
    );
  };

  const renderRatingBar = (count, total) => {
    const percentage = (count / total) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-yellow-400 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    if (onReviewAdded) {
      onReviewAdded();
    }
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Client Reviews</h2>
        {isClient && isClientView && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Write a Review
          </button>
        )}
      </div>

      {stats && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating Overview */}
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="mb-2">{renderStars(stats.averageRating)}</div>
              <div className="text-gray-600">
                Based on {stats.totalReviews} reviews
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="col-span-2">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="w-12 text-sm text-gray-600">
                      {rating} {rating === 1 ? 'star' : 'stars'}
                    </div>
                    <div className="flex-1">
                      {renderRatingBar(stats.ratingDistribution[rating], stats.totalReviews)}
                    </div>
                    <div className="w-12 text-sm text-gray-600 text-right">
                      {stats.ratingDistribution[rating]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {review.clientName}
                    </h3>
                    <div className="flex items-center gap-4">
                      {renderStars(review.rating)}
                      <span className="text-yellow-500 font-semibold">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {isClientView ? "No reviews yet. Be the first to review!" : "No reviews yet."}
            </p>
          </div>
        )}
      </div>

      {showReviewForm && (
        <ReviewForm
          companyId={companyId}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={() => setShowReviewForm(false)}
        />
      )}
    </section>
  );
};

ClientReviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      clientName: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      date: PropTypes.string
    })
  ).isRequired,
  companyId: PropTypes.string.isRequired,
  onReviewAdded: PropTypes.func
};

export default ClientReviews;