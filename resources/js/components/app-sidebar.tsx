import { Link, usePage } from '@inertiajs/react';
import { Car, ClipboardList, Tags, Users, Wrench } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { index as brandsIndex } from '@/routes/admin/brands';
import { index as maintenanceTypesIndex } from '@/routes/admin/maintenance-types';
import { index as usersIndex } from '@/routes/admin/users';
import { index as maintenancesIndex } from '@/routes/maintenances';
import { index as vehiclesIndex } from '@/routes/vehicles';
import type { NavItem } from '@/types';

const clientNavItems: NavItem[] = [
    { title: 'Mon garage', href: vehiclesIndex(), icon: Car },
    { title: 'Mes entretiens', href: maintenancesIndex(), icon: ClipboardList },
];

const adminNavItems: NavItem[] = [
    { title: 'Utilisateurs', href: usersIndex(), icon: Users },
    { title: 'Marques', href: brandsIndex(), icon: Tags },
    { title: 'Types d’entretien', href: maintenanceTypesIndex(), icon: Wrench },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    const navItems = isAdmin ? adminNavItems : clientNavItems;
    const home = isAdmin ? usersIndex() : vehiclesIndex();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={home} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain
                    items={navItems}
                    label={isAdmin ? 'Administration' : 'Mon compte'}
                />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
