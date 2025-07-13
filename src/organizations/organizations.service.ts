import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { EntityManager, FindOneOptions } from '@mikro-orm/mariadb';
import { Organization } from 'src/entities/organization.entity';
import { OrganizationRepository } from './organizations.repository';
import { Tenant } from 'src/entities/tenant.entity';

/**
 * Organizations service that handles organization-related business logic.
 * Provides CRUD operations for organization entities with tenant management.
 */
@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);
  constructor(
    private readonly repo: OrganizationRepository,
    private readonly em: EntityManager,
  ) {}

  /**
   * Creates a new organization.
   * @param {CreateOrganizationDto} createOrganizationDto - The organization creation data.
   * @returns {Promise<Organization>} The newly created organization.
   * @throws {Error} When organization creation fails.
   */
  async create(createOrganizationDto: CreateOrganizationDto) {
    try {
      const organization = this.repo.create({
        ...createOrganizationDto,
      });

      await this.em.flush();
      this.logger.log('New Organization created', organization);
      return organization;
    } catch (error) {
      this.logger.error('Error creating organization', error);
      throw error;
    }
  }

  /**
   * Retrieves all organizations from the database.
   * @returns {Promise<Organization[]>} Array of all organizations.
   */
  findAll() {
    return this.repo.findAll();
  }

  /**
   * Finds an organization by ID with optional population options.
   * @param {Object} params - The search parameters.
   * @param {number} params.id - The organization ID to find.
   * @param {FindOneOptions<Organization>} [params.options] - Optional MikroORM find options.
   * @returns {Promise<Organization>} The found organization.
   */
  findOne({
    id,
    options,
  }: {
    id: number;
    options?: FindOneOptions<Organization>;
  }) {
    if (options) {
      return this.repo.findOne(id, options);
    }
    return this.repo.findOne(id);
  }

  /**
   * Updates an existing organization by ID.
   * @param {Object} params - The update parameters.
   * @param {number} params.id - The organization ID to update.
   * @param {UpdateOrganizationDto} params.updateOrganizationDto - The organization update data.
   * @returns {Promise<Organization>} The updated organization.
   * @throws {BadRequestException} When organization is not found.
   */
  async update({
    id,
    updateOrganizationDto,
  }: {
    id: number;
    updateOrganizationDto: UpdateOrganizationDto;
  }) {
    const organization = await this.repo.findOne(id);
    if (!organization) {
      throw new BadRequestException('Organization not found');
    }
    this.repo.assign(organization, updateOrganizationDto);
    await this.em.flush();
    this.logger.log('Organization updated', organization);
    return organization;
  }

  /**
   * Removes an organization by ID.
   * @param {Object} params - The removal parameters.
   * @param {number} params.id - The organization ID to remove.
   * @returns {Promise<Organization>} The removed organization.
   * @throws {BadRequestException} When organization is not found.
   */
  async remove({ id }: { id: number }) {
    const organization = await this.repo.findOne(id);
    if (!organization) {
      throw new BadRequestException('Organization not found');
    }
    this.em.remove(organization);
    await this.em.flush();
    this.logger.log('Organization deleted', organization);
    return organization;
  }
}
