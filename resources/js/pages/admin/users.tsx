import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Ban, ChevronLeft, ChevronRight, Pencil, Plus, ShieldCheck, Trash2, Users as UsersIcon, UserX } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import PasswordInput from '@/components/password-input';
import Pill from '@/components/pill';
import StatCard from '@/components/stat-card';
import { TONE, type Tone } from '@/components/tone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { destroy as userDestroy, store as userStore, suspension, update as userUpdate } from '@/routes/admin/users';

type UserRow = {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
    isSuspended: boolean;
    widgetsCount: number;
    joined: string | null;
};

type Props = {
    users: {
        data: UserRow[];
        links: { url: string | null; label: string; active: boolean }[];
        total: number;
    };
    stats?: { total: number; suspended: number; widgets: number };
    passwordRules: string;
};

const AVATAR_TONES: Tone[] = ['violet', 'sky', 'emerald', 'amber', 'rose'];
const GRADIENT_BUTTON = 'border-0 bg-gradient-to-r from-violet-600 via-primary to-sky-500 text-white shadow-lg shadow-primary/25 hover:opacity-95';

export default function AdminUsers({ users, stats, passwordRules }: Props) {
    const { flash } = usePage<{ flash?: { status?: string } }>().props;
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState<UserRow | null>(null);
    const suspendedOnPage = users.data.filter((user) => user.isSuspended).length;

    function toggleSuspension(user: UserRow) {
        const message = user.isSuspended
            ? `Restore ${user.email}? Their widgets will work again.`
            : `Suspend ${user.email}? Their widgets will stop working on visitors' sites.`;

        if (!window.confirm(message)) {
            return;
        }

        router.patch(suspension.url({ user: user.id }), { suspended: !user.isSuspended }, { preserveScroll: true });
    }

    function deleteUser(user: UserRow) {
        const message = `Delete ${user.email}? Their account and ${user.widgetsCount} widget${user.widgetsCount === 1 ? '' : 's'} will be removed permanently.`;

        if (!window.confirm(message)) {
            return;
        }

        router.delete(userDestroy.url({ user: user.id }), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Admin - users" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    eyebrow="Administration"
                    title="Users"
                    description="Create accounts, update their details, suspend or remove them."
                    actions={
                        <Button className={GRADIENT_BUTTON} onClick={() => setCreating(true)}>
                            <Plus /> New user
                        </Button>
                    }
                />

                {flash?.status && (
                    <p role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                        {flash.status}
                    </p>
                )}

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard label="Accounts" value={stats?.total ?? users.total} hint="Everyone who has signed up" icon={UsersIcon} tone="violet" />
                    <StatCard label="Suspended" value={stats?.suspended ?? suspendedOnPage} hint="Their widgets are paused" icon={UserX} tone="rose" />
                    <StatCard label="Widgets" value={stats?.widgets ?? 0} hint="Across all accounts" icon={ShieldCheck} tone="emerald" />
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="bg-muted/50 text-xs tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">Account</th>
                                        <th className="px-5 py-3 font-semibold">Widgets</th>
                                        <th className="px-5 py-3 font-semibold">Joined</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 text-right font-semibold">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${TONE[AVATAR_TONES[user.id % AVATAR_TONES.length]].chip}`}>
                                                        {initials(user.name)}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="flex items-center gap-2 font-medium">
                                                            {user.name}
                                                            {user.isAdmin && <Pill tone="violet">Admin</Pill>}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-medium">{user.widgetsCount}</td>
                                            <td className="px-5 py-4 text-muted-foreground">{user.joined}</td>
                                            <td className="px-5 py-4">
                                                <Pill tone={user.isSuspended ? 'rose' : 'emerald'} dot>
                                                    {user.isSuspended ? 'Suspended' : 'Active'}
                                                </Pill>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button size="sm" variant="ghost" className="text-sky-600 hover:bg-sky-500/10 hover:text-sky-600 dark:text-sky-400" onClick={() => setEditing(user)}>
                                                        <Pencil /> Edit
                                                    </Button>
                                                    {user.isAdmin ? (
                                                        <span className="px-2 text-xs text-muted-foreground">Protected</span>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className={user.isSuspended ? 'text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400' : 'text-amber-600 hover:bg-amber-500/10 hover:text-amber-600 dark:text-amber-400'}
                                                                onClick={() => toggleSuspension(user)}
                                                            >
                                                                {user.isSuspended ? <ShieldCheck /> : <Ban />}
                                                                {user.isSuspended ? 'Restore' : 'Suspend'}
                                                            </Button>
                                                            <Button size="icon" variant="ghost" aria-label={`Delete ${user.email}`} title="Delete" className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400" onClick={() => deleteUser(user)}>
                                                                <Trash2 />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-6">
                                                <EmptyState
                                                    icon={UsersIcon}
                                                    tone="sky"
                                                    title="No accounts yet"
                                                    description="Create the first account and set its password here. No email is sent."
                                                    action={
                                                        <Button className={GRADIENT_BUTTON} onClick={() => setCreating(true)}>
                                                            <Plus /> New user
                                                        </Button>
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {users.links.length > 3 && (
                    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pages">
                        {users.links.map((link, index) =>
                            link.url ? (
                                <Button
                                    key={`${link.label}-${index}`}
                                    size="sm"
                                    variant={link.active ? 'default' : 'outline'}
                                    onClick={() => router.get(link.url as string, {}, { preserveScroll: true })}
                                >
                                    {index === 0 && <ChevronLeft />}
                                    <span dangerouslySetInnerHTML={{ __html: link.label.replace(/&laquo;|&raquo;/g, '') }} />
                                    {index === users.links.length - 1 && <ChevronRight />}
                                </Button>
                            ) : null,
                        )}
                    </nav>
                )}
            </div>

            <CreateUserDialog open={creating} onOpenChange={setCreating} passwordRules={passwordRules} />
            {editing && <EditUserDialog user={editing} onClose={() => setEditing(null)} passwordRules={passwordRules} />}
        </>
    );
}

function CreateUserDialog({
    open,
    onOpenChange,
    passwordRules,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    passwordRules: string;
}) {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(userStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new user</DialogTitle>
                    <DialogDescription>
                        The account is ready to sign in with the password you set. No email is sent.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4">
                    <UserFields form={form} />
                    <div className="grid gap-2">
                        <Label htmlFor="user-password">Password</Label>
                        <PasswordInput
                            id="user-password"
                            value={form.data.password}
                            onChange={(event) => form.setData('password', event.target.value)}
                            autoComplete="new-password"
                            passwordrules={passwordRules}
                            required
                        />
                        {form.errors.password && <p className="text-sm text-destructive">{form.errors.password}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="user-password-confirmation">Confirm password</Label>
                        <PasswordInput
                            id="user-password-confirmation"
                            value={form.data.password_confirmation}
                            onChange={(event) => form.setData('password_confirmation', event.target.value)}
                            autoComplete="new-password"
                            passwordrules={passwordRules}
                            required
                        />
                        {form.errors.password_confirmation && <p className="text-sm text-destructive">{form.errors.password_confirmation}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={form.processing} className={GRADIENT_BUTTON}>
                            Create account
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditUserDialog({
    user,
    onClose,
    passwordRules,
}: {
    user: UserRow;
    onClose: () => void;
    passwordRules: string;
}) {
    const form = useForm({ name: user.name, email: user.email, password: '', password_confirmation: '' });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.patch(userUpdate.url({ user: user.id }), {
            preserveScroll: true,
            onSuccess: onClose,
        });
    }

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit account</DialogTitle>
                    <DialogDescription>
                        Update their name, email, or password. Leave password blank to keep the current one. No email is sent.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4">
                    <UserFields form={form} />
                    <div className="grid gap-2">
                        <Label htmlFor="edit-user-password">New password</Label>
                        <PasswordInput
                            id="edit-user-password"
                            value={form.data.password}
                            onChange={(event) => form.setData('password', event.target.value)}
                            autoComplete="new-password"
                            passwordrules={passwordRules}
                        />
                        {form.errors.password && <p className="text-sm text-destructive">{form.errors.password}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-user-password-confirmation">Confirm new password</Label>
                        <PasswordInput
                            id="edit-user-password-confirmation"
                            value={form.data.password_confirmation}
                            onChange={(event) => form.setData('password_confirmation', event.target.value)}
                            autoComplete="new-password"
                            passwordrules={passwordRules}
                        />
                        {form.errors.password_confirmation && <p className="text-sm text-destructive">{form.errors.password_confirmation}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={form.processing} className={GRADIENT_BUTTON}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function UserFields({
    form,
}: {
    form: {
        data: { name: string; email: string };
        errors: { name?: string; email?: string };
        setData: (key: 'name' | 'email', value: string) => void;
    };
}) {
    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="user-name">Full name</Label>
                <Input id="user-name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} required maxLength={255} />
                {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="user-email">Email address</Label>
                <Input id="user-email" type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} required maxLength={255} />
                {form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}
            </div>
        </>
    );
}

function initials(name: string): string {
    return name
        .split(' ')
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

AdminUsers.layout = {
    breadcrumbs: [{ title: 'Users', href: '/admin/users' }],
};
