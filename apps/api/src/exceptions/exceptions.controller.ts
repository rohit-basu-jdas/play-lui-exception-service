import { ExceptionCountResponseDto } from './dto/exception.count.dto';
import { Controller, Get, Post, Body, Patch, Param, Put, Query, UseInterceptors } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';
import { CreateExceptionDto, CreateExceptionResponse } from './dto/exception.dto';
import { Exception } from './exception.interface';
import { PaginateResult } from 'mongoose';
import { LocationHeaderInterceptor } from './interceptors';

const mock_tenant_id = '1144ffe9-abca-474f-b41e-79c442166d31';
const defaultLimitResultSet = "5";
const defaultPageNo = "1";
@Controller('exceptions')
export class ExceptionsController {
    constructor(private readonly exceptionService: ExceptionsService) { }

     @Get('/')
     async getAll(@Query('pageNo') pageNo:string = defaultPageNo,@Query('limit') limit: string = defaultLimitResultSet): Promise<PaginateResult<Exception>> {
         const parsedlimit = parseInt(limit);
         const parsedPageNo = parseInt(pageNo);
         const tenantId = mock_tenant_id;
         return await this.exceptionService.findAll(parsedPageNo,parsedlimit,tenantId);
     }
    @Get('/count')
    async getCount(@Query('limit') limit: string = defaultLimitResultSet): Promise<ExceptionCountResponseDto> {
        const parsedlimit = parseInt(limit);
        const tenantId = mock_tenant_id;
        const count = await this.exceptionService.findAndCountAll(parsedlimit, tenantId);
        return {
            count
        }
    }
    @Post()
    @UseInterceptors(new LocationHeaderInterceptor<CreateExceptionResponse>())
    async create(@Body() exception: CreateExceptionDto): Promise<CreateExceptionResponse> {
        const _id = await this.exceptionService.createException(exception)
        return {
            _id
        }
    }

}
