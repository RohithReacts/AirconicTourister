import React, { useEffect, useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  BarChart3,
  Package,
  Users,
  ArrowUpRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import api from "@/api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
};

export default function AdminDashboard() {
  useDocumentTitle("Admin Dashboard");
  const [data, setData] = useState({
    products: [],
    recentSales: [],
    performanceData: [],
    userCount: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, userCountRes, ordersRes] = await Promise.all([
          api.get("/products"),
          api.get("/user/count"),
          api.get("/orders"),
        ]);

        // Process orders into recent sales items
        const allOrders = ordersRes.data || [];
        const sales = [];

        for (const order of allOrders) {
          if (!order.orderItems) continue;
          for (const item of order.orderItems) {
            sales.push({
              id: item._id || Math.random().toString(36).substring(7),
              title: item.title,
              image: item.image,
              price: item.price || 0,
              customerName:
                `${order.customerDetails?.firstName || ""} ${order.customerDetails?.lastName || ""}`.trim(),
              customerEmail: order.customerDetails?.email,
              date: order.createdAt,
            });
            if (sales.length >= 6) break;
          }
          if (sales.length >= 6) break;
        }

        // Performance data taken directly from Recent Sales
        // Reverse so the oldest of the recent is on the left
        const perfData = [...sales].reverse().map((sale) => ({
          date:
            sale.title.length > 12
              ? sale.title.substring(0, 12) + "..."
              : sale.title,
          revenue: sale.price,
        }));

        setData({
          products: productsRes.data.Products || [],
          recentSales: sales,
          performanceData: perfData,
          userCount: userCountRes.data.count || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  if (data.loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate stats
  const totalProducts = data.products.length;
  const totalRevenue = data.products.reduce(
    (acc, p) => acc + p.salePrice * p.stock,
    0,
  );
  const totalUsers = data.userCount;
  const totalStock = data.products.reduce((acc, p) => acc + p.stock, 0);

  const stats = [
    {
      title: "Inventory Value",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "Based on current stock",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total products",
      value: totalProducts.toString(),
      change: "Items in catalog",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Live Account",
      value: totalUsers.toString(),
      change: "Registered users",
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Stock Volume",
      value: totalStock.toString(),
      change: "Units in warehouse",
      icon: BarChart3,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-border bg-card/50 backdrop-blur-sm hover:shadow-md transition-all group overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-500 font-bold flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                </span>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border bg-card/50 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Recent Performance</CardTitle>
            <CardDescription>
              Direct revenue mapped from your latest sales
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full p-4 sm:p-6 sm:pt-0 flex-1">
            {data.performanceData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                No performance data yet.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.performanceData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--muted-foreground))"
                      opacity={0.2}
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                      tickMargin={10}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                      tickFormatter={(value) =>
                        `₹${value.toLocaleString("en-IN")}`
                      }
                    />
                    <ChartTooltip
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="revenue"
                      radius={[4, 4, 0, 0]}
                      fill="hsl(var(--primary))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3 border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentSales.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground italic text-sm">
                No recent transactions found.
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {data.recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center">
                    <div className="h-10 w-10 bg-muted/30 rounded-full border border-border/50 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                      {sale.image ? (
                        <img
                          src={sale.image}
                          alt={sale.title}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="ml-4 space-y-1 overflow-hidden">
                      <p className="text-sm font-medium leading-none truncate">
                        {sale.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {sale.customerName ||
                          sale.customerEmail ||
                          "Unknown Customer"}
                      </p>
                    </div>
                    <div className="ml-auto font-bold text-emerald-500">
                      +₹{sale.price.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
