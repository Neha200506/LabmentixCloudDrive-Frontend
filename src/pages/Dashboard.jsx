import { useState, useEffect, useRef, useMemo, lazy } from 'react';
import mammoth from 'mammoth';
import { API_BASE_URL } from '../config';

import {
  GridIcon,
  ListIcon,
  SearchIcon
} from '../components/Icons';
import { getFileIcon, formatSize } from '../utils/dashboardUtils';

import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import FileList from '../components/dashboard/FileList';
import FileGrid from '../components/dashboard/FileGrid';
import HomeSection from '../components/dashboard/HomeSection';
import TrashSection from '../components/dashboard/TrashSection';
import StarredSection from '../components/dashboard/StarredSection';
import FilterBar from '../components/dashboard/FilterBar';
import StorageSection from '../components/dashboard/StorageSection';
import DashboardModals from '../components/dashboard/DashboardModals';

const FilePreviewModal = lazy(() => import('../components/FilePreviewModal'));
const ShareModal = lazy(() => import('../components/dashboard/ShareModal'));
const VersionHistoryModal = lazy(() => import('../components/dashboard/VersionHistoryModal'));
const parseSizeInBytes = (sizeStr) => {
  if (!sizeStr || sizeStr === '-' || sizeStr === '--') return 0;
  const str = String(sizeStr).trim().toUpperCase();
  const match = str.match(/^([\d.]+)\s*([A-Z]+)?$/);
  if (!match) return 0;
  const num = parseFloat(match[1]) || 0;
  const unit = match[2] || 'B';
  if (unit === 'KB' || unit === 'K') return num * 1024;
  if (unit === 'MB' || unit === 'M') return num * 1024 * 1024;
  if (unit === 'GB' || unit === 'G') return num * 1024 * 1024 * 1024;
  if (unit === 'TB' || unit === 'T') return num * 1024 * 1024 * 1024 * 1024;
  return num;
};

const sortItemsList = (itemsList, currentSortBy, currentSortOrder) => {
  return [...itemsList].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    let res = 0;
    if (currentSortBy === 'name') {
      res = (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' });
    } else if (currentSortBy === 'size') {
      const sizeA = typeof a.sizeBytes === 'number' ? a.sizeBytes : parseSizeInBytes(a.size);
      const sizeB = typeof b.sizeBytes === 'number' ? b.sizeBytes : parseSizeInBytes(b.size);
      res = sizeA - sizeB;
    } else if (currentSortBy === 'date' || currentSortBy === 'modified') {
      const dateA = a._time || (a._time = new Date(a.createdAt || a.updatedAt || 0).getTime());
      const dateB = b._time || (b._time = new Date(b.createdAt || b.updatedAt || 0).getTime());
      res = dateA - dateB;
    }
    return currentSortOrder === 'desc' ? -res : res;
  });
};


