import { EntityRepository } from "@mikro-orm/mariadb";
import { Organization } from "src/entities/organization.entity";

export class OrganizationRepository extends EntityRepository<Organization> {
}
