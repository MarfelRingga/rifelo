import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2 } from 'lucide-react';

interface ResonanceShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
}

export function ResonanceShareModal({ isOpen, onClose, videoUrl }: ResonanceShareModalProps) {
  const handleDownload = async () => {
    if (!videoUrl) return;
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = `resonance-capture.mp4`; // Force .mp4 for better gallery app support
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading:', error);
      // Fallback
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'resonance-capture.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleShare = async () => {
    if (!videoUrl) return;
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      // Force MP4 extension and MIME type for Android share sheet compatibility 
      // (especially for Instagram), even if the container is technically WebM with H.264
      const ext = 'mp4';
      const file = new File([blob], `resonance-capture.${ext}`, { type: 'video/mp4' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Circle Resonance',
          text: 'Check out our active Circle Resonance!',
          files: [file]
        });
      } else {
        // Fallback to download
        handleDownload();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback
      handleDownload();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && videoUrl && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-sm flex flex-col items-center">
            
            <button 
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 shadow-[0_0_50px_rgba(168,85,247,0.2)] border border-white/10 relative"
            >
              <video 
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </motion.div>

            <div className="mt-6 flex items-center gap-4 w-full">
              <button
                onClick={handleDownload}
                className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold tracking-wide transition-colors flex items-center justify-center gap-2 text-sm border border-white/5"
              >
                <Download className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-3.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold tracking-wide transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
