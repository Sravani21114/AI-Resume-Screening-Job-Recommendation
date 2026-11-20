import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, Briefcase, Award, ArrowRight, Activity } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "An error occurred during file upload.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to color-code scores
  const getScoreStyles = (score) => {
    if (score >= 70) return { border: 'border-green-500', text: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 40) return { border: 'border-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { border: 'border-red-500', text: 'text-red-600', bg: 'bg-red-50' };
  };

  const scoreMeta = results ? getScoreStyles(results["ATS Score"]) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Activity size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">AI Resume Screener</h1>
              <p className="text-xs text-slate-500">Analyze resume parsing details & job recommendations</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* File Upload Component */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-md font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Upload size={18} className="text-blue-600" />
            Upload Professional Resume
          </h2>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-8 text-center transition-all cursor-pointer relative bg-slate-50 hover:bg-slate-100/50">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <FileText size={36} className="text-slate-400" />
                <p className="text-sm font-medium text-slate-700">
                  {file ? file.name : "Select or drop your PDF or DOCX file here"}
                </p>
                <p className="text-xs text-slate-400">Supported Formats: PDF, DOCX (Max size: 5MB)</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {file && (
                <span className="text-xs text-slate-600">
                  Ready: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                </span>
              )}
              <button
                type="submit"
                disabled={loading || !file}
                className="ml-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Parsing & Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Failed to Analyze File</h4>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}
        </section>

        {/* Dashboard Analysis Outputs */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            
            {/* ATS Score Panel */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">ATS Match Score</h3>
              <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center mb-4 ${scoreMeta.border} ${scoreMeta.bg}`}>
                <span className={`text-3xl font-extrabold ${scoreMeta.text}`}>{results["ATS Score"]}%</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs">
                Calculated by verifying extracted resume metrics against required tech profiles.
              </p>
            </div>

            {/* Extracted Skills List */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Award size={18} className="text-yellow-600" />
                Extracted Skills Profile
              </h3>
              {results.skills && results.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {results.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-full uppercase"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No recognized matching skills detected in your file.</p>
              )}
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-3">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Briefcase size={18} className="text-indigo-600" />
                Semantic Job Recommendations
              </h3>
              {results["Recommended Jobs"] && results["Recommended Jobs"].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results["Recommended Jobs"].map((job, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-100 hover:border-slate-200 rounded-lg bg-slate-50 hover:bg-white transition-all flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">{job["Job Title"]}</h4>
                        <p className="text-xs text-slate-500">{job["Company"]}</p>
                      </div>
                      <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        Matched
                        <ArrowRight size={10} />
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No direct semantic matches could be established.</p>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;