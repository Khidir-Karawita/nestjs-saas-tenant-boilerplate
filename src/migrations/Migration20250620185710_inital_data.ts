import { Migration } from '@mikro-orm/migrations';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';

export class Migration20250620185710_inital_data extends Migration {

  override async up(): Promise<void> {
    const em = this.getEntityManager();

    const now = new Date();
    
    const createUserPermission = em.create(Permission, { 
      name: 'create:user',
      
    });
    const readUserPermission = em.create(Permission, { 
      name: 'read:user',
      
    });
    const updateUserPermission = em.create(Permission, { 
      name: 'update:user',
      
    });
    const deleteUserPermission = em.create(Permission, { 
      name: 'delete:user',
      
    });
    
    const createRolePermission = em.create(Permission, { 
      name: 'create:role',
      
    });
    const readRolePermission = em.create(Permission, { 
      name: 'read:role',
      
    });
    const updateRolePermission = em.create(Permission, { 
      name: 'update:role',
      
    });
    const deleteRolePermission = em.create(Permission, { 
      name: 'delete:role',
      
    });
    
    await em.persistAndFlush([
      createUserPermission,
      readUserPermission,
      updateUserPermission,
      deleteUserPermission,
      createRolePermission,
      readRolePermission,
      updateRolePermission,
      deleteRolePermission,
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
      deleteRolePermission
    );
    
    userRole.permissions.add(
      readUserPermission
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
