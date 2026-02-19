import Image from 'next/image'

export default function MediaSection() {
    return (
        <section className="mt-8 space-y-8">
            {/* Judul Section  */}
            <h3 className="text-2xl font-bold"> Galeri Media Section</h3>

            {/* Single image dengan next/image */}
            <div className="space-y-4">
                <h4 className="text-2xl font-semibold">Gambar Optimasi Otomatis</h4>
                <Image 
                    src="/lau sape Mpruy.jpg"
                    alt="Gambar Optimasi Otomatis"
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-lg shadow-xl"
                />
                <p className="text-white-600 text-sm">
                    Gambar ini otomatis di lazy load, dikonversi jadi WebP, dan ukurannya disesuaikan
                </p>
            </div>

            {/* Grid Gambar 2: Di mobile bertumpuk */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Galeri Responsive</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Image
                        src="/gem.jpg"
                        alt="Gambar pertama"
                        width={800}
                        height={500}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <Image
                        src="/HooLeeSheet.jpg"
                        alt="Gambar Kedua"
                        width={800}
                        height={500}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* Video Responsive Youtube */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Video Responsive(OHIO IMPRESSED)</h4>
                <div className="aspect-video w-full">
                    <iframe 
                        src="https://youtube.com/embed/tBKYI3-3lMg?si=yaBmQU_M0mttS43d" 
                        allowFullScreen
                        className="w-full h-full rounded-lg shadow-xl"></iframe>
                </div>
                <p>Video Selalu Menjaga Aspect Rasia 16:9 dan responsif di semua ukuran layar (OHIO IMPRESSED)</p>
            </div>

            {/* Video Lokal Opsional */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Video Lokal Opsional</h4>
                <div className="aspect-video w-full">
                   <video 
                    src="/ohio_impress.mp4"
                    controls
                    className="w-full h-full rounded-lg shadow-xl"
                   ></video>
                </div>
                <p className="text-white-600 text-sm">Video King Von Lokal Ohio Impresed JUga bisa</p>
            </div>
        </section>
    )
}