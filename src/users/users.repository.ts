import { EntityRepository } from "@mikro-orm/mariadb";
import { User } from "src/entities/user.entity";

export class UserRepository extends EntityRepository<User> {
}
