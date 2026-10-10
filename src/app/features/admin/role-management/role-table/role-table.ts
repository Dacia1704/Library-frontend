import { Component, computed, inject } from '@angular/core';
import { signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '@core/services/role.service';
import { PermissionService } from '@core/services/permission.service';
import { Role } from '@core/models/role-permission/role.model';
import { Permission } from '@core/models/role-permission/permission.model';
import { RoleRequest } from '@core/models/role-permission/request/role-request';
import { ToastService } from '@core/services/toast.service';

/**
 * Extended Role with UI state — must stay a proper class instance
 * so that spreading it ({ ...r }) preserves methods like getPermissionPercent.
 */
class RoleRow extends Role {
  isDirty = false;
  isSaving = false;

  constructor(data: Partial<Role> & { isDirty?: boolean; isSaving?: boolean } = {}) {
    super(data);
    this.isDirty = data.isDirty ?? false;
    this.isSaving = data.isSaving ?? false;
  }

  withDirty(dirty: boolean): RoleRow {
    return Object.assign(new RoleRow(this), { isDirty: dirty, isSaving: this.isSaving });
  }

  withSaving(saving: boolean): RoleRow {
    return Object.assign(new RoleRow(this), { isDirty: this.isDirty, isSaving: saving });
  }

  withState(dirty: boolean, saving: boolean): RoleRow {
    return Object.assign(new RoleRow(this), { isDirty: dirty, isSaving: saving });
  }
}

@Component({
  selector: 'app-role-table',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './role-table.html',
  styleUrl: './role-table.scss',
})
export class RoleTableComponent {
  private roleService = inject(RoleService);
  private permService = inject(PermissionService);
  private toast = inject(ToastService);

  // ===== Signals =====
  roles = signal<RoleRow[]>([]);
  permissions = signal<Permission[]>([]);
  matrix = signal<Map<number, Set<number>>>(new Map());
  dirty = signal<Map<number, Set<number>>>(new Map());
  searchKeyword = signal('');
  isLoading = signal(false);

  // ===== Computed =====
  hasChanges = computed(() => this.dirty().size > 0);

  dirtyPermissionCount = computed(() => {
    let count = 0;
    this.dirty().forEach((set) => { count += set.size; });
    return count;
  });

  filteredPermissions = computed(() => {
    const kw = this.searchKeyword().toLowerCase().trim();
    if (!kw) return this.permissions();
    return this.permissions().filter(
      (p) =>
        p.code.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw)
    );
  });

  filteredRoleIds = computed(() => {
    const kw = this.searchKeyword().toLowerCase().trim();
    const roles = this.roles();
    if (!kw) return new Set(roles.map((r) => r.id));
    return new Set(
      roles
        .filter(
          (r) =>
            r.name.toLowerCase().includes(kw) ||
            r.description.toLowerCase().includes(kw)
        )
        .map((r) => r.id)
    );
  });

  // ===== Lifecycle =====
  constructor() {
    this.loadData();
  }

  // ===== Data loading =====
  loadData(): void {
    this.isLoading.set(true);

    this.roleService.getRoles().subscribe({
      next: (res) => {
        const rows = res.data.map((r) => new RoleRow({ ...r, isDirty: false }));
        this.roles.set(rows);
        const newMatrix = new Map<number, Set<number>>();
        rows.forEach((r) => newMatrix.set(r.id, new Set(r.permissionIds)));
        this.matrix.set(newMatrix);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Không thể tải danh sách vai trò');
      },
    });

    this.permService.getPermissions().subscribe({
      next: (res) => {
        this.permissions.set(res.data);
      },
      error: () => {
        this.toast.error('Không thể tải danh sách quyền hạn');
      },
    });
  }

  // ===== Matrix helpers =====
  isChecked(roleId: number, permId: number): boolean {
    const d = this.dirty().get(roleId);
    if (d !== undefined) return d.has(permId);
    return this.matrix().get(roleId)?.has(permId) ?? false;
  }

  isRoleDirty(roleId: number): boolean {
    return this.dirty().has(roleId);
  }

  isRoleSystem(roleId: number): boolean {
    return this.roles().find((r) => r.id === roleId)?.isSystem ?? false;
  }

  getGrantedCount(roleId: number): number {
    const d = this.dirty().get(roleId);
    if (d !== undefined) return d.size;
    return this.matrix().get(roleId)?.size ?? 0;
  }

  // ===== Toggle actions =====
  togglePermission(roleId: number, permId: number): void {
    if (this.isRoleSystem(roleId)) return;

    const currentDirty = this.dirty();
    const currentMatrix = this.matrix();

    const originalSet = new Set(currentMatrix.get(roleId) ?? []);
    const workingSet = currentDirty.has(roleId)
      ? new Set(currentDirty.get(roleId)!)
      : new Set(originalSet);

    if (workingSet.has(permId)) {
      workingSet.delete(permId);
    } else {
      workingSet.add(permId);
    }

    const newDirty = new Map(currentDirty);
    if (this.setsEqual(workingSet, originalSet)) {
      newDirty.delete(roleId);
    } else {
      newDirty.set(roleId, workingSet);
    }
    this.dirty.set(newDirty);

    // Update role dirty flag — create proper RoleRow instance
    const roles = this.roles();
    const idx = roles.findIndex((r) => r.id === roleId);
    if (idx >= 0) {
      const updated = [...roles];
      updated[idx] = roles[idx].withDirty(newDirty.has(roleId));
      this.roles.set(updated);
    }
  }

  toggleAllForRole(roleId: number): void {
    if (this.isRoleSystem(roleId)) return;

    const currentDirty = this.dirty();
    const currentMatrix = this.matrix();
    const perms = this.permissions();

    const allPermIds = new Set(perms.map((p) => p.id));
    const originalSet = new Set(currentMatrix.get(roleId) ?? []);
    const workingSet = currentDirty.has(roleId)
      ? new Set(currentDirty.get(roleId)!)
      : new Set(originalSet);

    const newDirty = new Map(currentDirty);
    if (this.setsEqual(workingSet, allPermIds)) {
      newDirty.delete(roleId);
    } else {
      newDirty.set(roleId, allPermIds);
    }
    this.dirty.set(newDirty);

    const roles = this.roles();
    const idx = roles.findIndex((r) => r.id === roleId);
    if (idx >= 0) {
      const updated = [...roles];
      updated[idx] = roles[idx].withDirty(newDirty.has(roleId));
      this.roles.set(updated);
    }
  }

  // ===== Save / Discard =====
  saveAll(): void {
    const dirtyEntries = Array.from(this.dirty().entries());
    if (dirtyEntries.length === 0) return;

    // Mark all as saving — create proper RoleRow instances
    const roles = this.roles();
    this.roles.set(roles.map((r) =>
      dirtyEntries.some(([id]) => id === r.id)
        ? r.withSaving(true)
        : r
    ));

    let completed = 0;

    dirtyEntries.forEach(([roleId, permIds]) => {
      const role = roles.find((r) => r.id === roleId);
      if (!role) return;

      const request: RoleRequest = {
        name: role.name,
        description: role.description,
        permissionIds: Array.from(permIds),
      };

      this.roleService.updateRole(roleId.toString(), request).subscribe({
        next: () => {
          // Sync matrix + dirty
          this.matrix.set(new Map(this.matrix()).set(roleId, new Set(permIds)));
          const newDirty = new Map(this.dirty());
          newDirty.delete(roleId);
          this.dirty.set(newDirty);

          // Update role with fresh data — proper RoleRow instance
          const curr = this.roles();
          const idx = curr.findIndex((r) => r.id === roleId);
          if (idx >= 0) {
            const updated = [...curr];
            updated[idx] = new RoleRow({
              ...curr[idx],
              permissionIds: Array.from(permIds),
              isDirty: false,
              isSaving: false,
            });
            this.roles.set(updated);
          }

          completed++;
          if (completed === dirtyEntries.length) {
            this.toast.success('Lưu phân quyền thành công');
          }
        },
        error: () => {
          const curr = this.roles();
          const idx = curr.findIndex((r) => r.id === roleId);
          if (idx >= 0) {
            const updated = [...curr];
            updated[idx] = curr[idx].withSaving(false);
            this.roles.set(updated);
          }
          completed++;
          if (completed === dirtyEntries.length) {
            this.toast.error('Lưu phân quyền thất bại');
          }
        },
      });
    });
  }

  discardAll(): void {
    this.dirty.set(new Map());
    this.roles.set(this.roles().map((r) => r.withDirty(false)));
  }

  // ===== Private helpers =====
  private setsEqual(a: Set<number>, b: Set<number>): boolean {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  }
}
