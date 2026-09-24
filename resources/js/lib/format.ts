const mileageFormatter = new Intl.NumberFormat('fr-FR');

const priceFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
});

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

export function formatMileage(mileage: number | null): string | null {
    return mileage === null ? null : `${mileageFormatter.format(mileage)} km`;
}

export function formatPrice(price: string | null): string | null {
    return price === null ? null : priceFormatter.format(Number(price));
}

/** Formats an ISO date (YYYY-MM-DD) without shifting it across time zones. */
export function formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-').map(Number);

    return dateFormatter.format(new Date(year, month - 1, day));
}
