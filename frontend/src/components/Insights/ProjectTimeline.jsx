import React, { useState, useEffect } from "react";
import {
  Clock,
  Home,
  Building2,
  Construction,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import analyticsService from "../../services/analyticsService";

const ProjectTimeline = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("all");

  // Map project types to their icons
  const getProjectIcon = (type) => {
    switch (type.toLowerCase()) {
      case "residential":
        return <Home className="w-6 h-6" />;
      case "commercial":
        return <Building2 className="w-6 h-6" />;
      default:
        return <Construction className="w-6 h-6" />;
    }
  };

  useEffect(() => {
    const fetchProjectTimelines = async () => {
      setLoading(true);
      try {
        const response = await analyticsService.getProjectTimelines(selectedType);

        // Transform the data to match the component's requirements
        const transformedData = Object.entries(response.categories)
          .filter(([type]) => selectedType === "all" || type.toLowerCase() === selectedType.toLowerCase())
          .map(([type, stats]) => {
            // Calculate phase durations based on average duration
            const avgDuration = stats.averageDuration;
            const planningDuration = Math.round(avgDuration * 0.2);  // 20% for Planning & Approval
            const foundationDuration = Math.round(avgDuration * 0.25);  // 25% for Foundation
            const constructionDuration = Math.round(avgDuration * 0.35);  // 35% for Construction
            const finishingDuration = Math.round(avgDuration * 0.2);  // 20% for Finishing

            return {
              type,
              totalDuration: `${avgDuration} days`,
              stats: {
                totalProjects: stats.totalProjects,
                averageBudgetVariance: stats.averageBudgetVariance,
                averageDuration: stats.averageDuration
              },
              phases: [
                {
                  name: 'Planning & Approval',
                  duration: `${planningDuration} days`,
                  progress: 100
                },
                {
                  name: 'Foundation',
                  duration: `${foundationDuration} days`,
                  progress: 75
                },
                {
                  name: 'Construction',
                  duration: `${constructionDuration} days`,
                  progress: 25
                },
                {
                  name: 'Finishing',
                  duration: `${finishingDuration} days`,
                  progress: 0
                }
              ]
            };
          });

        // Add icons to the transformed data
        const dataWithIcons = transformedData.map((project) => ({
          ...project,
          icon: getProjectIcon(project.type),
        }));

        setTimelineData(dataWithIcons);
        setError(null);
      } catch (err) {
        console.error("Error fetching project timelines:", err);
        setError(
          "Failed to load project timeline data. Please try again later."
        );
        setTimelineData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectTimelines();
  }, [selectedType]);

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress > 50) return "bg-yellow-500";
    if (progress > 0) return "bg-amber-500";
    return "bg-gray-200";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-400 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Project Timelines
              </h2>
              <p className="text-white/80 mt-1 text-sm">
                Estimated duration for different project types
              </p>
            </div>
          </div>
          <div>
            <select
              className="bg-white/10 text-white border-0 rounded-lg px-3 py-2 focus:ring-2 focus:ring-white/30 focus:outline-none"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-60">
            <RefreshCw className="w-8 h-8 text-yellow-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading timeline data...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        ) : timelineData.length === 0 ? (
          <div className="bg-gray-50 text-gray-600 p-4 rounded-lg mb-6 text-center">
            <p>No timeline data available for the selected project type.</p>
          </div>
        ) : (
          timelineData.map((project) => (
            <div key={project.type} className="mb-8 last:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  {project.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {project.type}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Total: {project.totalDuration} | Projects: {project.stats.totalProjects} |
                    Avg Budget Variance: {project.stats.averageBudgetVariance.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {project.phases.map((phase, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Construction
                          className={`w-4 h-4 ${
                            phase.progress === 100
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium text-gray-700">
                          {phase.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {phase.duration}
                      </span>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(
                          phase.progress
                        )} transition-all duration-500`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>

                    {phase.progress === 100 && (
                      <div className="absolute -right-1 -top-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <span>Not Started</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
