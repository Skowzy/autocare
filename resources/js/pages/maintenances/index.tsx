import { Head, Link } from '@inertiajs/react';
import { EmptyState } from '@/components/empty-state';
import { LicensePlate } from '@/components/license-plate';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatMileage, formatPrice } from '@/lib/format';
import { index, show } from '@/routes/maintenances';
import { index as vehiclesIndex, show as vehicleShow } from '@/routes/vehicles';
import type { MaintenanceRow } from '@/types/domain';

export default function MaintenancesIndex({
    maintenances,
}: {
    maintenances: MaintenanceRow[];
}) {
    const total = maintenances.reduce(
        (sum, maintenance) => sum + Number(maintenance.price ?? 0),
        0,
    );

    return (
        <>
            <Head title="Mes entretiens" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
                <PageHeader
                    title="Mes entretiens"
                    description={
                        maintenances.length === 0
                            ? 'Aucun entretien enregistré.'
                            : `${maintenances.length} entretien${maintenances.length > 1 ? 's' : ''} · ${formatPrice(String(total))} au total`
                    }
                />

                {maintenances.length === 0 ? (
                    <EmptyState
                        title="Aucun entretien"
                        description="Les interventions que vous enregistrez sur vos véhicules apparaîtront ici, tous véhicules confondus."
                        action={
                            <Button asChild>
                                <Link href={vehiclesIndex()}>
                                    Aller à mon garage
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="border-border bg-card rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-condensed">
                                        Date
                                    </TableHead>
                                    <TableHead className="font-condensed">
                                        Type
                                    </TableHead>
                                    <TableHead className="font-condensed">
                                        Véhicule
                                    </TableHead>
                                    <TableHead className="font-condensed text-right">
                                        Kilométrage
                                    </TableHead>
                                    <TableHead className="font-condensed text-right">
                                        Prix
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {maintenances.map((maintenance) => (
                                    <TableRow key={maintenance.id}>
                                        <TableCell>
                                            <time
                                                dateTime={
                                                    maintenance.performedAt
                                                }
                                            >
                                                {formatDate(
                                                    maintenance.performedAt,
                                                )}
                                            </time>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={show(maintenance.id)}
                                                className="hover:text-primary font-medium underline-offset-4 hover:underline"
                                            >
                                                {maintenance.type}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={vehicleShow(
                                                    maintenance.vehicle.id,
                                                )}
                                                className="flex items-center gap-2"
                                            >
                                                <LicensePlate
                                                    value={
                                                        maintenance.vehicle
                                                            .licensePlate
                                                    }
                                                    size="sm"
                                                />
                                                <span className="text-muted-foreground">
                                                    {maintenance.vehicle.brand}{' '}
                                                    {maintenance.vehicle.model}
                                                </span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatMileage(
                                                maintenance.mileage,
                                            ) ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {formatPrice(maintenance.price) ??
                                                '—'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}

MaintenancesIndex.layout = {
    breadcrumbs: [{ title: 'Mes entretiens', href: index() }],
};
