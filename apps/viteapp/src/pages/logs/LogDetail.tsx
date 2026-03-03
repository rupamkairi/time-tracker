import { useParams, Link } from "react-router-dom";
import { trpc } from "../../utils/trpc";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function LogDetail() {
  const { logId } = useParams();
  const id = Number(logId);
  
  const { data: log, isLoading } = trpc.taskLog.getById.useQuery({ id }, {
    enabled: !!id
  });

  if (isLoading) return <div className="text-center py-10">Loading log details...</div>;
  if (!log) return <div className="text-center py-10 text-red-600">Log entry not found</div>;

  const duration = log.startTime && log.endTime 
    ? (new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / (1000 * 60) 
    : 0;
  
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <Link to="/calendar" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-flex items-center gap-1">
            &larr; Back to Calendar
       </Link>

       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-4">
             {log.task && (
                 <Link to={`/projects/${log.task.projectId}`} className="text-sm text-blue-600 hover:underline mb-1 block">
                     Task: {log.task.title}
                 </Link>
             )}
             <h1 className="text-2xl font-bold text-gray-900">{log.title}</h1>
             {log.description && <p className="text-gray-600 mt-2">{log.description}</p>}
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
              <div>
                  <span className="font-medium text-gray-700 block">Date</span>
                  {log.logDate}
              </div>
              <div>
                  <span className="font-medium text-gray-700 block">Time</span>
                  {log.startTime ? new Date(log.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'} - 
                  {log.endTime ? new Date(log.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}
              </div>
              <div>
                  <span className="font-medium text-gray-700 block">Duration</span>
                  {hours}h {minutes}m
              </div>
          </div>
       </div>
       
       <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Details & Notes</h2>
          {log.details && log.details.length > 0 ? (
              log.details.map((detail) => (
                  <div key={detail.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="prose prose-sm max-w-none text-gray-800">
                          <Markdown remarkPlugins={[remarkGfm]}>{detail.content || ''}</Markdown>
                      </div>
                      
                      {detail.links && detail.links.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Links</h4>
                              <ul className="space-y-1">
                                  {detail.links.map((link) => (
                                      <li key={link.id}>
                                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                              </svg>
                                              {link.title || link.url}
                                          </a>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
              ))
          ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No details added yet.</p>
                  <button className="mt-2 text-blue-600 font-medium hover:underline text-sm">
                      + Add Detail
                  </button>
              </div>
          )}
       </div>
    </div>
  );
}
