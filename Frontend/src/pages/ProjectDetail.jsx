import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import api from '../api/axios.js';
import Modal from '../components/Modal.jsx';

export default function ProjectDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('Board');

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberError, setMemberError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [taskError, setTaskError] = useState('');
  
  const [taskToReassign, setTaskToReassign] = useState(null);
  const [reassignAssignee, setReassignAssignee] = useState('');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const pRes = await api.get(`/api/projects/${id}`);
        setProject(pRes.data);
        const tRes = await api.get(`/api/tasks/project/${id}`);
        setTasks(tRes.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProjectData();
  }, [id]);

  useEffect(() => {
    if (isMemberModalOpen) {
      const fetchUsers = async () => {
        try {
          const res = await api.get('/api/auth/users');
          setAllUsers(res.data);
        } catch (e) {
          console.error("Failed to load users", e);
        }
      };
      fetchUsers();
    }
  }, [isMemberModalOpen]);

  const [memberToRemove, setMemberToRemove] = useState(null);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError('');
    if (selectedEmails.length === 0) return;
    try {
      const res = await api.post(`/api/projects/${id}/members`, { emails: selectedEmails });
      setProject(res.data);
      setIsMemberModalOpen(false);
      setSelectedEmails([]);
      setSearchTerm('');
    } catch (e) {
      setMemberError(e.response?.data?.message || "Error adding members.");
    }
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      const res = await api.delete(`/api/projects/${id}/members`, { data: { userId: memberToRemove._id } });
      setProject(res.data);
      setMemberToRemove(null);
    } catch (e) {
      alert(e.response?.data?.message || "Error removing member");
    }
  };

  const toggleEmailSelection = (email) => {
    setSelectedEmails(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setTaskError('');
    if (!newTaskTitle) return;
    try {
      const payload = { 
        title: newTaskTitle, 
        project: id, 
        status: newTaskStatus 
      };
      if (newTaskDueDate) payload.dueDate = newTaskDueDate;
      if (newTaskAssignee) payload.assignedTo = newTaskAssignee;

      const res = await api.post('/api/tasks', payload);
      setTasks(prev => [...prev, res.data]);
      setIsTaskModalOpen(false);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskAssignee('');
    } catch (e) {
      setTaskError(e.response?.data?.message || "Error adding task.");
    }
  };

  const openTaskModal = (statusId) => {
    setNewTaskStatus(statusId);
    setTaskError('');
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskAssignee('');
    setIsTaskModalOpen(true);
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (e) {
      console.error("Failed to update task status", e);
    }
  };

  const handleReassignTask = async (e) => {
    e.preventDefault();
    if (!reassignAssignee) return;
    try {
      const res = await api.put(`/api/tasks/${taskToReassign._id}`, { assignedTo: reassignAssignee });
      setTasks(tasks.map(t => t._id === taskToReassign._id ? res.data : t));
      setTaskToReassign(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reassign task");
    }
  };

  if (!project) return <div>Loading...</div>;

  const columns = [
    { id: 'todo', title: 'TODO' },
    { id: 'in-progress', title: 'IN PROGRESS' },
    { id: 'done', title: 'DONE' },
    { id: 'overdue', title: 'OVERDUE' }
  ];

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6 shrink-0">
        <h1 className="font-serif text-[32px] mb-2">{project.title}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-text-muted text-sm">Owner: {project.owner?.name}</span>
            <div className="flex -space-x-2">
              {project.members.map(m => (
                <div key={m._id} className="w-8 h-8 rounded-full border-2 border-surface bg-border flex items-center justify-center text-[10px] font-medium" title={m.name}>
                  {m.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsMemberModalOpen(true)}
              className="text-[13px] border border-border-strong px-4 py-2 hover:bg-raised transition-colors rounded-[3px]"
            >
              Add Member
            </button>
          )}
        </div>
      </header>

      <div className="flex space-x-6 border-b border-border mb-6 shrink-0">
        {['Board', 'List'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[14px] font-medium transition-colors ${
              activeTab === tab 
                ? 'text-text-primary border-b-[2px] border-text-primary' 
                : 'text-text-muted hover:text-text-primary border-b-[2px] border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Board' && (
        <div className="flex-1 overflow-x-auto">
          <div className="flex space-x-6 h-full min-w-max pb-4">
            {columns.map(col => {
              const colTasks = tasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="w-[300px] flex flex-col h-full bg-[#111111]/5">
                  <div className="flex items-center space-x-2 mb-4 shrink-0">
                    <h3 className="tracking-wider text-[12px] font-semibold text-text-muted">{col.title}</h3>
                    <span className="text-[12px] text-text-subtle">{colTasks.length}</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {colTasks.map(task => (
                      <div key={task._id} className="bg-surface border border-border rounded-[4px] p-4 cursor-pointer hover:border-border-strong transition-colors relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${
                          task.priority === 'high' ? 'bg-danger' : 
                          task.priority === 'medium' ? 'bg-warning' : 'bg-border-strong'
                        }`}></div>
                        
                        <h4 className="text-[14px] mb-2 ml-2">{task.title}</h4>
                        <div className="flex justify-between items-center ml-2">
                          <span className="text-[12px] text-text-muted">
                            {task.assignedTo ? (
                              project.members.some(m => m._id === task.assignedTo._id) || project.owner?._id === task.assignedTo._id
                                ? task.assignedTo.name 
                                : <span onClick={(e) => { e.stopPropagation(); setTaskToReassign(task); setReassignAssignee(''); }} className="text-danger flex items-center gap-1.5 cursor-pointer hover:underline" title={`Previously assigned to ${task.assignedTo.name}. Click to reassign.`}><span className="w-1.5 h-1.5 rounded-full bg-danger inline-block shrink-0"></span> Needs Reassignment</span>
                            ) : 'Unassigned'}
                          </span>
                          {task.dueDate && (
                            <span className="text-[11px] text-text-subtle">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => openTaskModal(col.id)}
                      className="text-[13px] text-text-muted hover:text-text-primary w-full text-left py-2 transition-colors mt-2"
                    >
                      + Add task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'List' && (
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border-strong text-text-muted text-[12px] tracking-wider font-semibold">
                <th className="pb-3 font-normal">Task Name</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal">Priority</th>
                <th className="pb-3 font-normal">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-text-muted italic">No tasks in this project yet.</td>
                </tr>
              ) : tasks.map(task => (
                <tr key={task._id} className="border-b border-border hover:bg-[#111111]/5 transition-colors">
                  <td className="py-4 font-medium">{task.title}</td>
                  <td className="py-4">
                    <select 
                      value={task.status} 
                      onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                      className="px-2 py-1 text-[11px] bg-border border-none rounded-sm tracking-wider uppercase outline-none cursor-pointer hover:bg-border-strong transition-colors"
                    >
                      <option value="todo" className="bg-bg text-text-primary">TODO</option>
                      <option value="in-progress" className="bg-bg text-text-primary">IN PROGRESS</option>
                      <option value="done" className="bg-bg text-text-primary">DONE</option>
                    </select>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-[11px] rounded-sm tracking-wider uppercase ${task.priority === 'high' ? 'bg-danger/10 text-danger' : task.priority === 'medium' ? 'bg-warning/10 text-warning' : 'bg-border text-text-muted'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 text-text-muted">
                    {task.assignedTo ? (
                      project.members.some(m => m._id === task.assignedTo._id) || project.owner?._id === task.assignedTo._id
                        ? task.assignedTo.name 
                        : <span onClick={(e) => { e.stopPropagation(); setTaskToReassign(task); setReassignAssignee(''); }} className="text-danger flex items-center gap-1.5 cursor-pointer hover:underline" title={`Previously assigned to ${task.assignedTo.name}. Click to reassign.`}><span className="w-1.5 h-1.5 rounded-full bg-danger inline-block shrink-0"></span> Needs Reassignment</span>
                    ) : 'Unassigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            onClick={() => openTaskModal('todo')}
            className="mt-6 text-[13px] text-text-muted hover:text-text-primary transition-colors"
          >
            + Add task
          </button>
        </div>
      )}

      <Modal isOpen={isMemberModalOpen} onClose={() => { setIsMemberModalOpen(false); setSelectedEmails([]); setSearchTerm(''); }} title="Manage Members">
        {memberError && <div className="mb-4 text-danger text-[13px]">{memberError}</div>}
        
        <div className="mb-6">
          <h3 className="text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-3">Current Members</h3>
          <div className="space-y-2 mb-4">
            {project.members.map(m => (
              <div key={m._id} className="flex justify-between items-center p-2 bg-[#111111]/5 rounded-[4px] border border-border">
                <div>
                  <p className="text-[13px] font-medium leading-tight">{m.name} {project.owner?._id === m._id && <span className="text-text-muted text-[10px] ml-1">(Owner)</span>}</p>
                  <p className="text-[11px] text-text-muted">{m.email}</p>
                </div>
                {project.owner?._id !== m._id && (
                  <button onClick={() => setMemberToRemove(m)} className="text-[12px] text-danger hover:underline">Remove</button>
                )}
              </div>
            ))}
          </div>
          <hr className="border-t border-border" />
        </div>

        <div className="mb-4">
          <h3 className="text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-3">Add New Members</h3>
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-b border-border-strong pb-2 text-[14px] text-text-primary outline-none focus:border-text-primary transition-colors"
          />
        </div>
        
        <div className="max-h-[160px] overflow-y-auto space-y-1 mb-6 pr-2">
          {allUsers
            .filter(u => !project.members.some(m => m._id === u._id))
            .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(u => (
              <label key={u._id} className="flex items-center p-3 hover:bg-raised rounded-[4px] cursor-pointer transition-colors border border-transparent hover:border-border">
                <input 
                  type="checkbox" 
                  checked={selectedEmails.includes(u.email)}
                  onChange={() => toggleEmailSelection(u.email)}
                  className="mr-3 accent-text-primary"
                />
                <div>
                  <p className="text-[14px] font-medium leading-tight">{u.name}</p>
                  <p className="text-[12px] text-text-muted">{u.email}</p>
                </div>
              </label>
            ))
          }
          {allUsers.length > 0 && allUsers.filter(u => !project.members.some(m => m._id === u._id)).length === 0 && (
            <p className="text-[13px] text-text-muted italic py-2">All available users are already in this project.</p>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-[12px] text-text-muted">{selectedEmails.length} selected</span>
          <div className="flex space-x-4">
            <button type="button" onClick={() => { setIsMemberModalOpen(false); setSelectedEmails([]); setSearchTerm(''); }} className="text-[13px] text-text-muted hover:text-text-primary">Done</button>
            <button 
              onClick={handleAddMember} 
              disabled={selectedEmails.length === 0}
              className={`px-4 py-2 bg-text-primary text-bg text-[13px] font-medium rounded-[3px] transition-opacity ${selectedEmails.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              Add Selected
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Add Task">
        {taskError && <div className="mb-4 text-danger text-[13px]">{taskError}</div>}
        <form onSubmit={handleAddTask} className="space-y-6">
          <div>
            <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-2">Task Title</label>
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              className="w-full bg-transparent border-b border-border-strong pb-2 text-text-primary outline-none focus:border-text-primary transition-colors text-[14px]"
              required
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-2">Due Date</label>
              <input 
                type="date" 
                value={newTaskDueDate}
                onChange={e => setNewTaskDueDate(e.target.value)}
                className="w-full bg-transparent border-b border-border-strong pb-2 text-text-primary outline-none focus:border-text-primary transition-colors text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-2">Assignee</label>
              <select 
                value={newTaskAssignee}
                onChange={e => setNewTaskAssignee(e.target.value)}
                className="w-full bg-transparent border-b border-border-strong pb-2 text-text-primary outline-none focus:border-text-primary transition-colors text-[14px] cursor-pointer"
              >
                <option value="" className="bg-bg text-text-muted">Unassigned</option>
                {project.members.map(m => (
                  <option key={m._id} value={m._id} className="bg-bg text-text-primary">{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={() => setIsTaskModalOpen(false)} className="text-[13px] text-text-muted hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-text-primary text-bg text-[13px] font-medium rounded-[3px] hover:opacity-90">Add Task</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!memberToRemove} onClose={() => setMemberToRemove(null)} title="Remove Member">
        <div className="space-y-6">
          <p className="text-[14px] text-text-primary">
            Are you sure you want to remove <span className="font-semibold">{memberToRemove?.name}</span> from this project?
          </p>
          <div className="flex justify-end space-x-4 pt-4 border-t border-border">
            <button type="button" onClick={() => setMemberToRemove(null)} className="text-[13px] text-text-muted hover:text-text-primary">Cancel</button>
            <button onClick={confirmRemoveMember} className="px-4 py-2 bg-danger text-bg text-[13px] font-medium rounded-[3px] hover:opacity-90 transition-opacity">Remove</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!taskToReassign} onClose={() => setTaskToReassign(null)} title="Reassign Task">
        <form onSubmit={handleReassignTask} className="space-y-6">
          <p className="text-[13px] text-text-muted">Select a new team member to take over <span className="text-text-primary font-medium">"{taskToReassign?.title}"</span>.</p>
          <div>
            <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-2">New Assignee</label>
            <select 
              value={reassignAssignee}
              onChange={e => setReassignAssignee(e.target.value)}
              className="w-full bg-transparent border-b border-border-strong pb-2 text-text-primary outline-none focus:border-text-primary transition-colors text-[14px] cursor-pointer"
              required
            >
              <option value="" disabled className="bg-bg text-text-muted">Select member</option>
              {project?.owner && <option value={project.owner._id} className="bg-bg text-text-primary">{project.owner.name} (Owner)</option>}
              {project?.members.map(m => (
                <option key={m._id} value={m._id} className="bg-bg text-text-primary">{m.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={() => setTaskToReassign(null)} className="text-[13px] text-text-muted hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-text-primary text-bg text-[13px] font-medium rounded-[3px] hover:opacity-90">Reassign</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
