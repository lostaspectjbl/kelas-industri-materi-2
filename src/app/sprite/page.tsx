"use client";

import { useState } from "react";
import Link from "next/link";

type Icon = {
    name: string;
    col: number;
    row: number;
    offsetX: number;
    offsetY: number;
    color: string;
}

export default function SpritePage() {
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);

    const sosialIcon: Icon[] = [
        { name: "BMW 1", col: 0, row: 0, offsetX: 34, offsetY: 35, color:"#ffffff"},
        { name: "BMW 2", col: 1, row: 0, offsetX: 20, offsetY: 45, color:"#ffffff"},
        { name: "BMW 3", col: 2, row: 0, offsetX: -5, offsetY: 45, color:"#ffffff"},
        { name: "BMW 4", col: 3, row: 0, offsetX: -25, offsetY: 45, color:"#ffffff"},
        { name: "BMW 5", col: 0, row: 1, offsetX: 45, offsetY: 20, color:"#ffffff"},
        { name: "BMW 6", col: 1, row: 1, offsetX: 20, offsetY: 20, color:"#ffffff"},
        { name: "BMW 7", col: 2, row: 1, offsetX: -5, offsetY: 20, color:"#ffffff"},
        { name: "BMW 8", col: 3, row: 1, offsetX: -25, offsetY: 20, color:"#ffffff"},
        { name: "BMW 9", col: 0, row: 2, offsetX: 45, offsetY: 0, color:"#ffffff"},
        { name: "BMW 10", col: 1, row: 2, offsetX: 20, offsetY: 0, color:"#ffffff"},
        { name: "BMW 11", col: 2, row: 2, offsetX: -5, offsetY: 0, color:"#ffffff"},
        { name: "BMW 12", col: 3, row: 2, offsetX: -25, offsetY: 0, color:"#ffffff"},
        { name: "BMW 13", col: 0, row: 3, offsetX: 45, offsetY: -20, color:"#ffffff"},
        { name: "BMW 14", col: 1, row: 3, offsetX: 20, offsetY: -20, color:"#ffffff"},
        { name: "BMW 15", col: 2, row: 3, offsetX: -5, offsetY: -20, color:"#ffffff"},
        { name: "BMW 16", col: 3, row: 3, offsetX: -25, offsetY: -20, color:"#ffffff"}
    ];

    const iconSize = 100;
    const displaySize = 80;
    const previewSize = 200;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
            <Link href="/" className="text-indigo-600 hover:underline text-sm inline-block mb-4">
            &larr; Kembali Ke home
            </Link>

            {/* Header */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <h1 className="m-0 text-xl md:text-2xl font-semibold">BMW Picture</h1>
                <p className="mt-2 mb-0 text-gray-600 text-sm md:text-base">Css Sprite Sheet</p>
            </div>

            {/* Icon Grid */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                    {sosialIcon.map((icon, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-centergap-2 md:gap-3 cursor-pointer"
                            onMouseEnter={() => setHoveredIcon(icon.name)}
                            onMouseLeave={() => setHoveredIcon(null)}
                            onClick={() => setSelectedIcon(icon)}
                            role="button"
                            tabIndex={0}
                       >
                            <div 
                                className={`rounded-xl shadow-sm transition-all duration-200
                                    ${hoveredIcon === icon.name ? 'scale-110' : 'scale-100'}`}
                                style={{
                                    width:`${displaySize}px`,
                                    height:`${displaySize}px`,
                                    backgroundImage: `url('/sprite.jpg')`,
                                    backgroundSize: `${iconSize * 4}px ${iconSize * 4}px`,
                                    backgroundPosition: `-${icon.col * iconSize + icon.offsetX}px
                                    -${icon.row * iconSize + icon.offsetY}px`,
                                    boxShadow: hoveredIcon === icon.name
                                        ? `0 4px 12px ${icon.color}60`
                                        : undefined
                                }}
                            />
                            <span className="text-xs md:text-sm text-gray-800 text-center">
                                {icon.name}
                            </span>           
                        </div>
                    ))}
                </div>

                {/* Preview Sectio */}
                {selectedIcon && (
                    <div className="mt-4 md:mt-6 p-4 md:p-6 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm">
                        <div
                            className="rounded -2xl mx-auto ms:mx-0 flex-shrink-0"
                            style={{
                                width: `${previewSize}px`,
                                height: `${previewSize}px`,
                                backgroundImage:`${iconSize * 4 * (previewSize / displaySize)}px ${iconSize * 4 * (previewSize / displaySize)}px`,
                                backgroundPosition: `-${selectedIcon.col * iconSize * (previewSize / displaySize) + selectedIcon.offsetX * (previewSize / displaySize)}px
                                -${selectedIcon.row * iconSize * (previewSize / displaySize) + selectedIcon.offsetY * (previewSize / displaySize)}px`,
                            }}
                        />

                        <div className="flex-1 w-full md:w-auto text-center md:text-left ">
                            <h3 className="m-0 text-lg md:text-xl font-semibold">{selectedIcon.name}</h3>
                            <p className="mt-2 mb-0 text-gray-600 text-sm">Preview</p>
                            <div className="mt-3 md:mt-4">
                                <button
                                    onClick={() => setSelectedIcon(null)}
                                    className="px-4 py-2 rounded-lg border-none bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors">
                                        Close
                                    </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}