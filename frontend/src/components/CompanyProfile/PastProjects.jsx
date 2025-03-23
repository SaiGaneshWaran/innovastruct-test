import PropTypes from 'prop-types';
import { Image } from 'lucide-react';

const PastProjects = ({ projects }) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Past Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="card bg-base-100 shadow-xl">
            <figure className="h-48">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-300" />
                </div>
              )}
            </figure>
            <div className="card-body">
              <h3 className="card-title">{project.title}</h3>
              <p>{project.description}</p>
              <div className="text-sm text-gray-600">
                Completed: {project.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

PastProjects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.string,  // Made optional
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PastProjects;
