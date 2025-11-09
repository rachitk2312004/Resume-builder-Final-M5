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

const ModernTemplate = ({ data, isPreview = false }) => {
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
    <div className={`${containerClass} bg-gradient-to-br from-slate-50 to-blue-50`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{name}</h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-6">{title}</p>
              <p className="text-lg text-blue-100 max-w-2xl">{about}</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-blue-100">
                <Mail className="w-5 h-5" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <Phone className="w-5 h-5" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <MapPin className="w-5 h-5" />
                <span>{location}</span>
              </div>
              <div className="flex gap-4 mt-4">
                {github && (
                  <a href={github} target="_blank" rel="noopener noreferrer" 
                     className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer"
                     className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer"
                     className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Skills */}
            {skills.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Code className="w-6 h-6 text-blue-600" />
                  Skills
                </h2>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{skill.name || skill}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${skill.level || 85}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-800">{edu.degree || edu.title}</h3>
                      <p className="text-gray-600">{edu.institution || edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.year || edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  Certifications
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{cert.name || cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            {experience.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{exp.title || exp.position}</h3>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period || `${exp.startDate} - ${exp.endDate}`}</span>
                        </div>
                      </div>
                      <p className="text-blue-600 font-medium mb-2">{exp.company || exp.organization}</p>
                      <p className="text-gray-600 mb-3">{exp.description}</p>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {exp.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex}>{resp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Code className="w-6 h-6 text-blue-600" />
                  Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name || project.title}</h3>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                            <ExternalLink className="w-4 h-4" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Sections */}
            {customSections && customSections.length > 0 && customSections.map((section) => (
              section.items && section.items.length > 0 && (
                <div key={section.id} className="bg-white rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.items.map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                          {item.date && (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{item.date}</span>
                            </div>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-gray-600">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-300">© 2024 {name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
