## NEXORA DRIVE

## Cloud-Based File Management and Sharing System

## 1. Introduction

Nexora Drive is a cloud-based file management and sharing application developed to provide users with a secure and convenient platform for storing, organizing, accessing, editing, and sharing files. The application provides a user-friendly interface inspired by modern cloud storage platforms.

Users can manage their files and folders from a single dashboard and access their data through desktop or mobile devices. The system also includes features such as file preview, document editing, sharing and permissions, search, filtering, sorting, trash management, and version history.

## 2. Problem Statement

With the increasing amount of digital data, managing files across different devices can become difficult. Users often need a single platform where they can store files, organize them into folders, access them from different devices, and share them securely with others.

Nexora Drive addresses this problem by providing a centralized cloud-based file management system where users can perform common file operations while maintaining controlled access to shared files.


## 3. Objectives

The main objective of Nexora Drive is to develop a secure, user-friendly, and responsive cloud storage platform.

The project aims to:

- Provide secure user authentication and account management.

- Allow users to upload, organize, rename, download, and delete files.

- Support folder and nested-folder management.

- Provide file preview and document editing capabilities.

- Allow users to search, filter, and sort their files.

- Provide controlled file sharing with different permissions.

- Maintain deleted files through a Trash system.

- Maintain previous file versions and support restoration.

- Provide a responsive interface for desktop and mobile devices.

- Deploy the application so that it can be accessed through the Internet.

## 4. Features of Nexora Drive

## 4.1 User Authentication

Nexora Drive provides a secure authentication system for protecting user accounts and personal files. New users can create an account by providing their name, email address, and password. The password must satisfy the required password validation rules before the account can be created.

Existing users can log in using their registered email and password. The application also supports Google Login for convenient authentication. Users can log out securely and recover their account using the Forgot Password and Reset Password features.

## Main authentication features:

- Create a new account with name, email, and password.

- Password validation during account creation.

- Login using registered credentials.

- Google Login.

- Logout.

- Forgot Password.


- Reset Password.

- Protected access to user files and data.


## 4.2 Dashboard

The Home section acts as the main dashboard of Nexora Drive and provides users with a quick overview of their files and activities. It includes sections such as Recent Files and Suggested Files, helping users quickly access files they have recently used or may want to open. The dashboard also provides navigation to important areas such as My Drive, Starred, Trash, and Storage.

Users can switch between different sections and use the available navigation and file management options to access and organize their data easily. The Grid View and List View options allow users to choose how their files are displayed according to their preference.


## 4.3 File and Folder Management

The My Drive section allows users to manage their files and folders. Users can create folders, upload files, drag and drop files for quick uploading, open folders, preview files, download files, rename items, and delete files when required. Files can also be organized into nested folders for better management.

During file uploads, the application provides upload progress and success/error notifications to keep users informed about the status of their operations.

## 4.4 File Preview and Document Editing

Nexora Drive provides an integrated preview system for supported file types, allowing users to view files without leaving the application.

For DOCX documents, the application provides an editor where users can modify the document and apply common formatting options such as headings, text styles, lists, alignment, and images.

Supported editing features include:

- Bold, Italic and Underline

- Headings and paragraphs

- Bullets and numbering

- Text alignment

- Image insertion

- Saving edited content


## 4.5 Search, Filter and Sort

Nexora Drive provides search, filtering, and sorting features to help users quickly find and organize their files. The search function supports real-time searching, while filters allow users to narrow down files based on different criteria.

The available options include:

- Type: Filter files based on their file type.

- People: Filter files based on the file owner or person.

- Modified: Filter files according to when they were modified.

- Sort: Sort files by name, size, or date in ascending or descending order.

These options can be used together to make file management faster and more convenient.


## 4.6 File Sharing and Permissions

Nexora Drive allows users to share files with other registered users. The owner can control what the recipient is allowed to do with the shared file.

The system provides three main permission levels:

- Viewer: Allows the recipient to view or access the file.

