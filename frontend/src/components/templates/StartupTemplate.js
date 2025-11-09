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
  Rocket,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

const StartupTemplate = ({ data, isPreview = false }) => {
  const {
    name = 'John Doe',
    title = 'Startup Founder',
    about = 'Entrepreneur and innovator passionate about building the next generation of technology solutions.',
    email = 'john@startup.com',
    phone = '+1 (555) 123-4567',
    location = 'San Francisco, CA',
    website = 'https://johndoe.com',
    github = 'https://github.com/johndoe',
    linkedin = 'https://linkedin.com/in/johndoe',
    experience = [],
    projects = [],
    skills = [],
    education = [],
    certifications = [],
    customSections = []
  } = data || {};

  const containerClass = isPreview ? 'max-w-6xl mx-auto' : 'min-h-screen';

  return (
    <div className={`${containerClass} bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white`}>
      {/* Hero Section */}
      <div className="relative py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Rocket className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              {name}
            </h1>
            <p className="text-2xl text-blue-200 mb-6">{title}</p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">{about}</p>
          </div>
          
          {/* Contact Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <a href={`mailto:${email}`} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
            <a href={`tel:${phone}`} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all">
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Experience */}
            {experience.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-yellow-400" />
                  Experience
                </h2>
                <div className="space-y-8">
                  {experience.map((exp, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                      <h3 className="text-xl font-semibold mb-2">{exp.title || exp.position}</h3>
                      <p className="text-yellow-400 font-medium mb-2">{exp.company || exp.organization}</p>
                      <p className="text-gray-300 text-sm mb-3">{exp.period || `${exp.startDate} - ${exp.endDate}`}</p>
                      <p className="text-gray-200">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-pink-400" />
                  Projects
                </h2>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                      <h3 className="text-xl font-semibold mb-3">{project.name || project.title}</h3>
                      <p className="text-gray-200 mb-4">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full">
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
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <Target className="w-8 h-8 text-green-400" />
                  Skills
                </h2>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{skill.name || skill}</span>
                        {skill.level && <span className="text-gray-300 text-sm">{skill.level}%</span>}
                      </div>
                      {skill.level && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <Award className="w-8 h-8 text-blue-400" />
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-2">{edu.degree || edu.title}</h3>
                      <p className="text-blue-300 font-medium mb-1">{edu.institution || edu.school}</p>
                      <p className="text-gray-300 text-sm">{edu.year || edu.period}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  Certifications
                </h2>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">{cert.name || cert}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {customSections && customSections.length > 0 && customSections.map((section) => (
              section.items && section.items.length > 0 && (
                <section key={section.id} className="col-span-full">
                  <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-yellow-400" />
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {section.items.map((item, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          {item.date && (
                            <p className="text-gray-300 text-sm">{item.date}</p>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-gray-200">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupTemplate;
