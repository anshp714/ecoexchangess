
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { EcoExchangeLogo } from '@/lib/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  List,
  PlusCircle,
  BarChart2,
  Settings,
  LogOut,
  LifeBuoy,
  MessageCircleQuestion,
  User,
  Phone,
  Truck,
  DollarSign,
  Map,
  ShoppingBag,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentLocale } from '@/locales/client';
import { HelpChatbot } from './help-chatbot';
import { useUser } from '@/context/UserContext';
import { Button } from '../ui/button';

export function DashboardSidebar() {
  const pathname = usePathname();
  const locale = useCurrentLocale();
  const { user, logout } = useUser();

  const getInitials = (name?: string | null) => {
    if (!name) return '..';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  const allMenuItems = [
    // Buyer
    { href: `/${locale}/dashboard`, label: 'Marketplace', icon: Store, roles: ['buyer'] },
    { href: '#', label: 'My Orders', icon: ShoppingBag, roles: ['buyer'] },
    { href: `/${locale}/dashboard/analytics`, label: 'Analytics', icon: BarChart2, roles: ['buyer'] },
    
    // Seller
    { href: `/${locale}/dashboard/seller`, label: 'Dashboard', icon: LayoutDashboard, roles: ['seller'] },
    { href: `/${locale}/dashboard/listings/new`, label: 'New Listing', icon: PlusCircle, roles: ['seller'] },
    { href: '#', label: 'My Listings', icon: List, roles: ['seller'] },
    { href: `/${locale}/dashboard/seller/orders`, label: 'Orders', icon: ShoppingBag, roles: ['seller'] },
    { href: '#', label: 'Earnings', icon: DollarSign, roles: ['seller'] },
    { href: `/${locale}/dashboard/analytics`, label: 'Analytics', icon: BarChart2, roles: ['seller'] },
    
    // Logistics
    { href: `/${locale}/dashboard/logistics`, label: 'Dashboard', icon: LayoutDashboard, roles: ['logistics'] },
    { href: `/${locale}/dashboard/logistics/jobs`, label: 'Job Marketplace', icon: Truck, roles: ['logistics'] },
    { href: `/${locale}/dashboard/logistics/fleet`, label: 'Fleet', icon: Map, roles: ['logistics'] },
    { href: `/${locale}/dashboard/logistics/earnings`, label: 'Earnings', icon: DollarSign, roles: ['logistics'] },
  ];

  const visibleMenuItems = allMenuItems.filter(item => user && item.roles.includes(user.role));

  const getDashboardHome = () => {
    if (!user) return `/${locale}/login`;
    switch (user.role) {
      case 'buyer':
        return `/${locale}/dashboard`;
      case 'seller':
        return `/${locale}/dashboard/seller`;
      case 'logistics':
        return `/${locale}/dashboard/logistics`;
      default:
        return `/${locale}/dashboard`;
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border" side="left">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Link href={getDashboardHome()} className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground">
            <EcoExchangeLogo className="w-8 h-8" />
            <span className="group-data-[collapsible=icon]:hidden">EcoExchange</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {visibleMenuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: "right" }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
         <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="size-8">
              <AvatarImage src={user?.profileImageUrl} alt={user?.name ?? ""} />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold text-sidebar-foreground">{user?.name}</span>
              <span className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</span>
            </div>
        </div>
        <SidebarMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton tooltip={{ children: "Settings", side: "right"}}>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
               <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <HelpChatbot>
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <MessageCircleQuestion className="mr-2 h-4 w-4" />
                  <span>Help Chatbot</span>
                </DropdownMenuItem>
              </HelpChatbot>
               <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
               <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                <span>Contact Us</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SidebarMenuItem>
             <SidebarMenuButton onClick={logout} tooltip={{ children: "Logout", side: "right" }}>
                <LogOut />
                <span>Logout</span>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
