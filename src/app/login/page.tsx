"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
    const router = useRouter();

    // state input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    //state error
    const [error, setError] = useState("");

    // handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //1. validasi required (wajib diisi)
        if(! email || !password) {
            setError("Email dan Password wajib diisi");
            return; 
        }

        //2. validasi format email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(! emailPattern.test(email)) {
            setError("Format email tidak valid");
            return;
        }

        //3. validasi panjang password
        if(password.length < 6) {
            setError("Panjang password minimal 6 karakter");
            return;
        }

        //4. validasi recaptcha
        if(! recaptchaToken) {
            setError("Silahkan verifikasi reCAPTCHA");
            return;
        }

        // Jika lolos
        setError("");
        alert("login berhasil!, selamat datang kembali");
        router.push("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Masuk Akun</h1>
                    <p className="text-sm text-gray-500 mt-2">Silahkan login untuk mengakses dashboard</p>
                </div>
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm texr-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Email</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="masukkan email anda"
                            />
                        <label className="block text-sm font-medium text-black mb-1">Password</label>    
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="masukkan password anda"
                            />      
                    </div>

                    {/* Tambahkan reCAPTCHA di sini */}
                    <div className="flex justify-center pt-2">
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={(token) => setRecaptchaToken(token)}
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-blue-500 text-white-500">
                        Masuk Sekarang 
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Belum punya akun?{" "}
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Daftar disini
                    </Link>
                </p>
            </div>
        </div>
    )
}