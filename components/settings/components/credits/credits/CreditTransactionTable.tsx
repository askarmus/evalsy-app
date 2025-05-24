'use client';

import React, { useEffect, useState } from 'react';

import { FaArrowUp, FaArrowDown, FaFileDownload, FaInbox } from 'react-icons/fa';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { getCreditHistory } from '@/services/credits.service';
import { DateRangePicker, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Card, CardBody } from '@heroui/react';

const PAGE_SIZE = 10;

export const CreditTransactionTable = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<any>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getCreditHistory();
        setTransactions(data);
        setFiltered(data);
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter by date range
  useEffect(() => {
    if (dateRange?.start && dateRange?.end) {
      const from = new Date(dateRange.start);
      const to = new Date(dateRange.end);
      const filteredTxs = transactions.filter((tx) => {
        const date = new Date(tx.createdAt);
        return date >= from && date <= to;
      });
      setFiltered(filteredTxs);
      setCurrentPage(1);
    } else {
      setFiltered(transactions);
    }
  }, [dateRange, transactions]);

  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleExport = () => {
    const csvRows = [['Date', 'Type', 'Amount', 'Related ID'], ...filtered.map((tx) => [format(new Date(tx.createdAt), 'PPpp'), tx.type, tx.amount, tx.relatedId || ''])];
    const blob = new Blob([csvRows.map((r) => r.join(',')).join('\n')], {
      type: 'text/csv',
    });
    saveAs(blob, 'credit-transactions.csv');
  };

  return (
    <Card radius="none" shadow="none">
      <CardBody>
        <h1 className="text-xl font-semibold mb-4">Credit Transaction</h1>

        <div className="flex flex-col sm:flex-row justify-between items-end mb-5 gap-4">
          <div className="w-full sm:w-60">
            <DateRangePicker label="Filter by Date" placeholder="Select range" value={dateRange} onChange={setDateRange} size="sm" />
          </div>

          <Button onPress={handleExport} color="primary" startContent={<FaFileDownload />} className="w-full sm:w-auto">
            Export CSV
          </Button>
        </div>

        <Table aria-label="Credit Transactions" isStriped removeWrapper>
          <TableHeader>
            <TableColumn>Date</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Amount</TableColumn>
            <TableColumn>Related ID</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
                <FaInbox className="text-4xl text-slate-500 mb-2" />
                <h4 className="text-md font-semibold">No transactions to display</h4>
                <p className="text-sm">Your recent credit activity will appear here.</p>
              </div>
            }
            loadingContent="Loading transactions... "
          >
            {paginated.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{format(new Date(tx.createdAt), 'PPpp')}</TableCell>
                <TableCell className="capitalize">{tx.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {tx.amount > 0 ? <FaArrowDown className="text-green-500" /> : <FaArrowUp className="text-red-500" />}
                    <span className={tx.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                      {Math.abs(tx.amount)} credit{Math.abs(tx.amount) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{tx.relatedId || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center mt-4">
          <Pagination page={currentPage} total={totalPages} onChange={setCurrentPage} showControls size="sm" color="primary" />
        </div>
      </CardBody>
    </Card>
  );
};
