import MediaSection from "@/components/MediaSection";
import Link from "next/link";
import InfiniteScrollFeed from "@/components/infiniteScroll";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-purple-500 p-4 text-white">
        <div className="container flex justify-between items-center">
          <h1 className="text-cl font-bold">MyBrand</h1>
          
          {/* mobile */}
          <nav>
            <ul className="hidden md:flex gap-6">
              <li className="hover:text-indigo-200 cursor-pointer">Home</li>
              <li className="hover:text-indigo-200 cursor-pointer">About</li>
              <li className="hover:text-indigo-200 cursor-pointer">Contact</li>
            </ul>
            {/*Hamburger icon Mobile*/}
            <div className="md:hidden cursor pointer">
              =
            </div>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 mx-auto w-full">
        <aside className="hidden md:block w-64 bg-purple-100 p-6 border">
          <ul className="space-y-4 text-gray-700">
            <li className="font-semibold text-indigo-600 cursor-pointer">Dashboard</li>
            <li className="hover:text-indigo-600 cursor-pointer">Setting</li>
            <li className="hover:text-indigo-600 cursor-pointer">Profile</li>
            <li className="hover:text-indigo-600 cursor-pointer">
              <Link href="/user">Tabel User</Link>
            </li>
            <li key="image-process" className="hover:text-indigo-600 cursor-pointer">
              <Link href="/image-process">Image Process</Link>
            </li>
            <li key="image-sprite" className="hover:text-indigo-600 cursor-pointer">
              <Link href="/sprite">Sprite-Image</Link>
            </li>
            <li key="analytics" className="hover:text-indigo-600 cursor-pointer">
              <Link href="/analytic-dashboard">Analytic Dashboard</Link>
            </li>
            <li key="map" className="hover:text-indigo-600 cursor-pointer">
              <Link href="/penanganan-map">Penanganan Map</Link>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <h2 className="text-2-xl font-bold mb-4">Selamat Datang</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue p-6 rounded-lg shadow border">Statistik 1</div>
            <div className="bg-blue p-6 rounded-lg shadow border">Statistik 2</div>
            <div className="bg-blue p-6 rounded-lg shadow border md:col-span-2">Statistik Full</div>
          </div>

          <MediaSection />
          <InfiniteScrollFeed />
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 p-4 text-center text-sm">
        &copy; 2024 Responsive | UBIG.
      </footer>
    </div>
  );
}