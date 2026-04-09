'use client'

import React, {useState, useEffect} from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,  } from 'recharts';
import { Calendar, RefreshCw, Maximize2, Minimize2, Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const FILTER_OPTIONS : { label: string, value: FilterOption }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'This Month', value: 'thismonth' },
    { label: 'Last Month', value: 'lastmonth' },
    { label: 'This Year', value: 'thisyear' },
    { label: 'Last Year', value: 'lastyear' },
    { label: 'All Time', value: 'alltime' },
];

//Types
type FilterOption = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thismonth' | 'lastmonth' | 'thisyear' | 'lastyear' | 'alltime';
type BarDatum = {name: string; value: number; target: number; };
type LineDatum = {name: string; sales: number; revenue: number; }; 
type PieDatum = {name: string; value: number; }; 
type Stats = {users: number; revenue: number; orders: number; growth: string; }; 

//Fungsi untuk generate data berdasarkan filter
const generateDataByFilter = (filter: FilterOption) => {
    const multiplier = {
        today: 0.3,
        yesterday: 0.25,
        last7days: 0.6,
        last30days: 1,
        thismonth: 1.1,
        lastmonth: 0.9,
        thisyear: 1.5,
        lastyear: 1.3,
        alltime: 2,
    }

    const mult = multiplier[filter] ?? 1;

    return {
        bar: [
            { name: 'Jan', value: Math.round(4000 * mult), target: Math.round(3500 * mult)},
            { name: 'Feb', value: Math.round(3000 * mult), target: Math.round(3200 * mult)},
            { name: 'Mar', value: Math.round(5000 * mult), target: Math.round(4000 * mult)},
            { name: 'Apr', value: Math.round(4500 * mult), target: Math.round(4200 * mult)},
            { name: 'May', value: Math.round(6000 * mult), target: Math.round(5000 * mult)},
            { name: 'Jun', value: Math.round(5500 * mult), target: Math.round(5200 * mult)},
        ] as BarDatum[],
        line: [
            { name: 'Week 1', sales: Math.round(2400 * mult), revenue: Math.round(3400 * mult)},
            { name: 'Week 2', sales: Math.round(1398 * mult), revenue: Math.round(2210 * mult)},
            { name: 'Week 3', sales: Math.round(9800 * mult), revenue: Math.round(4290 * mult)},
            { name: 'Week 4', sales: Math.round(3908 * mult), revenue: Math.round(3000 * mult)},
        ] as LineDatum[],
        pie: [
            { name: 'Kelas A', value: Math.round(400 * mult)},
            { name: 'Kelas B', value: Math.round(300 * mult)},
            { name: 'Kelas C', value: Math.round(200 * mult)},
            { name: 'Kelas D', value: Math.round(100 * mult)},
        ] as PieDatum [],
        stats: {
            users: Math.round(12345 * mult),
            revenue: Math.round(45678 * mult),
            orders: Math.round(3456 * mult),
            growth: (23.5 * mult).toFixed(1)   
        } as Stats
    }
}
 
export default function AnalyticDashboard() {
    const [dateFilter, setDateFilter] = useState<FilterOption>('last7days');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const [fullscreenChart, setFullscreenChart] = useState<'bar' | 'line' | 'pie' | null>(null);
    const [isLoading, setIsLoading] =useState(false);

    //data untuk grafik
    const [barData, setBarData] = useState<BarDatum[]>([]);
    const [lineData, setLineData] = useState<LineDatum[]>([]);
    const [pieData, setPieData] = useState<PieDatum[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);

    //Load data saat filter berubah
    useEffect(() => {
        setIsLoading(true);

        //simulasi loading data
        setTimeout (() => {
            const data = generateDataByFilter(dateFilter);
            setBarData(data.bar);
            setLineData(data.line);
            setPieData(data.pie);
            setStats(data.stats);
            setIsLoading(false);
        }, 500);
    }, [dateFilter]);

    //stats card data dengan data 
    return (
        <div></div>
    )
}