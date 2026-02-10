
import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onUpload: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        stopCamera();
        onUpload(dataUrl);
      }
    }
  };

  return (
    <div className="w-full max-w-xl">
      {isCameraActive ? (
        <div className="relative rounded-[3rem] overflow-hidden bg-black aspect-video flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-8 flex gap-4">
            <button 
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
            >
              <div className="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
            </button>
            <button 
              onClick={stopCamera}
              className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-[3rem] p-16 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
              : 'border-gray-200 hover:border-indigo-400 hover:bg-white hover:shadow-2xl'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden" 
            accept="image/*"
          />
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 mb-8 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-inner">
              <i className="fa-solid fa-cloud-arrow-up text-4xl"></i>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">Upload Source</h3>
            <p className="text-gray-500 mb-10 max-w-xs font-medium leading-relaxed">
              Drag and drop your high-res design here, or click to browse
            </p>
            <div className="flex items-center gap-6">
               <button 
                 onClick={(e) => { e.stopPropagation(); startCamera(); }}
                 className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-500 hover:text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors border border-gray-100"
               >
                 <i className="fa-solid fa-camera"></i> Take Photo
               </button>
               <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">PNG / JPG / WEBP</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-12 grid grid-cols-3 gap-6">
        {[42, 43, 44].map((i) => (
          <div key={i} className="group relative rounded-2xl overflow-hidden h-28 cursor-pointer shadow-sm hover:shadow-xl transition-all border border-gray-100">
            <img 
              src={`https://picsum.photos/seed/${i}/400/300`} 
              alt="Example" 
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              onClick={(e) => {
                  e.stopPropagation();
                  const img = e.currentTarget as HTMLImageElement;
                  fetch(img.src).then(res => res.blob()).then(blob => {
                     const reader = new FileReader();
                     reader.onloadend = () => onUpload(reader.result as string);
                     reader.readAsDataURL(blob);
                  });
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
          </div>
        ))}
      </div>
      <p className="text-center mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quick inspiration samples</p>
    </div>
  );
};
