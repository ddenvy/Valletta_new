'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Перенаправляем на дашборд
        router.push('/dashboard');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Загрузка...</h1>
                <p className="mt-2">Перенаправление на дашборд</p>
            </div>
        </div>
    );
}
