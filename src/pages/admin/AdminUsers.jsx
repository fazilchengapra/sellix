import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import AlertDialog from '../../components/ui/AlertDialog';
import Pagination from '../../components/ui/Pagination';
import UsersHeader from '../../components/admin/users/UsersHeader';
import UsersToolbar from '../../components/admin/users/UsersToolbar';
import UsersTable from '../../components/admin/users/UsersTable';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const { showToast } = useToast();
  
    // Alert Dialog State
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'danger',
        onConfirm: () => {},
        loading: false
    });
  
    // Debounce search: wait 500ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset to page 1 when debounced search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const fetchUsers = useCallback(async () => {
      try {
        setTableLoading(true);
        const params = {
          page: currentPage,
          page_size: itemsPerPage,
        };
        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }
        const response = await api.get('/admin/users/', { params });
        setUsers(response.data.results || response.data);
        if (response.data.count !== undefined) {
            setTotalPages(Math.ceil(response.data.count / itemsPerPage));
        } else {
            setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setInitialLoading(false);
        setTableLoading(false);
      }
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
      fetchUsers();
    }, [fetchUsers]);
  
    const confirmDelete = (userId) => {
        setAlertConfig({
            isOpen: true,
            title: 'Delete User',
            message: `Are you sure you want to delete this user? This action cannot be undone.`,
            variant: 'danger',
            confirmText: 'Delete',
            onConfirm: () => handleDelete(userId)
        });
    };
  
    const handleDelete = async (id) => {
          setAlertConfig(prev => ({ ...prev, loading: true }));
          try {
              const response = await api.delete(`/admin/users/${id}/`);
              setUsers(users.filter(u => u.id !== id));
              showToast(response.data.message || "User deleted successfully", "success");
              setAlertConfig(prev => ({ ...prev, isOpen: false }));
          } catch (error) {
              console.error(error);
              showToast("Failed to delete user", "error");
              setAlertConfig(prev => ({ ...prev, isOpen: false }));
          }
    };

    const handleToggleBlock = async (user) => {
        try {
            const response = await api.post(`/admin/users/${user.id}/block-unblock/`);
            const newStatus = !user.is_active;
            setUsers(users.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
            showToast(response.data.message || `User ${newStatus ? 'unblocked' : 'blocked'} successfully`, "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to update user status", "error");
        }
    };
  
    if (initialLoading) return <div className="h-96 flex items-center justify-center"><Spinner size={40} /></div>;
  
    return (
      <div className="space-y-6">
        <UsersHeader />
  
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <UsersToolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  
          <div className={`relative transition-opacity duration-200 ${tableLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <UsersTable users={users} onDelete={confirmDelete} onToggleBlock={handleToggleBlock} />
          </div>
          
           <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
           />
        </div>

        <AlertDialog
            isOpen={alertConfig.isOpen}
            title={alertConfig.title}
            message={alertConfig.message}
            variant={alertConfig.variant}
            confirmText={alertConfig.confirmText}
            loading={alertConfig.loading}
            onConfirm={alertConfig.onConfirm}
            onClose={() => setAlertConfig(prev => ({...prev, isOpen: false}))}
        />
      </div>
    );
  };
export default AdminUsers;
