import { Migration } from '@mikro-orm/migrations';
import { Permission } from '../../entities/permission.entity';
import { Role } from '../../entities/role.entity';

export class Migration20250622193541_init_data extends Migration {
  override async up(): Promise<void> {
    const em = this.getEntityManager();

    const createUserPermission = em.create(Permission, {
      name: 'create:user',
      action: 'create',
      subject: 'User',
    });
    const readUserPermission = em.create(Permission, {
      name: 'read:user',
      action: 'read',
      subject: 'User',
    });
    const updateUserPermission = em.create(Permission, {
      name: 'update:user',
      action: 'update',
      subject: 'User',
    });
    const deleteUserPermission = em.create(Permission, {
      name: 'delete:user',
      action: 'delete',
      subject: 'User',
    });

    const createAnyUserPermission = em.create(Permission, {
      name: 'createAny:user',
      action: 'createAny',
      subject: 'User',
    });
    const readAnyUserPermission = em.create(Permission, {
      name: 'readAny:user',
      action: 'readAny',
      subject: 'User',
    });
    const readOneUserPermission = em.create(Permission, {
      name: 'readOne:user',
      action: 'readOne',
      subject: 'User',
    });
    const readOwnUserPermission = em.create(Permission, {
      name: 'readOwn:user',
      action: 'readOwn',
      subject: 'User',
    });
    const updateAnyUserPermission = em.create(Permission, {
      name: 'updateAny:user',
      action: 'updateAny',
      subject: 'User',
    });
    const updateOneUserPermission = em.create(Permission, {
      name: 'updateOne:user',
      action: 'updateOne',
      subject: 'User',
    });
    const updateOwnUserPermission = em.create(Permission, {
      name: 'updateOwn:user',
      action: 'updateOwn',
      subject: 'User',
    });
    const deleteAnyUserPermission = em.create(Permission, {
      name: 'deleteAny:user',
      action: 'deleteAny',
      subject: 'User',
    });
    const deleteOneUserPermission = em.create(Permission, {
      name: 'deleteOne:user',
      action: 'deleteOne',
      subject: 'User',
    });
    const deleteOwnUserPermission = em.create(Permission, {
      name: 'deleteOwn:user',
      action: 'deleteOwn',
      subject: 'User',
    });

    const createRolePermission = em.create(Permission, {
      name: 'create:role',
      action: 'create',
      subject: 'Role',
    });
    const readRolePermission = em.create(Permission, {
      name: 'read:role',
      action: 'read',
      subject: 'Role',
    });
    const updateRolePermission = em.create(Permission, {
      name: 'update:role',
      action: 'update',
      subject: 'Role',
    });
    const deleteRolePermission = em.create(Permission, {
      name: 'delete:role',
      action: 'delete',
      subject: 'Role',
    });

    const createAnyRolePermission = em.create(Permission, {
      name: 'createAny:role',
      action: 'createAny',
      subject: 'Role',
    });
    const readAnyRolePermission = em.create(Permission, {
      name: 'readAny:role',
      action: 'readAny',
      subject: 'Role',
    });
    const readOneRolePermission = em.create(Permission, {
      name: 'readOne:role',
      action: 'readOne',
      subject: 'Role',
    });
    const updateAnyRolePermission = em.create(Permission, {
      name: 'updateAny:role',
      action: 'updateAny',
      subject: 'Role',
    });
    const updateOneRolePermission = em.create(Permission, {
      name: 'updateOne:role',
      action: 'updateOne',
      subject: 'Role',
    });
    const deleteAnyRolePermission = em.create(Permission, {
      name: 'deleteAny:role',
      action: 'deleteAny',
      subject: 'Role',
    });
    const deleteOneRolePermission = em.create(Permission, {
      name: 'deleteOne:role',
      action: 'deleteOne',
      subject: 'Role',
    });

    const createOrganizationPermission = em.create(Permission, {
      name: 'create:organization',
      action: 'create',
      subject: 'Organization',
    });
    const readOrganizationPermission = em.create(Permission, {
      name: 'read:organization',
      action: 'read',
      subject: 'Organization',
    });
    const updateOrganizationPermission = em.create(Permission, {
      name: 'update:organization',
      action: 'update',
      subject: 'Organization',
    });
    const deleteOrganizationPermission = em.create(Permission, {
      name: 'delete:organization',
      action: 'delete',
      subject: 'Organization',
    });

    const createAnyOrganizationPermission = em.create(Permission, {
      name: 'createAny:organization',
      action: 'createAny',
      subject: 'Organization',
    });
    const readAnyOrganizationPermission = em.create(Permission, {
      name: 'readAny:organization',
      action: 'readAny',
      subject: 'Organization',
    });
    const readOneOrganizationPermission = em.create(Permission, {
      name: 'readOne:organization',
      action: 'readOne',
      subject: 'Organization',
    });
    const readOwnOrganizationPermission = em.create(Permission, {
      name: 'readOwn:organization',
      action: 'readOwn',
      subject: 'Organization',
    });
    const updateAnyOrganizationPermission = em.create(Permission, {
      name: 'updateAny:organization',
      action: 'updateAny',
      subject: 'Organization',
    });
    const updateOneOrganizationPermission = em.create(Permission, {
      name: 'updateOne:organization',
      action: 'updateOne',
      subject: 'Organization',
    });
    const updateOwnOrganizationPermission = em.create(Permission, {
      name: 'updateOwn:organization',
      action: 'updateOwn',
      subject: 'Organization',
    });
    const deleteAnyOrganizationPermission = em.create(Permission, {
      name: 'deleteAny:organization',
      action: 'deleteAny',
      subject: 'Organization',
    });
    const deleteOneOrganizationPermission = em.create(Permission, {
      name: 'deleteOne:organization',
      action: 'deleteOne',
      subject: 'Organization',
    });

    await em.persistAndFlush([
      createUserPermission,
      readUserPermission,
      updateUserPermission,
      deleteUserPermission,
      createAnyUserPermission,
      readAnyUserPermission,
      readOneUserPermission,
      readOwnUserPermission,
      updateAnyUserPermission,
      updateOneUserPermission,
      updateOwnUserPermission,
      deleteAnyUserPermission,
      deleteOneUserPermission,
      deleteOwnUserPermission,
      createRolePermission,
      readRolePermission,
      updateRolePermission,
      deleteRolePermission,
      createAnyRolePermission,
      readAnyRolePermission,
      readOneRolePermission,
      updateAnyRolePermission,
      updateOneRolePermission,
      deleteAnyRolePermission,
      deleteOneRolePermission,
      createOrganizationPermission,
      readOrganizationPermission,
      updateOrganizationPermission,
      deleteOrganizationPermission,
      createAnyOrganizationPermission,
      readAnyOrganizationPermission,
      readOneOrganizationPermission,
      readOwnOrganizationPermission,
      updateAnyOrganizationPermission,
      updateOneOrganizationPermission,
      updateOwnOrganizationPermission,
      deleteAnyOrganizationPermission,
      deleteOneOrganizationPermission,
    ]);

    const adminRole = em.create(Role, {
      name: 'admin',
    });
    const userRole = em.create(Role, {
      name: 'user',
    });

    adminRole.permissions.add(
      createUserPermission,
      readUserPermission,
      updateUserPermission,
      deleteUserPermission,
      createRolePermission,
      readRolePermission,
      updateRolePermission,
      deleteRolePermission,
      createAnyUserPermission,
      readAnyUserPermission,
      readOneUserPermission,
      updateAnyUserPermission,
      updateOneUserPermission,
      deleteAnyUserPermission,
      deleteOneUserPermission,
      createAnyRolePermission,
      readAnyRolePermission,
      readOneRolePermission,
      updateAnyRolePermission,
      updateOneRolePermission,
      deleteAnyRolePermission,
      deleteOneRolePermission,
      createOrganizationPermission,
      readOrganizationPermission,
      updateOrganizationPermission,
      deleteOrganizationPermission,
      createAnyOrganizationPermission,
      readAnyOrganizationPermission,
      readOneOrganizationPermission,
      updateAnyOrganizationPermission,
      updateOneOrganizationPermission,
      deleteAnyOrganizationPermission,
      deleteOneOrganizationPermission,
    );

    userRole.permissions.add(
      readOwnUserPermission,
      updateOwnUserPermission,
      readOrganizationPermission,
      readOwnOrganizationPermission,
    );

    await em.persistAndFlush([adminRole, userRole]);
  }

  override async down(): Promise<void> {
    const em = this.getEntityManager();

    const roles = await em.find(Role, {});
    await em.removeAndFlush(roles);

    const permissions = await em.find(Permission, {});
    await em.removeAndFlush(permissions);
  }
}
