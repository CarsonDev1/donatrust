import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, index }) => {
  // Calculate progress percentage from project data
  const progressPercentage =
    project.current_amount && project.goal_amount
      ? Math.round((project.current_amount / project.goal_amount) * 100)
      : 0;

  // Format currency values
  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-sm mx-auto">
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image_url || project.image || '/images/img_image_18.png'}
          alt={project.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/images/img_image_18.png';
          }}
        />

        {/* Heart Icon */}
        <button className="absolute top-3 left-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
          <svg
            className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full">
          <span className="text-xs font-medium">{project.category || 'General'}</span>
        </div>

        {/* Organization Avatar */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <img
            src={project.charity?.logo_url || project.avatar || '/images/img_ellipse_8.png'}
            alt="Organization"
            className="w-12 h-12 rounded-full border-4 border-white shadow-md bg-white"
            onError={(e) => {
              e.target.src = '/images/img_ellipse_8.png';
            }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-8 px-6 pb-6">
        {/* Organization Name */}
        <p className="text-sm text-gray-600 text-center mb-2 font-medium">
          {project.charity?.name || project.organization || 'Unknown Organization'}
        </p>

        {/* Project Title */}
        <h3 className="text-lg font-bold text-gray-900 text-center mb-4 line-clamp-2 leading-tight">
          {project.title}
        </h3>

        {/* Progress Section */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Progress Stats */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">
              {formatCurrency(project.current_amount || 0)} VND
            </span>
            <span className="text-pink-500 font-bold">{progressPercentage}%</span>
          </div>

          {/* Goal */}
          <p className="text-xs text-gray-500 text-center">
            with the goal of{' '}
            <span className="font-semibold">{formatCurrency(project.goal_amount || 0)} VND</span>
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6 text-center">
          <Link
            to={`/campaign/${project.campaign_id || project.id}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
          >
            <span>Detail</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
