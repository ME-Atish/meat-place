import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { PlaceService } from './place.service';
import { Place } from './place.entity';
import { CreatePlaceDto } from 'src/modules/place/dto/create-place.dto';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';

@Controller(`v${process.env.VERSION}/place`)
@UseGuards(AuthGuard('jwt-access'))
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}
  @Get()
  getAll(): Promise<Place[]> {
    return this.placeService.getAll();
  }

  @Get('/owner-places')
  getOwnerPlaces(@Req() req): Promise<Place[]> {
    const userId = req.user.id;
    return this.placeService.getOwnerPlaces(userId);
  }

  @Get('/owner-place/:id')
  getOneOwnerPlace(
    @Req() req,
    @Param('id', ParseUUIDPipe) placeId: string,
  ): Promise<Place> {
    const userId = req.user.id;
    return this.placeService.getOneOwnerPlace(userId, placeId);
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Place> {
    return this.placeService.getOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createPlaceDto: CreatePlaceDto,
    @Req() req,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ): Promise<void> {
    const id = req.user.id;
    return this.placeService.create(createPlaceDto, id, file.originalname);
  }

  @Delete('/:id')
  remove(
    @Req() req,
    @Param('id', ParseUUIDPipe) placeId: string,
  ): Promise<void> {
    const userId = req.user.id;
    return this.placeService.remove(userId, placeId);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Req() req,
    @Param('id', ParseUUIDPipe) placeId: string,
    @Body() createPlaceDto: CreatePlaceDto,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ): Promise<void> {
    const userId = req.user.id;
    return this.placeService.update(
      userId,
      placeId,
      createPlaceDto,
      file.originalname,
    );
  }
}
