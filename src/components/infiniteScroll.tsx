"use client";

import { useState, useEffect, useRef, useCallback } from "react";

//definisikan tipe data untuk item
interface Item {
    id: number;
    title: string;
    description: string;
    page: number;
}

export default function InfiniteScrollFeed() {
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    //Ref untuk observer
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    //fungsi untuk membuat data baru (simulasi API call)
    const fetchData = async (pageNum: number) : Promise<Item[]> => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi delay

        //batas total halaman
        if (pageNum > 5) {
            return [];
        }

        //buat data dummy
        const newItems: Item[] = Array.from({ length: 10 }, (_, index) => ({
            id: (pageNum - 1) * 10 + index + 1,
            title: `Item ${(pageNum - 1) * 10 + index + 1}`,
            description: `Deskripsi untuk item ${(pageNum - 1) * 10 + index + 1}`,
            page: pageNum,
        }));

        return newItems;
    };

    //callback untuk intersection observer
    const loadMoreItems = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const newItems = await fetchData(page);
            if (newItems.length === 0) {
                setHasMore(false);
            } else {
                setItems(prevItems => [...prevItems, ...newItems]);
                setPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page]);

    //setup intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMoreItems();
                }
            },
            {
                rootMargin: "0px",
                threshold: 1.0
            }
        );
        
        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }
        };
    }, [loadMoreItems]);

    //load data awel
    useEffect(() => {
        loadMoreItems();
    }, []);
    
    return (
        <div className="w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
                infinite scroll feed
            </h3>

            {/* container feed items */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-6 rounded-lg shadow-md border border-gray-200    hover:shadow-lg transition-shadow">

                        <h4 className="font-semibold text-lg text-indigo-600 mb-2">
                            {item.title}
                        </h4>
                        <p className="text-gray-600">{item.description}</p>
                        <span className="inline-block mt-2 text-xs text-gray-400">
                            Halamman: {item.page} # ID: {item.id}
                        </span>
                    </div>
                ))}
            </div>

            {/* Skeleton Loading */}
            {loading && (
                <div className="space-y-4 mt-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <SkeletonLoader key={index} />
                    ))}
                </div>
            )}

            {/* Sentinel untuk intersection observer */}
            <div ref={sentinelRef} className="h-10 flext items-center justify-center">
                {!hasMore && !loading && (
                    <p className="text-gray-500 text-sm font-medium ">
                        Anda sudah mencapai akhir feed
                    </p>
                )}
            </div>

        </div>
    )
}

//komponen skeleton loader
function SkeletonLoader() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-100 rounded w-1/4 mt-3"></div>
        </div>
    )
}