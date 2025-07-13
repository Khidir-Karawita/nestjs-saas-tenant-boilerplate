import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CheckPolicies } from 'src/common/decorators/metadata/check-policy.decorator';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { ReadOrganizationPolicyHandler } from './policies/read-organization.policy';
import { ReadAnyOrganizationPolicyHandler } from './policies/read-any-organization.policy';
import { UpdateOrganizationPolicyHandler } from './policies/update-organization.policy';
import { DeleteOrganizationPolicyHandler } from './policies/delete-organization.policy';

/**
 * Organizations controller that handles organization management operations.
 * Provides CRUD endpoints for organization entities with policy-based authorization.
 */
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  /**
   * Creates a new organization.
   * @param {CreateOrganizationDto} createOrganizationDto - The organization creation data.
   * @returns {Promise<Organization>} The newly created organization.
   */
  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  /**
   * Retrieves all organizations in the system.
   * Requires authorization through policies guard.
   * @returns {Promise<Organization[]>} Array of all organizations.
   */
  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadAnyOrganizationPolicyHandler())
  findAll() {
    return this.organizationsService.findAll();
  }

  /**
   * Retrieves a specific organization by ID.
   * Requires authorization through policies guard.
   * @param {string} id - The organization ID to retrieve.
   * @returns {Promise<Organization>} The organization with populated tenant.
   */
  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadOrganizationPolicyHandler())
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne({
      id: +id,
      options: { populate: ['tenant'] as never },
    });
  }

  /**
   * Updates a specific organization by ID.
   * Requires authorization through policies guard.
   * @param {string} id - The organization ID to update.
   * @param {UpdateOrganizationDto} updateOrganizationDto - The organization update data.
   * @returns {Promise<Organization>} The updated organization.
   */
  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateOrganizationPolicyHandler())
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update({
      id: +id,
      updateOrganizationDto,
    });
  }

  /**
   * Removes a specific organization by ID.
   * Requires authorization through policies guard.
   * @param {string} id - The organization ID to remove.
   * @returns {Promise<Organization>} The removed organization.
   */
  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteOrganizationPolicyHandler())
  remove(@Param('id') id: string) {
    return this.organizationsService.remove({ id: +id });
  }
}
