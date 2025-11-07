import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Eye, ArrowUpDown, FileDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/csvExport";
import { useMembers } from "@/hooks/useMembers";

type SortField = 'name' | 'phone' | 'joined_date';
type SortOrder = 'asc' | 'desc';

export default function Members() {
  const navigate = useNavigate();
  const { members, isLoading, addMember, softDeleteMember } = useMembers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", phone: "", address: "" });
  const [sortField, setSortField] = useState<SortField>('joined_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    let aValue: string | number = a[sortField];
    let bValue: string | number = b[sortField];

    if (sortField === 'joined_date') {
      aValue = new Date(a.joined_date).getTime();
      bValue = new Date(b.joined_date).getTime();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredMembers = sortedMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone.includes(searchQuery) ||
    member.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = () => {
    if (!newMember.name || !newMember.phone) {
      toast.error("Please fill in required fields");
      return;
    }

    addMember.mutate(newMember, {
      onSuccess: () => {
        setNewMember({ name: "", phone: "", address: "" });
        setIsAddDialogOpen(false);
      },
    });
  };

  const handleDeleteMember = (memberId: string) => {
    softDeleteMember.mutate(memberId);
  };

  const handleViewMember = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  const handleExportMembers = () => {
    const csvData = filteredMembers.map(member => ({
      Name: member.name,
      Phone: member.phone,
      Address: member.address,
      'Joined Date': new Date(member.joined_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));
    
    exportToCSV(csvData, 'members_list');
    toast.success("Members list exported successfully!");
  };

  const handleNavigateToDeleted = () => {
    navigate('/deleted-members');
  };

  return (
    <DashboardLayout title="VeggieTrack Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">Members</h2>
            <p className="text-muted-foreground">Manage your member database</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleNavigateToDeleted} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Deleted Members
            </Button>
            <Button variant="outline" onClick={handleExportMembers} className="gap-2">
              <FileDown className="h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>Enter member details below</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="0821234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newMember.address}
                    onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        </div>


        <div className="bg-card rounded-lg border p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No members found
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="h-8 px-2 lg:px-3"
                          onClick={() => handleSort('name')}
                        >
                          Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="h-8 px-2 lg:px-3"
                          onClick={() => handleSort('phone')}
                        >
                          Phone
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">Address</TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button 
                          variant="ghost" 
                          className="h-8 px-2 lg:px-3"
                          onClick={() => handleSort('joined_date')}
                        >
                          Joined Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell className="hidden sm:table-cell">{member.address}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(member.joined_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewMember(member.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-muted-foreground">
                Showing {filteredMembers.length} of {members.length} members
              </p>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
