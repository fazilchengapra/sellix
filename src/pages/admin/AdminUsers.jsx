import { useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };
  
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
              await api.delete(`/users/${id}`);
              setUsers(users.filter(u => u.id !== id));
              showToast("User deleted successfully", "success");
              setAlertConfig(prev => ({ ...prev, isOpen: false }));
          } catch (error) {
              console.error(error);
              showToast("Failed to delete user", "error");
              setAlertConfig(prev => ({ ...prev, isOpen: false }));
          }
    };
  
    const filteredUsers = users.filter(user =>
      (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
    if (loading) return <div className="h-96 flex items-center justify-center"><Spinner size={40} /></div>;
  
    return (
      <div className="space-y-6">
        <UsersHeader />
  
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <UsersToolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  
          <UsersTable users={currentUsers} onDelete={confirmDelete} />
          
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
