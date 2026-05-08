"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNotification } from "@/layout/NotificationComponents";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
}

export default function IndexDBPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [loading, setLoading] = useState(true);
    const [permissionRequested, setPermissionRequested] = useState(false);

    const { sendNotification, requestPermission, isPermissionGranted} = useNotification();

    //request permission notifikasi saat pertama kali load
    useEffect(() => {
        const askPermission = async () => {
            if (!permissionRequested && !isPermissionGranted()) {
                await requestPermission();
                setPermissionRequested(true)
            }
        };
        askPermission();
    }, [isPermissionGranted, permissionRequested, requestPermission]);


    //inisialisasi supabase
    useEffect(() => {
        loadTodos();

        //Subscribe ke perubahan realtime
        const channel = supabase
            .channel('todos-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'todos'},
                (payload) => {
                    console.log('Changes received!', payload);
                    loadTodos();
                }
            )
            .subscribe();
        
        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    //load semua todo dari indexdb
    const loadTodos = async() => {
        try {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .order('created_at', { ascending: false});

            if (error) throw error;
            setTodos(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading todos: ', error);
            setLoading(false);
        }
    };

    //tambah todo baru 
    const addTodo = async() => {
        try {
            const { error } = await supabase
                .from('todos')
                .insert([{ text: newTodo, completed: false}]);

            if (error) throw error;
            setNewTodo("");
        } catch (error) {
            console.error('Error adding todo: ', error);
        }
    };


    //Toggle Completed Todo
    const toggleTodo =async (id: number, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('todos')
                .update({ completed: currentStatus })
                .eq('id', id)
            if (error) throw error;
        } catch (error) {
            console.error('Error toggling todo: ', error);
        }
    };

    //hapus Todo
    const deleteTodo = async (id: number) => {
        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id)
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting todo: ', error);
        }
    };

    //Hapus semua Todo
    const clearAll = async() => {
        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .neq("id", 0)

            if (error) throw error;

            await sendNotification({
                title: 'All Todos Cleared',
                body: 'All Todos Item Have been deleted',
                redirectUrl: '/realtime-db'
            })
        } catch (error) {
            console.error('Error clearing todo: ', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
                <p className="text-gray-500 text-lg">Loading todos...</p>
            </div>
        );
    }


    return(
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold">Todo List with Supabase dan Send notifikasi</h1>
                    <p className="text-sm md:text-base mt-2">
                        {isPermissionGranted()
                            ? "Notifikasi diizinkan"
                            : "Notifikasi tidak diizinkan. Silahkan izinkan notifikasi untuk menerima pembaruan pesan realtime"
                        }
                    </p>
                </div>

                {/* Input Form */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2  className="text-xl font-bold mb-4 ">Tambah Todo</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addTodo()}
                            placeholder="Apa yang ingin anda lakukan" 
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline none"   
                        />
                        <button
                            onClick={addTodo}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            tambah
                        </button>
                    </div>
                </div>

                {/* Todo List */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Daftar Todo ({todos.length})</h2>
                        {todos.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="px-4 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                                Hapus Semua
                            </button>
                        )}
                    </div>
                    {todos.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-4xl mb-2">-</p>
                            <p>Tidak Ada Todo Yang Terserdia </p>
                        </div>
                    ): (
                        <div className="space-y-2">
                            {todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transisition"
                                >
                                    <input 
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(todo.id, todo.completed)}
                                        className="w-5 h-5 cursor-ponter"
                                    />

                                    <span
                                        className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-400" : ""}`}
                                    >
                                        {todo.text}
                                    </span>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}