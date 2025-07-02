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

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);
  constructor(
    private readonly repo: OrganizationRepository,
    private readonly em: EntityManager,
  ) {}

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

  findAll() {
    return this.repo.findAll();
  }

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
