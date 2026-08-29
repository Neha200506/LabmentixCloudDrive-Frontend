import { useState, useEffect } from 'react';

// ==========================================
// SVG ICONS (Nexora Dark ThemeAccents)
// ==========================================

const LogoIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
  </svg>
);

const FolderIcon = ({ className = "w-5 h-5 text-indigo-400/80" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

// File types matching dark theme guidelines
const FileIconPdf = () => (
  <svg className="w-5 h-5 text-rose-500/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12h9m9 3H12m1.5-4.5H12M3.75 6H7.5m-.75 3h7.5M3.75 21h16.5c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H16.5L12 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21z" />
  </svg>
);

const FileIconImage = () => (
  <svg className="w-5 h-5 text-purple-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const FileIconCode = () => (
  <svg className="w-5 h-5 text-amber-500/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const FileIconSheet = () => (
  <svg className="w-5 h-5 text-emerald-500/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5m16.5-16.5v16.5m-16.5-16.5h16.5m-16.5 16.5h16.5m-16.5-12h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
  </svg>
);

const FileIconDoc = () => (
  <svg className="w-5 h-5 text-blue-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 6H7.5m-.75 3h7.5M3.75 21h16.5c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H16.5L12 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21z" />
  </svg>
);

const FileIconZip = () => (
  <svg className="w-5 h-5 text-slate-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.125a3.75 3.75 0 01-3.75 3.75H8.125a3.75 3.75 0 01-3.75-3.75L3.75 7.5m16.5 0V4.5a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V7.5m16.5 0H3.75m10.125 3.75h-3.75m3.75 3H10.125m3.75 3h-3.75" />
  </svg>
);

const FileIconAudio = () => (
  <svg className="w-5 h-5 text-cyan-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 0v11.25M19.5 6l-10.5 3m0 0v11.25m0-11.25L3.75 10.5M3.75 10.5v10.5m0-10.5L9 9M9 19.5a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm10.5-3a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
  </svg>
);

const FileIconDefault = () => (
  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3H12M10.5 6H7.5M3.75 21h16.5c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H16.5L12 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21z" />
  </svg>
);

// Map extensions to SVGs
const getFileIcon = (ext) => {
  const extension = ext ? ext.toLowerCase() : '';
  if (extension === 'pdf') return <FileIconPdf />;
  if (['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(extension)) return <FileIconImage />;
  if (['js', 'jsx', 'html', 'css', 'json', 'py', 'java', 'cpp', 'md'].includes(extension)) return <FileIconCode />;
  if (['xls', 'xlsx', 'csv'].includes(extension)) return <FileIconSheet />;
  if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return <FileIconDoc />;
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(extension)) return <FileIconZip />;
  if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension)) return <FileIconAudio />;
  return <FileIconDefault />;
};

// Sidebar icons
const HomeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ProjectsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    <line x1="12" x2="16" y1="11" y2="11"/>
    <line x1="12" x2="16" y1="15" y2="15"/>
  </svg>
);

const DriveIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 22 22 22"/>
  </svg>
);

const ComputerIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="3" rx="2"/>
    <line x1="8" x2="16" y1="21" y2="21"/>
    <line x1="12" x2="12" y1="17" y2="21"/>
  </svg>
);

const PeopleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const StarIconOutline = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const StarIconSolid = () => (
  <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const CloudIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19A5.5 5.5 0 0 0 22 13.5a5.5 5.5 0 0 0-5.5-5.5H16a7.5 7.5 0 0 0-14 3.5c0 1.2.3 2.3.8 3.3L3.5 19Z"/>
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1"/>
    <rect width="7" height="7" x="14" y="3" rx="1"/>
    <rect width="7" height="7" x="14" y="14" rx="1"/>
    <rect width="7" height="7" x="3" y="14" rx="1"/>
  </svg>
);

const ListIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" x2="21" y1="6" y2="6"/>
    <line x1="3" x2="21" y1="12" y2="12"/>
    <line x1="3" x2="21" y1="18" y2="18"/>
  </svg>
);

const ThreeDotsIcon = () => (
  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/>
    <circle cx="12" cy="5" r="1"/>
    <circle cx="12" cy="19" r="1"/>
  </svg>
);

// Utility icons
const HelpIcon = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" x2="12.01" y1="17" y2="17"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" x2="16.65" y1="21" y2="16.65"/>
  </svg>
);

const AppsIcon = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="4" height="4" x="4" y="4" rx="1"/>
    <rect width="4" height="4" x="10" y="4" rx="1"/>
    <rect width="4" height="4" x="16" y="4" rx="1"/>
    <rect width="4" height="4" x="4" y="10" rx="1"/>
    <rect width="4" height="4" x="10" y="10" rx="1"/>
    <rect width="4" height="4" x="16" y="10" rx="1"/>
    <rect width="4" height="4" x="4" y="16" rx="1"/>
    <rect width="4" height="4" x="10" y="16" rx="1"/>
    <rect width="4" height="4" x="16" y="16" rx="1"/>
  </svg>
);

// Right Utilities
const CalendarIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
    <text x="12" y="18" fontSize="8" fontWeight="bold" textAnchor="middle" stroke="none" fill="currentColor">31</text>
  </svg>
);

const KeepIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <line x1="9" x2="15" y1="18" y2="18"/>
    <line x1="10" x2="14" y1="21" y2="21"/>
  </svg>
);

const TasksIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="8 12 11 15 16 9"/>
  </svg>
);

const ContactsIcon = () => (
  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="5" y2="19"/>
    <line x1="5" x2="19" y1="12" y2="12"/>
  </svg>
);

// ==========================================
// MOCK DATA
// ==========================================