export default function Dashboard({ onNavigate, user }) {
  const displayUser = user || { email: '', full_name: 'Nexora User' };
  const displayName = displayUser.full_name || displayUser.name || 'Nexora User';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTextContent, setPreviewTextContent] = useState('');
  const [previewDocxHtml, setPreviewDocxHtml] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [selectedShareFile, setSelectedShareFile] = useState(null);
  const [selectedVersionFile, setSelectedVersionFile] = useState(null);
  const [activeTab, setActiveTab] = useState('drive'); // home, projects, drive, computers, shared, recent, starred, spam, trash, storage
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const dataCacheRef = useRef(new Map());

  const invalidateCache = () => {
    dataCacheRef.current.clear();
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const userKey = displayUser.email || displayUser.id || 'default';
  const [recentActivityMap, setRecentActivityMap] = useState(() => {
    try {
      const saved = localStorage.getItem(`nexora_recent_activity_${userKey}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`nexora_recent_activity_${userKey}`);
      if (saved) {
        queueMicrotask(() => {
          setRecentActivityMap(JSON.parse(saved));
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [userKey]);

  const trackItemActivity = (itemId, actionType = 'Opened') => {
    if (!itemId) return;
    const now = Date.now();
    setRecentActivityMap(prev => {
      const next = {
        ...prev,
        [itemId]: { lastAccessedAt: now, actionType }
      };
      try {
        localStorage.setItem(`nexora_recent_activity_${userKey}`, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };
  const [viewMode, setViewModeState] = useState(() => {
    return localStorage.getItem(`nexora_view_mode_${userKey}`) || 'list';
  });

  const setViewMode = (mode) => {
    setViewModeState(mode);
    localStorage.setItem(`nexora_view_mode_${userKey}`, mode);
  };

  useEffect(() => {
    const saved = localStorage.getItem(`nexora_view_mode_${userKey}`);
    if (saved) {
      const timer = setTimeout(() => setViewModeState(saved), 0);
      return () => clearTimeout(timer);
    }
  }, [userKey]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleUploadFile = async (file) => {
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (currentFolderId) {
      formData.append("folder_id", currentFolderId);
    }
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "File upload failed");
      }

      const uploadedFile = data.file;
      const fileSizeNum = Number(uploadedFile.file_size) || parseSizeInBytes(formatSize(uploadedFile.file_size));
      const newFileItem = {
        id: uploadedFile.id,
        name: uploadedFile.file_name,
        type: "file",
        extension: uploadedFile.file_name.split(".").pop().toLowerCase(),
        parentId: uploadedFile.folder_id,
        starred: false,
        inTrash: false,
        createdAt: uploadedFile.created_at || new Date().toISOString(),
        updatedAt: uploadedFile.created_at ? new Date(uploadedFile.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        owner: 'me',
        size: formatSize(uploadedFile.file_size || fileSizeNum),
        sizeBytes: fileSizeNum,
        location: 'My Drive',
        reasonSuggested: 'Opened recently',
      };

      setItems((prev) => [newFileItem, ...prev]);
      trackItemActivity(uploadedFile.id, 'Uploaded');
      showNotification("success", `"${file.name}" uploaded successfully!`);
      invalidateCache();
      await fetchDashboardData(false, true);
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  const findOrCreateFolder = async (pathSegments, parentId, pathMap) => {
    let currentParentId = parentId;
    let accumulatedPath = "";

    for (const segment of pathSegments) {
      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${segment}` : segment;

      if (pathMap[accumulatedPath]) {
        currentParentId = pathMap[accumulatedPath];
        continue;
      }

      const existingFolder = items.find(
        item => item.type === 'folder' &&
          item.name.toLowerCase() === segment.toLowerCase() &&
          (item.parentId === currentParentId || (!item.parentId && !currentParentId))
      );

      if (existingFolder) {
        pathMap[accumulatedPath] = existingFolder.id;
        currentParentId = existingFolder.id;
      } else {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/folders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: segment,
            parent_folder_id: currentParentId,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `Failed to create folder "${segment}"`);
        }

        const newFolder = data.folder;
        const newFolderItem = {
          id: newFolder.id,
          name: newFolder.name,
          type: 'folder',
          parentId: newFolder.parent_folder_id,
          starred: false,
          inTrash: false,
          createdAt: newFolder.created_at,
          updatedAt: '2026-08-30',
        };

        setItems((prev) => [newFolderItem, ...prev]);

        pathMap[accumulatedPath] = newFolder.id;
        currentParentId = newFolder.id;
      }
    }

    return currentParentId;
  };

  const handleUploadFolder = async (files) => {
    if (!files || files.length === 0) return;

    const token = localStorage.getItem("token");
    setIsLoading(true);
    showNotification("success", `Starting folder upload (${files.length} files)...`);

    const pathMap = {};
    let successCount = 0;

    try {
      for (const file of files) {
        const relativePath = file.webkitRelativePath;
        if (!relativePath) {
          await handleUploadFile(file);
          successCount++;
          continue;
        }

        const parts = relativePath.split('/');
        parts.pop();
        const pathSegments = parts;

        const targetFolderId = await findOrCreateFolder(pathSegments, currentFolderId, pathMap);

        const formData = new FormData();
        if (targetFolderId) {
          formData.append("folder_id", targetFolderId);
        }
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `Failed to upload "${file.name}"`);
        }

        const uploadedFile = data.file;
        const fileSizeNum = Number(uploadedFile.file_size) || parseSizeInBytes(formatSize(uploadedFile.file_size));
        const newFileItem = {
          id: uploadedFile.id,
          name: uploadedFile.file_name,
          type: "file",
          extension: uploadedFile.file_name.split(".").pop().toLowerCase(),
          parentId: uploadedFile.folder_id,
          starred: false,
          inTrash: false,
          createdAt: uploadedFile.created_at || new Date().toISOString(),
          updatedAt: uploadedFile.created_at ? new Date(uploadedFile.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          owner: 'me',
          size: formatSize(uploadedFile.file_size || fileSizeNum),
          sizeBytes: fileSizeNum,
          location: 'My Drive',
          reasonSuggested: 'Opened recently',
        };

        setItems((prev) => [newFileItem, ...prev]);
        successCount++;
      }

      showNotification("success", `Folder uploaded successfully: ${successCount} files.`);
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      setIsLoading(false);
      invalidateCache();
      await fetchDashboardData(false, true);
    }
  };

  const handlePreviewFile = async (file) => {
    if (!file) return;
    trackItemActivity(file.id, 'Opened');

    setSelectedPreviewFile(file);
    setPreviewLoading(true);
    setPreviewUrl('');
    setPreviewTextContent('');
    setPreviewDocxHtml('');
    setPreviewError('');

    const token = localStorage.getItem("token");
    const isText = ['txt', 'html', 'css', 'js', 'jsx', 'json', 'md'].includes(file.extension);
    const isDocx = ['docx', 'doc'].includes(file.extension);

    try {
      const response = await fetch(`${API_BASE_URL}/api/files/${file.id}/url`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch file URL");
      }

      setPreviewUrl(data.url);

      const freshUrl = data.url ? `${data.url}${data.url.includes('?') ? '&' : '?'}t=${Date.now()}` : '';

      if (isText) {
        const textRes = await fetch(freshUrl || data.url);
        if (!textRes.ok) {
          throw new Error("Failed to load text content");
        }
        const text = await textRes.text();
        setPreviewTextContent(text);
      }

      if (isDocx) {
        try {
          const docxRes = await fetch(freshUrl || data.url);
          if (!docxRes.ok) {
            throw new Error("Failed to download document for preview");
          }
          const arrayBuffer = await docxRes.arrayBuffer();
          try {
            const result = await mammoth.convertToHtml(
              { arrayBuffer },
              {
                styleMap: [
                  "u => u",
                  "p[style-name='align-left'] => p[align='left']:fresh",
                  "p[style-name='align-center'] => p[align='center']:fresh",
                  "p[style-name='align-right'] => p[align='right']:fresh",
                  "p[style-name='align-justify'] => p[align='justify']:fresh"
                ],
                transformDocument: mammoth.transforms.paragraph((paragraph) => {
                  if (paragraph.alignment) {
                    return {
                      ...paragraph,
                      styleName: paragraph.styleName ? `${paragraph.styleName} align-${paragraph.alignment}` : `align-${paragraph.alignment}`
                    };
                  }
                  return paragraph;
                })
              }
            );
            setPreviewDocxHtml(result.value || "<p>Empty document.</p>");
          } catch (mammothErr) {
            const textDecoder = new TextDecoder("utf-8");
            const textContent = textDecoder.decode(arrayBuffer);
            if (textContent && textContent.trim()) {
              setPreviewDocxHtml(`<div className="whitespace-pre-wrap font-sans text-sm">${textContent}</div>`);
            } else {
              throw mammothErr;
            }
          }
        } catch (err) {
          console.error("DOCX conversion error:", err);
          setPreviewError("Could not convert DOCX file to preview format.");
        }
      }
    } catch (error) {
      showNotification("error", error.message);
      setSelectedPreviewFile(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPreviewFile(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchDashboardData = async (showShimmer = true, bypassCache = false) => {
    const cacheKey = `${activeTab}:${currentFolderId || 'root'}`;
    const cachedItems = dataCacheRef.current.get(cacheKey);

    if (!bypassCache && cachedItems) {
      setItems(cachedItems);
      setIsLoading(false);
    } else if (showShimmer) {
      setIsLoading(true);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 1. Fetch folders
      let foldersUrl = `${API_BASE_URL}/api/folders`;
      if (activeTab === 'trash') {
        foldersUrl = `${API_BASE_URL}/api/folders/trash`;
      }

      const foldersRes = await fetch(foldersUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const foldersData = await foldersRes.json();
      const backendFolders = foldersData.folders || [];

      // 2. Fetch files
      let filesUrl = `${API_BASE_URL}/api/files?limit=1000`;
      if (activeTab === 'trash') {
        filesUrl = `${API_BASE_URL}/api/files/trash`;
      }

      const filesRes = await fetch(filesUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filesData = await filesRes.json();
      const backendFiles = filesData.files || [];

      // Format folders
      const formattedFolders = backendFolders.map(folder => ({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        parentId: folder.parent_folder_id,
        starred: folder.is_starred || false,
        inTrash: activeTab === 'trash' || folder.deleted_at !== null,
        createdAt: folder.created_at || new Date().toISOString(),
        updatedAt: folder.created_at ? new Date(folder.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      }));

      // Format files
      const formattedFiles = backendFiles.map(file => ({
        id: file.id,
        name: file.file_name,
        type: 'file',
        extension: file.file_name.split('.').pop().toLowerCase(),
        parentId: file.folder_id,
        starred: file.is_starred || false,
        inTrash: activeTab === 'trash' || file.deleted_at !== null,
        createdAt: file.created_at || new Date().toISOString(),
        updatedAt: file.created_at ? new Date(file.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        owner: file.is_shared ? (file.owner_id || file.owner_name || 'Owner') : 'me',
        shared: Boolean(file.is_shared),
        shared_permission: file.shared_permission,
        permission: file.shared_permission || 'owner',
        size: formatSize(file.file_size),
        sizeBytes: Number(file.file_size) || 0,
        location: activeTab === 'trash' ? 'Trash' : 'My Drive',
        reasonSuggested: 'Opened recently',
      }));

      const fetchedItems = [...formattedFolders, ...formattedFiles];
      dataCacheRef.current.set(cacheKey, fetchedItems);

      const currentKey = `${activeTab}:${currentFolderId || 'root'}`;
      if (cacheKey === currentKey) {
        setItems(fetchedItems);
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
    } finally {
      const currentKey = `${activeTab}:${currentFolderId || 'root'}`;
      if (cacheKey === currentKey) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentFolderId]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (activeTab !== 'drive') return;
    dragCounterRef.current++;
    if (dragCounterRef.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (activeTab !== 'drive') return;
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounterRef.current = 0;

    if (activeTab !== 'drive') return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleUploadFile(files[0]);
    }
  };

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentFolderId]);

  const handleRenameFolderPrompt = async (folderId, currentName) => {
    const newName = prompt("Rename folder:", currentName);
    if (!newName || newName === currentName) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to rename folder');
      }

      invalidateCache();
      await fetchDashboardData(false, true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm("Are you sure you want to move this folder to trash?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete folder');
      }

      invalidateCache();
      await fetchDashboardData(false, true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRenameFilePrompt = async (fileId, currentName) => {
    const item = items.find(i => i.id === fileId);
    const perm = (item?.permission || item?.shared_permission || '').toLowerCase();
    if (item && item.shared && (perm === 'view' || perm === 'viewer')) {
      alert("You do not have permission to edit this file");
      return;
    }

    const newName = prompt("Rename file:", currentName);
    if (!newName || newName === currentName) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ file_name: newName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to rename file');
      }

      invalidateCache();
      await fetchDashboardData(false, true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteFile = async (fileId) => {
    const item = items.find(i => i.id === fileId);
    const perm = (item?.permission || item?.shared_permission || '').toLowerCase();
    if (item && item.shared && (perm === 'view' || perm === 'viewer')) {
      alert("You do not have permission to delete this file");
      return;
    }

    if (!confirm("Are you sure you want to move this file to trash?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete file');
      }

      invalidateCache();
      await fetchDashboardData(false, true);
    } catch (error) {
      alert(error.message);
    }
  };

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
  const [peopleOptions, setPeopleOptions] = useState([]);
  const filteredPeople = peopleOptions.filter(p =>
    p.name.toLowerCase().includes(peopleSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(peopleSearch.toLowerCase())
  );
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
  
        const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const users = (data.users || []).map(user => ({
            id: user.id,
            name: user.full_name || user.email,
            email: user.email,
            initials: (user.full_name || user.email)
              .split(' ')
              .map(part => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase(),
          }));
  
          setPeopleOptions(users);
        }
      } catch (error) {
      console.error('Failed to fetch people:', error);
      }
    };
    fetchPeople();
  }, []);
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
    trackItemActivity(folderId, 'Opened');
    setActiveTab('drive'); // Always switch to My Drive view when exploring folders
    setSearchQuery('');
    setActiveFilterDropdown(null);
    window.history.pushState({ folderId, tab: 'drive' }, '', '');
  };

  // Star / Unstar toggling
  const handleToggleStar = async (itemId, e) => {
    e.stopPropagation();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    trackItemActivity(itemId, 'Starred');

    setItems(prevItems =>
      prevItems.map(i =>
        i.id === itemId ? { ...i, starred: !i.starred } : i
      )
    );

    try {
      const token = localStorage.getItem('token');
      const route = item.type === 'folder' ? 'folders' : 'files';
      const response = await fetch(`${API_BASE_URL}/api/${route}/${itemId}/star`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle star');
      }
      invalidateCache();
      await fetchDashboardData(false, true);
    } catch (error) {
      showNotification("error", error.message);
      setItems(prevItems =>
        prevItems.map(i =>
          i.id === itemId ? { ...i, starred: !i.starred } : i
        )
      );
    }
  };

  // Trash actions
  const handleRestoreItem = async (itemId, e) => {
    e.stopPropagation();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    try {
      const token = localStorage.getItem('token');
      const route = item.type === 'folder' ? 'folders' : 'files';
      const response = await fetch(`${API_BASE_URL}/api/${route}/${itemId}/restore`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to restore item');
      }
      showNotification("success", `${item.type === 'folder' ? 'Folder' : 'File'} restored successfully.`);
      invalidateCache();
      await fetchDashboardData(false, true);
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  const handleDeletePermanent = async (itemId, e) => {
    e.stopPropagation();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (!confirm(`Are you sure you want to permanently delete this ${item.type === 'folder' ? 'folder' : 'file'}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const route = item.type === 'folder' ? 'folders' : 'files';
      const response = await fetch(`${API_BASE_URL}/api/${route}/${itemId}/permanent`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to permanently delete item');
      }
      showNotification("success", `${item.type === 'folder' ? 'Folder' : 'File'} permanently deleted.`);
      invalidateCache();
      await fetchDashboardData(false, true);
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  const handleEmptyTrash = () => {
    if (confirm("Empty trash? All items in the trash will be permanently deleted.")) {
      invalidateCache();
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

  const filteredItems = useMemo(() => {
    let baseItems = [];
    const activeItems = items.map(item => {
      const activity = recentActivityMap[item.id];
      return {
        ...item,
        lastAccessedAt: activity?.lastAccessedAt || new Date(item.createdAt || item.updatedAt || 0).getTime(),
        lastActionType: activity?.actionType || 'Modified',
      };
    }).filter(item => !item.inTrash);

    const isFilterActive = filterType !== 'all' || filterOwner !== 'all' || (filterModified !== 'all' && filterModified !== 'anytime') || searchQuery.trim() !== '';

    if (activeTab === 'trash') {
      baseItems = items.filter(item => item.inTrash === true);
    } else if (activeTab === 'drive') {
      if (isFilterActive) {
        if (currentFolderId === null) {
          // At My Drive root: filter across ALL accessible items globally
          baseItems = activeItems;
        } else {
          // Inside a folder: filter across all items in this folder's subtree
          const subtreeFolderIds = new Set([currentFolderId]);
          let addedNew = true;
          while (addedNew) {
            addedNew = false;
            for (const item of activeItems) {
              if (item.type === 'folder' && item.parentId && subtreeFolderIds.has(item.parentId) && !subtreeFolderIds.has(item.id)) {
                subtreeFolderIds.add(item.id);
                addedNew = true;
              }
            }
          }
          baseItems = activeItems.filter(item => item.parentId && subtreeFolderIds.has(item.parentId));
        }
      } else {
        baseItems = activeItems.filter(item => (item.parentId || null) === (currentFolderId || null));
      }
    } else if (activeTab === 'home') {
      baseItems = activeItems;
    } else if (activeTab === 'recent') {
      const hasTracked = Object.keys(recentActivityMap).length > 0;
      baseItems = activeItems
        .filter(item => hasTracked ? Boolean(recentActivityMap[item.id]?.lastAccessedAt) : true)
        .sort((a, b) => (b.lastAccessedAt || 0) - (a.lastAccessedAt || 0));
    } else if (activeTab === 'starred') {
      baseItems = activeItems.filter(item => item.starred);
    } else if (activeTab === 'shared') {
      baseItems = activeItems.filter(item => item.shared);
    } else if (activeTab === 'computers' || activeTab === 'spam' || activeTab === 'projects') {
      baseItems = [];
    } else if (activeTab === 'storage') {
      baseItems = activeItems;
    }

    // Apply interactive filter criteria
    if (['drive', 'shared', 'recent', 'starred', 'trash', 'home', 'storage'].includes(activeTab)) {
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

      if (filterOwner !== 'all') {
        if (filterOwner === 'link') {
          baseItems = baseItems.filter(item => item.shared === true);
        } else {
          baseItems = baseItems.filter(item => item.owner === filterOwner);
        }
      }

      if (filterModified !== 'all' && filterModified !== 'anytime') {
        const now = new Date();
        const nowTime = now.getTime();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        baseItems = baseItems.filter(item => {
          const rawDate = item.createdAt || item.updatedAt;
          if (!rawDate) return false;
          const itemTime = new Date(rawDate).getTime();
          if (isNaN(itemTime) || itemTime === 0) return false;

          if (filterModified === 'today') {
            return itemTime >= startOfToday || (nowTime - itemTime <= 24 * 60 * 60 * 1000);
          } else if (filterModified === '7days') {
            return (nowTime - itemTime) <= 7 * 24 * 60 * 60 * 1000;
          } else if (filterModified === '30days') {
            return (nowTime - itemTime) <= 30 * 24 * 60 * 60 * 1000;
          } else if (filterModified === 'thisyear') {
            return new Date(itemTime).getFullYear() === now.getFullYear();
          } else if (filterModified === 'lastyear') {
            return new Date(itemTime).getFullYear() === (now.getFullYear() - 1);
          } else if (filterModified === 'custom') {
            let matches = true;
            if (customStart) {
              const startT = new Date(customStart).getTime();
              if (!isNaN(startT) && itemTime < startT) matches = false;
            }
            if (customEnd) {
              const endT = new Date(customEnd).setHours(23, 59, 59, 999);
              if (!isNaN(endT) && itemTime > endT) matches = false;
            }
            return matches;
          }
          return true;
        });
      }
    }

    let resultItems = baseItems;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      resultItems = baseItems.filter(item => item.name.toLowerCase().includes(query));
    }

    if (activeTab === 'recent' && sortBy === 'name') {
      return resultItems;
    }
    return sortItemsList(resultItems, sortBy, sortOrder);
  }, [items, activeTab, currentFolderId, filterType, filterOwner, filterModified, customStart, customEnd, searchQuery, sortBy, sortOrder, recentActivityMap]);

  const breadcrumbs = buildBreadcrumbs();

  const folderItems = useMemo(() => filteredItems.filter(item => item.type === 'folder'), [filteredItems]);
  const fileItems = useMemo(() => filteredItems.filter(item => item.type === 'file'), [filteredItems]);

  // Dynamic storage calculations based on actual user files
  const activeFilesForStorage = useMemo(() => items.filter(item => !item.inTrash && item.type === 'file'), [items]);

  const totalUsedStorageBytes = useMemo(() => {
    return activeFilesForStorage.reduce((acc, f) => {
      const bytes = (typeof f.sizeBytes === 'number' && !isNaN(f.sizeBytes) && f.sizeBytes > 0) ? f.sizeBytes : parseSizeInBytes(f.size);
      return acc + bytes;
    }, 0);
  }, [activeFilesForStorage]);

  const totalStorageCapacityBytes = 15 * 1024 * 1024 * 1024; // 15 GB

  const usedPercentStr = useMemo(() => {
    if (totalUsedStorageBytes <= 0) return '0';
    const pct = (totalUsedStorageBytes / totalStorageCapacityBytes) * 100;
    return pct < 0.1 ? '< 0.1' : pct.toFixed(1);
  }, [totalUsedStorageBytes, totalStorageCapacityBytes]);

  const storageCategories = useMemo(() => {
    const cats = [
      { id: 'docs', label: 'Documents & PDFs', exts: ['pdf', 'docx', 'doc', 'txt', 'md', 'rtf'], color: 'bg-indigo-500', bytes: 0 },
      { id: 'sheets', label: 'Spreadsheets', exts: ['xlsx', 'xls', 'csv'], color: 'bg-emerald-500', bytes: 0 },
      { id: 'media', label: 'Audio & Media', exts: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'mp4', 'mkv', 'avi', 'mov', 'webm'], color: 'bg-purple-500', bytes: 0 },
      { id: 'backups', label: 'System Backups', exts: ['zip', 'tar', 'gz', 'rar', '7z', 'bak', 'iso'], color: 'bg-amber-500', bytes: 0 },
    ];

    activeFilesForStorage.forEach(file => {
      const ext = (file.extension || '').toLowerCase();
      const bytes = (typeof file.sizeBytes === 'number' && !isNaN(file.sizeBytes) && file.sizeBytes > 0) ? file.sizeBytes : parseSizeInBytes(file.size);
      const matched = cats.find(c => c.exts.includes(ext));
      if (matched) {
        matched.bytes += bytes;
      } else {
        cats[0].bytes += bytes;
      }
    });

    return cats;
  }, [activeFilesForStorage]);

  // People dropdown lists search filter

  const handleCreateFolderPrompt = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/folders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: folderName,
          parent_folder_id: currentFolderId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create folder");
      }

      if (data.folder?.id) {
        trackItemActivity(data.folder.id, 'Created');
      }
      invalidateCache();
      await fetchDashboardData(false, true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveFileContent = async (fileId, newContent) => {
    try {
      const jwtToken = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/files/${fileId}/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ content: newContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save file content");
      }
      showNotification("success", "File content saved successfully");

      setPreviewDocxHtml(newContent);
      setPreviewTextContent(newContent);

      if (selectedPreviewFile) {
        handlePreviewFile(selectedPreviewFile);
      }

      trackItemActivity(fileId, 'Modified');
      invalidateCache();
      fetchDashboardData(false, true);
    } catch (err) {
      showNotification("error", err.message);
      throw err;
    }
  };

  const handleOpenVersionHistory = (file) => {
    setSelectedVersionFile(file);
  };

  const handleVersionRestoreSuccess = async (fileId) => {
    invalidateCache();
    await fetchDashboardData(false, true);
    if (selectedPreviewFile && selectedPreviewFile.id === fileId) {
      handlePreviewFile(selectedPreviewFile);
    }
  };

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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isNewMenuOpen={isNewMenuOpen}
        setIsNewMenuOpen={setIsNewMenuOpen}
        activeTab={activeTab}
        handleTabSwitch={handleTabSwitch}
        handleUploadFile={handleUploadFile}
        handleUploadFolder={handleUploadFolder}
        onCreateFolderClick={handleCreateFolderPrompt}
      />

      {/* ==========================================
          MAIN AREA (Header + Floated Workspace)
          ========================================== */}
      <main className="flex-1 flex flex-col h-screen min-w-0">

        {/* TOP HEADER */}
        <DashboardHeader
          setIsSidebarOpen={setIsSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          initials={initials}
          displayName={displayName}
          displayUser={displayUser}
          onNavigate={onNavigate}
        />

        {/* WORKSPACE CONTENT BODY */}
        <div className="workspace-content-body flex-1 flex overflow-hidden">

          {/* Main Workspace Card */}
          <div className="flex-1 bg-slate-900/30 border border-slate-800/60 m-2 mr-1 flex flex-col overflow-hidden shadow-xs rounded-2xl relative">
            {isDragging && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 border-2 border-dashed border-indigo-500 rounded-2xl m-0.5 backdrop-blur-xs pointer-events-none animate-in fade-in duration-150">
                <svg className="w-12 h-12 text-indigo-400 animate-bounce mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm font-semibold text-white">Drop your file here</span>
                <span className="text-xs text-slate-400 mt-1">Upload directly to this folder</span>
              </div>
            )}

            {/* Title / Action Bar */}
            <div className="px-6 py-4.5 border-b border-slate-800/60 flex items-center justify-between shrink-0">
              <div className="flex flex-col gap-1 min-w-0">
                {activeTab === 'drive' ? (
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
                    {breadcrumbs.map((crumb, index) => (
                      <div key={crumb.id || 'root'} className="flex items-center gap-1 shrink-0">
                        {index > 0 && (
                          <svg className="w-3.5 h-3.5 text-slate-600 mx-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7-7" />
                          </svg>
                        )}
                        <button
                          onClick={() => handleFolderClick(crumb.id)}
                          className={`text-lg font-semibold hover:text-indigo-400 hover:underline transition ${index === breadcrumbs.length - 1 ? 'text-white' : 'text-slate-400'
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
                      className={`p-1.5 rounded-md transition duration-150 ${viewMode === 'list'
                        ? 'bg-slate-800 text-indigo-400'
                        : 'text-slate-500 hover:text-slate-300'
                        }`}
                      title="List view"
                    >
                      <ListIcon />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition duration-150 ${viewMode === 'grid'
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
            <FilterBar
              activeTab={activeTab}
              filterType={filterType}
              setFilterType={setFilterType}
              filterOwner={filterOwner}
              setFilterOwner={setFilterOwner}
              filterModified={filterModified}
              setFilterModified={setFilterModified}
              filterSource={filterSource}
              activeFilterDropdown={activeFilterDropdown}
              setActiveFilterDropdown={setActiveFilterDropdown}
              peopleSearch={peopleSearch}
              setPeopleSearch={setPeopleSearch}
              filteredPeople={filteredPeople}
              tempModified={tempModified}
              setTempModified={setTempModified}
              customStart={customStart}
              setCustomStart={setCustomStart}
              customEnd={customEnd}
              setCustomEnd={setCustomEnd}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              resetFilters={resetFilters}
            />

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
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow transition"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" x2="12" y1="5" y2="19" />
                            <line x1="5" x2="19" y1="12" y2="12" />
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
                      {/* Folders Section */}
                      {folderItems.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1 text-slate-400">
                            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                            <span className="text-xs font-bold tracking-wide text-slate-400">Folders</span>
                          </div>

                          <FileGrid
                            items={folderItems}
                            viewType="folder"
                            onFolderClick={handleFolderClick}
                            onToggleStar={handleToggleStar}
                            onRenameFolder={handleRenameFolderPrompt}
                            onDeleteFolder={handleDeleteFolder}
                          />
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
                            <FileList
                              items={fileItems}
                              activeTab="drive"
                              onPreviewFile={handlePreviewFile}
                              onToggleStar={handleToggleStar}
                              onRenameFile={handleRenameFilePrompt}
                              onDeleteFile={handleDeleteFile}
                              onShareFile={setSelectedShareFile}
                              sortBy={sortBy}
                              sortOrder={sortOrder}
                              onSort={handleSortChange}
                            />
                          ) : (
                            <FileGrid
                              items={fileItems}
                              viewType="file"
                              onPreviewFile={handlePreviewFile}
                              onToggleStar={handleToggleStar}
                              onRenameFile={handleRenameFilePrompt}
                              onDeleteFile={handleDeleteFile}
                              onShareFile={setSelectedShareFile}
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* ==========================================
                      RENDER: HOME ('home')
                      ========================================== */}
                  {activeTab === 'home' && (
                    <HomeSection
                      items={filteredItems}
                      onPreviewFile={handlePreviewFile}
                      onToggleStar={handleToggleStar}
                      onShareFile={setSelectedShareFile}
                      onFolderClick={handleFolderClick}
                      onRenameFolder={handleRenameFolderPrompt}
                      onDeleteFolder={handleDeleteFolder}
                      onRenameFile={handleRenameFilePrompt}
                      onDeleteFile={handleDeleteFile}
                      viewMode={viewMode}
                    />
                  )}

                  {/* ==========================================
                      RENDER: COMPUTERS ('computers')
                      ========================================== */}
                  {activeTab === 'computers' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 rounded-full bg-slate-900/60 border border-slate-800/60 flex items-center justify-center text-slate-500 mb-6 shadow-xs">
                        <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <rect width="18" height="12" x="3" y="4" rx="2" />
                          <line x1="12" x2="12" y1="16" y2="20" />
                          <line x1="8" x2="16" y1="20" y2="20" />
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
                      {viewMode === 'list' ? (
                        <FileList
                          items={fileItems}
                          activeTab="shared"
                          onPreviewFile={handlePreviewFile}
                          onShareFile={setSelectedShareFile}
                          sortBy={sortBy}
                          sortOrder={sortOrder}
                          onSort={handleSortChange}
                        />
                      ) : (
                        <FileGrid
                          items={fileItems}
                          viewType="file"
                          onPreviewFile={handlePreviewFile}
                          onShareFile={setSelectedShareFile}
                        />
                      )}
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: RECENT ('recent')
                      ========================================== */}
                  {activeTab === 'recent' && (
                    <div className="space-y-3">
                      {viewMode === 'list' ? (
                        <FileList
                          items={fileItems}
                          activeTab="recent"
                          onPreviewFile={handlePreviewFile}
                          onShareFile={setSelectedShareFile}
                          sortBy={sortBy}
                          sortOrder={sortOrder}
                          onSort={handleSortChange}
                        />
                      ) : (
                        <FileGrid
                          items={fileItems}
                          viewType="file"
                          onPreviewFile={handlePreviewFile}
                          onShareFile={setSelectedShareFile}
                        />
                      )}
                    </div>
                  )}

                  {/* ==========================================
                      RENDER: STARRED ('starred')
                      ========================================== */}
                  {activeTab === 'starred' && (
                    <StarredSection
                      folderItems={folderItems}
                      fileItems={fileItems}
                      onFolderClick={handleFolderClick}
                      onToggleStar={handleToggleStar}
                      onPreviewFile={handlePreviewFile}
                      onShareFile={setSelectedShareFile}
                      onRenameFolder={handleRenameFolderPrompt}
                      onDeleteFolder={handleDeleteFolder}
                      onRenameFile={handleRenameFilePrompt}
                      onDeleteFile={handleDeleteFile}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSortChange}
                      viewMode={viewMode}
                    />
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
                    <TrashSection
                      items={filteredItems}
                      onRestoreItem={handleRestoreItem}
                      onDeletePermanent={handleDeletePermanent}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSortChange}
                    />
                  )}

                  {/* ==========================================
                      RENDER: STORAGE ('storage')
                      ========================================== */}
                  {activeTab === 'storage' && (
                    <StorageSection
                      totalUsedStorageBytes={totalUsedStorageBytes}
                      totalStorageCapacityBytes={totalStorageCapacityBytes}
                      usedPercentStr={usedPercentStr}
                      storageCategories={storageCategories}
                      activeFilesForStorage={activeFilesForStorage}
                      handlePreviewFile={handlePreviewFile}
                      resetFilters={resetFilters}
                    />
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Toast Notifications and Modals */}
      <DashboardModals
        notification={notification}
        setNotification={setNotification}
        selectedPreviewFile={selectedPreviewFile}
        setSelectedPreviewFile={setSelectedPreviewFile}
        previewLoading={previewLoading}
        previewUrl={previewUrl}
        previewTextContent={previewTextContent}
        previewDocxHtml={previewDocxHtml}
        previewError={previewError}
        getFileIcon={getFileIcon}
        handleSaveFileContent={handleSaveFileContent}
        handleOpenVersionHistory={handleOpenVersionHistory}
        selectedShareFile={selectedShareFile}
        setSelectedShareFile={setSelectedShareFile}
        showNotification={showNotification}
        selectedVersionFile={selectedVersionFile}
        setSelectedVersionFile={setSelectedVersionFile}
        handleVersionRestoreSuccess={handleVersionRestoreSuccess}
        FilePreviewModal={FilePreviewModal}
        ShareModal={ShareModal}
        VersionHistoryModal={VersionHistoryModal}
      />
    </div>
  );
}
