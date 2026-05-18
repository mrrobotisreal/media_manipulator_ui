import { cn } from '@/lib/utils';
import type { FaceBox } from '@/lib/useDetectFaces';

interface FaceSelectionOverlayProps {
  imageUrl: string;
  faces: FaceBox[];
  selectedFaceIds: string[];
  onToggleFace: (id: string) => void;
  disabled?: boolean;
}

// FaceSelectionOverlay renders the original image with clickable absolute-
// positioned boxes over each detected face. Box coordinates are normalized
// [0,1] so CSS percentages handle any rendered image size — we don't need a
// canvas or pixel math.
const FaceSelectionOverlay: React.FC<FaceSelectionOverlayProps> = ({
  imageUrl,
  faces,
  selectedFaceIds,
  onToggleFace,
  disabled = false,
}) => {
  const selected = new Set(selectedFaceIds);

  return (
    <div className="relative inline-block w-full overflow-hidden rounded-lg border border-border bg-black/40">
      <img
        src={imageUrl}
        alt="Detected faces preview"
        className="block w-full h-auto select-none"
        draggable={false}
      />
      {faces.map((face) => {
        const isSelected = selected.has(face.id);
        const label = face.index ?? face.id;
        return (
          <button
            type="button"
            key={face.id}
            disabled={disabled}
            aria-pressed={isSelected}
            aria-label={`Face ${label}${isSelected ? ' (selected)' : ''}`}
            onClick={() => onToggleFace(face.id)}
            style={{
              left: `${face.x * 100}%`,
              top: `${face.y * 100}%`,
              width: `${face.width * 100}%`,
              height: `${face.height * 100}%`,
            }}
            className={cn(
              'absolute flex items-start justify-start p-0.5 border-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-cyan-400',
              isSelected
                ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.6)]'
                : 'border-emerald-400/80 bg-emerald-400/10 hover:bg-emerald-400/25',
              disabled && 'opacity-60 cursor-not-allowed',
            )}
          >
            <span
              className={cn(
                'inline-block px-1 text-[10px] font-semibold leading-tight rounded',
                isSelected
                  ? 'bg-cyan-400 text-black'
                  : 'bg-emerald-500/90 text-black',
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FaceSelectionOverlay;
