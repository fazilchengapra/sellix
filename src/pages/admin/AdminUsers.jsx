import { useState, useEffect } from 'react';
import { Search, Mail, Ban, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import AlertDialog from '../../components/ui/AlertDialog';

import Pagination from '../../components/ui/Pagination';

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage registered users</p>
        </div>
  
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                              <Mail size={18} />
                          </button>
                          <button 
                              onClick={() => confirmDelete(user.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete User"
                          >
                              <Trash2 size={18} />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
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
