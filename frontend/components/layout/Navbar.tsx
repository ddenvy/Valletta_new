import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/candidates', label: 'Candidates' },
  { href: '/departments', label: 'Departments' },
  { href: '/employees', label: 'Employees' },
  { href: '/vacancy', label: 'Vacancy' },
  { href: '/reports', label: 'Reports' },
  { href: '/payroll', label: 'Payroll' },
  { href: '/statistic', label: 'Statistic' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r">
      <div className="p-6">
        <h1 className="text-xl font-bold text-black mb-8">Valletta CRM</h1>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
