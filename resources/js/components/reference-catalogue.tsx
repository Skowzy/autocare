import { Form } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export type CatalogueEntry = {
    id: number;
    name: string;
    usage: number;
    href?: string;
};

type ReferenceCatalogueProps = {
    entries: CatalogueEntry[];
    usageLabel: string;
    addLabel: string;
    storeAction: string;
    updateAction: (id: number) => string;
    destroyAction: (id: number) => string;
    deleteDescription: (entry: CatalogueEntry) => string;
};

/**
 * Brands, car models and maintenance types are all flat name lists with the same
 * add / rename / remove affordances, so they share one table.
 */
export function ReferenceCatalogue({
    entries,
    usageLabel,
    addLabel,
    storeAction,
    updateAction,
    destroyAction,
    deleteDescription,
}: ReferenceCatalogueProps) {
    const [editing, setEditing] = useState<CatalogueEntry | null>(null);

    return (
        <div className="space-y-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        {addLabel}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{addLabel}</DialogTitle>
                    </DialogHeader>
                    <Form
                        action={storeAction}
                        method="post"
                        resetOnSuccess
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-name">Nom</Label>
                                    <Input id="new-name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        Ajouter
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            <div className="border-border bg-card rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-condensed">
                                Nom
                            </TableHead>
                            <TableHead className="font-condensed text-right">
                                {usageLabel}
                            </TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className="font-medium">
                                    {entry.href ? (
                                        <a
                                            href={entry.href}
                                            className="hover:text-primary underline-offset-4 hover:underline"
                                        >
                                            {entry.name}
                                        </a>
                                    ) : (
                                        entry.name
                                    )}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {entry.usage}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label={`Renommer ${entry.name}`}
                                            onClick={() => setEditing(entry)}
                                        >
                                            <Pencil />
                                        </Button>
                                        <ConfirmDeleteDialog
                                            action={destroyAction(entry.id)}
                                            title={`Supprimer ${entry.name} ?`}
                                            description={deleteDescription(
                                                entry,
                                            )}
                                            confirmLabel="Supprimer"
                                            trigger={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Supprimer ${entry.name}`}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog
                open={editing !== null}
                onOpenChange={(open) => !open && setEditing(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Renommer</DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <Form
                            action={updateAction(editing.id)}
                            method="patch"
                            onSuccess={() => setEditing(null)}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-name">Nom</Label>
                                        <Input
                                            id="edit-name"
                                            name="name"
                                            defaultValue={editing.name}
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Enregistrer
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
