interface CardProps {
  title?: string;
  value?: string;
  trend?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Card({ title, value, trend, children, className = '' }: CardProps) {
  const isTrendPositive = trend?.startsWith('+');
  
  return (
    <div className={`bg-white rounded-lg border-2 border-black shadow-sm p-6 ${className}`}>
      {title && value ? (
        <>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {value}
            </p>
            {trend && (
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                isTrendPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend}
              </p>
            )}
          </div>
        </>
      ) : children}
    </div>
  );
}
