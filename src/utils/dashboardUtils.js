import React from 'react';
import {
  FileIconPdf,
  FileIconImage,
  FileIconCode,
  FileIconSheet,
  FileIconDoc,
  FileIconZip,
  FileIconAudio,
  FileIconDefault
} from '../components/Icons';

export const formatSize = (bytes) => {
  const num = Number(bytes);
  if (isNaN(num) || num < 0) return 'Unknown size';
  if (num === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(num) / Math.log(k));
  if (i < 0 || i >= sizes.length) return '0 B';
  return parseFloat((num / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getFileIcon = (ext) => {
  const extension = ext ? ext.toLowerCase() : '';
  if (extension === 'pdf') return React.createElement(FileIconPdf);
  if (['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(extension)) return React.createElement(FileIconImage);
  if (['js', 'jsx', 'html', 'css', 'json', 'py', 'java', 'cpp', 'md'].includes(extension)) return React.createElement(FileIconCode);
  if (['xls', 'xlsx', 'csv'].includes(extension)) return React.createElement(FileIconSheet);
  if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return React.createElement(FileIconDoc);
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(extension)) return React.createElement(FileIconZip);
  if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension)) return React.createElement(FileIconAudio);
  return React.createElement(FileIconDefault);
};
