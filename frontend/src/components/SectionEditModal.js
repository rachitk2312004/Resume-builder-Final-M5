import React, { useEffect, useState } from 'react';
import Modal from './Modal';

export default function SectionEditModal({ open, onClose, section, onSave }) {
  const safeSection = section || { title: '', items: [] };
  const [textValue, setTextValue] = useState('');
  const [skillsValue, setSkillsValue] = useState('');
  const [entries, setEntries] = useState([]);
  // Personal Info states
  const [piName, setPiName] = useState('');
  const [piTitle, setPiTitle] = useState('');
  const [piEmail, setPiEmail] = useState('');
  const [piPhone, setPiPhone] = useState('');
  const [piLocation, setPiLocation] = useState('');
  const [piExtras, setPiExtras] = useState([]);

  const typeKey = (safeSection.title || '').toLowerCase();
  const isPersonal = typeKey === 'personal information';
  const isTextOnly = ['summary', 'objective', 'career objective'].includes(typeKey);
  const isSkills = typeKey.includes('skills');
  const isListItem = !isTextOnly && !isSkills && !isPersonal;

  useEffect(() => {
    const items = Array.isArray(safeSection.items) ? safeSection.items : [];
    if (isPersonal) {
      const obj = items[0] || {};
      setPiName(obj.name || '');
      setPiTitle(obj.title || '');
      setPiEmail(obj.email || '');
      setPiPhone(obj.phone || '');
      setPiLocation(obj.location || '');
      setPiExtras(Array.isArray(obj.extras) ? obj.extras : []);
      setTextValue('');
      setSkillsValue('');
      setEntries([]);
    } else if (isTextOnly) {
      setTextValue(items[0] || '');
      setSkillsValue('');
      setEntries([]);
    } else if (isSkills) {
      setSkillsValue(items.join(', '));
      setTextValue('');
      setEntries([]);
    } else if (isListItem) {
      const mapped = items.length ? items.map(it => ({
        role: it.role || it.title || '',
        company: it.company || '',
        startDate: it.startDate || '',
        endDate: it.endDate || '',
        description: it.description || '',
        bullets: Array.isArray(it.bullets) ? it.bullets : []
      })) : [{ role: '', company: '', startDate: '', endDate: '', description: '', bullets: [] }];
      setEntries(mapped);
      setTextValue('');
      setSkillsValue('');
    }
  }, [open, safeSection.title, isPersonal, isTextOnly, isSkills, isListItem]);

  const addEntry = () => setEntries([...entries, { role: '', company: '', startDate: '', endDate: '', description: '', bullets: [] }]);
  const removeEntry = (idx) => setEntries(entries.filter((_, i) => i !== idx));
  const updateEntry = (idx, field, value) => {
    const copy = entries.slice();
    copy[idx] = { ...copy[idx], [field]: value };
    setEntries(copy);
  };
  const addBullet = (idx) => {
    const copy = entries.slice();
    copy[idx] = { ...copy[idx], bullets: [...(copy[idx].bullets || []), ''] };
    setEntries(copy);
  };
  const updateBullet = (idx, bIdx, value) => {
    const copy = entries.slice();
    const bullets = copy[idx].bullets.slice();
    bullets[bIdx] = value;
    copy[idx].bullets = bullets;
    setEntries(copy);
  };
  const removeBullet = (idx, bIdx) => {
    const copy = entries.slice();
    const bullets = copy[idx].bullets.slice();
    bullets.splice(bIdx, 1);
    copy[idx].bullets = bullets;
    setEntries(copy);
  };

  const handleSave = () => {
    let newItems = [];
    if (isPersonal) {
      newItems = [{ name: piName, title: piTitle, email: piEmail, phone: piPhone, location: piLocation, extras: piExtras }];
    } else if (isTextOnly) {
      newItems = [textValue];
    } else if (isSkills) {
      newItems = skillsValue.split(',').map(s => s.trim()).filter(Boolean);
    } else if (isListItem) {
      newItems = entries.map(e => ({
        role: e.role,
        title: e.role, // ensure compatibility
        company: e.company,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description,
        bullets: e.bullets.filter(Boolean)
      }));
    }
    onSave({ ...safeSection, items: newItems });
    onClose();
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit ${safeSection.title}`}
      size="xl"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">Save</button>
        </>
      }
    >
      <div className="space-y-6">
        {isPersonal && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input className="input-field" value={piName} onChange={(e) => setPiName(e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input className="input-field" value={piTitle} onChange={(e) => setPiTitle(e.target.value)} placeholder="Software Engineer" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input className="input-field" type="email" value={piEmail} onChange={(e) => setPiEmail(e.target.value)} placeholder="john.doe@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input className="input-field" value={piPhone} onChange={(e) => setPiPhone(e.target.value)} placeholder="+1 555-123-4567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input className="input-field" value={piLocation} onChange={(e) => setPiLocation(e.target.value)} placeholder="San Francisco, CA" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h4 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">Social Links & Profiles</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setPiExtras([...piExtras, { label: 'LinkedIn', value: '', icon: 'linkedin' }])}>+ LinkedIn</button>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setPiExtras([...piExtras, { label: 'GitHub', value: '', icon: 'github' }])}>+ GitHub</button>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setPiExtras([...piExtras, { label: 'Portfolio', value: '', icon: 'globe' }])}>+ Portfolio</button>
                  <button className="btn-secondary text-xs px-3 py-1.5" onClick={() => setPiExtras([...piExtras, { label: 'Custom', value: '', icon: 'link' }])}>+ Custom</button>
                </div>
              </div>
              <div className="space-y-4">
                {piExtras.map((ex, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-start">
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select className="input-field" value={ex.icon || 'link'} onChange={(e) => {
                          const copy = piExtras.slice();
                          const newIcon = e.target.value;
                          copy[i] = { ...copy[i], icon: newIcon };
                          // Auto-update label based on selection
                          if (newIcon === 'linkedin' && !copy[i].label) copy[i].label = 'LinkedIn';
                          else if (newIcon === 'github' && !copy[i].label) copy[i].label = 'GitHub';
                          else if (newIcon === 'globe' && !copy[i].label) copy[i].label = 'Portfolio';
                          else if (newIcon === 'twitter' && !copy[i].label) copy[i].label = 'Twitter';
                          else if (newIcon === 'dribbble' && !copy[i].label) copy[i].label = 'Dribbble';
                          setPiExtras(copy);
                        }}>
                          <option value="linkedin">LinkedIn</option>
                          <option value="github">GitHub</option>
                          <option value="globe">Website</option>
                          <option value="twitter">Twitter</option>
                          <option value="dribbble">Dribbble</option>
                          <option value="link">Other</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                        <input className="input-field" value={ex.label || ''} onChange={(e) => {
                          const copy = piExtras.slice();
                          copy[i] = { ...copy[i], label: e.target.value };
                          setPiExtras(copy);
                        }} placeholder={ex.icon === 'linkedin' ? 'LinkedIn' : ex.icon === 'github' ? 'GitHub' : ex.icon === 'globe' ? 'Portfolio' : 'Custom Label'} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input className="input-field" value={ex.value || ''} onChange={(e) => {
                          const copy = piExtras.slice();
                          copy[i] = { ...copy[i], value: e.target.value };
                          setPiExtras(copy);
                        }} placeholder={ex.icon === 'linkedin' ? 'linkedin.com/in/username' : ex.icon === 'github' ? 'github.com/username' : 'https://...'} />
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium" onClick={() => {
                        const copy = piExtras.slice();
                        copy.splice(i, 1);
                        setPiExtras(copy);
                      }}>Remove</button>
                    </div>
                  </div>
                ))}
                {piExtras.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Add social profiles and links to appear in your resume header
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isTextOnly && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">Content</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
              <textarea 
                value={textValue} 
                onChange={(e) => setTextValue(e.target.value)} 
                rows={8} 
                className="input-field" 
                placeholder="Enter summary or objective..."
              />
            </div>
          </div>
        )}

        {isSkills && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">Skills</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
              <input 
                type="text" 
                value={skillsValue} 
                onChange={(e) => setSkillsValue(e.target.value)} 
                className="input-field" 
                placeholder="e.g. JavaScript, React, Node.js, Python, SQL, Git"
              />
              <p className="text-sm text-gray-500 mt-2">Separate each skill with a comma. They will be displayed as individual tags.</p>
            </div>
          </div>
        )}

        {isListItem && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">Entries</h4>
            </div>
            
            {entries.map((entry, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-sm font-semibold text-gray-800">Entry {idx + 1}</h5>
                  <button className="btn-danger text-sm" onClick={() => removeEntry(idx)}>Remove Entry</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role/Title</label>
                    <input className="input-field" value={entry.role} onChange={(e) => updateEntry(idx, 'role', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
                    <input className="input-field" value={entry.company} onChange={(e) => updateEntry(idx, 'company', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input className="input-field" value={entry.startDate} onChange={(e) => updateEntry(idx, 'startDate', e.target.value)} placeholder="e.g. Jan 2020" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input className="input-field" value={entry.endDate} onChange={(e) => updateEntry(idx, 'endDate', e.target.value)} placeholder="e.g. Dec 2022 or Present" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea className="input-field" rows={3} value={entry.description} onChange={(e) => updateEntry(idx, 'description', e.target.value)} placeholder="Brief description of the role or project..." />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                    <button className="btn-secondary text-sm" onClick={() => addBullet(idx)}>+ Add Bullet</button>
                  </div>
                  <div className="space-y-3">
                    {(entry.bullets || []).map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-3 flex-shrink-0"></div>
                        <div className="flex-1">
                          <input 
                            className="input-field" 
                            value={b} 
                            onChange={(e) => updateBullet(idx, bIdx, e.target.value)} 
                            placeholder="e.g. Achieved 25% improvement in system performance through optimization"
                          />
                        </div>
                        <button className="btn-secondary text-sm px-3 py-2 flex-shrink-0" onClick={() => removeBullet(idx, bIdx)}>Remove</button>
                      </div>
                    ))}
                    {(!entry.bullets || entry.bullets.length === 0) && (
                      <p className="text-sm text-gray-500 text-center py-4">No bullet points yet. Add some key achievements or responsibilities.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center pt-4 border-t border-gray-200">
              <button className="btn-secondary" onClick={addEntry}>+ Add Another Entry</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
