import type { ReactNode } from 'react';

type EmptyStateProps = {
    title: string;
    description: string;
    action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="border-border bg-card flex flex-col items-start gap-3 rounded-md border border-dashed p-8">
            <div className="space-y-1">
                <p className="font-medium">{title}</p>
                <p className="text-muted-foreground max-w-prose text-sm">
                    {description}
                </p>
            </div>
            {action}
        </div>
    );
}