const INITIAL_MOCK_ITEMS = [
  // Root Folders
  { id: 'f-1', name: 'Work Projects', type: 'folder', parentId: null, starred: true, shared: false, owner: 'Alex Rivera', updatedAt: '2026-08-28', size: '-' },
  { id: 'f-2', name: 'Personal Documents', type: 'folder', parentId: null, starred: false, shared: false, owner: 'me', updatedAt: '2026-08-25', size: '-' },
  { id: 'f-6', name: 'College Files', type: 'folder', parentId: null, starred: false, shared: false, owner: 'me', updatedAt: '2026-08-24', size: '-' },
  { id: 'f-3', name: 'Nexora Codebase', type: 'folder', parentId: 'f-1', starred: true, shared: false, owner: 'me', updatedAt: '2026-08-29', size: '-' },
  { id: 'f-4', name: 'Design Assets', type: 'folder', parentId: 'f-1', starred: false, shared: true, owner: 'Sarah Jenkins', updatedAt: '2026-08-27', size: '-' },
  { id: 'f-5', name: 'Financial Sheets', type: 'folder', parentId: 'f-2', starred: false, shared: false, owner: 'me', updatedAt: '2026-08-14', size: '-' },

  // Root Files
  { id: '1', name: 'Nexora_Brand_Identity.pdf', type: 'file', extension: 'pdf', parentId: null, starred: true, shared: false, owner: 'me', updatedAt: '2026-08-28', size: '4.5 MB', reasonSuggested: 'You opened • 9:53 PM', location: 'My Drive' },
  { id: '2', name: 'marketing_plan_v2.docx', type: 'file', extension: 'docx', parentId: null, starred: false, shared: true, owner: 'Sarah Jenkins', updatedAt: '2026-08-26', size: '240 KB', reasonSuggested: 'You edited • Aug 26', location: 'My Drive' },
  { id: '3', name: 'audio_intro.mp3', type: 'file', extension: 'mp3', parentId: null, starred: false, shared: true, owner: 'Alex Rivera', updatedAt: '2026-08-24', size: '6.4 MB', reasonSuggested: 'You opened • Jun 2', location: 'My Drive' },
  { id: '4', name: 'backup_archive.zip', type: 'file', extension: 'zip', parentId: null, starred: false, shared: false, owner: 'me', updatedAt: '2026-08-20', size: '142 MB', reasonSuggested: 'You uploaded • Aug 20', location: 'My Drive' },
  { id: '5', name: 'abandoned_draft.txt', type: 'file', extension: 'txt', parentId: null, starred: false, shared: false, owner: 'me', inTrash: true, updatedAt: '2026-08-10', size: '12 KB', reasonSuggested: 'Deleted • Aug 10', location: 'Trash' },

  // Items Inside f-1 (Work Projects)
  { id: '6', name: 'ProjectSpecs_V1.pdf', type: 'file', extension: 'pdf', parentId: 'f-1', starred: false, shared: false, owner: 'Alex Rivera', updatedAt: '2026-08-20', size: '2.1 MB', reasonSuggested: 'You created • Aug 10', location: 'Work Projects' },

  // Items Inside f-3 (Nexora Codebase)
  { id: '7', name: 'App.jsx', type: 'file', extension: 'jsx', parentId: 'f-3', starred: false, shared: false, owner: 'me', updatedAt: '2026-08-29', size: '4 KB', reasonSuggested: 'You edited • Aug 29', location: 'Nexora Codebase' },
  { id: '8', name: 'index.css', type: 'file', extension: 'css', parentId: 'f-3', starred: false, shared: false, owner: 'me', updatedAt: '2026-08-29', size: '2 KB', reasonSuggested: 'You opened • Aug 29', location: 'Nexora Codebase' },
  { id: '9', name: 'package.json', type: 'file', extension: 'json', parentId: 'f-3', starred: false, shared: false, owner: 'me', updatedAt: '2026-08-29', size: '1 KB', reasonSuggested: 'You opened • Aug 29', location: 'Nexora Codebase' },
  { id: '10', name: 'README.md', type: 'file', extension: 'md', parentId: 'f-3', starred: true, shared: false, owner: 'me', updatedAt: '2026-08-29', size: '10 KB', reasonSuggested: 'You created • Aug 29', location: 'Nexora Codebase' },

  // Items Inside f-4 (Design Assets)
  { id: '11', name: 'dashboard_mockup.png', type: 'file', extension: 'png', parentId: 'f-4', starred: true, shared: true, owner: 'Sarah Jenkins', updatedAt: '2026-08-27', size: '890 KB', reasonSuggested: 'You opened • Aug 18', location: 'Design Assets' },
  { id: '12', name: 'landing_hero_draft.jpg', type: 'file', extension: 'jpg', parentId: 'f-4', starred: false, shared: true, owner: 'Sarah Jenkins', updatedAt: '2026-08-26', size: '1.4 MB', reasonSuggested: 'You edited • Aug 26', location: 'Design Assets' },

  // Items Inside f-5 (Financial Sheets)
  { id: '13', name: 'financial_forecast_2026.xlsx', type: 'file', extension: 'xlsx', parentId: 'f-5', starred: false, shared: false, owner: 'me', updatedAt: '2026-08-14', size: '1.2 MB', reasonSuggested: 'You edited • Aug 8', location: 'Financial Sheets' },
  { id: '14', name: 'payroll_August.xlsx', type: 'file', extension: 'xlsx', parentId: 'f-5', starred: false, shared: false, owner: 'me', updatedAt: '2026-08-12', size: '980 KB', reasonSuggested: 'You opened • Aug 12', location: 'Financial Sheets' },

  // Items Inside f-2 (Personal Documents)
  { id: '15', name: 'vacation_itinerary.pdf', type: 'file', extension: 'pdf', parentId: 'f-2', starred: false, shared: false, owner: 'me', updatedAt: '2026-08-15', size: '1.8 MB', reasonSuggested: 'You created • Aug 15', location: 'Personal Documents' },
  { id: '16', name: 'apartment_lease_signed.pdf', type: 'file', extension: 'pdf', parentId: 'f-2', starred: true, shared: false, owner: 'me', updatedAt: '2026-08-11', size: '3.6 MB', reasonSuggested: 'You opened • Aug 11', location: 'Personal Documents' },

  // Items Inside f-6 (College Files)
  { id: '17', name: 'chemistry_lab_report.pdf', type: 'file', extension: 'pdf', parentId: 'f-6', starred: false, shared: false, owner: 'me', updatedAt: '2026-08-23', size: '1.2 MB', reasonSuggested: 'You edited • Aug 23', location: 'College Files' },
  { id: '18', name: 'history_essay_draft.docx', type: 'file', extension: 'docx', parentId: 'f-6', starred: true, shared: false, owner: 'me', updatedAt: '2026-08-22', size: '45 KB', reasonSuggested: 'You opened • Aug 22', location: 'College Files' }
];

