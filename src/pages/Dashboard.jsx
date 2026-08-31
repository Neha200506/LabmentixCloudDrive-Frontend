import { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';

import {
  GridIcon,
  ListIcon,
  SearchIcon,
  CalendarIcon,
  KeepIcon,
  TasksIcon,
  ContactsIcon,
  PlusIcon
} from '../components/Icons';
import { getFileIcon, formatSize } from '../utils/dashboardUtils';
import FilePreviewModal from '../components/FilePreviewModal';

import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import FileList from '../components/dashboard/FileList';
import FileGrid from '../components/dashboard/FileGrid';
import HomeSection from '../components/dashboard/HomeSection';
import TrashSection from '../components/dashboard/TrashSection';
import StarredSection from '../components/dashboard/StarredSection';
import ShareModal from '../components/dashboard/ShareModal';

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
  const [activeTab, setActiveTab] = useState('drive'); // home, projects, drive, computers, shared, recent, starred, spam, trash, storage
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const userKey = displayUser.email || displayUser.id || 'default';
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
      const response = await fetch("http://localhost:8080/api/files/upload", {
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
      const newFileItem = {
        id: uploadedFile.id,
        name: uploadedFile.file_name,
        type: "file",
        extension: uploadedFile.file_name.split(".").pop().toLowerCase(),
        parentId: uploadedFile.folder_id,
        starred: false,
        inTrash: false,
        createdAt: uploadedFile.created_at,
        updatedAt: uploadedFile.created_at ? new Date(uploadedFile.created_at).toISOString().split('T')[0] : '2026-08-30',
        owner: 'me',
        size: formatSize(uploadedFile.file_size),
        location: 'My Drive',
        reasonSuggested: 'Opened recently',
      };

      setItems((prev) => [newFileItem, ...prev]);
      showNotification("success", `"${file.name}" uploaded successfully!`);
      await fetchDashboardData(false);
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
        const response = await fetch("http://localhost:8080/api/folders", {
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

        const response = await fetch("http://localhost:8080/api/files/upload", {
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
        const newFileItem = {
          id: uploadedFile.id,
          name: uploadedFile.file_name,
          type: "file",
          extension: uploadedFile.file_name.split(".").pop().toLowerCase(),
          parentId: uploadedFile.folder_id,
          starred: false,
          inTrash: false,
          createdAt: uploadedFile.created_at,
          updatedAt: uploadedFile.created_at ? new Date(uploadedFile.created_at).toISOString().split('T')[0] : '2026-08-30',
          owner: 'me',
          size: formatSize(uploadedFile.file_size),
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
      await fetchDashboardData(false);
    }
  };

  const handlePreviewFile = async (file) => {
    if (!file) return;

    setSelectedPreviewFile(file);
    setPreviewLoading(true);
    setPreviewUrl('');
    setPreviewTextContent('');
    setPreviewDocxHtml('');
    setPreviewError('');

    const token = localStorage.getItem("token");
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(file.extension);
    const isPdf = file.extension === 'pdf';
    const isText = ['txt', 'html', 'css', 'js', 'jsx', 'json', 'md'].includes(file.extension);
    const isDocx = ['docx', 'doc'].includes(file.extension);

    if (!isImage && !isPdf && !isText && !isDocx) {
      setPreviewLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/files/${file.id}/url`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch file URL");
      }

      setPreviewUrl(data.url);

      if (isText) {
        const textRes = await fetch(data.url);
        if (!textRes.ok) {
          throw new Error("Failed to load text content");
        }
        const text = await textRes.text();
        setPreviewTextContent(text);
      }

      if (isDocx) {
        try {
          const docxRes = await fetch(data.url);
          if (!docxRes.ok) {
            throw new Error("Failed to download document for preview");
          }
          const arrayBuffer = await docxRes.arrayBuffer();
          try {
            const result = await mammoth.convertToHtml({ arrayBuffer });
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

  const fetchDashboardData = async (showShimmer = true) => {
    if (showShimmer) setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 1. Fetch folders
      let foldersUrl = 'http://localhost:8080/api/folders';
      if (activeTab === 'trash') {
        foldersUrl = 'http://localhost:8080/api/folders/trash';
      }

      const foldersRes = await fetch(foldersUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const foldersData = await foldersRes.json();
      const backendFolders = foldersData.folders || [];

      // 2. Fetch files
      let filesUrl = 'http://localhost:8080/api/files?limit=1000';
      if (activeTab === 'trash') {
        filesUrl = 'http://localhost:8080/api/files/trash';
      } else if (activeTab === 'drive') {
        filesUrl = `http://localhost:8080/api/files?limit=1000&folder_id=${currentFolderId || 'root'}`;
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
        createdAt: folder.created_at,
        updatedAt: folder.created_at ? new Date(folder.created_at).toISOString().split('T')[0] : '2026-08-30',
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
        createdAt: file.created_at,
        updatedAt: file.created_at ? new Date(file.created_at).toISOString().split('T')[0] : '2026-08-30',
        owner: file.is_shared ? (file.owner_name || 'Owner') : 'me',
        shared: Boolean(file.is_shared),
        shared_permission: file.shared_permission,
        permission: file.shared_permission || 'owner',
        size: formatSize(file.file_size),
        location: activeTab === 'trash' ? 'Trash' : 'My Drive',
        reasonSuggested: 'Opened recently',
      }));

      setItems([...formattedFolders, ...formattedFiles]);
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
    } finally {
      if (showShimmer) setIsLoading(false);
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
      const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
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

      await fetchDashboardData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm("Are you sure you want to move this folder to trash?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete folder');
      }

      await fetchDashboardData();
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
      const response = await fetch(`http://localhost:8080/api/files/${fileId}`, {
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

      await fetchDashboardData();
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
      const response = await fetch(`http://localhost:8080/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete file');
      }

      await fetchDashboardData();
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
  const handleToggleStar = async (itemId, e) => {
    e.stopPropagation();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setItems(prevItems =>
      prevItems.map(i =>
        i.id === itemId ? { ...i, starred: !i.starred } : i
      )
    );

    try {
      const token = localStorage.getItem('token');
      const route = item.type === 'folder' ? 'folders' : 'files';
      const response = await fetch(`http://localhost:8080/api/${route}/${itemId}/star`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle star');
      }
      await fetchDashboardData(false);
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
      const response = await fetch(`http://localhost:8080/api/${route}/${itemId}/restore`, {
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
      await fetchDashboardData();
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
      const response = await fetch(`http://localhost:8080/api/${route}/${itemId}/permanent`, {
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
      await fetchDashboardData();
    } catch (error) {
      showNotification("error", error.message);
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

  const handleCreateFolderPrompt = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/folders", {
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

      await fetchDashboardData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveFileContent = async (fileId, newContent) => {
    try {
      const jwtToken = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/files/${fileId}/content`, {
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
      setPreviewTextContent(newContent);
      setPreviewDocxHtml(`<div className="whitespace-pre-wrap font-sans text-sm">${newContent}</div>`);
      fetchDashboardData();
    } catch (err) {
      showNotification("error", err.message);
      throw err;
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
            {['drive', 'shared', 'recent', 'starred', 'trash'].includes(activeTab) && (
              <div className="px-6 py-2.5 bg-slate-900/10 border-b border-slate-800/40 flex flex-wrap items-center gap-2.5 z-20 shrink-0">

                {/* 1. Type Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'type' ? null : 'type')}
                    className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${filterType !== 'all'
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
                    className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${filterOwner !== 'all'
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
                    className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${filterModified !== 'all'
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
                    className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${filterSource !== 'all'
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
                      items={items}
                      onPreviewFile={handlePreviewFile}
                      onToggleStar={handleToggleStar}
                      onShareFile={setSelectedShareFile}
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
                    />
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
                                .sort((a, b) => {
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
                                        <span
                                          className="truncate cursor-pointer hover:text-indigo-400 transition"
                                          title={file.name}
                                          onClick={() => handlePreviewFile(file)}
                                        >
                                          {file.name}
                                        </span>
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

      {/* Toast Notifications */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-200 ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-800 text-emerald-300' 
            : 'bg-rose-950/90 border-rose-800 text-rose-300'
        }`}>
          <span>{notification.type === 'success' ? '✓' : '✕'}</span>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* FILE PREVIEW MODAL */}
      <FilePreviewModal
        selectedPreviewFile={selectedPreviewFile}
        previewLoading={previewLoading}
        previewUrl={previewUrl}
        previewTextContent={previewTextContent}
        previewDocxHtml={previewDocxHtml}
        previewError={previewError}
        onClose={() => setSelectedPreviewFile(null)}
        getFileIcon={getFileIcon}
        onSaveContent={handleSaveFileContent}
      />

      {/* SHARE MODAL */}
      {selectedShareFile && (
        <ShareModal
          file={selectedShareFile}
          onClose={() => setSelectedShareFile(null)}
          showNotification={showNotification}
        />
      )}
    </div>
  );
}
