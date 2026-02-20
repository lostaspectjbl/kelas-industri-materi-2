"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";

import TableSkeleton from "@/components/TableSkeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

type User = {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Siswa";
}

//data dummy
const dummyUser : User[] = Array.from({length: 20}, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@sekolah.com`,
    role: i % 3 === 0 ? "Admin" : "Siswa",
}));

const ITEMS_PER_PAGE = 10;

export default function UserPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    //state tabel user 
    const [isLoading, setIsLoading] = React.useState(false); 
    const [selectedQR, setSelectedQR] = useState<User | null>(null);

    //1. state untuk pencarian dan debounce
    const [searchQuery, setSearchQuery] = useState("");
    const [debounceQuery, setDebounceQuery] = useState("");

    //2. filter data pencarian
    const filteredUsers = dummyUser.filter((user) => {
        const query = debounceQuery.toLowerCase();
        return(
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query) 
        )
    })


    //3. logic pagination
    const page = Number(searchParams.get("page")) || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = filteredUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    //4. reset halaman ke satu saat search berubah
    useEffect(() => {
        if (page !== 1) {
            router.push(`/user?page=1`);
        }
    }, [debounceQuery]);

    //5. efek loading saar halaman berubah
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);//simulate loading 500ms

        return () => clearTimeout(timer);
    }, [page, debounceQuery]);

    //fungsi navigasi pagination
    const handlePageChange = (newPage: number) => {
        router.push(`/user?page=${newPage}`);
    }

    //fungsi QR code
    const getQRCodeUrl = (user: User) => {
        const data = `ID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`;
        return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=1000x1000`
    }

    //handle click qr code
    const handleQRCodeClick = (user: User) => {
        setSelectedQR(user);
    }

    //Handle close qr modal
    const handleCloseModal = () => {
        setSelectedQR(null);
    }

    //debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-600">Daftar Users</h1>
                    <Link href="/" className="text-indigo-600 hover:underline text-sm">
                       &larr; Kembali Ke Home
                    </Link>
                </div>

                {/* pencarian */}
                <div className="mb-4">
                    <input 
                        type="text"
                        placeholder="Cari Berdasarkan nama, email, ateu role...." 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                    />
                </div>

                {/* Tabel User */}
                <div className="border rounded-lg overflow-hidden min-h-[300px] relative">

                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold uppercase">
                            <tr>
                                <th className="p-4 border-b">ID</th>
                                <th className="p-4 border-b">Nama Lengkap</th>
                                <th className="p-4 border-b">Email</th>
                                <th className="p-4 border-b">Role</th>
                                <th className="p-4 border-b">QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableSkeleton />
                            ) : (
                            currentData.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition border-b last:border-0">
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4 font-semibold text-gray-900">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full ${user.role === "Admin" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <img 
                                            src={getQRCodeUrl(user)}
                                            className="w-16 h-16 cursor-pointer hover:scale-110 transition"
                                            onClick={() => handleQRCodeClick(user)} 
                                            alt="Qr Code" 
                                        />
                                    </td>
                                </tr>
                            ))
                            )}
        
                        </tbody>
                    </table>
                </div>
                
                {/* navigasi pagination */}
                <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-500">
                        Halaman <b>{page}</b> dari <b>{totalPages}</b>
                    </span>

                    <div className="flex gap-2">
                        <button
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                        className="px-4 py-4 border rounded hover:bg-gray-50 desabled:ocapacity=50 disabled:cursor-not-allowed text-black">
                            sebelumnya
                        </button>
                        <button
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                        className="px-4 py-4 border rounded hover:bg-gray-50 desabled:ocapacity=50 disabled:cursor-not-allowed text-black">
                            berikutnya
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal QR Code */}
            {selectedQR && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseModal}
                >
                    <div className="bg-white rounded-lg p-6 max-w-md w-full-relative" onClick={(e) => e.stopPropagation()}>
                        {/* Tombol Close */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>

                        {/* informasi user  */}
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedQR?.name}</h2>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                    <span className="font-semibold">
                                        ID: </span> {selectedQR?.id}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Email: </span> {selectedQR?.email}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Role: </span> {selectedQR?.role}
                                </p>
                            </div>
                        </div>

                        {/* QR Code Image */}
                        <div className="flex justify-center">
                            <img src={getQRCodeUrl(selectedQR)} alt="QR Code" className="w-80 h-80 rounded-lg"/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}