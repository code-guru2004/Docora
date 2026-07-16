/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UploadCloud, FileText, Check, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { MOCK_CATEGORIES } from '../data/mockData';
import { CategoryCombobox } from '../components/CategoryCombobox';

export const UploadView: React.FC = () => {
  const { currentUser, uploadDocument, showToast, navigate, dbStatus } = useApp();

  // Authentication Guard
  useEffect(() => {
    if (!currentUser) {
      showToast('You must be signed in to upload documents.', 'info');
      navigate('login');
    }
  }, [currentUser]);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('programming');
  const [language, setLanguage] = useState('English');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  
  // Custom tag management
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['guide']);

  // File Upload states
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState('');

  // Cover design gradient presets
  const [selectedGradient, setSelectedGradient] = useState('linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)');
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [hexInput, setHexInput] = useState('3B82F6');

  const handleCustomColorChange = (hex: string) => {
    setCustomColor(hex);
    setHexInput(hex.replace('#', '').toUpperCase());
    setSelectedGradient(hex);
  };

  const handleHexInputChange = (val: string) => {
    const cleaned = val.replace(/[^a-fA-F0-9]/g, '');
    setHexInput(cleaned.toUpperCase());
    if (cleaned.length === 6) {
      const fullHex = `#${cleaned}`;
      setCustomColor(fullHex);
      setSelectedGradient(fullHex);
    }
  };

  const gradientPresets = [
    { name: 'Royal Sapphire (Blue)', gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
    { name: 'Deep Cosmic (Black)', gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
    { name: 'Emerald Forest (Green)', gradient: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)' },
    { name: 'Warm Copper (Orange)', gradient: 'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)' },
    { name: 'Imperial Plum (Purple)', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)' },
    { name: 'Crimson Velvet (Red)', gradient: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)' }
  ];

  if (!currentUser) return null;

  // File format check
  const allowedExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'];
  const maxFileSizeMB = 30;

  const validateFile = (selectedFile: File): boolean => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (!ext || !allowedExtensions.includes(ext)) {
      setFileError(`Unsupported format .${ext}. Only PDF, PowerPoint, Word, and Excel spreadsheets are supported.`);
      showToast('Unsupported file type', 'error');
      return false;
    }

    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
      setFileError(`File exceeds maximum limit of 30 MB (Your file is ${fileSizeMB.toFixed(1)} MB).`);
      showToast('File size too large', 'error');
      return false;
    }

    setFileError('');
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        if (!title) {
          // Auto fill title with file name without extension
          setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        if (!title) {
          setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
        }
      }
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanedTag = tagInput.trim().toLowerCase().replace(/#/g, '');
      if (cleanedTag && !tags.includes(cleanedTag)) {
        if (tags.length >= 3) {
          showToast('Maximum of 3 tags allowed', 'error');
          return;
        }
        setTags([...tags, cleanedTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFileError('Please select a valid document to upload.');
      return;
    }
    if (!title.trim()) {
      showToast('Please provide a document title', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const reader = new FileReader();

    reader.onloadstart = () => {
      setUploadProgress(20);
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 70) + 20; // 20% to 90%
        setUploadProgress(percent);
      }
    };

    reader.onload = async () => {
      const base64Data = reader.result as string;
      setUploadProgress(95);

      const finalExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';

      // Generate a few pages of dummy visual text based on title and category so viewer can show text!
      let generatedPages = [];
      if (finalExt === 'ppt' || finalExt === 'pptx') {
        generatedPages = [
          `[SLIDE 1: COVER]\n${title.toUpperCase()}\n\nPresented in ${category} category\nLanguage: ${language}\nFile: ${file.name}\n\n- Welcome to the Presentation\n- Built for digital sharing`,
          `[SLIDE 2: OVERVIEW]\nKEY CONCEPTS & METHODOLOGY\n\n- Primary objective: Accelerate knowledge dissemination\n- Core metrics and target demographics\n- Strategic alignment across academic fields`,
          `[SLIDE 3: KEY TAKEAWAYS]\nRECOMMENDATIONS & CONTEXT\n\n- Ensure consistency across files\n- Reduce viewer padding for optimal display\n- Leverage online review tools`
        ];
      } else {
        generatedPages = [
          `PUBLICATION TITLE: ${title.toUpperCase()}\nCategory: ${category}\nLanguage: ${language}\nFile Name: ${file.name}\nSize: ${(file.size / (1024*1024)).toFixed(2)} MB\n\n--- INTRODUCTION & SYNOPSIS ---\nThis document represents a formal research brief or informational handbook. The following chapters address the critical parameters of ${category} methodologies, compiling historical trends, and proposing architectural blueprints.`,
          `--- SEGMENT 1: CORE DATA ANALYSIS ---\n- Empirical assessments outline standard operational coefficients.\n- Standard deviations have stabilized in the nominal ±1.5% baseline.\n- Visual telemetry demonstrates that integration speedups scale quadratically under standard loads.\n- Operational pipelines have been cleared for production deployment and general testing.`,
          `--- SUMMARY AND STRATEGIC RECOMMENDATIONS ---\nBased on these compiled reviews, we suggest the following key actions:\n1. Audit active resource allocations annually to prevent waste.\n2. Leverage modern cloud pipelines to maximize synchronization across remote platforms.\n3. Publish progress reports consistently to foster community feedback and academic engagement.`
        ];
      }

      // Save to App context
      const fileUrl = finalExt === 'pdf' ? URL.createObjectURL(file) : undefined;

      try {
        await uploadDocument({
          title: title.trim(),
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          description: description.trim() || `Public handbook regarding ${title}. Published for general academic sharing.`,
          category,
          tags,
          language,
          coverImage: selectedGradient,
          fileType: finalExt as any,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          totalPages: generatedPages.length,
          visibility,
          pages: generatedPages,
          fileUrl,
          originalname: file.name
        }, base64Data);

        setUploadProgress(100);
        setIsUploading(false);
      } catch (err) {
        console.error('Upload handler error:', err);
        setIsUploading(false);
        showToast('Failed to complete document upload.', 'error');
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      showToast('Error reading the local document file.', 'error');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* Title block */}
      <div className="border-b border-gray-100 pb-5 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Upload Your Document</h1>
        <p className="mt-2 text-sm text-gray-500">
          Share your slides, spreadsheet templates, lecture notes, or textbooks with our global reader community
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Side: Upload Form Block */}
        <div className="space-y-6 lg:col-span-8">
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* 1. Drag & Drop Field */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Select Document</label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-gray-200 bg-white hover:border-blue-400'
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  id="document-file-input"
                />

                {file ? (
                  <div className="space-y-2 z-10">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)} MB • Click or drag to change</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      <Check className="h-3 w-3" /> Ready to publish
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700">Drag & drop your file here, or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">Supports PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX (Max 30MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {fileError && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{fileError}</p>
                </div>
              )}
            </div>

            {/* Upload Progress Bar (If uploading) */}
            {isUploading && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>Uploading files to secure cloud...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Title & Description */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Calculus Lecture Handout Week 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-blue-500"
                  id="upload-title-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Description / Synopsis</label>
                <textarea
                  placeholder="Detail the contents, syllabus, or findings covered inside this document to help readers find it..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-24 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-blue-500"
                  id="upload-desc-input"
                />
              </div>
            </div>

            {/* Category, Lang, Visibility */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Category</label>
                <CategoryCombobox
                  selectedSlug={category}
                  onChange={(slug) => setCategory(slug)}
                  categories={MOCK_CATEGORIES}
                  id="upload-category-combobox"
                  placeholder="Select category..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  id="upload-lang-select"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={`rounded-xl py-2.5 text-xs font-bold border ${
                      visibility === 'public'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-100 text-gray-600'
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`rounded-xl py-2.5 text-xs font-bold border ${
                      visibility === 'private'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-100 text-gray-600'
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>

            </div>

            {/* Tags Multiple manager */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Tags (press Enter or comma to add — max 3)</label>
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 focus-within:border-blue-500">
                {tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    #{tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded p-0.5 hover:bg-blue-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={tags.length < 3 ? "Add search tags..." : "Max 3 tags reached"}
                  disabled={tags.length >= 3}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder-gray-400 py-1"
                  id="upload-tag-input"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!file || isUploading}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-40 transition-all active:scale-[0.99]"
            >
              Publish Document to Library
            </button>

          </form>

        </div>

        {/* Right Side: Gradient Cover Canvas Designer */}
        <div className="space-y-6 lg:col-span-4">
          
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
            <h3 className="font-sans text-sm font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              Document Cover Preview
            </h3>
            
            {/* Live Cover preview Card */}
            <div 
              className="relative flex aspect-[3/4] w-full items-center justify-center rounded-xl p-6 text-center select-none overflow-hidden shadow-sm transition-all"
              style={{ background: selectedGradient }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-25"></div>
              <div className="z-10 flex flex-col items-center justify-center gap-2">
                <span className="rounded bg-white/25 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-widest">
                  {file ? file.name.split('.').pop() : 'PDF'} Format
                </span>
                <p className="line-clamp-3 text-sm font-bold text-white drop-shadow-sm px-2">
                  {title || 'Untitiled Publication'}
                </p>
                <span className="text-[10px] text-white/70">
                  by {currentUser.name}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/5"></div>
            </div>

            {/* Gradient selector row */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-500">Select Custom Cover Theme:</label>
              <div className="grid grid-cols-3 gap-2">
                {gradientPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGradient(preset.gradient)}
                    className={`h-8 rounded-lg border shadow-sm transition-all relative ${
                      selectedGradient === preset.gradient 
                        ? 'border-blue-600 ring-2 ring-blue-100' 
                        : 'border-transparent'
                    }`}
                    style={{ background: preset.gradient }}
                    title={preset.name}
                  >
                    {selectedGradient === preset.gradient && (
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-0.5 text-blue-600">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Hex Color Picker */}
            <div className="space-y-3 border-t border-gray-100 pt-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block">Custom Cover Color (Hex)</label>
              <div className="flex items-center gap-3">
                {/* Visual color picker input */}
                <div className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border shadow-sm cursor-pointer hover:border-gray-300 transition-all ${
                  selectedGradient.startsWith('#') ? 'ring-2 ring-blue-100 border-blue-600' : 'border-gray-200'
                }`}>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="absolute inset-0 h-[150%] w-[150%] -translate-x-[15%] -translate-y-[15%] cursor-pointer border-0 p-0"
                    id="cover-color-picker"
                  />
                </div>
                
                {/* Hex code input */}
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">#</span>
                  <input
                    type="text"
                    maxLength={6}
                    value={hexInput}
                    onChange={(e) => handleHexInputChange(e.target.value)}
                    placeholder="3B82F6"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-3 pl-7 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 uppercase font-mono"
                    id="cover-color-hex-input"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Use the color swatch or enter any standard 6-digit Hexadecimal color code to design your book cover.</p>
            </div>

            {/* Safety policy warning */}
            <div className="border-t border-gray-100 pt-4 flex gap-2 text-[10px] text-gray-400 leading-normal">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>
                By publishing, you agree that this document meets community guidelines and contains no unauthorized commercial advertisements or spam.
              </span>
            </div>

          </div>

          {/* Cloudinary Info Panel */}
          {dbStatus?.cloudinary && (
            <div className={`rounded-2xl border p-5 space-y-3 font-sans transition-all ${
              dbStatus.cloudinary.isConfigured 
                ? 'border-emerald-100 bg-emerald-50/40' 
                : 'border-amber-100 bg-amber-50/40'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                  dbStatus.cloudinary.isConfigured 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-100 text-amber-700 border-amber-200/60'
                }`}>
                  <UploadCloud className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${
                    dbStatus.cloudinary.isConfigured ? 'text-emerald-900' : 'text-amber-900'
                  }`}>
                    {dbStatus.cloudinary.isConfigured ? 'Cloudinary Connected' : 'Cloudinary Offline Demo'}
                  </h4>
                  <p className={`text-[10px] leading-relaxed mt-0.5 ${
                    dbStatus.cloudinary.isConfigured ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {dbStatus.cloudinary.isConfigured 
                      ? 'Your uploaded documents are hosted securely in Cloudinary Cloud Storage and can be shared globally!'
                      : 'Running in Local Demo Mode. Uploads are processed locally via reader-side buffers.'
                    }
                  </p>
                </div>
              </div>

              {!dbStatus.cloudinary.isConfigured && (
                <div className="border-t border-amber-200/50 pt-2 text-[10px] text-amber-800 space-y-1.5">
                  <p className="font-bold uppercase tracking-wider text-[9px] text-amber-900">How to Enable Persistent Cloudinary Hosting:</p>
                  <ol className="list-decimal list-inside space-y-1 pl-1 text-amber-700 text-[10px]">
                    <li>Create a free account at <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-amber-900">cloudinary.com</a>.</li>
                    <li>Copy your **API Environment Variable** / connection string.</li>
                    <li>Open the **Secrets panel** in the AI Studio sidebar.</li>
                    <li>Add a key named <code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded font-bold">CLOUDINARY_URL</code> and paste your URI.</li>
                    <li>Restart server to enable secure, lightning-fast hosting!</li>
                  </ol>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
