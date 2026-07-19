import React, { useState, useEffect } from 'react';

export default function ProjectForm({ mode = 'create', initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    technologies: '',
    category: '',
    status: '',
    github_url: '',
    live_demo_url: '',
    featured: false,
    thumbnail_image: '',
    gallery_images: '',
    zip_file: '',
    pdf_document: ''
  });

  const [thumbnail, setThumbnail] = useState(null);

  const [galleryImages, setGalleryImages] = useState([]);

  const [zipFile, setZipFile] = useState(null);

  const [pdfFile, setPdfFile] = useState(null);

  // Sync state data structures on edit mode initialization
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        title: initialData.title || '',
        short_description: initialData.short_description || '',
        full_description: initialData.full_description || '',
        technologies: Array.isArray(initialData.technologies) ? initialData.technologies.join(', ') : initialData.technologies || '',
        category: initialData.category || '',
        status: initialData.status || '',
        github_url: initialData.github_url || '',
        live_demo_url: initialData.live_demo_url || '',
        featured: !!initialData.featured,
        thumbnail_image: initialData.thumbnail_image || '',
        gallery_images: Array.isArray(initialData.gallery_images) ? initialData.gallery_images.join(', ') : initialData.gallery_images || '',
        zip_file: initialData.zip_file || '',
        pdf_document: initialData.pdf_document || ''
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const uploadData = new FormData();

    // Append text fields and structural node flags
    uploadData.append("title", formData.title);
    uploadData.append("short_description", formData.short_description);
    uploadData.append("full_description", formData.full_description);
    uploadData.append("category", formData.category);
    uploadData.append("status", formData.status);
    uploadData.append("github_url", formData.github_url);
    uploadData.append("live_demo_url", formData.live_demo_url);
    uploadData.append("featured", formData.featured);

    // Map and split text lists cleanly to vector parameters
    const parseCommaSeparated = (str) => 
      typeof str === 'string' ? str.split(',').map(item => item.trim()).filter(item => item !== '') : [];

    const technologies = parseCommaSeparated(formData.technologies);
    technologies.forEach(tech => {
      uploadData.append("technologies", tech);
    });

    // Append operational assets and discrete document payloads
    if (thumbnail) {
      uploadData.append("thumbnail", thumbnail);
    }

    if (zipFile) {
      uploadData.append("zip_file", zipFile);
    }

    if (pdfFile) {
      uploadData.append("pdf_document", pdfFile);
    }

    galleryImages.forEach(image => {
      uploadData.append("gallery_images", image);
    });

    onSubmit(uploadData);
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-slate-950/50 max-w-4xl mx-auto">
      <div className="border-b border-slate-800/60 pb-4 mb-6">
        <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
          {mode === 'edit' ? 'Modify Project Configuration' : 'Initialize New Project Entry'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Specify core variables and system mapping telemetry configurations below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-300 font-medium">
        {/* Core Configuration Segment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Project Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Quantum Core Gateway"
              className="w-full h-10 px-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Category *</label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Neural Infrastructure"
              className="w-full h-10 px-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Status *</label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full h-10 px-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 focus:outline-none focus:border-slate-700 transition-colors"
            >
              <option value="" disabled>Select Status Mode</option>
              <option value="Planning">Planning</option>
              <option value="Development">Development</option>
              <option value="In Progress">In Progress</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Technologies (Comma-separated) *</label>
            <input
              type="text"
              name="technologies"
              required
              value={formData.technologies}
              onChange={handleChange}
              placeholder="FastAPI, React, Tailwind, Docker"
              className="w-full h-10 px-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors"
            />
          </div>
        </div>

        {/* Descriptive Descriptions Segment */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Short Overview Summary *</label>
            <input
              type="text"
              name="short_description"
              required
              value={formData.short_description}
              onChange={handleChange}
              placeholder="High-level operational overview sequence description."
              className="w-full h-10 px-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Full Functional Specifications Overview</label>
            <textarea
              name="full_description"
              rows="4"
              value={formData.full_description}
              onChange={handleChange}
              placeholder="Comprehensive architectural system functional breakdown parameters..."
              className="w-full p-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Extended Metadata Matrix Endpoint Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">VCS Repository URL (GitHub)</label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/org/repo"
              className="w-full h-10 px-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Live Interface Environment URI</label>
            <input
              type="url"
              name="live_demo_url"
              value={formData.live_demo_url}
              onChange={handleChange}
              placeholder="https://demo.evotech.ai"
              className="w-full h-10 px-3 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setThumbnail(e.target.files[0] || null);
              }}
              className="w-full h-10 p-2 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Gallery Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                setGalleryImages(Array.from(e.target.files));
              }}
              className="w-full h-10 p-2 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Project ZIP File</label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => {
                setZipFile(e.target.files[0] || null);
              }}
              className="w-full h-10 p-2 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">Project Documentation (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                setPdfFile(e.target.files[0] || null);
              }}
              className="w-full h-10 p-2 bg-slate-950 text-slate-200 text-sm rounded-lg border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-slate-700 transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Feature Node Flag Checkbox */}
        <div className="flex items-center gap-3 bg-slate-950 p-4 border border-slate-800 rounded-lg">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-0 focus:ring-offset-0"
          />
          <label htmlFor="featured" className="text-xs font-semibold text-slate-300 uppercase tracking-wide cursor-pointer select-none">
            Promote Entry to System Spotlight Featured Array
          </label>
        </div>

        {/* Operational Terminal Steering Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-4 border border-slate-800 bg-transparent hover:bg-slate-950 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-colors duration-150 shadow-lg shadow-indigo-600/10"
          >
            {mode === 'edit' ? 'Update Project' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
}