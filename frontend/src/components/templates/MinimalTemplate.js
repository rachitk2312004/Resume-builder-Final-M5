import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  ExternalLink,
  Calendar,
  Award,
  Code,
  Briefcase
} from 'lucide-react';

const MinimalTemplate = ({ data, isPreview = false }) => {
  const {
    name = 'John Doe',
    title = 'Software Engineer',
    about = 'Passionate software engineer with 5+ years of experience building scalable web applications.',
    email = 'john.doe@email.com',
    phone = '+1 (555) 123-4567',
    location = 'San Francisco, CA',
    website = 'https://johndoe.dev',
    github = 'https://github.com/johndoe',
    linkedin = 'https://linkedin.com/in/johndoe',
    experience = [],
    projects = [],
    skills = [],
    education = [],
    certifications = [],
    customSections = []
  } = data || {};

  const containerClass = isPreview ? 'max-w-4xl mx-auto' : 'min-h-screen';

  return (
    <div className={`${containerClass} bg-white`}>
      {/* Header Section */}
      <div className="border-b border-gray-200 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-2">{name}</h1>
            <p className="text-xl text-gray-600 mb-8">{title}</p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">{about}</p>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${email}`} className="hover:text-gray-900 transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-6">
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-gray-900 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer"
                   className="text-gray-600 hover:text-gray-900 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer"
                   className="text-gray-600 hover:text-gray-900 transition-colors">
                  <ExternalLink className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-12">
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">
                Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <h3 className="text-xl font-medium text-gray-900">{exp.title || exp.position}</h3>
                      <span className="text-gray-500 text-sm">{exp.period || `${exp.startDate} - ${exp.endDate}`}</span>
                    </div>
                    <p className="text-gray-600 font-medium">{exp.company || exp.organization}</p>
                    <p className="text-gray-700">{exp.description}</p>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                        {exp.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">
                Projects
              </h2>
              <div className="space-y-8">
                {projects.map((project, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <h3 className="text-xl font-medium text-gray-900">{project.name || project.title}</h3>
                      <div className="flex gap-4">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer"
                             className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer"
                             className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full">
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-900">{edu.degree || edu.title}</h3>
                    <p className="text-gray-600">{edu.institution || edu.school}</p>
                    <p className="text-gray-500 text-sm">{edu.year || edu.period}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <p key={index} className="text-gray-700">{cert.name || cert}</p>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections && customSections.length > 0 && customSections.map((section) => (
            section.items && section.items.length > 0 && (
              <section key={section.id}>
                <h2 className="text-2xl font-light text-gray-900 mb-8 border-b border-gray-200 pb-2">
                  {section.title}
                </h2>
                <div className="space-y-8">
                  {section.items.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <h3 className="text-xl font-medium text-gray-900">{item.title}</h3>
                        {item.date && (
                          <span className="text-gray-500 text-sm">{item.date}</span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-700">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-8 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500">© 2024 {name}</p>
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;