export default function Dashboard({ onNavigate, user }) {
  const displayUser = user || { email: 'alex.rivera@nexora.io', name: 'Alex Rivera' };
  const initials = displayUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const [items, setItems] = useState(INITIAL_MOCK_ITEMS);
  const [activeTab, setActiveTab] = useState('drive'); // home, projects, drive, computers, shared, recent, starred, spam, trash, storage
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // Default is list
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  // Filters State
  const [filterType, setFilterType] = useState('all');

  // Load beautiful font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Synchronize history state on browser back/forward
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ folderId: null, tab: 'drive' }, '', '');
    }

    const handlePopState = (event) => {
      if (event.state) {
        const { folderId, tab } = event.state;
        setIsLoading(true);
        setCurrentFolderId(folderId);
        setActiveTab(tab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  const [filterOwner, setFilterOwner] = useState('all');
  const [filterModified, setFilterModified] = useState('all');
  const [filterSource, setFilterSource] = useState('all');

  // Filter dropdown state toggles
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null); // 'type', 'people', 'modified', 'source'

  // Dropdown helper inputs/states
  const [peopleSearch, setPeopleSearch] = useState('');
  const [tempModified, setTempModified] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Trigger loading effect when navigation changes
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Handle Tab Switch
  const handleTabSwitch = (tab) => {
    setIsLoading(true);
    setActiveTab(tab);
    setCurrentFolderId(null);
    setSearchQuery('');
    setIsSidebarOpen(false);
    setActiveFilterDropdown(null);
    resetFilters();
    window.history.pushState({ folderId: null, tab }, '', '');
  };

  const resetFilters = () => {
    setFilterType('all');
    setFilterOwner('all');
    setFilterModified('all');
    setTempModified('all');
    setFilterSource('all');
    setCustomStart('');
    setCustomEnd('');
  };

  // Navigate to Folder (Drill down)
  const handleFolderClick = (folderId) => {
    setIsLoading(true);
    setCurrentFolderId(folderId);
    setActiveTab('drive'); // Always switch to My Drive view when exploring folders
    setSearchQuery('');
    setActiveFilterDropdown(null);
    window.history.pushState({ folderId, tab: 'drive' }, '', '');
  };

  // Star / Unstar toggling
  const handleToggleStar = (itemId, e) => {
    e.stopPropagation();
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, starred: !item.starred } : item
      )
    );
  };

  // Trash actions
  const handleRestoreItem = (itemId, e) => {
    e.stopPropagation();
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, inTrash: false } : item));
  };

  const handleDeletePermanent = (itemId, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this item? This action cannot be undone.")) {
      setItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleEmptyTrash = () => {
    if (confirm("Empty trash? All items in the trash will be permanently deleted.")) {
      setItems(prev => prev.filter(item => !item.inTrash));
    }
  };

  // Breadcrumbs generation
  const buildBreadcrumbs = () => {
    const crumbs = [{ id: null, name: 'My Drive' }];
    if (!currentFolderId) return crumbs;

    const path = [];
    let currentId = currentFolderId;
    let safetyCounter = 0;

    while (currentId && safetyCounter < 10) {
      const folder = items.find(item => item.id === currentId && item.type === 'folder');
      if (folder) {
        path.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
      safetyCounter++;
    }

    return crumbs.concat(path);
  };

  // Filter Items based on sidebar tab & active folder & local filters
  const getFilteredItems = () => {
    let baseItems = [];
    const activeItems = items.filter(item => !item.inTrash);

    if (activeTab === 'trash') {
      baseItems = items.filter(item => item.inTrash === true);
    } else if (activeTab === 'drive') {
      baseItems = activeItems.filter(item => item.parentId === currentFolderId);
    } else if (activeTab === 'home') {
      baseItems = activeItems.filter(item => item.type === 'file');
    } else if (activeTab === 'recent') {
      baseItems = activeItems.filter(item => item.type === 'file');
    } else if (activeTab === 'starred') {
      baseItems = activeItems.filter(item => item.starred);
    } else if (activeTab === 'shared') {
      baseItems = activeItems.filter(item => item.shared);
    } else if (activeTab === 'computers') {
      baseItems = [];
    } else if (activeTab === 'spam') {
      baseItems = [];
    } else if (activeTab === 'storage') {
      baseItems = activeItems;
    } else if (activeTab === 'projects') {
      baseItems = [];
    }

    // Apply interactive filter criteria
    if (['drive', 'shared', 'recent', 'starred', 'trash'].includes(activeTab)) {
      // 1. Filter by Type
      if (filterType !== 'all') {
        if (filterType === 'folder') {
          baseItems = baseItems.filter(item => item.type === 'folder');
        } else if (filterType === 'docx') {
          baseItems = baseItems.filter(item => item.type === 'file' && ['docx', 'doc', 'txt'].includes(item.extension));
        } else if (filterType === 'xlsx') {
          baseItems = baseItems.filter(item => item.type === 'file' && ['xlsx', 'xls', 'csv'].includes(item.extension));
        } else if (filterType === 'presentation') {
          baseItems = baseItems.filter(item => item.type === 'file' && ['pptx', 'ppt'].includes(item.extension));
        } else if (filterType === 'png') {
          baseItems = baseItems.filter(item => item.type === 'file' && ['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(item.extension));
        } else if (filterType === 'pdf') {
          baseItems = baseItems.filter(item => item.type === 'file' && item.extension === 'pdf');
        } else if (filterType === 'video') {
          baseItems = baseItems.filter(item => item.type === 'file' && ['mp4', 'mkv', 'avi'].includes(item.extension));
        } else if (filterType === 'mp3') {
          baseItems = baseItems.filter(item => item.type === 'file' && item.extension === 'mp3');
        } else if (filterType === 'code') {
          baseItems = baseItems.filter(item => item.type === 'file' && ['js', 'jsx', 'html', 'css', 'json', 'py', 'java', 'cpp', 'md'].includes(item.extension));
        } else if (filterType === 'zip') {
          baseItems = baseItems.filter(item => item.type === 'file' && item.extension === 'zip');
        }
      }

      // 2. Filter by Owner
      if (filterOwner !== 'all') {
        if (filterOwner === 'link') {
          baseItems = baseItems.filter(item => item.shared === true);
        } else {
          baseItems = baseItems.filter(item => item.owner === filterOwner);
        }
      }

      // 3. Filter by Modified
      if (filterModified !== 'all') {
        if (filterModified === 'today') {
          baseItems = baseItems.filter(item => item.updatedAt === '2026-08-29' || item.updatedAt === '2026-08-28');
        } else if (filterModified === '7days') {
          baseItems = baseItems.filter(item => {
            const date = new Date(item.updatedAt);
            const refDate = new Date('2026-08-29');
            const diffTime = Math.abs(refDate - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          });
        } else if (filterModified === '30days') {
          baseItems = baseItems.filter(item => {
            const date = new Date(item.updatedAt);
            const refDate = new Date('2026-08-29');
            const diffTime = Math.abs(refDate - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30;
          });
        }
      }

      // 4. Filter by Source
      if (filterSource !== 'all') {
        if (filterSource === 'gmail') {
          baseItems = baseItems.filter(item => item.id === '2'); // mock gmail item
        } else if (filterSource === 'meet') {
          baseItems = [];
        }
      }
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      if (activeTab === 'drive') {
        return activeItems.filter(item => item.name.toLowerCase().includes(query));
      }
      return baseItems.filter(item => item.name.toLowerCase().includes(query));
    }

    return baseItems;
  };

  const filteredItems = getFilteredItems();
  const breadcrumbs = buildBreadcrumbs();

  const folderItems = filteredItems.filter(item => item.type === 'folder');
  const fileItems = filteredItems.filter(item => item.type === 'file');

  const suggestedFoldersList = [
    { name: 'Work Projects', id: 'f-1', itemsCount: '12 items' },
    { name: 'Personal Documents', id: 'f-2', itemsCount: '8 items' },
    { name: 'College Files', id: 'f-6', itemsCount: '15 items' },
    { name: 'Design Assets', id: 'f-4', itemsCount: '10 items' },
  ];

  // People dropdown lists search filter
  const peopleOptions = [
    { id: 'Alex Rivera', name: 'Alex Rivera', email: 'alex.rivera@nexora.io', initials: 'AR' },
    { id: 'Sarah Jenkins', name: 'Sarah Jenkins', email: 'sarah.j@nexora.io', initials: 'SJ' },
    { id: 'Michael Chen', name: 'Michael Chen', email: 'michael.c@nexora.io', initials: 'MC' },
  ];
  const filteredPeople = peopleOptions.filter(p => 
    p.name.toLowerCase().includes(peopleSearch.toLowerCase()) || 
    p.email.toLowerCase().includes(peopleSearch.toLowerCase())
  );

  return (
    <div className="flex w-full h-screen overflow-hidden font-sans text-sm text-slate-100 bg-[#070b13] select-none antialiased" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[99] md:hidden transition-opacity duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ==========================================
          LEFT SIDEBAR (Google Drive Layout)
          ========================================== */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900/60 border-r border-slate-800/40 py-4 px-3 flex flex-col justify-between z-[100] md:sticky md:flex transform transition-transform duration-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Logo & Nexora Branding */}
          <div className="flex items-center justify-between px-3 py-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20">
                <LogoIcon />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                Nexora <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded ml-1">Drive</span>
              </span>
            </div>
            {/* Mobile close button */}
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="p-1 rounded-md border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white md:hidden"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* "+ New" Pill-style Button */}
          <div className="relative px-2 py-2">
            <button
              onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
              className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 text-slate-200 font-medium rounded-[16px] shadow-lg hover:bg-slate-850 hover:shadow-xl transition-all outline-none duration-200 active:scale-[0.98]"
            >
              {/* Colorful Custom Plus Icon */}
              <svg className="w-6 h-6" viewBox="0 0 36 36">
                <path fill="#818cf8" d="M16 16v14h4V20h14v-4H20V2h-4v14H2v4h14z"/>
              </svg>
              <span className="text-sm font-semibold tracking-wide">New</span>
            </button>

            {isNewMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNewMenuOpen(false)} />
                <div className="absolute left-2 top-16 w-56 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                  <button
                    onClick={() => {
                      setIsNewMenuOpen(false);
                      alert("Folder creation is scheduled for Day 10+ backend development.");
                    }}
                    className="w-full text-left px-3 py-2 font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition flex items-center gap-2.5"
                  >
                    <FolderIcon className="w-4 h-4 text-indigo-400" />
                    <span>New Folder</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsNewMenuOpen(false);
                      alert("File upload functionality is scheduled for Day 10+ backend development.");
                    }}
                    className="w-full text-left px-3 py-2 font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition flex items-center gap-2.5"
                  >
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>File Upload</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsNewMenuOpen(false);
                      alert("Folder upload functionality is scheduled for Day 10+ backend development.");
                    }}
                    className="w-full text-left px-3 py-2 font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition flex items-center gap-2.5"
                  >
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5M5 19v-2m14 2v-2" />
                    </svg>
                    <span>Folder Upload</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-0.5 px-2">
            {[
              { id: 'home', label: 'Home', icon: <HomeIcon /> },
              { id: 'projects', label: 'Projects', icon: <ProjectsIcon /> },
              { id: 'drive', label: 'My Drive', icon: <DriveIcon /> },
              { id: 'computers', label: 'Computers', icon: <ComputerIcon /> },
              { id: 'shared', label: 'Shared with me', icon: <PeopleIcon /> },
              { id: 'recent', label: 'Recent', icon: <ClockIcon /> },
              { id: 'starred', label: 'Starred', icon: <StarIconOutline /> },
              { id: 'spam', label: 'Spam', icon: <AlertIcon /> },
              { id: 'trash', label: 'Trash', icon: <TrashIcon /> },
              { id: 'storage', label: 'Storage', icon: <CloudIcon /> },
            ].map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSwitch(item.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-full text-xs font-medium transition duration-150 text-left ${
                    isActive
                      ? 'bg-slate-800/80 text-white font-semibold border-l-2 border-indigo-500'
                      : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                  }`}
                >
                  <span className={`${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {item.id === 'starred' && isActive ? <StarIconSolid /> : item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storage Meter */}
        <div className="px-4 py-3 border-t border-slate-800/40 mt-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <CloudIcon />
              <span className="text-[11px] font-semibold text-slate-300">Storage</span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '8%' }}></div>
            </div>

            <div className="text-[11px] text-slate-400">
              1.2 GB of 15 GB used
            </div>

            <button
              onClick={() => handleTabSwitch('storage')}
              className="mt-2 w-full py-1.5 px-3 border border-slate-800 text-indigo-400 hover:bg-indigo-500/10 text-[11px] rounded-full font-semibold transition text-center"
            >
              Get more storage
            </button>
          </div>
        </div>
      </aside>

      {/* ==========================================
          MAIN AREA (Header + Floated Workspace)
          ========================================== */}
      <main className="flex-1 flex flex-col h-screen min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-16 px-6 flex items-center justify-between gap-4 shrink-0 bg-[#070b13]/40 border-b border-slate-900/40">
          {/* Hamburger Menu & Search */}
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 rounded-full hover:bg-slate-900 text-slate-400 md:hidden transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Compact Search Bar */}
            <div className="relative flex-1 group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in Nexora Drive"
                className="w-full pl-11 pr-10 py-2.5 rounded-full bg-slate-900/60 border border-slate-800/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-slate-700 focus:shadow-md transition duration-150"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-900 text-slate-400 transition" title="Help">
              <HelpIcon />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-900 text-slate-400 transition" title="Settings">
              <SettingsIcon />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-900 text-slate-400 transition" title="Apps">
              <AppsIcon />
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-slate-800 hover:bg-slate-900 transition active:scale-[0.98] outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 text-white font-bold text-xs flex items-center justify-center">
                  {initials}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-slate-300 pr-0.5">{displayUser.name}</span>
                <svg className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Card Popover */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-3 pb-3.5 border-b border-slate-800">
                      <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/30 text-white font-bold text-base flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white truncate">{displayUser.name}</span>
                        <span className="text-xs text-slate-400 truncate">{displayUser.email}</span>
                      </div>
                    </div>

                    <div className="py-3 border-b border-slate-800 flex flex-col gap-1.5 text-xs text-slate-300">
                      <div className="flex justify-between items-center">
                        <span>Account Plan</span>
                        <span className="font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Nexora Pro</span>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate('login');
                        }}
                        className="w-full py-2 px-3 justify-center text-center rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition duration-150 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT BODY */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Workspace Card */}
          <div className="flex-1 bg-slate-900/30 border border-slate-800/60 m-2 mr-1 flex flex-col overflow-hidden shadow-xs rounded-2xl">
            
            {/* Title / Action Bar */}
            <div className="px-6 py-4.5 border-b border-slate-800/60 flex items-center justify-between shrink-0">
              <div className="flex flex-col gap-1 min-w-0">
                {activeTab === 'drive' ? (
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
                    {breadcrumbs.map((crumb, index) => (
                      <div key={crumb.id || 'root'} className="flex items-center gap-1 shrink-0">
                        {index > 0 && (
                          <svg className="w-3.5 h-3.5 text-slate-600 mx-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        <button
                          onClick={() => handleFolderClick(crumb.id)}
                          className={`text-lg font-semibold hover:text-indigo-400 hover:underline transition ${
                            index === breadcrumbs.length - 1 ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {crumb.name}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <h1 className="text-lg font-semibold text-white capitalize">
                    {activeTab === 'shared' ? 'Shared with me' : activeTab}
                  </h1>
                )}
              </div>

              {/* Grid / List controls switcher */}
              <div className="flex items-center gap-3 ml-2 shrink-0">
                {['drive', 'starred', 'recent', 'shared', 'home'].includes(activeTab) && (
                  <div className="flex items-center border border-slate-800 rounded-lg p-0.5 bg-slate-950/30">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition duration-150 ${
                        viewMode === 'list'
                          ? 'bg-slate-800 text-indigo-400'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="List view"
                    >
                      <ListIcon />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition duration-150 ${
                        viewMode === 'grid'
                          ? 'bg-slate-800 text-indigo-400'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Grid view"
                    >
                      <GridIcon />
                    </button>
                  </div>
                )}

                {activeTab === 'trash' && filteredItems.length > 0 && (
                  <button
                    onClick={handleEmptyTrash}
                    className="py-1.5 px-3 border border-red-900/60 hover:border-red-700/60 text-red-400 bg-red-950/30 hover:bg-red-950/50 text-xs font-semibold rounded-lg transition"
                  >
                    Empty Trash
                  </button>
                )}
              </div>
            </div>

            {/* Filter controls row (Render on: My Drive, Shared with me, Recent, Starred, Trash) */}
            {['drive', 'shared', 'recent', 'starred', 'trash'].includes(activeTab) && (
              <div className="px-6 py-2.5 bg-slate-900/10 border-b border-slate-800/40 flex flex-wrap items-center gap-2.5 z-20 shrink-0">
                
                {/* 1. Type Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'type' ? null : 'type')}
                    className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${
                      filterType !== 'all'
                        ? 'border-indigo-800 bg-indigo-950/50 text-indigo-300 font-semibold'
                        : 'border-slate-800 bg-slate-900/35 text-slate-300 hover:bg-slate-850 hover:text-white'
                    }`}
                  >
                    <span>Type{filterType !== 'all' ? `: ${filterType.toUpperCase()}` : ''}</span>
                    <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeFilterDropdown === 'type' && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setActiveFilterDropdown(null)} />
                      <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 py-1.5 shadow-xl z-40 text-xs">
                        {[
                          { id: 'all', label: 'All types' },
                          { id: 'folder', label: 'Folders' },
                          { id: 'docx', label: 'Documents' },
                          { id: 'xlsx', label: 'Spreadsheets' },
                          { id: 'presentation', label: 'Presentations' },
                          { id: 'png', label: 'Photos & images' },
                          { id: 'pdf', label: 'PDFs' },
                          { id: 'video', label: 'Videos' },
                          { id: 'mp3', label: 'Audio' },
                          { id: 'code', label: 'Code / Text' },
                          { id: 'zip', label: 'Archives (ZIP)' },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setFilterType(opt.id);
                              setActiveFilterDropdown(null);
                            }}
                            className={`w-full text-left px-3.5 py-2 hover:bg-slate-800/60 transition ${filterType === opt.id ? 'font-semibold text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* 2. People Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'people' ? null : 'people')}
                    className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${
                      filterOwner !== 'all'
                        ? 'border-indigo-800 bg-indigo-950/50 text-indigo-300 font-semibold'
                        : 'border-slate-800 bg-slate-900/35 text-slate-300 hover:bg-slate-850 hover:text-white'
                    }`}
                  >
                    <span>People{filterOwner !== 'all' ? `: ${filterOwner === 'link' ? 'Shared link' : filterOwner.split(' ')[0]}` : ''}</span>
                    <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeFilterDropdown === 'people' && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setActiveFilterDropdown(null)} />
                      <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-slate-900 border border-slate-800 shadow-xl z-40 text-xs flex flex-col">
                        
                        {/* Search field */}
                        <div className="p-2 border-b border-slate-800">
                          <input
                            type="text"
                            value={peopleSearch}
                            onChange={(e) => setPeopleSearch(e.target.value)}
                            placeholder="Search for people and groups"
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-xs text-white rounded-lg focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* People Options list */}
                        <div className="max-h-56 overflow-y-auto py-1">
                          {filteredPeople.length === 0 ? (
                            <div className="p-3.5 text-center text-slate-500 italic">No people found</div>
                          ) : (
                            filteredPeople.map(p => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  setFilterOwner(p.id);
                                  setActiveFilterDropdown(null);
                                  setPeopleSearch('');
                                }}
                                className={`w-full text-left px-3.5 py-2 hover:bg-slate-800/60 transition flex items-center gap-2.5 ${filterOwner === p.id ? 'font-semibold text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                              >
                                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[8px] font-bold flex items-center justify-center shrink-0">
                                  {p.initials}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-semibold text-xs truncate">{p.name}</span>
                                  <span className="text-[9px] text-slate-500 truncate">{p.email}</span>
                                </div>
                              </button>
                            ))
                          )}
                          
                          {/* "Anyone with the link" option */}
                          <button
                            onClick={() => {
                              setFilterOwner('link');
                              setActiveFilterDropdown(null);
                              setPeopleSearch('');
                            }}
                            className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-800/60 border-t border-slate-800/60 transition flex items-center gap-2.5 ${filterOwner === 'link' ? 'font-semibold text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                          >
                            <span className="p-1 rounded bg-slate-800 text-indigo-400 shrink-0">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                              </svg>
                            </span>
                            <span className="font-semibold text-xs">Anyone with the link</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 3. Modified Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'modified' ? null : 'modified')}
                    className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${
                      filterModified !== 'all'
                        ? 'border-indigo-800 bg-indigo-950/50 text-indigo-300 font-semibold'
                        : 'border-slate-800 bg-slate-900/35 text-slate-300 hover:bg-slate-850 hover:text-white'
                    }`}
                  >
                    <span>Modified{filterModified !== 'all' ? ': Active' : ''}</span>
                    <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeFilterDropdown === 'modified' && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setActiveFilterDropdown(null)} />
                      <div 
                        className="absolute left-0 mt-1.5 w-60 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-xl z-40 text-xs flex flex-col gap-1.5 animate-in fade-in duration-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {[
                          { id: 'all', label: 'Any time' },
                          { id: 'today', label: 'Today' },
                          { id: '7days', label: 'Last 7 days' },
                          { id: '30days', label: 'Last 30 days' },
                          { id: 'thisyear', label: 'This year' },
                          { id: 'lastyear', label: 'Last year' },
                          { id: 'custom', label: 'Custom date range' },
                        ].map(opt => (
                          <label
                            key={opt.id}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer transition ${tempModified === opt.id ? 'text-indigo-400 font-semibold bg-indigo-500/5' : 'text-slate-300'}`}
                          >
                            <input
                              type="radio"
                              name="modifiedRange"
                              checked={tempModified === opt.id}
                              onChange={() => setTempModified(opt.id)}
                              className="text-indigo-500 focus:ring-indigo-500 bg-slate-950 border-slate-800"
                            />
                            <span>{opt.label}</span>
                          </label>
                        ))}

                        {/* Custom Date Range Picker */}
                        {tempModified === 'custom' && (
                          <div className="px-2.5 py-2 border border-slate-800 rounded-lg bg-slate-950 flex flex-col gap-2 animate-in fade-in duration-100">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Start Date</span>
                              <input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">End Date</span>
                              <input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* Dropdown actions */}
                        <div className="flex items-center justify-between border-t border-slate-800 pt-2 mt-1 px-1">
                          <button
                            onClick={() => setActiveFilterDropdown(null)}
                            className="text-slate-500 hover:text-slate-300 font-semibold px-2 py-1 transition"
                          >
                            Cancel
                          </button>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setTempModified('all');
                                setFilterModified('all');
                                setCustomStart('');
                                setCustomEnd('');
                                setActiveFilterDropdown(null);
                              }}
                              className="text-slate-400 hover:text-slate-250 font-semibold px-2 py-1 transition"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => {
                                setFilterModified(tempModified);
                                setActiveFilterDropdown(null);
                              }}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold transition"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 4. Source Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'source' ? null : 'source')}
                    className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${
                      filterSource !== 'all'
                        ? 'border-indigo-800 bg-indigo-950/50 text-indigo-300 font-semibold'
                        : 'border-slate-800 bg-slate-900/35 text-slate-300 hover:bg-slate-850 hover:text-white'
                    }`}
                  >
                    <span>Source{filterSource !== 'all' ? `: ${filterSource.toUpperCase()}` : ''}</span>
                    <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeFilterDropdown === 'source' && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setActiveFilterDropdown(null)} />
                      <div className="absolute left-0 mt-1.5 w-40 rounded-xl bg-slate-900 border border-slate-800 py-1.5 shadow-xl z-40 text-xs">
                        {[
                          { id: 'all', label: 'All sources' },
                          { id: 'gmail', label: 'Gmail' },
                          { id: 'meet', label: 'Meet' },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setFilterSource(opt.id);
                              setActiveFilterDropdown(null);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-slate-800/60 transition ${filterSource === opt.id ? 'font-semibold text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Reset Filters options link */}
                {(filterType !== 'all' || filterOwner !== 'all' || filterModified !== 'all' || filterSource !== 'all') && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-semibold ml-2"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}

            {/* SCROLLABLE WORKSPACE WINDOW */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20">
              
              {isLoading ? (
                /* LOADING SHIMMER */
                <div className="space-y-6 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-16" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-14 bg-slate-800 rounded-xl" />
                    ))}
                  </div>
                  <div className="h-4 bg-slate-800 rounded w-20 mt-8" />
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-10 bg-slate-800 rounded-lg" />
                    ))}
                  </div>
                </div>
              ) : filteredItems.length === 0 && !['computers', 'spam', 'storage', 'projects'].includes(activeTab) ? (
                /* EMPTY STATE */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800/60 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                    <SearchIcon />
                  </div>
                  <h3 className="text-sm font-semibold text-white">No items found</h3>
                  <p className="text-slate-400 text-xs max-w-xs mt-1">
                    Try adjusting your filters or search terms to inspect files.
                  </p>
                  {(searchQuery || filterType !== 'all' || filterOwner !== 'all' || filterModified !== 'all' || filterSource !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        resetFilters();
                      }}
                      className="mt-4 py-1.5 px-4 rounded-full text-xs font-semibold border border-slate-800 hover:bg-slate-900 transition"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                /* ACTUAL PAGE RENDERERS */
                <div className="space-y-6">
                  
                  {/* ==========================================
                      RENDER: PROJECTS ('projects')
                      ========================================== */}
                  {activeTab === 'projects' && (
                    <div className="space-y-6 flex flex-col h-full">
                      {/* Top bar with Title and Create action button */}
                      <div className="flex items-center justify-between shrink-0">
                        <h2 className="text-lg font-semibold text-white">Projects</h2>
                        <button
                          onClick={() => alert("Project creation is scheduled for later development days.")}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" x2="12" y1="5" y2="19"/>
                            <line x1="5" x2="19" y1="12" y2="12"/>
                          </svg>
                          <span>Create a project</span>
                        </button>
                      </div>

                      {/* Centered Empty State */}
                      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-slate-500 mb-5 shadow-sm">
                          <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        
                        <h3 className="text-sm font-bold text-white mb-1.5">Group files for better answers</h3>
                        <p className="text-slate-400 text-xs max-w-xs mb-5 leading-relaxed">
                          Create projects to organize related documents and chat with them in a dedicated context.
                        </p>
                        
                        <button
                          onClick={() => alert("Project creation is scheduled for later development days.")}
                          className="py-2 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-lg shadow-sm hover:shadow transition"
                        >
                          Create a project
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: MY DRIVE ('drive')
                      ========================================== */}
                  {activeTab === 'drive' && (
                    <>
                      {/* Suggested Folders section (Only visible on My Drive root) */}
                      {currentFolderId === null && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1 text-slate-400">
                            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-xs font-bold tracking-wide text-slate-400">Suggested folders</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {suggestedFoldersList.map(folder => (
                              <div
                                key={folder.id}
                                onClick={() => handleFolderClick(folder.id)}
                                className="group bg-slate-900/20 hover:bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/60 rounded-xl p-3.5 flex items-center justify-between transition cursor-pointer shadow-xs"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="p-2.5 rounded-lg bg-slate-950 text-indigo-400 border border-slate-850 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 transition shrink-0">
                                    <FolderIcon className="w-5 h-5" />
                                  </span>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-semibold text-slate-200 truncate" title={folder.name}>
                                      {folder.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500 mt-0.5">
                                      {folder.itemsCount}
                                    </span>
                                  </div>
                                </div>
                                <button className="p-1 rounded hover:bg-slate-800/50 text-slate-500 group-hover:text-slate-300 shrink-0" onClick={(e) => { e.stopPropagation(); alert("Actions menu is scheduled for Day 10+."); }}>
                                  <ThreeDotsIcon />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Normal Subfolders Section (Inside folder view) */}
                      {currentFolderId !== null && folderItems.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800/80">
                            Folders
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                            {folderItems.map(folder => (
                              <div
                                key={folder.id}
                                onClick={() => handleFolderClick(folder.id)}
                                className="group bg-slate-900/20 hover:bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between transition cursor-pointer select-none shadow-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-indigo-400 group-hover:text-indigo-300 shrink-0">
                                    <FolderIcon className="w-4 h-4" />
                                  </span>
                                  <span className="text-xs font-semibold text-slate-350 truncate" title={folder.name}>
                                    {folder.name}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => handleToggleStar(folder.id, e)}
                                  className="text-slate-600 hover:text-amber-400 p-0.5 rounded opacity-0 group-hover:opacity-100 transition shrink-0"
                                >
                                  {folder.starred ? <StarIconSolid /> : <StarIconOutline />}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Files Section */}
                      {fileItems.length > 0 && (
                        <div className="space-y-3 mt-6">
                          <div className="flex items-center gap-1 text-slate-400">
                            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-xs font-bold tracking-wide text-slate-400">Suggested files</span>
                          </div>

                          {viewMode === 'list' ? (
                            /* LIST VIEW TABLE */
                            <div className="border border-slate-800/60 rounded-xl overflow-hidden shadow-sm bg-slate-900/10">
                              <table className="min-w-full border-collapse text-left text-xs">
                                <thead>
                                  <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
                                    <th className="py-3 px-4 font-semibold w-1/3">Name</th>
                                    <th className="py-3 px-4 font-semibold w-1/4 hidden sm:table-cell">Reason suggested</th>
                                    <th className="py-3 px-4 font-semibold hidden md:table-cell">Owner</th>
                                    <th className="py-3 px-4 font-semibold hidden sm:table-cell">Location</th>
                                    <th className="py-3 px-4 w-12"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-850/60">
                                  {fileItems.map(file => (
                                    <tr key={file.id} className="group hover:bg-slate-800/35 text-slate-350 hover:text-white transition duration-150">
                                      <td className="py-2.5 px-4 font-medium">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <span className="shrink-0">{getFileIcon(file.extension)}</span>
                                          <span className="truncate max-w-[160px] sm:max-w-xs" title={file.name}>
                                            {file.name}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-4 text-slate-500 hidden sm:table-cell">
                                        {file.reasonSuggested || 'You opened • Aug 20'}
                                      </td>
                                      <td className="py-2.5 px-4 hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                          <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-[8px] uppercase">
                                            {file.owner === 'me' ? 'me' : file.owner.split(' ').map(n=>n[0]).join('')}
                                          </div>
                                          <span className="text-slate-400">{file.owner === 'me' ? 'me' : file.owner}</span>
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-4 text-slate-500 hidden sm:table-cell">
                                        <div className="flex items-center gap-1.5">
                                          <FolderIcon className="w-3.5 h-3.5 text-indigo-400/60" />
                                          <span>{file.location || 'My Drive'}</span>
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                          <button
                                            onClick={(e) => handleToggleStar(file.id, e)}
                                            className="text-slate-600 hover:text-amber-400 p-1 rounded hover:bg-slate-800/50 transition opacity-0 group-hover:opacity-100"
                                          >
                                            {file.starred ? <StarIconSolid /> : <StarIconOutline />}
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            /* GRID VIEW COMPACT CARDS */
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                              {fileItems.map(file => (
                                <div
                                  key={file.id}
                                  className="group bg-slate-900/20 hover:bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/60 rounded-xl p-3 flex flex-col justify-between h-24 transition cursor-pointer select-none shadow-xs"
                                >
                                  <div className="flex items-start justify-between">
                                    <span className="shrink-0">{getFileIcon(file.extension)}</span>
                                    <button
                                      onClick={(e) => handleToggleStar(file.id, e)}
                                      className="text-slate-600 hover:text-amber-400 p-0.5 rounded opacity-0 group-hover:opacity-100 transition shrink-0"
                                    >
                                      {file.starred ? <StarIconSolid /> : <StarIconOutline />}
                                    </button>
                                  </div>

                                  <div className="mt-2 min-w-0">
                                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 truncate" title={file.name}>
                                      {file.name}
                                    </h4>
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-medium">
                                      <span>{file.size}</span>
                                      <span>{file.updatedAt}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* ==========================================
                      RENDER: HOME ('home')
                      ========================================== */}
                  {activeTab === 'home' && (
                    <div className="space-y-6">
                      {/* Welcome banner */}
                      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800/60 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
                        <div className="space-y-1">
                          <h2 className="text-base font-bold text-slate-100">Welcome to Nexora Drive</h2>
                          <p className="text-xs text-slate-400">Access and organize all your files easily in one central cloud drive workspace.</p>
                        </div>
                        <div className="text-3xl hidden sm:block select-none">✨</div>
                      </div>

                      {/* Suggested Files Grid */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested files</h3>
                          <span className="text-[10px] text-slate-500 font-medium">Updated recently</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {items.filter(item => !item.inTrash && item.type === 'file').slice(0, 3).map(file => (
                            <div
                              key={file.id}
                              className="group bg-slate-900/20 hover:bg-slate-800/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between h-28 transition cursor-pointer shadow-xs"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="shrink-0">{getFileIcon(file.extension)}</span>
                                  <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 truncate" title={file.name}>
                                    {file.name}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => handleToggleStar(file.id, e)}
                                  className="text-slate-600 hover:text-amber-400 p-0.5 rounded opacity-0 group-hover:opacity-100 transition shrink-0"
                                >
                                  {file.starred ? <StarIconSolid /> : <StarIconOutline />}
                                </button>
                              </div>
                              <div className="mt-3 border-t border-slate-800/80 pt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                                <span className="truncate">Reason: {file.reasonSuggested}</span>
                                <span className="font-semibold text-slate-400">{file.size}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activities List */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                        <div className="border border-slate-800/60 rounded-xl overflow-hidden shadow-xs bg-slate-900/10">
                          <div className="divide-y divide-slate-850/60">
                            {items.filter(item => !item.inTrash).slice(0, 5).map(item => (
                              <div key={item.id} className="p-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-800/35 transition">
                                <div className="flex items-center gap-3 min-w-0">
                                  <span>{item.type === 'folder' ? <FolderIcon className="w-4 h-4 text-indigo-400" /> : getFileIcon(item.extension)}</span>
                                  <span className="font-medium text-slate-350 truncate">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-6 shrink-0 text-slate-500">
                                  <span>Modified {item.updatedAt}</span>
                                  <span className="hidden sm:inline w-16 text-right font-medium text-slate-400">{item.size}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: COMPUTERS ('computers')
                      ========================================== */}
                  {activeTab === 'computers' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 rounded-full bg-slate-900/60 border border-slate-800/60 flex items-center justify-center text-slate-500 mb-6 shadow-xs">
                        <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <rect width="18" height="12" x="3" y="4" rx="2"/>
                          <line x1="12" x2="12" y1="16" y2="20"/>
                          <line x1="8" x2="16" y1="20" y2="20"/>
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-white">No computers syncing</h3>
                      <p className="text-slate-400 text-xs max-w-sm mt-1.5 leading-relaxed">
                        Access folders from your computer globally. Download the Nexora Desktop client to automatically sync local workspaces.
                      </p>
                      <button
                        onClick={() => alert("Nexora Desktop App download is not available on this demonstration environment.")}
                        className="mt-6 py-2 px-5 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow transition"
                      >
                        Download Drive for Desktop
                      </button>
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: SHARED WITH ME ('shared')
                      ========================================== */}
                  {activeTab === 'shared' && (
                    <div className="space-y-3">
                      <div className="border border-slate-800/60 rounded-xl overflow-hidden shadow-xs bg-slate-900/10">
                        <table className="min-w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
                              <th className="py-3 px-4 font-semibold w-1/3">Name</th>
                              <th className="py-3 px-4 font-semibold">Shared by</th>
                              <th className="py-3 px-4 font-semibold">Share Date</th>
                              <th className="py-3 px-4 font-semibold w-24">Size</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850/60">
                            {fileItems.map(file => (
                              <tr key={file.id} className="hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                                <td className="py-3 px-4 font-medium">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="shrink-0">{getFileIcon(file.extension)}</span>
                                    <span className="truncate" title={file.name}>{file.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-[8px] uppercase">
                                      {file.owner === 'me' ? 'me' : file.owner.split(' ').map(n=>n[0]).join('')}
                                    </div>
                                    <span>{file.owner === 'me' ? 'me' : file.owner}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-slate-500">{file.updatedAt}</td>
                                <td className="py-3 px-4 text-slate-500">{file.size}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: RECENT ('recent')
                      ========================================== */}
                  {activeTab === 'recent' && (
                    <div className="space-y-3">
                      <div className="border border-slate-800/60 rounded-xl overflow-hidden shadow-xs bg-slate-900/10">
                        <table className="min-w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
                              <th className="py-3 px-4 font-semibold">Name</th>
                              <th className="py-3 px-4 font-semibold">Activity</th>
                              <th className="py-3 px-4 font-semibold">Date modified</th>
                              <th className="py-3 px-4 font-semibold w-24">Size</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850/60">
                            {fileItems.map(file => (
                              <tr key={file.id} className="hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                                <td className="py-3 px-4 font-medium">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="shrink-0">{getFileIcon(file.extension)}</span>
                                    <span className="truncate" title={file.name}>{file.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-slate-500">{file.reasonSuggested}</td>
                                <td className="py-3 px-4 text-slate-500">{file.updatedAt}</td>
                                <td className="py-3 px-4 text-slate-500">{file.size}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: STARRED ('starred')
                      ========================================== */}
                  {activeTab === 'starred' && (
                    <div className="space-y-6">
                      {folderItems.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starred Folders</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {folderItems.map(folder => (
                              <div
                                key={folder.id}
                                onClick={() => handleFolderClick(folder.id)}
                                className="group bg-slate-900/20 hover:bg-slate-800/40 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between transition cursor-pointer shadow-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-indigo-400 shrink-0">
                                    <FolderIcon className="w-4 h-4" />
                                  </span>
                                  <span className="text-xs font-semibold text-slate-200 truncate" title={folder.name}>
                                    {folder.name}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => handleToggleStar(folder.id, e)}
                                  className="text-amber-500 p-0.5 rounded transition shrink-0"
                                >
                                  <StarIconSolid />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {fileItems.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starred Files</h3>
                          <div className="border border-slate-800/60 rounded-xl overflow-hidden shadow-xs bg-slate-900/10">
                            <table className="min-w-full border-collapse text-left text-xs">
                              <thead>
                                <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
                                  <th className="py-3 px-4 font-semibold">Name</th>
                                  <th className="py-3 px-4 font-semibold">Owner</th>
                                  <th className="py-3 px-4 font-semibold">Modified</th>
                                  <th className="py-3 px-4 w-12"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-850/60">
                                {fileItems.map(file => (
                                  <tr key={file.id} className="group hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                                    <td className="py-2.5 px-4 font-medium">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="shrink-0">{getFileIcon(file.extension)}</span>
                                        <span className="truncate" title={file.name}>{file.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-500">{file.owner}</td>
                                    <td className="py-2.5 px-4 text-slate-500">{file.updatedAt}</td>
                                    <td className="py-2.5 px-4 text-right">
                                      <button
                                        onClick={(e) => handleToggleStar(file.id, e)}
                                        className="text-amber-500 p-1 rounded hover:bg-slate-800/50 transition"
                                      >
                                        <StarIconSolid />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: SPAM ('spam')
                      ========================================== */}
                  {activeTab === 'spam' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800/60 flex items-center justify-center text-slate-500 mb-4 shadow-xs">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-white">Your spam folder is clean</h3>
                      <p className="text-slate-400 text-xs max-w-xs mt-1">
                        Files that look suspicious will be sent here to keep your main workspace safe and organized.
                      </p>
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: TRASH ('trash')
                      ========================================== */}
                  {activeTab === 'trash' && (
                    <div className="space-y-4">
                      {/* Notice Banner */}
                      <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-300">
                        <AlertIcon />
                        <span>Items in trash will be permanently deleted automatically after 30 days.</span>
                      </div>

                      {filteredItems.length === 0 ? (
                        <div className="text-center py-20">
                          <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800/60 flex items-center justify-center text-slate-500 mx-auto mb-4">
                            <TrashIcon />
                          </div>
                          <h3 className="text-sm font-semibold text-white">Trash is empty</h3>
                          <p className="text-slate-400 text-xs mt-1">No deleted files or folders in your account.</p>
                        </div>
                      ) : (
                        <div className="border border-slate-800/60 rounded-xl overflow-hidden shadow-xs bg-slate-900/10">
                          <table className="min-w-full border-collapse text-left text-xs">
                            <thead>
                              <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
                                <th className="py-3 px-4 font-semibold">Name</th>
                                <th className="py-3 px-4 font-semibold">Date Deleted</th>
                                <th className="py-3 px-4 font-semibold w-24">Size</th>
                                <th className="py-3 px-4 w-28 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-850/60">
                              {filteredItems.map(item => (
                                <tr key={item.id} className="hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                                  <td className="py-2.5 px-4 font-medium">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className="shrink-0">{item.type === 'folder' ? <FolderIcon className="w-4 h-4 text-slate-400" /> : getFileIcon(item.extension)}</span>
                                      <span className="truncate" title={item.name}>{item.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-4 text-slate-500">{item.updatedAt}</td>
                                  <td className="py-2.5 px-4 text-slate-500">{item.size}</td>
                                  <td className="py-2.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      {/* Restore Action */}
                                      <button
                                        onClick={(e) => handleRestoreItem(item.id, e)}
                                        className="py-1 px-2 border border-slate-850 rounded hover:bg-slate-800 font-semibold text-indigo-400 transition"
                                        title="Restore item"
                                      >
                                        Restore
                                      </button>
                                      {/* Permanent Delete Action */}
                                      <button
                                        onClick={(e) => handleDeletePermanent(item.id, e)}
                                        className="p-1 rounded text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/40 transition"
                                        title="Delete permanently"
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: STORAGE ('storage')
                      ========================================== */}
                  {activeTab === 'storage' && (
                    <div className="space-y-6">
                      
                      {/* Storage utilization card */}
                      <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2.5 flex-1">
                          <h3 className="text-sm font-semibold text-slate-200">Nexora Cloud Storage Usage</h3>
                          <div className="text-3xl font-extrabold text-indigo-400">1.2 GB <span className="text-sm font-semibold text-slate-500">of 15 GB used (8%)</span></div>
                          
                          {/* Segmented storage progress bar */}
                          <div className="w-full bg-slate-950 border border-slate-850 rounded-full h-3 overflow-hidden flex">
                            <div className="bg-indigo-500 h-full" style={{ width: '4%' }} title="PDFs: 4.5 MB" />
                            <div className="bg-emerald-500 h-full" style={{ width: '2.5%' }} title="Spreadsheets: 3.2 MB" />
                            <div className="bg-purple-500 h-full" style={{ width: '1.2%' }} title="Audio: 6.4 MB" />
                            <div className="bg-amber-500 h-full" style={{ width: '0.3%' }} title="Archives: 142 MB" />
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-medium pt-1">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Documents & PDFs (4.5 MB)</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Spreadsheets (3.2 MB)</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Audio & Media (6.4 MB)</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> System Backups (142 MB)</span>
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col gap-2">
                          <button onClick={() => alert("Payment and upgrades are disabled in demo mode.")} className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow transition text-center">
                            Upgrade Storage Plan
                          </button>
                          <button onClick={resetFilters} className="py-2.5 px-5 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-full transition text-center">
                            Clean Up Files
                          </button>
                        </div>
                      </div>

                      {/* Largest Files Breakdown */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Largest files in your drive</h3>
                          <span className="text-[10px] text-slate-500">Used space rankings</span>
                        </div>

                        <div className="border border-slate-800/60 rounded-xl overflow-hidden shadow-xs bg-slate-900/10">
                          <table className="min-w-full border-collapse text-left text-xs">
                            <thead>
                              <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
                                <th className="py-3 px-4 font-semibold">Name</th>
                                <th className="py-3 px-4 font-semibold">Location</th>
                                <th className="py-3 px-4 font-semibold">Size</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-850/60">
                              {items.filter(item => !item.inTrash && item.type === 'file')
                                .sort((a,b) => {
                                  const parseSize = (sizeStr) => {
                                    const val = parseFloat(sizeStr);
                                    if (sizeStr.includes('MB')) return val * 1024;
                                    if (sizeStr.includes('KB')) return val;
                                    return val;
                                  };
                                  return parseSize(b.size) - parseSize(a.size);
                                })
                                .map(file => (
                                  <tr key={file.id} className="hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                                    <td className="py-3 px-4 font-medium">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="shrink-0">{getFileIcon(file.extension)}</span>
                                        <span className="truncate" title={file.name}>{file.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-500">{file.location || 'My Drive'}</td>
                                    <td className="py-3 px-4 font-semibold text-slate-400">{file.size}</td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

          {/* ==========================================
              RIGHT UTILITY RAIL (Google Workspace-style)
              ========================================== */}
          <aside className="w-12 bg-transparent flex flex-col items-center py-4 border-l border-slate-900/60 gap-6 z-10 shrink-0">
            <button className="p-2 rounded-full hover:bg-slate-900 transition active:scale-[0.98]" title="Calendar">
              <CalendarIcon />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-900 transition active:scale-[0.98]" title="Keep">
              <KeepIcon />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-900 transition active:scale-[0.98]" title="Tasks">
              <TasksIcon />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-900 transition active:scale-[0.98]" title="Contacts">
              <ContactsIcon />
            </button>

            <div className="w-6 border-b border-slate-800/60 my-1" />

            <button className="p-2 rounded-full border border-slate-800 hover:bg-slate-900 transition active:scale-[0.98]" title="Get Add-ons">
              <PlusIcon />
            </button>
          </aside>

        </div>
      </main>
    </div>
  );
}
