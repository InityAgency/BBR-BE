export async function seed(knex) {
  await knex('role_permissions').del();

  await knex.transaction(async (trx) => {
    const roles = await trx('roles').select('id', 'name');
    const roleMap = {};
    roles.forEach((role) => {
      roleMap[role.name.toLowerCase()] = role.id;
    });

    const permissions = await trx('permissions').select('id', 'name');
    const permissionMap = {};
    permissions.forEach((permission) => {
      permissionMap[permission.name.toLowerCase()] = permission.id;
    });

    for (const [roleName, permissionNames] of Object.entries({
      superadmin: ['create', 'read', 'edit', 'delete'],
      admin: ['create', 'read', 'edit'],
      developer: ['read', 'edit'],
      buyer: ['read'],
    })) {
      const roleId = roleMap[roleName.toLowerCase()];
      if (!roleId) {
        console.warn(`⚠️ Role ${roleName} not found`);
        continue;
      }

      for (const permissionName of permissionNames) {
        const permissionId = permissionMap[permissionName.toLowerCase()];
        if (!permissionId) {
          console.warn(`⚠️ Permission ${permissionName} not found`);
          continue;
        }

        const exists = await trx('role_permissions')
          .where({ role_id: roleId, permission_id: permissionId })
          .first();

        if (!exists) {
          await trx('role_permissions').insert({
            role_id: roleId,
            permission_id: permissionId,
          });
        } else {
        }
      }
    }
  });
}
