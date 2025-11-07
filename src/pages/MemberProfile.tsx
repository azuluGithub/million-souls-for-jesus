import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, CheckCircle2, Trash2, Download, FileDown } from "lucide-react";
import { exportToCSV } from "@/lib/csvExport";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Collection {
  id: string;
  date: string;
  status: string;
}

export default function MemberProfile() {
  const navigate = useNavigate();
  const { memberId } = useParams();
  
  // Mock data - replace with actual data fetching
  const [member, setMember] = useState({
    id: memberId || "1",
    name: "Star Arnold",
    phone: "0737368007",
    address: "2100 Soweto",
    about: "Star Arnold has been a valued member since joining our community. Dedicated to sustainable living and supporting local vegetable distribution initiatives.",
    isActive: true,
  });

  const [collections] = useState<Collection[]>([
    { id: "1", date: "2024-01-15", status: "Collected" },
    { id: "2", date: "2024-01-22", status: "Collected" },
    { id: "3", date: "2024-01-29", status: "Collected" },
    { id: "4", date: "2024-02-05", status: "Collected" },
    { id: "5", date: "2024-02-12", status: "Collected" },
  ]);

  const handleToggleActive = (checked: boolean) => {
    setMember({ ...member, isActive: checked });
    toast.success(`Member ${checked ? 'activated' : 'deactivated'} successfully!`);
  };

  const handleUpdateMember = () => {
    toast.success("Member details updated successfully!");
  };

  const handleDeleteMember = () => {
    toast.success("Member deleted successfully!");
    navigate("/members");
  };

  const handleDownloadProfile = () => {
    const downloadDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    window.print();
    toast.success("Preparing profile for download...");
  };

  const handleExportCollections = () => {
    const csvData = collections.map(collection => ({
      Date: new Date(collection.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      Status: collection.status,
    }));
    
    exportToCSV(csvData, `${member.name.replace(/\s+/g, '_')}_collections`);
    toast.success("Collection history exported successfully!");
  };

  return (
    <DashboardLayout title="VeggieTrack Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/members")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold">Member Profile</h2>
              <p className="text-muted-foreground">View and manage member details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadProfile}>
              <Download className="h-4 w-4 mr-2" />
              Download/Print
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Member
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the member
                    and all their collection history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteMember}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="hidden print:block mb-6">
          <h2 className="text-3xl font-bold mb-2">Member Profile</h2>
          <p className="text-sm text-muted-foreground">
            Date Downloaded: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Member biography and notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="about">About Member</Label>
              <Textarea
                id="about"
                value={member.about}
                onChange={(e) => setMember({ ...member, about: e.target.value })}
                placeholder="Add information about this member..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Member Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update member details below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={member.name}
                  onChange={(e) => setMember({ ...member, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={member.phone}
                  onChange={(e) => setMember({ ...member, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={member.address}
                  onChange={(e) => setMember({ ...member, address: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="active-toggle">Member Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {member.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <Switch
                  id="active-toggle"
                  checked={member.isActive}
                  onCheckedChange={handleToggleActive}
                />
              </div>
              <Button onClick={handleUpdateMember} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Collection Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Statistics</CardTitle>
              <CardDescription>Overview of member's collections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Collections</p>
                    <p className="text-3xl font-bold">{collections.length}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Collection</p>
                    <p className="text-lg font-semibold">
                      {collections.length > 0 
                        ? new Date(collections[collections.length - 1].date).toLocaleDateString()
                        : "No collections yet"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection History Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Collection History</CardTitle>
                <CardDescription>List of all member&apos;s collections</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCollections}
                className="print:hidden"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {collections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No collections found
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collections.map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell className="font-medium">
                          {new Date(collection.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            <CheckCircle2 className="h-3 w-3" />
                            {collection.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
