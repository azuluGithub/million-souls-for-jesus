import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Printer, ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import { exportToCSV } from "@/lib/csvExport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parse } from "date-fns";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Collection {
  id: string;
  memberName: string;
  phone: string;
  date: Date;
  time: string;
}

// Mock data generator
const generateMockData = (): Collection[] => {
  const members = [
    { name: "Star Arnold", phone: "0737368007" },
    { name: "Menzi N", phone: "0814099783" },
    { name: "John Doe", phone: "0711223344" },
    { name: "Jane Khumalo", phone: "0722334455" },
    { name: "Minnie D", phone: "0733445566" },
  ];
  
  const collections: Collection[] = [];
  const dates = [
    new Date(2025, 9, 15), // Oct 15
    new Date(2025, 9, 14), // Oct 14
    new Date(2025, 9, 10), // Oct 10
    new Date(2025, 8, 28), // Sep 28
    new Date(2025, 8, 20), // Sep 20
  ];
  
  dates.forEach((date, dateIndex) => {
    const numCollections = Math.floor(Math.random() * 3) + 2; // 2-4 collections per date
    for (let i = 0; i < numCollections; i++) {
      const member = members[Math.floor(Math.random() * members.length)];
      collections.push({
        id: `${dateIndex}-${i}`,
        memberName: member.name,
        phone: member.phone,
        date: date,
        time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'PM' : 'AM'}`,
      });
    }
  });
  
  return collections;
};

const ITEMS_PER_PAGE = 10;

export default function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allCollections] = useState<Collection[]>(generateMockData());
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const selectedDate = searchParams.get("date");

  // Filter collections by month
  const filteredCollections = useMemo(() => {
    if (filterMonth === "all") return allCollections;
    const [year, month] = filterMonth.split("-");
    return allCollections.filter(
      (c) => c.date.getFullYear() === parseInt(year) && c.date.getMonth() === parseInt(month)
    );
  }, [allCollections, filterMonth]);

  // Group by date
  const collectionDates = useMemo(() => {
    const dateMap = new Map<string, Collection[]>();
    filteredCollections.forEach((collection) => {
      const dateKey = format(collection.date, "yyyy-MM-dd");
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(collection);
    });
    return Array.from(dateMap.entries())
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([dateKey, collections]) => ({
        dateKey,
        date: parse(dateKey, "yyyy-MM-dd", new Date()),
        collections,
      }));
  }, [filteredCollections]);

  // Get available months
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    allCollections.forEach((c) => {
      months.add(`${c.date.getFullYear()}-${c.date.getMonth()}`);
    });
    return Array.from(months).sort().reverse();
  }, [allCollections]);

  // Pagination
  const totalPages = selectedDate
    ? Math.ceil((collectionDates.find((d) => d.dateKey === selectedDate)?.collections.length || 0) / ITEMS_PER_PAGE)
    : Math.ceil(collectionDates.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    if (selectedDate) {
      const dateData = collectionDates.find((d) => d.dateKey === selectedDate);
      if (!dateData) return [];
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return dateData.collections.slice(start, start + ITEMS_PER_PAGE);
    } else {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return collectionDates.slice(start, start + ITEMS_PER_PAGE);
    }
  }, [collectionDates, selectedDate, currentPage]);

  const handleDateClick = (dateKey: string) => {
    setSearchParams({ date: dateKey });
    setCurrentPage(1);
  };

  const handleBack = () => {
    setSearchParams({});
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (!selectedDate) return;
    
    const dateData = collectionDates.find((d) => d.dateKey === selectedDate);
    if (!dateData) return;

    const csvData = dateData.collections.map((c) => ({
      "Member Name": c.memberName,
      "Phone Number": c.phone,
      "Date": format(dateData.date, "yyyy-MM-dd"),
      "Day": format(dateData.date, "EEEE"),
      "Time": c.time,
    }));

    exportToCSV(csvData, `collections_${selectedDate}`);
    toast.success("CSV exported successfully");
  };

  const handleExportPDF = () => {
    if (!selectedDate) return;
    
    const dateData = collectionDates.find((d) => d.dateKey === selectedDate);
    if (!dateData) return;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(`Collections - ${format(dateData.date, "EEEE MMMM do, yyyy")}`, 14, 20);
    
    // Add table
    autoTable(doc, {
      startY: 30,
      head: [["Member Name", "Phone Number", "Day", "Time"]],
      body: dateData.collections.map((c) => [
        c.memberName,
        c.phone,
        format(dateData.date, "EEEE"),
        c.time,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [132, 204, 22], // Primary green color
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
    });

    // Add signature line
    const finalY = (doc as any).lastAutoTable.finalY || 30;
    doc.setFontSize(10);
    doc.text("Name and Signature of Moderator: __________________________", 14, finalY + 20);
    
    // Save the PDF
    doc.save(`collections_${selectedDate}.pdf`);
    toast.success("PDF exported successfully");
  };

  const handlePrint = () => {
    if (!selectedDate) return;
    
    const dateData = collectionDates.find((d) => d.dateKey === selectedDate);
    if (!dateData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print");
      return;
    }

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Collections - ${format(dateData.date, "EEEE MMMM do, yyyy")}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
              max-width: 1000px;
              margin: 0 auto;
            }
            h1 { 
              color: #333; 
              margin-bottom: 20px;
              border-bottom: 2px solid #84cc16;
              padding-bottom: 10px;
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
            .signature {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>Collections - ${format(dateData.date, "EEEE MMMM do, yyyy")}</h1>
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
              ${dateData.collections.map(c => `
                <tr>
                  <td>${c.memberName}</td>
                  <td>${c.phone}</td>
                  <td>${format(dateData.date, "EEEE")}</td>
                  <td>${c.time}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="signature">
            <p style="font-size: 14px; color: #333;">Name and Signature of Moderator: _______________________</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  // Get total unique members
  const totalMembers = useMemo(() => {
    return new Set(filteredCollections.map((c) => c.memberName)).size;
  }, [filteredCollections]);

  if (selectedDate) {
    const dateData = collectionDates.find((d) => d.dateKey === selectedDate);
    if (!dateData) {
      return (
        <DashboardLayout title="VeggieTrack Dashboard">
          <div className="space-y-6">
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dates
            </Button>
            <p className="text-muted-foreground">Date not found</p>
          </div>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout title="VeggieTrack Dashboard">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Button variant="ghost" onClick={handleBack} className="gap-2 mb-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dates
              </Button>
              <h2 className="text-3xl font-bold">{format(dateData.date, "EEEE MMMM do, yyyy")}</h2>
              <p className="text-muted-foreground">{dateData.collections.length} collections</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
                <FileText className="h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="gap-2" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="font-medium">{collection.memberName}</TableCell>
                      <TableCell>{collection.phone}</TableCell>
                      <TableCell className="text-right">{collection.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="VeggieTrack Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">History</h2>
            <p className="text-muted-foreground">Browse collection dates</p>
          </div>
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {availableMonths.map((month) => {
                const [year, monthNum] = month.split("-");
                const date = new Date(parseInt(year), parseInt(monthNum), 1);
                return (
                  <SelectItem key={month} value={month}>
                    {format(date, "MMMM yyyy")}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Collection Dates</CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No collection dates found
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedData.map((dateItem) => (
                  <div
                    key={dateItem.dateKey}
                    onClick={() => handleDateClick(dateItem.dateKey)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-2 cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        {format(dateItem.date, "EEEE MMMM do, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dateItem.collections.length} collection{dateItem.collections.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="bg-muted/50 rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Summary Statistics</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Collections</p>
              <p className="text-2xl font-bold">{collectionDates.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{totalMembers}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date Established</p>
              <p className="text-sm font-medium">
                {collectionDates.length > 0 
                  ? format(collectionDates[collectionDates.length - 1].date, "PPP")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
