import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../api/axios.js';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal.jsx';

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/api/projects');
        setProjects(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    if (!newTitle) return;
    try {
      const res = await api.post('/api/projects', { title: newTitle, description: newDesc });
      setProjects(prev => [...prev, res.data]);
      setIsModalOpen(false);
      setNewTitle('');
      setNewDesc('');
    } catch (err) {
      setError(err.response?.data?.message || "Error creating project");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-serif text-[32px] mb-1">Projects</h1>
          <p className="text-text-muted text-[14px]">All active team projects</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-text-primary text-bg text-[13px] font-medium rounded-[3px] hover:opacity-90 transition-opacity"
          >
            New Project
          </button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        {error && <div className="mb-4 text-danger text-[13px]">{error}</div>}
        <form onSubmit={handleCreateProject} className="space-y-6">
          <div>
            <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-2">Project Title</label>
            <input 
              type="text" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-transparent border-b border-border-strong pb-2 text-text-primary outline-none focus:border-text-primary transition-colors"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-2">Description</label>
            <input 
              type="text" 
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="w-full bg-transparent border-b border-border-strong pb-2 text-text-primary outline-none focus:border-text-primary transition-colors"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="text-[13px] text-text-muted hover:text-text-primary">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-text-primary text-bg text-[13px] font-medium rounded-[3px] hover:opacity-90">Create</button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <Link to={`/projects/${p._id}`} key={p._id} className="block group">
            <div className="bg-surface border border-border p-5 rounded-[4px] group-hover:border-border-strong transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-[18px]">{p.title}</h3>
                <div className="w-2 h-2 rounded-full bg-success"></div>
              </div>
              <p className="text-[13px] text-text-muted line-clamp-2 h-10 mb-4">{p.description}</p>
              
              <hr className="border-t border-border mb-4" />
              
              <div className="flex justify-between items-center text-[12px] text-text-muted mb-2">
                <span>{p.members.length} members</span>
                <span>Active</span>
              </div>
              
              <div className="w-full h-[3px] bg-border overflow-hidden">
                <div className="h-full bg-accent" style={{ width: '45%' }}></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
