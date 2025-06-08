// src/components/Layout/Sidebar.tsx

import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.rol;

  return (
    <div
      className="bg-secondary text-white vh-100 p-3"
      style={{ width: '200px', position: 'fixed', top: '56px' }}
    >
      <ul className="nav flex-column">
        {role === 'ADMIN' && (
          <>
            <li className="nav-item mb-2">
              <Link href="/admin/dashboard" className="nav-link text-white">
                Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/branches" className="nav-link text-white">
                Branches
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/employees" className="nav-link text-white">
                Employees
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/services" className="nav-link text-white">
                Services
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/equipment-types" className="nav-link text-white">
                Equipment Types
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/inventory" className="nav-link text-white">
                Inventory
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/products" className="nav-link text-white">
                Products
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/group-classes" className="nav-link text-white">
                Group Classes
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/generate-payroll" className="nav-link text-white">
                Generate Payroll
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/copy-calendar" className="nav-link text-white">
                Copy Calendar
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/admin/copy-gym" className="nav-link text-white">
                Copy Gym
              </Link>
            </li>
          </>
        )}

        {role === 'CLIENTE' && (
          <>
            <li className="nav-item mb-2">
              <Link href="/cliente/dashboard" className="nav-link text-white">
                Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/cliente/my-plan" className="nav-link text-white">
                My Plan
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/cliente/search-classes" className="nav-link text-white">
                Search Classes
              </Link>
            </li>
          </>
        )}

        {role === 'INSTRUCTOR' && (
          <>
            <li className="nav-item mb-2">
              <Link href="/instructor/dashboard" className="nav-link text-white">
                Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/instructor/AssignClient" className="nav-link text-white">
                Assign Client
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/instructor/CreateWorkPlan" className="nav-link text-white">
                Create Work Plan
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link href="/instructor/RegisterClass" className="nav-link text-white">
                Register Class
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
