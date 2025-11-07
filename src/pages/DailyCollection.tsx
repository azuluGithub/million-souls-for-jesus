import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, CheckCircle, Download, Search, Wifi, WifiOff, CloudUpload } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { Badge } from "@/components/ui/badge";

interface Collection {
  id: string;
  memberName: string;
  phone: string;
  day: string;
  date: Date;
  time: string;
}

export default function DailyCollection() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [searchPhone, setSearchPhone] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [collectionStatus, setCollectionStatus] = useState<string>("Collected");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isHistoryDatePickerOpen, setIsHistoryDatePickerOpen] = useState(false);
  const { isOnline, pendingCount, addCollection, loadCollections, saveCollections } = useOfflineSync();
  const [collections, setCollections] = useState<Collection[]>([]);

  // Load collections from localStorage on mount
  useEffect(() => {
    const stored = loadCollections();
    if (stored.length > 0) {
      const parsedCollections = stored.map((c: any) => ({
        ...c,
        date: new Date(c.date),
      }));
      setCollections(parsedCollections);
    } else {
      // Initial mock data
      const mockData = [
        {
          id: "1",
          memberName: "Star Arnold",
          phone: "0737368007",
          day: "Monday",
          date: new Date(),
          time: "2:06:38 PM",
        },
        {
          id: "2",
          memberName: "Arnold Zulu",
          phone: "0814099783",
          day: "Monday",
          date: new Date(),
          time: "10:32:27 AM",
        },
      ];
      setCollections(mockData);
      saveCollections(mockData);
    }
  }, [loadCollections, saveCollections]);

  const members = [
    { id: "1", name: "Star Arnold", phone: "0737368007" },
    { id: "2", name: "Arnold Zulu", phone: "0814099783" },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const filteredMembers = members.filter((member) =>
    member.phone.includes(searchPhone)
  );

  const handleRecordCollection = () => {
    if (!selectedMember) {
      toast.error("Please select a member");
      return;
    }

    const member = members.find((m) => m.id === selectedMember);
    if (!member) return;

    const newCollection: Collection = {
      id: Date.now().toString(),
      memberName: member.name,
      phone: member.phone,
      day: selectedDay,
      date: date,
      time: format(new Date(), "h:mm:ss a"),
    };

    // Use offline sync to add collection
    addCollection({
      ...newCollection,
      date: newCollection.date.toISOString(),
    });

    const updatedCollections = [newCollection, ...collections];
    setCollections(updatedCollections);
    setSelectedMember("");
    setSearchPhone("");
    toast.success(isOnline ? "Collection recorded successfully!" : "Collection saved offline!");
  };

  const filteredCollections = collections.filter((collection) => 
    format(collection.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Unable to open print window. Please allow popups.");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Collection History - ${format(date, "PPP")}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 1000px;
              margin: 0 auto;
            }
            h1 {
              color: #333;
              border-bottom: 2px solid #84cc16;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #f5f5f5;
              padding: 12px;
              text-align: left;
              border: 1px solid #ddd;
              font-weight: bold;
              color: #333;
            }
            td {
              padding: 10px 12px;
              border: 1px solid #ddd;
            }
            tr:nth-child(even) {
              background-color: #fafafa;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>Collection History - ${format(date, "PPP")}</h1>
          ${filteredCollections.length === 0 
            ? '<p>No collections recorded yet</p>' 
            : `
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Number</th>
                    <th>Day</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredCollections.map(c => `
                    <tr>
                      <td>${c.memberName}</td>
                      <td>${c.phone}</td>
                      <td>${c.day}</td>
                      <td>${c.time}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `
          }
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    toast.success("Opening print dialog...");
  };

  return (
    <DashboardLayout title="VeggieTrack Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Daily Collection</h2>
            <p className="text-muted-foreground">Track vegetable collections for today</p>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20">
                <Wifi className="h-3 w-3" />
                Online
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 bg-destructive/10 text-destructive border-destructive/20">
                <WifiOff className="h-3 w-3" />
                Offline
              </Badge>
            )}
            {pendingCount > 0 && (
              <Badge variant="outline" className="gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                <CloudUpload className="h-3 w-3" />
                {pendingCount} pending
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Record New Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3 mb-4">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                      mode="single" 
                      selected={date} 
                      onSelect={(d) => {
                        if (d) {
                          setDate(d);
                          setSelectedDay(format(d, "EEEE"));
                          setIsDatePickerOpen(false);
                        }
                      }} 
                      initialFocus 
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Collection Day</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Search Member</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter phone number"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Label>Collection Status</Label>
              <Select value={collectionStatus} onValueChange={setCollectionStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Collected">Collected</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={handleRecordCollection}>
              <CheckCircle className="h-4 w-4" />
              Record Collection
            </Button>
          </CardContent>
        </Card>

        {searchPhone && filteredMembers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setSelectedMember(member.id);
                      setSearchPhone(member.phone);
                    }}
                    className="w-full text-left p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.phone}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Collection History</CardTitle>
            <div className="flex items-center gap-2">
              <Popover open={isHistoryDatePickerOpen} onOpenChange={setIsHistoryDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar 
                    mode="single" 
                    selected={date} 
                    onSelect={(d) => {
                      if (d) {
                        setDate(d);
                        setIsHistoryDatePickerOpen(false);
                      }
                    }} 
                    initialFocus 
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                <Download className="h-4 w-4" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCollections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No collections recorded for {format(date, "PPP")}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{collection.memberName}</p>
                      <p className="text-sm text-muted-foreground">{collection.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{collection.day}</p>
                      <p className="text-sm text-muted-foreground">{collection.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
