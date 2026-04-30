import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../api/axios.js';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/api/tasks/dashboard');
        setStats(statsRes.data);
        
        const projectsRes = await api.get('/api/projects');
        setProjects(projectsRes.data.slice(0, 3)); // top 3 recent
      } catch (e) {
        console.error(e);
      }
    };
    fetchDashboardData();
  }, []);

  const dateStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-8">
        <h1 className="font-serif text-[36px] mb-1">Good morning, {user?.name.split(' ')[0]}.</h1>
        <p className="text-text-muted text-[14px]">{dateStr}</p>
      </header>

      <hr className="border-t border-border mb-8" />

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface border-t-2 border-border p-6 pt-4 border-x border-b rounded-b-sm">
            <div className="text-[48px] font-serif leading-none mb-1">{stats.total}</div>
            <div className="text-[13px] text-text-muted">Total Tasks</div>
          </div>
          <div className="bg-surface border-t-2 border-accent p-6 pt-4 border-x border-b rounded-b-sm">
            <div className="text-[48px] font-serif leading-none mb-1">{stats.inProgress}</div>
            <div className="text-[13px] text-text-muted">In Progress</div>
          </div>
          <div className="bg-surface border-t-2 border-success p-6 pt-4 border-x border-b rounded-b-sm">
            <div className="text-[48px] font-serif leading-none mb-1">{stats.done}</div>
            <div className="text-[13px] text-text-muted">Done</div>
          </div>
          <div className="bg-surface border-t-2 border-danger p-6 pt-4 border-x border-b rounded-b-sm">
            <div className="text-[48px] font-serif leading-none mb-1">{stats.overdue}</div>
            <div className="text-[13px] text-text-muted">Overdue</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-[12px] tracking-widest text-danger font-semibold mb-4">OVERDUE TASKS</h2>
          <hr className="border-t border-danger/30 mb-4" />
          {stats?.overdueTasks?.length > 0 ? (
            <div className="space-y-3">
              {stats.overdueTasks.map(t => (
                <Link to={`/projects/${t.project?._id}`} key={t._id} className="block">
                  <div className="bg-danger/5 border border-danger/20 p-4 rounded-[4px] hover:border-danger/40 transition-colors flex justify-between items-center">
                    <div>
                      <h4 className="text-[14px] font-medium">{t.title}</h4>
                      <p className="text-[12px] text-danger/70">{t.project?.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-[13px] text-text-muted italic">No overdue tasks. Great job!</div>
          )}

          <h2 className="text-[12px] tracking-widest text-text-subtle mb-4 mt-8">DUE TODAY</h2>
          <hr className="border-t border-border mb-4" />
          {stats?.dueTodayTasks?.length > 0 ? (
            <div className="space-y-3">
              {stats.dueTodayTasks.map(t => (
                <Link to={`/projects/${t.project?._id}`} key={t._id} className="block">
                  <div className="bg-surface border border-border p-4 rounded-[4px] hover:border-border-strong transition-colors flex justify-between items-center">
                    <div>
                      <h4 className="text-[14px] font-medium">{t.title}</h4>
                      <p className="text-[12px] text-text-muted">{t.project?.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-[13px] text-text-muted italic">Nothing due today.</div>
          )}
        </div>

        <div>
          <h2 className="text-[12px] tracking-widest text-accent font-semibold mb-4">IN PROGRESS</h2>
          <hr className="border-t border-accent/30 mb-4" />
          {stats?.inProgressTasks?.length > 0 ? (
            <div className="space-y-3">
              {stats.inProgressTasks.map(t => (
                <Link to={`/projects/${t.project?._id}`} key={t._id} className="block">
                  <div className="bg-accent/5 border border-accent/20 p-4 rounded-[4px] hover:border-accent/40 transition-colors flex justify-between items-center">
                    <div>
                      <h4 className="text-[14px] font-medium">{t.title}</h4>
                      <p className="text-[12px] text-accent/70">{t.project?.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-[13px] text-text-muted italic">No tasks currently in progress.</div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-[12px] tracking-widest text-text-subtle mb-4">RECENT PROJECTS</h2>
        <hr className="border-t border-border mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map(p => (
            <Link to={`/projects/${p._id}`} key={p._id} className="block group">
              <div className="bg-surface border border-border p-5 rounded-[4px] group-hover:border-border-strong transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-[18px]">{p.title}</h3>
                </div>
                <p className="text-[13px] text-text-muted line-clamp-2 h-10 mb-4">{p.description}</p>
                <hr className="border-t border-border mb-3" />
                <div className="flex justify-between items-center text-[12px] text-text-subtle">
                  <span>{p.members.length} members</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
