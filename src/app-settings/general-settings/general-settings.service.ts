import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeneralSetting } from "../entities/general-setting.entity";
import { Repository } from "typeorm";
import { GeneralSettingsDto } from "../dto/general-settings.dto";
import { ImagesService } from "src/images/images.service";

@Injectable()
export class GeneralSettingService {
    constructor(
        @InjectRepository(GeneralSetting) private readonly generalSettingRepo: Repository<GeneralSetting>,
        private readonly imagesService: ImagesService,
    ) { }

    async set(generalSettingsDto: GeneralSettingsDto) {
        const generalSetting = await this.generalSettingRepo.find();
        if (generalSetting.length > 0) {
            return await this.update(generalSettingsDto, generalSetting[0]);
        } else {
            return await this.create(generalSettingsDto);
        }
    }

    async create(generalSettingsDto: GeneralSettingsDto) {
        const logo = generalSettingsDto.logoId ? await this.imagesService.findOne(generalSettingsDto.logoId) : null;
        const collapseLogo = generalSettingsDto.collapseLogoId ? await this.imagesService.findOne(generalSettingsDto.collapseLogoId) : null;

        const generalSetting = this.generalSettingRepo.create({
            ...generalSettingsDto,
            logo,
            collapseLogo,
        });
        return await this.generalSettingRepo.save(generalSetting);
    }

    async update(generalSettingsDto: GeneralSettingsDto, generalSetting: GeneralSetting) {
        const logo = generalSettingsDto.logoId ? await this.imagesService.findOne(generalSettingsDto.logoId) : generalSetting.logo;
        const collapseLogo = generalSettingsDto.collapseLogoId ? await this.imagesService.findOne(generalSettingsDto.logoId) : generalSetting.collapseLogo;

        Object.assign(generalSetting, {
            ...generalSettingsDto,
            logo,
            collapseLogo,
        });
        return await this.generalSettingRepo.save(generalSetting);
    }

    async get() {
        return (await this.generalSettingRepo.find({
            relations: {
                logo: true,
                collapseLogo: true,
            },
            select: {
                logo: {
                    url: true,
                    id: true,
                },
                collapseLogo: {
                    url: true,
                    id: true,
                }
            }
        }))[0];
    }
}