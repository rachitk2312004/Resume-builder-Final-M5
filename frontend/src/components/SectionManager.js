import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash2, Edit3, GripVertical, FileText } from 'lucide-react';
import Modal from './Modal';
import SectionEditModal from './SectionEditModal';

export default function SectionManager({ sections, setSections }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionColumn, setNewSectionColumn] = useState('right');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editingContentIdx, setEditingContentIdx] = useState(null);
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceId = result.draggableId;
    const destDroppableId = result.destination.droppableId;
    const destIndex = result.destination.index; // index within the destination column list

    const current = Array.from(sections);
    const srcGlobalIndex = current.findIndex(s => String(s.id) === String(sourceId));
    if (srcGlobalIndex === -1) return;

    const [moved] = current.splice(srcGlobalIndex, 1);

    // Determine destination column
    const destColumn = destDroppableId === 'left-column' ? 'left' : 'right';
    moved.column = destColumn;

    // Build destination list (based on updated current without moved)
    const destList = current
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => (s.column || 'right') === destColumn);

    // Find global insertion index corresponding to destIndex
    let insertAt;
    if (destIndex >= destList.length) {
      // Insert after the last item of that column (or at end if none)
      if (destList.length === 0) {
        insertAt = current.length; // append
      } else {
        const lastGlobal = destList[destList.length - 1].i;
        insertAt = lastGlobal + 1;
      }
    } else {
      insertAt = destList[destIndex].i;
    }

    current.splice(insertAt, 0, moved);
    setSections(current);
  };

  const addSection = () => {
    setIsAddOpen(true);
  };
  const confirmAdd = () => {
    const title = (newSectionName || '').trim();
    if (!title) return;
    setSections([ ...sections, { id: `${Date.now()}`, title, column: newSectionColumn, items: [] } ]);
    setNewSectionName('');
    setNewSectionColumn('right');
    setIsAddOpen(false);
  };
  const cancelAdd = () => {
    setNewSectionName('');
    setNewSectionColumn('right');
    setIsAddOpen(false);
  };

  const renameSection = (idx) => {
    setEditingIdx(idx);
  };

  const removeSection = (idx) => {
    const isPI = (sections[idx]?.title || '').toLowerCase() === 'personal information';
    if (isPI) return; // cannot delete Personal Information
    if (!window.confirm('Remove section?')) return;
    const next = sections.slice();
    next.splice(idx, 1);
    setSections(next);
  };

  return (
    <>
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
        <button onClick={addSection} className="btn-secondary">
          <Plus className="w-4 h-4 mr-2" /> Add Section
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 bg-blue-50 px-3 py-2 rounded border border-blue-200">
              Left Column
              <span className="text-xs font-normal text-gray-500 ml-2">
                ({sections.filter(s => (s.column || 'right') === 'left').length} sections)
              </span>
            </h4>
            <Droppable droppableId="left-column">
              {(provided, snapshot) => (
                <ul 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className={`space-y-2 min-h-[120px] p-3 rounded border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {sections
                    .map((section, globalIndex) => ({ section, globalIndex }))
                    .filter(({ section }) => (section.column || 'right') === 'left')
                    .map(({ section, globalIndex }, localIndex) => (
                      <Draggable key={section.id} draggableId={String(section.id)} index={localIndex}>
                        {(provided, snapshot) => (
                          <li 
                            ref={provided.innerRef} 
                            {...provided.draggableProps} 
                            className={`w-full bg-white rounded-lg border border-gray-200 px-3 py-2.5 transition-all duration-200 ${
                              snapshot.isDragging 
                                ? 'shadow-xl ring-2 ring-primary-200 border-primary-300' 
                                : 'shadow-sm hover:shadow-md hover:border-gray-300'
                            }`}
                          >
                            {/* Header with drag handle and section title */}
                            <div className="flex items-start gap-3 mb-2.5">
                              <span {...provided.dragHandleProps} className="text-gray-400 cursor-grab hover:text-gray-600 mt-0.5 flex-shrink-0">
                                <GripVertical className="w-4 h-4" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-gray-900 leading-relaxed break-words">
                                  {section.title}
                                </h3>
                              </div>
                            </div>
                            
                            {/* Action buttons row */}
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => renameSection(globalIndex)} 
                                className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                title="Rename section"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setEditingContentIdx(globalIndex)} 
                                className="inline-flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit content"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => removeSection(globalIndex)} 
                                disabled={(section.title || '').toLowerCase() === 'personal information'} 
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                                  ((section.title || '').toLowerCase() === 'personal information') 
                                    ? 'opacity-40 cursor-not-allowed text-gray-400' 
                                    : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                                }`}
                                title={((section.title || '').toLowerCase() === 'personal information') ? 'Cannot delete Personal Information' : 'Delete section'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  {sections.filter(s => (s.column || 'right') === 'left').length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Drag sections here for the left column
                    </div>
                  )}
                </ul>
              )}
            </Droppable>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 bg-green-50 px-3 py-2 rounded border border-green-200">
              Right Column
              <span className="text-xs font-normal text-gray-500 ml-2">
                ({sections.filter(s => (s.column || 'right') === 'right').length} sections)
              </span>
            </h4>
            <Droppable droppableId="right-column">
              {(provided, snapshot) => (
                <ul 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className={`space-y-2 min-h-[120px] p-3 rounded border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver ? 'border-green-400 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  {sections
                    .map((section, globalIndex) => ({ section, globalIndex }))
                    .filter(({ section }) => (section.column || 'right') === 'right')
                    .map(({ section, globalIndex }, localIndex) => (
                      <Draggable key={section.id} draggableId={String(section.id)} index={localIndex}>
                        {(provided, snapshot) => (
                          <li 
                            ref={provided.innerRef} 
                            {...provided.draggableProps} 
                            className={`w-full bg-white rounded-lg border border-gray-200 px-3 py-2.5 transition-all duration-200 ${
                              snapshot.isDragging 
                                ? 'shadow-xl ring-2 ring-primary-200 border-primary-300' 
                                : 'shadow-sm hover:shadow-md hover:border-gray-300'
                            }`}
                          >
                            {/* Header with drag handle and section title */}
                            <div className="flex items-start gap-3 mb-3">
                              <span {...provided.dragHandleProps} className="text-gray-400 cursor-grab hover:text-gray-600 mt-0.5 flex-shrink-0">
                                <GripVertical className="w-4 h-4" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-gray-900 leading-relaxed break-words">
                                  {section.title}
                                </h3>
                              </div>
                            </div>
                            
                            {/* Action buttons row */}
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => renameSection(globalIndex)} 
                                className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                title="Rename section"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setEditingContentIdx(globalIndex)} 
                                className="inline-flex items-center justify-center w-8 h-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit content"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => removeSection(globalIndex)} 
                                disabled={(section.title || '').toLowerCase() === 'personal information'} 
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                                  ((section.title || '').toLowerCase() === 'personal information') 
                                    ? 'opacity-40 cursor-not-allowed text-gray-400' 
                                    : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                                }`}
                                title={((section.title || '').toLowerCase() === 'personal information') ? 'Cannot delete Personal Information' : 'Delete section'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  {sections.filter(s => (s.column || 'right') === 'right').length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Drag sections here for the right column
                    </div>
                  )}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>

    <Modal
      open={isAddOpen}
      onClose={cancelAdd}
      title="Add Section"
      footer={(
        <>
          <button onClick={cancelAdd} className="btn-secondary">Cancel</button>
          <button onClick={confirmAdd} className="btn-primary">Add</button>
        </>
      )}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Enter new section name"
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Column Placement</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="column"
                value="left"
                checked={newSectionColumn === 'left'}
                onChange={(e) => setNewSectionColumn(e.target.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                <strong>Left Column</strong>
                <div className="text-xs text-gray-500 ml-0">Typically for skills, certifications, hobbies, and shorter sections</div>
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="column"
                value="right"
                checked={newSectionColumn === 'right'}
                onChange={(e) => setNewSectionColumn(e.target.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                <strong>Right Column</strong>
                <div className="text-xs text-gray-500 ml-0">Typically for experience, education, projects, and longer sections</div>
              </span>
            </label>
          </div>
        </div>
      </div>
    </Modal>

    <SectionEditModal
      open={editingContentIdx !== null}
      onClose={() => setEditingContentIdx(null)}
      section={editingContentIdx !== null ? sections[editingContentIdx] : null}
      onSave={(updated) => {
        if (editingContentIdx === null) return;
        const next = sections.slice();
        next[editingContentIdx] = updated;
        setSections(next);
        setEditingContentIdx(null);
      }}
    />

    <Modal
      open={editingIdx !== null}
      onClose={() => setEditingIdx(null)}
      title="Rename Section"
      footer={(
        <>
          <button onClick={() => setEditingIdx(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => {
            if (editingIdx === null) return;
            const title = (newSectionName || sections[editingIdx].title).trim();
            if (!title) return;
            const next = sections.slice();
            next[editingIdx] = { ...next[editingIdx], title };
            setSections(next);
            setNewSectionName('');
            setEditingIdx(null);
          }} className="btn-primary">Save</button>
        </>
      )}
    >
      {editingIdx !== null && (
        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
          <input
            type="text"
            value={newSectionName || sections[editingIdx].title}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Enter section name"
            className="input-field"
          />
        </div>
      )}
    </Modal>
    </>
  );
}


