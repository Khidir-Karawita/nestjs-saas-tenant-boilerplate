import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "./base.entity";
import { Permission } from "./permission.entity";

@Entity()
export class Role extends CustomBaseEntity {

    @Property({unique: true})
    name: string;

    @ManyToMany(() => Permission,'roles', {owner: true})
    permissions = new Collection<Permission>(this);
}
