"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import { NotificationProvider, useNotification } from "./NotificationComponents";
import { supabase } from "@/lib/supabase";
import { title } from "process";
import { redirect } from "next/dist/server/api-utils";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAra: string;
}

function LayoutContent({ children }: {children: React.ReactNode}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { sendNotification } = useNotification();

    //setup supbase realtime
    useEffect(() => {
        const channel = supabase
            .channel('layout-notification')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'todos' },
                async (payload) => {
                    console.log('Change received in layout!', payload);

                    //Kirim Notifikasi
                    if (payload.eventType === 'INSERT' && payload.new) {
                        const todo = payload.new as Todo;
                        await sendNotification({
                            title: 'New Todo Added',
                            body: `${todo.text}`,
                            redirectUrl: '/realtime-db'
                        });
                    } else if (payload.eventType === 'UPDATE' && payload.new) {
                        const todo = payload.new as Todo;
                        await sendNotification({
                            title: todo.completed ? 'Todo Completed' : 'Todo Updated',
                            body: `${todo.text}`,
                            redirectUrl: '/realtime-db'
                        })
                    } else if (payload.eventType === 'DELETE' && payload.old) {
                        const todo = payload.old as Todo;
                        await sendNotification({
                            title: 'Todo Deleted',
                            body: todo.text ? `${todo.text}` : 'A todo item was deleted',
                            redirectUrl: '/realtime-db'
                        });
                    }
                }
            )
            .on('system', {}, (payload) => {
                if (payload.extension === 'postgres_changes' &&  payload.status === 'ok') {
                    sendNotification({
                        title: 'Realtime DB Connected',
                        body: 'Connected to supabase realtime database seccessfully',
                        redirectUrl: '/realtime-db'
                    });

                    setTimeout(() =>{

                    }, 3000);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sendNotification]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className="flex flex-col flex-1">
                <Header brandName="MyApp" onBrandClick={toggleSidebar} />
                <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
                <Footer />
            </div>
        </div>
    );
}

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <LayoutContent>{children}</LayoutContent>
        </NotificationProvider>
    );
}