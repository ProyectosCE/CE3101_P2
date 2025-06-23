// src/pages/admin/Branches.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/AdminPage.module.css';
import { API_BASE_URL } from '@/stores/api';

interface Branch {
  id_sucursal: number;
  nombre_sucursal: string;
  provincia: string;
  canton: string;
  distrito: string;
  horario_atencion: string;
  capacidad_max: number;
  id_admin: number;
  spa_activo: boolean;
  tienda_activo: boolean;
  telefonos: { id_telefono_sucursal: number, numero: string }[];
}

export default function Branches() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre_sucursal: '', provincia: '', canton: '', distrito: '',
    horario_atencion: '', capacidad_max: 0,
    id_admin: user?.id ?? 0,
    spa_activo: false, tienda_activo: false,
    telefonos: ['']
  });

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sucursal`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setBranches(json.data);
    } catch (err: any) {
      alert('Error al obtener sucursales: ' + err.message);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : id === 'capacidad_max' ? Number(value) : value
    }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updated = [...form.telefonos];
    updated[index] = value;
    setForm(prev => ({ ...prev, telefonos: updated }));
  };

  const addPhoneField = () => {
    setForm(prev => ({ ...prev, telefonos: [...prev.telefonos, ''] }));
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      nombre_sucursal: '', provincia: '', canton: '', distrito: '', horario_atencion: '', capacidad_max: 0,
      id_admin: user?.id ?? 0, spa_activo: false, tienda_activo: false, telefonos: ['']
    });
    setShowModal(true);
  };

  const openEditModal = (branch: Branch) => {
    setIsEditing(true);
    setEditingId(branch.id_sucursal);
    setForm({
      nombre_sucursal: branch.nombre_sucursal,
      provincia: branch.provincia,
      canton: branch.canton,
      distrito: branch.distrito,
      horario_atencion: branch.horario_atencion,
      capacidad_max: branch.capacidad_max,
      id_admin: branch.id_admin,
      spa_activo: branch.spa_activo,
      tienda_activo: branch.tienda_activo,
      telefonos: branch.telefonos.map(t => t.numero)
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Confirma eliminar esta sucursal?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/sucursal/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      fetchBranches();
    } catch (err: any) {
      alert('Error al eliminar sucursal: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!form.nombre_sucursal || !form.provincia || !form.horario_atencion) {
      alert('Complete todos los campos obligatorios.');
      return;
    }

    try {
      const method = isEditing ? 'PATCH' : 'POST';
      const url = isEditing ? `${API_BASE_URL}/api/sucursal/${editingId}` : '/api/sucursal';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_sucursal: form.nombre_sucursal,
          provincia: form.provincia,
          canton: form.canton,
          distrito: form.distrito,
          horario_atencion: form.horario_atencion,
          capacidad_max: form.capacidad_max,
          id_admin: form.id_admin,
          spa_activo: form.spa_activo,
          tienda_activo: form.tienda_activo
        })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      if (!isEditing) {
        // Crear teléfonos si es nuevo
        const idSucursal = json.data.id_sucursal;
        for (const numero of form.telefonos) {
          await fetch(`/api/telefonossucursal/${idSucursal}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero })
          });
        }
      }

      setShowModal(false);
      fetchBranches();
    } catch (err: any) {
      alert('Error al guardar sucursal: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return <div className={styles.pageContainer}>[...Interfaz sin cambios...]</div>;
}
