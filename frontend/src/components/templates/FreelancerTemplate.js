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
  User,
  Star,
  Clock,
  DollarSign
} from 'lucide-react';

const FreelancerTemplate = ({ data, isPreview = false }) => {
  const {
    name = 'John Doe',
    title = 'Freelance Developer',
    about = 'Independent professional offering high-quality development services to clients worldwide.',
    email = 'john@freelancer.com',
    phone = '+1 (555) 123-4567',
    location = 'Remote',
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

  const containerClass = isPreview ? 'max-w-6xl mx-auto' : 'min-h-screen';

  return (
    <div className={`${containerClass} bg-gradient-to-br from-orange-50 to-yellow-50`}>
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{name}</h1>
              <p className="text-xl text-orange-600 mb-4">{title}</p>
              <p className="text-gray-600 max-w-2xl">{about}</p>
            </div>
            <div className="hidden md:block">
              <User className="w-20 h-20 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Bar */}
      <div className="bg-orange-600 text-white py-4">
        <div className="max-w-4xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{email}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{phone}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Available Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            {experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-orange-600" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{exp.title || exp.position}</h3>
                      <p className="text-orange-600 font-medium mb-2">{exp.company || exp.organization}</p>
                      <p className="text-gray-600 text-sm mb-3">{exp.period || `${exp.startDate} - ${exp.endDate}`}</p>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Featured Projects
                </h2>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name || project.title}</h3>
                      <p className="text-gray-700 mb-4">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
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
          <div className="space-y-8">
            {/* Services */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Services
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-700">Web Development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-700">Mobile Apps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-700">UI/UX Design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-700">Consulting</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  Skills
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="space-y-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{skill.name || skill}</span>
                        {skill.level && (
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  Education
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900">{edu.degree || edu.title}</h3>
                        <p className="text-orange-600 text-sm">{edu.institution || edu.school}</p>
                        <p className="text-gray-600 text-sm">{edu.year || edu.period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Social Links */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Connect</h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-3">
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                  <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-orange-600 hover:text-orange-800">
                    <ExternalLink className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Custom Sections */}
            {customSections && customSections.length > 0 && customSections.map((section) => (
              section.items && section.items.length > 0 && (
                <section key={section.id} className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-orange-600" />
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.items.map((item, index) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          {item.date && (
                            <p className="text-gray-600 text-sm">{item.date}</p>
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
      </div>
    </div>
  );
};

export default FreelancerTemplate;
