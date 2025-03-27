export default function DashboardLoading() {
  return (
    <div className="notion-page flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">Загрузка панели управления...</p>
      </div>
    </div>
  );
} 