import { Head, Link } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { destroy, index, show } from '@/routes/admin/users';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
    roleLabel: string;
    carsCount: number;
};

export default function AdminUsers({ users }: { users: UserRow[] }) {
    return (
        <>
            <Head title="Utilisateurs" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title="Utilisateurs"
                    description={`${users.length} compte${users.length > 1 ? 's' : ''}`}
                />

                <div className="border-border bg-card rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-condensed">
                                    Nom
                                </TableHead>
                                <TableHead className="font-condensed">
                                    E-mail
                                </TableHead>
                                <TableHead className="font-condensed">
                                    Rôle
                                </TableHead>
                                <TableHead className="font-condensed text-right">
                                    Véhicules
                                </TableHead>
                                <TableHead className="w-0" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={show(user.id)}
                                            className="hover:text-primary underline-offset-4 hover:underline"
                                        >
                                            {user.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.role === 'admin'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {user.roleLabel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {user.carsCount}
                                    </TableCell>
                                    <TableCell>
                                        <ConfirmDeleteDialog
                                            action={destroy(user.id).url}
                                            title={`Supprimer ${user.name} ?`}
                                            description={`Le compte, ses ${user.carsCount} véhicule${user.carsCount > 1 ? 's' : ''} et tout son carnet d’entretien seront définitivement supprimés.`}
                                            confirmLabel="Supprimer le compte"
                                            trigger={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Supprimer ${user.name}`}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

AdminUsers.layout = {
    breadcrumbs: [{ title: 'Utilisateurs', href: index() }],
};
