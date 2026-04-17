"use client"

import { on } from "events";
import { useState } from "react"

interface ServerResizeProps {
    compressedFiles: File | null;
    originalSize: number | null;
    onresized : (data: any) => void;
}

export default function ServerResize({ compressedFiles, originalSize, onresized }: ServerResizeProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);

    const handleResize = async () => {
        if (!compressedFiles) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", compressedFiles);

        try {
            const response = await fetch("/api/resize", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Network Was not ok");
            }

            const data = await response.json();
            setResult(data.resizedUrl);
            onresized(compressedFiles);
        } catch (error) {
            console.error("Error resizing image:", error);
            setResult("Error resizing image");
        } finally {            
            setLoading(false);
        }
    }

    const formatBytes = (bytes: number) => {
        return (bytes/1024).toFixed(2) + "KB";
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">Step 2: Server Side Resize</h2>
            <p className="texr-black-500 mb-6">Generate Thumbnail 300x300</p>

            <button
                onClick={handleResize}
                disabled={loading || !compressedFiles}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-7000 disabled:bg-gray-400 font-medium"
            >
                {loading ? "Proses Resizing..." : "Generate Thumbnail"}
            </button>

            {result && (
                <div className="mt-6 grid md:grid-cols-2 gap-6 ">
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Compressed Image</h3>
                        <img 
                            src={result.originalUrl} 
                            alt="Compressed" 
                            className="w-full h-64 object contain rounded bg-gray-50 "
                        />
                        <p className="mt-3 text-sm text-gray-600">
                            Size: {formatBytes(result.size.compressed)}
                        </p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Thumbnail 300x300</h3>
                        <img 
                            src={result.ThumbnailUrl} 
                            alt="Thumbnail" 
                            className="w-full h-64 object contain rounded bg-gray-50 "
                        />
                        <p className="mt-3 text-sm text-gray-600">
                            Size: {formatBytes(result.size.thumbnail)}
                        </p>
                        <p className="text-sm text-green-600 font-medium ">
                            -{((1 - result.size.thumbnail / result.size.compressed) * 100).toFixed(1)}% lebih kecil dari gambar kompresi
                        </p>
                    </div>  
                </div>
            )}
        </div>
    )
}