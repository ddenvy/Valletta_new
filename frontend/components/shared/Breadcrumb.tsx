'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index === 0 ? (
              <Link 
                href={item.href}
                className="inline-flex items-center text-sm text-gray-700 hover:text-indigo-600"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            ) : (
              <div className="flex items-center">
                <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-1" />
                <Link 
                  href={item.href}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2"
                >
                  {item.label}
                </Link>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 