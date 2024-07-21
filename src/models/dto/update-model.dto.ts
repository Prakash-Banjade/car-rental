import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateModelDto } from './create-model.dto';

export class UpdateModelDto extends PartialType(OmitType(CreateModelDto, ['galleryId'])) { }
