import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Admin {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  password: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', role: 'admin', password: '' });
  const [sortBy, setSortBy] = useState<'name' | 'role'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    const stored = localStorage.getItem('admins');
    if (stored) {
      setAdmins(JSON.parse(stored));
    } else {
      // Initialize with mock data if no data exists
      const mockAdmins: Admin[] = [
        {
          id: '1',
          name: 'Zinhle',
          surname: 'Mokoena',
          email: 'zinhle@stokvel.com',
          role: 'super_admin',
          password: 'admin123'
        },
        {
          id: '2',
          name: 'Thabo',
          surname: 'Ndlovu',
          email: 'thabo@stokvel.com',
          role: 'admin',
          password: 'admin123'
        },
        {
          id: '3',
          name: 'Lerato',
          surname: 'Dlamini',
          email: 'lerato@stokvel.com',
          role: 'moderator',
          password: 'admin123'
        },
        {
          id: '4',
          name: 'Sipho',
          surname: 'Khumalo',
          email: 'sipho@stokvel.com',
          role: 'admin',
          password: 'admin123'
        },
        {
          id: '5',
          name: 'Nomsa',
          surname: 'Zungu',
          email: 'nomsa@stokvel.com',
          role: 'moderator',
          password: 'admin123'
        }
      ];
      localStorage.setItem('admins', JSON.stringify(mockAdmins));
      setAdmins(mockAdmins);
    }
  };

  const saveAdmins = (newAdmins: Admin[]) => {
    localStorage.setItem('admins', JSON.stringify(newAdmins));
    setAdmins(newAdmins);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAdmin) {
      const updated = admins.map(a => a.id === editingAdmin.id ? { ...formData, id: editingAdmin.id } : a);
      saveAdmins(updated);
      toast({ title: 'Admin updated successfully' });
    } else {
      const newAdmin = { ...formData, id: crypto.randomUUID() };
      saveAdmins([...admins, newAdmin]);
      toast({ title: 'Admin created successfully' });
    }
    
    closeDialog();
  };

  const handleDelete = (id: string) => {
    saveAdmins(admins.filter(a => a.id !== id));
    toast({ title: 'Admin deleted successfully' });
  };

  const openDialog = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData(admin);
    } else {
      setEditingAdmin(null);
      setFormData({ name: '', surname: '', email: '', role: 'admin', password: '' });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingAdmin(null);
    setFormData({ name: '', surname: '', email: '', role: 'admin', password: '' });
  };

  const sortedAdmins = useMemo(() => {
    return [...admins].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        const nameA = `${a.name} ${a.surname}`.toLowerCase();
        const nameB = `${b.name} ${b.surname}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (sortBy === 'role') {
        comparison = a.role.localeCompare(b.role);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [admins, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAdmins = sortedAdmins.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout title="Admin Management">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Admins</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Total: {admins.length} admin{admins.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: 'name' | 'role') => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="role">Sort by Role</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={toggleSortOrder}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.name} {admin.surname}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell className="capitalize">{admin.role.replace('_', ' ')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(admin)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(admin.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">Items per page:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="items-per-page" className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, admins.length)} of {admins.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAdmin ? 'Edit Admin' : 'Add Admin'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit">{editingAdmin ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
