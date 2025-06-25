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
import { UserTenant } from 'src/common/decorators/requests/tenant.decorator';
import { Tenant } from 'src/entities/tenant.entity';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @UserTenant() tenant: Tenant,
  ) {
    return this.organizationsService.create(createOrganizationDto, tenant);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadAnyOrganizationPolicyHandler())
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadOrganizationPolicyHandler())
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne({
      id: +id,
      options: { populate: ['tenant'] as never },
    });
  }

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

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteOrganizationPolicyHandler())
  remove(@Param('id') id: string) {
    return this.organizationsService.remove({ id: +id });
  }
}
