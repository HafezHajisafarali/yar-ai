import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://www.y4r.net/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('yar_token')}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('❌ Failed to fetch users:', err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">پنل ادمین</h1>
      <Card className="mb-6">
        <CardContent className="flex gap-2 p-4">
          <Input
            placeholder="جستجوی ایمیل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={fetchUsers}>بروزرسانی</Button>
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام</TableHead>
            <TableHead>ایمیل</TableHead>
            <TableHead>تاریخ ساخت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString('fa-IR')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}