- Editor: Allows the recipient to modify the shared file.

- Owner: Provides complete control over the file.

The owner can also change permissions or remove a user's access when required.


## 4.7 Public Sharing

In addition to sharing files with registered users, Nexora Drive allows users to generate a public sharing link. The generated link can be shared with another person and accessed through the Internet without requiring the recipient to log in.

This makes it easier to share individual files with people who do not have an account on the platform.

## 4.8 Recent and Starred Files

The Recent section provides quick access to files that have been recently accessed or modified. This allows users to quickly continue working with files they recently used.

The Starred section allows users to mark important files so that they can easily find them later. Both sections support convenient file viewing and management.


## 4.9 Trash and File Recovery

The Trash system provides an additional layer of file recovery. Instead of permanently deleting a file immediately, the application moves it to Trash.

Users can review deleted files and either restore them to their original location or permanently delete them when they are no longer needed.

## 4.10 Version History

Nexora Drive maintains previous versions of files when changes are made. This helps users recover older versions if an unwanted modification is made.

Users can open the Version History section, view previous versions, and restore an older version when required.


## 4.11 Storage Management

The Storage section provides users with an overview of their file storage usage. Files are categorized to make it easier to understand how storage is being used.

The system provides categories such as:

- Documents & PDFs

- Spreadsheets

- Audio & Media

- System Backups


## 4.12 Mobile Responsiveness

Nexora Drive is designed to work on different screen sizes. The interface automatically adapts to smaller mobile screens while maintaining access to important features.

The mobile interface includes responsive navigation, search, filters, file lists, Grid/List views, file previews, and document editing.


## 5. Technology Stack

Nexora Drive is developed using modern web technologies for building a responsive frontend, secure backend, database, and cloud storage system.

Technology

React + Vite

Tailwind CSS

Node.js

Express.js

PostgreSQL / Supabase

Supabase Storage

JWT

Google OAuth

Nodemailer

Vercel

Git & GitHub

Purpose

Frontend development

UI design and styling

Backend runtime

REST API development

Database

Cloud file storage

Authentication

Google authentication

Password reset emails

Deployment

Version control

## 6. System Architecture

Nexora Drive follows a client-server architecture. The frontend provides the user interface and communicates with the backend through REST APIs. The backend manages authentication, file operations, sharing, permissions, and communication with the database and cloud storage.

Basic architecture:

User → React/Vite Frontend → Node.js/Express Backend → PostgreSQL & Supabase Storage

## 7. Security, Performance, Testing and Deployment

Nexora Drive is designed with security, performance, reliability, and accessibility in mind. Authentication is implemented using JWT, while Google OAuth provides an additional login option. Protected APIs ensure that users can access only authorized resources, and secure signed URLs are used for file access. Sharing permissions also help control access to shared


files. Sensitive information such as database credentials, API keys, OAuth secrets, SMTP credentials, and JWT secrets is stored using environment variables instead of being included directly in the source code.

The application also includes performance improvements such as client-side caching, lazy loading, memoization, and optimized filtering and sorting to reduce unnecessary processing and API requests. The system was tested across major features including authentication, file and folder management, search, filters, sorting, sharing, permissions, public links, Trash, version history, document editing, downloading, and mobile responsiveness. Testing was performed on both desktop and mobile devices. Frontend code quality and production build were verified using npm run lint and npm run build, and both completed successfully without errors.

The application was successfully deployed online using Vercel, with separate deployments for the frontend and backend.

[INSERT PHOTO 17 – Vercel Deployment]

## 8. Conclusion

Nexora Drive successfully provides a centralized cloud-based platform for storing, organizing, editing, downloading, and sharing files. The application combines secure authentication, cloud storage, file and folder management, document editing, sharing permissions, search and organization tools, Trash recovery, and version history into one platform.

The application has been successfully deployed and tested on both desktop and mobile devices. It provides users with a simple and accessible way to manage their files through the Internet.
