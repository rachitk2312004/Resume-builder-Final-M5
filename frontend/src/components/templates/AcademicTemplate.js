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
  GraduationCap,
  BookOpen,
  Microscope,
  FileText,
  Users
} from 'lucide-react';

const AcademicTemplate = ({ data, isPreview = false }) => {
  const {
    name = 'Dr. John Doe',
    title = 'Research Professor',
    about = 'Distinguished researcher and educator with expertise in advanced scientific methodologies and academic excellence.',
    email = 'john.doe@university.edu',
    phone = '+1 (555) 123-4567',
    location = 'Cambridge, MA',
    website = 'https://johndoe.edu',
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
    <div className={`${containerClass} bg-white text-gray-800`}>
      {/* Academic Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{name}</h1>
              <p className="text-xl text-blue-200 mb-4">{title}</p>
              <p className="text-blue-100 max-w-2xl">{about}</p>
            </div>
            <div className="hidden md:block">
              <GraduationCap className="w-24 h-24 text-blue-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-100 py-6 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700">{email}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700">{phone}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700">{location}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700">Academic Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Academic Experience */}
            {experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  Academic Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-indigo-600 pl-6">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title || exp.position}</h3>
                      <p className="text-indigo-600 font-medium">{exp.company || exp.organization}</p>
                      <p className="text-gray-600 text-sm mb-2">{exp.period || `${exp.startDate} - ${exp.endDate}`}</p>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Research Projects */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                  <Microscope className="w-6 h-6" />
                  Research Projects
                </h2>
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name || project.title}</h3>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
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

            {/* Publications */}
            <section>
              <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Publications
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 italic">Publications will be displayed here when added to the portfolio.</p>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Research Interests */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Research Interests
                </h2>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{skill.name || skill}</span>
                      {skill.level && (
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full"
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
                <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900">{edu.degree || edu.title}</h3>
                      <p className="text-indigo-600 text-sm">{edu.institution || edu.school}</p>
                      <p className="text-gray-600 text-sm">{edu.year || edu.period}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Awards & Honors */}
            {certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Awards & Honors
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700">{cert.name || cert}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Academic Links */}
            <section>
              <h2 className="text-xl font-bold text-indigo-900 mb-4">Academic Links</h2>
              <div className="space-y-3">
                <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
                  <ExternalLink className="w-4 h-4" />
                  <span>University Profile</span>
                </a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
                  <Github className="w-4 h-4" />
                  <span>Research Code</span>
                </a>
              </div>
            </section>

            {/* Custom Sections */}
            {customSections && customSections.length > 0 && customSections.map((section) => (
              section.items && section.items.length > 0 && (
                <section key={section.id} className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6" />
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.items.map((item, index) => (
                      <div key={index} className="border-l-4 border-indigo-600 pl-6">
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

export default AcademicTemplate;
