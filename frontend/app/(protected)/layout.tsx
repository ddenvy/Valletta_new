import Sidebar from '../../components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex h-100">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <header className="d-flex align-items-center justify-content-end border-bottom p-3" style={{ height: '60px' }}>
          <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
            <ThemeToggle />
            {/* Здесь можно добавить другие элементы верхней панели */}
          </div>
        </header>
        <main className="main-content w-100 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
} 