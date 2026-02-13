/**
 * 📷 图片上传组件 (含裁剪)
 *
 * 功能：选择图片 → 裁剪 (可调缩放) → 上传到 R2
 *
 * 依赖：react-easy-crop, ../utils/cropImage
 * 禁用：不引用此组件即可。
 *
 * 用法：
 *   <ImageUploader
 *     onUploadComplete={(url) => setImageUrl(url)}
 *     aspectRatio={16 / 9}
 *   />
 */
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg, { type Area } from '../utils/cropImage';
import { api } from '../api/client';

interface ImageUploaderProps {
  onUploadComplete?: (url: string) => void;
  aspectRatio?: number;
  initialImage?: string;
}

export const ImageUploader = ({ onUploadComplete, aspectRatio = 4 / 3, initialImage }: ImageUploaderProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(initialImage || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setShowCropper(true);
    }
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result as string));
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setUploading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error('Crop failed');

      const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });
      const result = await api.upload(file);

      if (result.data?.url) {
        setUploadedUrl(result.data.url);
        onUploadComplete?.(result.data.url);
        setShowCropper(false);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`上传失败: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Upload Button */}
      {!showCropper && (
        <div className="relative">
          {uploadedUrl ? (
            <div className="relative group">
              <img src={uploadedUrl} alt="uploaded" className="w-full h-48 object-cover rounded-2xl" />
              <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer rounded-2xl transition-all">
                <span className="text-white text-sm font-semibold">重新上传</span>
                <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors bg-gray-50 dark:bg-gray-800/50">
              <span className="text-4xl mb-2">📷</span>
              <span className="text-sm text-gray-400 font-medium">点击选择图片</span>
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </label>
          )}
        </div>
      )}

      {/* Cropper Modal */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col">
          <div className="flex-1 relative">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          
          <div className="p-4 bg-gray-900 space-y-4">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCropper(false); setImageSrc(null); }}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                {uploading ? '上传中...' : '确认上传'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
