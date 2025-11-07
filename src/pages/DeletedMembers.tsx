import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RotateCcw, Trash2 } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";

export default function DeletedMembers() {
  const { members: deletedMembers, isLoading, restoreMember, permanentDeleteMember } = useMembers(true);

  const handleRestore = (memberId: string) => {
    restoreMember.mutate(memberId);
  };

  const handlePermanentDelete = (memberId: string) => {
    permanentDeleteMember.mutate(memberId);
  };

  return (
    <DashboardLayout title="VeggieTrack Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Deleted Members</h2>
          <p className="text-muted-foreground">Restore or permanently delete members</p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading...
            </div>
          ) : deletedMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No deleted members
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="hidden sm:table-cell">Address</TableHead>
                    <TableHead className="hidden md:table-cell">Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedMembers.map((member) => (
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
                            onClick={() => handleRestore(member.id)}
                            title="Restore member"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                title="Delete permanently"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete {member.name}'s data from the database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handlePermanentDelete(member.id)}>
                                  Delete Forever
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
