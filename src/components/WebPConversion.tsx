"use client"

import { useState } from "react";

interface WebPConversionProps {
    compressedFiles: File | null;
    resizeData: any;
}

export default function WebPConversion({ compressedFiles, resizeData }: WebPConversionProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleConversion = async () => {
        if (!compressedFiles) return;  

        setLoading(true);
        const formData = new FormData();
        formData.append("file", compressedFiles);

        try {
            const response = await fetch("/api/webp", {
                method: "POST",
                body: formData,
            });

        const data = await response.json();
        setResult(data);
        } catch (error) {
            console.error("Error converting to WebP:", error);
        } finally {
            setLoading(false);
        }
    };
    const formatBytes = (bytes: number) => {
        return (bytes/1024).toFixed(2) + "KB";
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Step 3: WebP Conversion</h2>
            <p className="text-gray-600 mb-6">Convert ke webP untuk performa lebih optimal</p>

            <button
                onClick={handleConversion}
                disabled={loading || !compressedFiles}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium"
            >
                {loading ? "Proses Konversi..." : "Convert to WebP"}
            </button>

            {result && (
                <>
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-3">Original Format (Compressed)</h3>
                            <img 
                            src={result.originalUrl} 
                            alt="Original"
                            className="w-full h-64 object-contain rounded bg-gray-50" 
                            />
                            <p className="mt-3 text-sm text-gray-600">
                                Size: {formatBytes(result.sizes.original)}
                            </p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-3">WebP Format</h3>
                            <picture>
                                <source srcSet={result.webpUrl} type="image/webp"/>
                                <img 
                                    src={result.webpUrl} 
                                    alt="WebP"
                                    className="w-full h-64 object-contain rounded bg-gray-50" 
                                />
                            </picture>
                            <p className="mt-3 text-sm text-gray-600">
                                Size: {formatBytes(result.sizes.webp)}
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                                Saved: {formatBytes(result.sizes.original - result.sizes.webp)} 
                                ({((1 - result.sizes.webp) / result.sizes.original * 100).toFixed(1)}%)
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient to-r from-blue-50 to-purple-50 rounded-lg">
                        <h4 className="font-semibold mb-3">Final Comparison (End-To-End)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Original Upload</p>
                                <p className="font-bold text-lg">{formatBytes(resizeData && resizeData.originalIze)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Compressed (Base)</p>
                                <p className="font-bold text-lg">{formatBytes(result.sizes.original)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Thumbnail (Step 2)</p>
                                <p className="font-bold text-lg">{resizeData && formatBytes(resizeData.sizes.thumbnail)}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">WebP (Final)</p>
                                <p className="font-bold text-lg text-green-600">{formatBytes(result.sizes.webp)}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-center text-green-600 font-semibold text-lg">
                                    Total Savings (WebP vs Original): {formatBytes(result.sizes.original - result.sizes.webp)}
                                    ({((1 - result.sizes.webp / resizeData.originalSize) * 100).toFixed(1)}%)
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}      