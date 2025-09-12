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
  Briefcase,
  Terminal
} from 'lucide-react';

const DeveloperTemplate = ({ data, isPreview = false }) => {
  const {
    name = 'John Doe',
    title = 'Full Stack Developer',
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
    certifications = []
  } = data || {};

  const containerClass = isPreview ? 'max-w-6xl mx-auto' : 'min-h-screen';

  return (
    <div className={`${containerClass} bg-gray-900 text-green-400 font-mono`}>
      {/* Terminal Header */}
      <div className="bg-black border-b border-green-500 py-4 px-6">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-green-400 text-sm">Terminal - Portfolio</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gray-800 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-400 mb-2">$ {name}</h1>
            <p className="text-xl text-green-300 mb-8">{title}</p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">{about}</p>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${email}`} className="hover:text-green-400 transition-colors">
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
                   className="text-gray-400 hover:text-green-400 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-green-400 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-green-400 transition-colors">
                  <ExternalLink className="w-6 h-6" />
                </a>
              )}
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
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  $ skills
                </h2>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">{skill.name || skill}</span>
                        <span className="text-green-400 text-sm">{skill.level || 85}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
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
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  $ education
                </h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-300">{edu.degree || edu.title}</h3>
                      <p className="text-gray-400">{edu.institution || edu.school}</p>
                      <p className="text-sm text-green-400">{edu.year || edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  $ certifications
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">{cert.name || cert}</span>
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
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  $ experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-green-500 pl-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-300">{exp.title || exp.position}</h3>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{exp.period || `${exp.startDate} - ${exp.endDate}`}</span>
                        </div>
                      </div>
                      <p className="text-green-400 font-medium mb-2">{exp.company || exp.organization}</p>
                      <p className="text-gray-400 mb-3">{exp.description}</p>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
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
              <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  $ projects
                </h2>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-300">{project.name || project.title}</h3>
                        <div className="flex gap-4">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-green-400 text-sm flex items-center gap-1">
                              <Github className="w-4 h-4" />
                              Code
                            </a>
                          )}
                          {project.demo && (
                            <a href={project.demo} target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-green-400 text-sm flex items-center gap-1">
                              <ExternalLink className="w-4 h-4" />
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 mb-3">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black border-t border-green-500 py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">© 2024 {name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTemplate;
