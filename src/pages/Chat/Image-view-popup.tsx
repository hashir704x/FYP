import { X } from "lucide-react";

type PropsType = {
    showImageView: boolean;
    setShowImageView: React.Dispatch<React.SetStateAction<boolean>>;
    imageViewUrl: string | null;
    setImageViewUrl: React.Dispatch<React.SetStateAction<string | null>>;
};

const ImageViewPopup = ({
    showImageView,
    imageViewUrl,
    setShowImageView,
    setImageViewUrl,
}: PropsType) => {
    if (!showImageView || !imageViewUrl) return null;

    const handleClose = () => {
        setShowImageView(false);
        setTimeout(() => setImageViewUrl(null), 300);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                showImageView ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={handleClose}
        >
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            >
                <X size={28} />
            </button>

            <div
                className={`max-w-[90vw] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 ${
                    showImageView ? "scale-100" : "scale-95 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageViewUrl}
                    alt="Preview"
                    className="rounded-2xl object-contain md:w-[800px] w-full h-full transition-transform duration-300 hover:scale-[1.03]"
                />
            </div>
        </div>
    );
};

export default ImageViewPopup;
