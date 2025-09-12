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
  Palette
} from 'lucide-react';

const CreativeTemplate = ({ data, isPreview = false }) => {
  const {
    name = 'John Doe',
    title = 'Creative Designer',
    about = 'Passionate creative designer with 5+ years of experience in visual design and user experience.',
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
    <div className={`${containerClass} bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50`}>
      {/* Header Section */}
      <div className="relative overflow-hidden py-20 px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            {name}
          </h1>
          <p className="text-2xl md:text-3xl text-yellow-200 mb-8">{title}</p>
          <p className="text-xl text-white max-w-3xl mx-auto mb-12">{about}</p>
          
          <div className="flex flex-wrap justify-center gap-8 text-white">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <a href={`mailto:${email}`} className="hover:text-yellow-300 transition-colors">
                {email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <span>{location}</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mt-8">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" 
                 className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Github className="w-6 h-6" />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer"
                 className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer"
                 className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <ExternalLink className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Skills */}
            {skills.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Palette className="w-6 h-6 text-purple-600" />
                  Skills
                </h2>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{skill.name || skill}</span>
                        <span className="text-purple-600 font-bold">{skill.level || 85}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
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
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-purple-600" />
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="relative">
                      <div className="absolute left-0 top-0 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <div className="pl-8">
                        <h3 className="font-bold text-gray-800">{edu.degree || edu.title}</h3>
                        <p className="text-gray-600">{edu.institution || edu.school}</p>
                        <p className="text-sm text-purple-600 font-medium">{edu.year || edu.period}</p>
                      </div>
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
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                  Experience
                </h2>
                <div className="space-y-8">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative pl-8">
                      <div className="absolute left-0 top-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-transparent"></div>
                      
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{exp.title || exp.position}</h3>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period || `${exp.startDate} - ${exp.endDate}`}</span>
                        </div>
                      </div>
                      <p className="text-purple-600 font-semibold mb-3">{exp.company || exp.organization}</p>
                      <p className="text-gray-700 mb-4">{exp.description}</p>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
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
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <Code className="w-6 h-6 text-purple-600" />
                  Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">{project.name || project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm font-medium">
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer"
                             className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm font-medium">
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl">© 2024 {name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
