import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { EFuelType, EGearBox, EModelStatus } from "src/core/types/global.types";

export class CreateModelDto {
    @ApiProperty({ type: String, description: 'Model name', example: 'Tesla Model 3' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: String, description: 'Model slug', example: 'tesla-model-3' })
    @IsString()
    @IsOptional()
    slug: string;

    @ApiProperty({ type: String, description: 'Model description', example: 'Model 3 description' })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ type: String, description: 'Model license plate', example: 'ABC-123' })
    @IsString()
    @IsNotEmpty()
    licensePlate: string;

    @ApiProperty({ type: String, description: 'Vehicle Identification Number', example: '4Y1SL65848Z411439' })
    @IsString()
    @IsNotEmpty()
    vin: string;

    @ApiProperty({ type: String, description: 'Model color', example: 'Black' })
    @IsString()
    @IsNotEmpty()
    color: string;

    @ApiProperty({ type: String, description: 'Model acceleration', example: `0–100 km/h: 3.8 seconds` })
    @IsString()
    @IsNotEmpty()
    acceleration: string;

    @ApiProperty({ type: String, description: 'Model Transmission', example: `Robotic 7` })
    @IsString()
    @IsNotEmpty()
    transmission: string;

    @ApiProperty({ type: Number, description: 'Model engine volume', example: `2993 cc` })
    @IsNumber()
    @IsNotEmpty()
    engineVolume: number;

    @ApiProperty({ type: Number, description: 'Model power', example: `570 hp` })
    @IsNumber()
    @IsNotEmpty()
    power: number;

    @ApiProperty({ type: String, description: 'Model drive train', example: `Full (4WD)` })
    @IsString()
    @IsNotEmpty()
    driveTrain: string;

    @ApiProperty({ type: Number, description: 'Number of seats', example: 5 })
    @IsInt()
    @IsNotEmpty()
    seatCount: number;

    @ApiProperty({ type: Boolean, description: 'Does the model have navigation?', example: true })
    @IsBoolean()
    @IsNotEmpty()
    navigation: boolean;

    @ApiPropertyOptional({ type: 'enum', enum: EGearBox, description: 'Model gear box', example: EGearBox.MT })
    @IsEnum(EGearBox)
    @IsOptional()
    gearBox: EGearBox;

    @ApiProperty({ type: Number, description: 'Number of doors', example: 5 })
    @IsInt()
    @IsNotEmpty()
    doorCount: number;

    @ApiProperty({ type: 'enum', enum: EFuelType, description: 'Model fuel type', example: EFuelType.DIESEL })
    @IsEnum(EFuelType)
    @IsNotEmpty()
    fuelType: EFuelType;

    @ApiProperty({ type: Number, description: 'Maximum speed', example: 200 })
    @IsNumber()
    @IsNotEmpty()
    maxSpeed: number;

    @ApiProperty({ type: String, description: 'Model Baggage', example: 'Trunk Space' })
    @IsString()
    @IsNotEmpty()
    baggage: string;

    @ApiPropertyOptional({ type: 'enum', enum: EModelStatus, description: 'Model status', example: EModelStatus.AVAILABLE })
    @IsEnum(EModelStatus)
    @IsOptional()
    status?: EModelStatus;

    @ApiProperty({ type: Number, description: 'Daily Rental Rate', example: 1000 })
    @IsNumber()
    @IsNotEmpty()
    dailyRentalRate: number;

    @ApiProperty({ type: String, format: 'uuid', description: 'Id of featured image', example: '123e4567-e89b-12d3-a456-426655440000' })
    @IsUUID()
    @IsNotEmpty()
    featuredImageId: string;

    @ApiProperty({ type: [String], format: 'uuid', description: 'Ids of images', example: '[123e4567-e89b-12d3-a456-426655440000, 123e4567-e89b-12d3-a456-426655440000]' })
    @IsUUID("all", { each: true })
    @IsNotEmpty({ each: true })
    galleryIds: string[];

    /**
    |--------------------------------------------------
    | PROPS FOR RELATIONS
    |--------------------------------------------------
    */

    @ApiProperty({ type: String, format: 'uuid', description: 'Brand Slug', example: '123e4567-e89b-12d3-a456-426655440000' })
    @IsString()
    @IsNotEmpty()
    brandSlug: string;

    @ApiProperty({ type: String, format: 'uuid', description: 'Car type Slug', example: '123e4567-e89b-12d3-a456-426655440000' })
    @IsString()
    @IsNotEmpty()
    carTypeSlug: string;
}
