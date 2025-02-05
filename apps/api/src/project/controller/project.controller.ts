import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { ProjectService } from '../service/project.service'
import { CurrentUser } from '../../decorators/user.decorator'
import { Authority, Project, User, Workspace } from '@prisma/client'
import { CreateProject } from '../dto/create.project/create.project'
import { UpdateProject } from '../dto/update.project/update.project'
import { ApiTags } from '@nestjs/swagger'
import { RequiredApiKeyAuthorities } from '../../decorators/required-api-key-authorities.decorator'

@ApiTags('Project Controller')
@Controller('project')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Post(':workspaceId')
  @RequiredApiKeyAuthorities(Authority.CREATE_PROJECT)
  async createProject(
    @CurrentUser() user: User,
    @Param('workspaceId') workspaceId: Workspace['id'],
    @Body() dto: CreateProject
  ) {
    return await this.service.createProject(user, workspaceId, dto)
  }

  @Put(':projectId')
  @RequiredApiKeyAuthorities(Authority.UPDATE_PROJECT)
  async updateProject(
    @CurrentUser() user: User,
    @Param('projectId') projectId: Project['id'],
    @Body() dto: UpdateProject
  ) {
    return await this.service.updateProject(user, projectId, dto)
  }

  @Delete(':projectId')
  @RequiredApiKeyAuthorities(Authority.DELETE_PROJECT)
  async deleteProject(
    @CurrentUser() user: User,
    @Param('projectId') projectId: Project['id']
  ) {
    return await this.service.deleteProject(user, projectId)
  }

  @Get(':projectId')
  @RequiredApiKeyAuthorities(Authority.READ_PROJECT)
  async getProject(
    @CurrentUser() user: User,
    @Param('projectId') projectId: Project['id']
  ) {
    return await this.service.getProjectByUserAndId(user, projectId)
  }

  @Get('/all/:workspaceId')
  @RequiredApiKeyAuthorities(Authority.READ_PROJECT)
  async getAllProjects(
    @CurrentUser() user: User,
    @Param('workspaceId') workspaceId: Workspace['id'],
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'name',
    @Query('order') order: string = 'asc',
    @Query('search') search: string = ''
  ) {
    return await this.service.getProjectsOfWorkspace(
      user,
      workspaceId,
      page,
      limit,
      sort,
      order,
      search
    )
  }
}
