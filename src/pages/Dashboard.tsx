import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar as CalendarIcon, TrendingUp, Package, Clock, CheckCircle2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  // Realistic stats based on the mock data we have
  const stats = [
    { title: "Total Members", value: "156", description: "+12 from last month", icon: Users, trend: "+8.3%" },
    { title: "Collections Today", value: "18", description: "2 collections recorded", icon: CalendarIcon, trend: "+12%" },
    { title: "This Week", value: "125", description: "Average: 18 per day", icon: TrendingUp, trend: "+5.2%" },
    { title: "Active Members", value: "142", description: "91% participation rate", icon: CheckCircle2, trend: "+3.1%" },
  ];

  // Recent collections activity
  const recentCollections = [
    { id: "1", memberName: "Star Arnold", phone: "0737368007", day: "Monday", time: "2:06:38 PM" },
    { id: "2", memberName: "Arnold Zulu", phone: "0814099783", day: "Monday", time: "10:32:27 AM" },
    { id: "3", memberName: "Thandi Mbatha", phone: "0723456789", day: "Monday", time: "9:15:42 AM" },
    { id: "4", memberName: "Sipho Khumalo", phone: "0734567890", day: "Monday", time: "8:45:22 AM" },
    { id: "5", memberName: "Nomsa Dlamini", phone: "0745678901", day: "Monday", time: "7:30:15 AM" },
  ];


  const weeklyData = [
    { day: "Mon", collections: 18 },
    { day: "Tue", collections: 22 },
    { day: "Wed", collections: 19 },
    { day: "Thu", collections: 25 },
    { day: "Fri", collections: 21 },
    { day: "Sat", collections: 12 },
    { day: "Sun", collections: 8 },
  ];

  const monthlyData = [
    { week: "Week 1", collections: 112 },
    { week: "Week 2", collections: 128 },
    { week: "Week 3", collections: 105 },
    { week: "Week 4", collections: 125 },
  ];

  const yearlyData = [
    { month: "Jan", collections: 420 },
    { month: "Feb", collections: 385 },
    { month: "Mar", collections: 450 },
    { month: "Apr", collections: 425 },
    { month: "May", collections: 490 },
    { month: "Jun", collections: 510 },
    { month: "Jul", collections: 485 },
    { month: "Aug", collections: 465 },
    { month: "Sep", collections: 505 },
    { month: "Oct", collections: 470 },
    { month: "Nov", collections: 0 },
    { month: "Dec", collections: 0 },
  ];

  const chartConfig = {
    collections: {
      label: "Collections",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <DashboardLayout title="Million Souls For Jesus - Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to Million Souls For Jesus - Track your vegetable collections</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {stat.trend}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Collections</CardTitle>
              <CardDescription>Latest collection activities from today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{collection.memberName}</p>
                        <p className="text-sm text-muted-foreground">{collection.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{collection.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Collection insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Today's Goal</span>
                  <span className="text-sm font-medium">20</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '90%' }} />
                </div>
                <p className="text-xs text-muted-foreground">18 of 20 completed (90%)</p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Peak Collection Time</span>
                  <span className="text-sm font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. per Day</span>
                  <span className="text-sm font-medium">18 collections</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Most Active Day</span>
                  <span className="text-sm font-medium">Thursday</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Participation Rate</span>
                  <span className="text-sm font-bold text-primary">91%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '91%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Charts */}
        <div className="grid gap-6 grid-cols-1">
          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
              <CardDescription>Collections per day this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="collections" fill="var(--color-collections)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>Collections per week this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="collections" fill="var(--color-collections)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Yearly Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Yearly Summary</CardTitle>
              <CardDescription>Collections per month this year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="collections" 
                    stroke="var(--color-collections)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-collections)" }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
