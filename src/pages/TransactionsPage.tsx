import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, ArrowUpCircle, ArrowDownCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string | null;
  reference: string | null;
  created_at: string;
  metadata: any;
}

const ITEMS_PER_PAGE = 10;

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, typeFilter, searchQuery]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Filter by search query (description or reference)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(query) ||
        t.reference?.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="bg-gradient-hero text-white py-12 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/dashboard" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-smooth">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold">Jadara Labs</span>
            </Link>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-xl text-blue-100 mt-2">
              View all your wallet transactions
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-primary" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <Card className="shadow-soft mb-6">
            <CardHeader>
              <CardTitle>Filter Transactions</CardTitle>
              <CardDescription>
                Filter by transaction type or search by description/reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Transaction Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All transactions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="credit">Credits Only</SelectItem>
                      <SelectItem value="debit">Debits Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Search by description or reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>
                {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''} Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTransactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">No transactions found</p>
                  <p className="text-sm mt-2">Try adjusting your filters or make a transaction</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Balance Before</TableHead>
                          <TableHead className="text-right">Balance After</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                              </div>
                            </TableCell>
                            <TableCell>
                              {transaction.type === 'credit' ? (
                                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                                  <ArrowUpCircle className="h-3 w-3 mr-1" />
                                  Credit
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20">
                                  <ArrowDownCircle className="h-3 w-3 mr-1" />
                                  Debit
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{transaction.description || 'No description'}</p>
                                {transaction.reference && (
                                  <p className="text-xs text-muted-foreground">Ref: {transaction.reference}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={transaction.type === 'credit' ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400 font-semibold'}>
                                {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              ₦{transaction.balance_before.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ₦{transaction.balance_after.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                              // Show first page, last page, current page, and pages around current
                              return page === 1 || 
                                     page === totalPages || 
                                     Math.abs(page - currentPage) <= 1;
                            })
                            .map((page, index, array) => (
                              <>
                                {index > 0 && array[index - 1] !== page - 1 && (
                                  <span key={`ellipsis-${page}`} className="px-2">...</span>
                                )}
                                <Button
                                  key={page}
                                  variant={currentPage === page ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </Button>
                              </>
                            ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 flex gap-4 justify-center">
            <Link to="/top-up">
              <Button>Top Up Wallet</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
