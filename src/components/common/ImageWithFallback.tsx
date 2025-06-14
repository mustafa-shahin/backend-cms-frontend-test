// src/components/common/ImageWithFallback.tsx
import React, { useState } from "react";
import Icon from "./Icon";
import { IconName } from "./Icon";

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackIcon?: IconName;
  fallbackText?: string;
  onError?: () => void;
  onLoad?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "",
  fallbackIcon = "image",
  fallbackText,
  onError,
  onLoad,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  if (!src || hasError) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <Icon
            name={fallbackIcon}
            size="lg"
            className="text-gray-400 mx-auto mb-1"
          />
          {fallbackText && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {fallbackText}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Icon name="spinner" size="sm" spin className="text-gray-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default ImageWithFallback;
