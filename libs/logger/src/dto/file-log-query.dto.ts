import { LogType, TimeUnit } from '@libs/shared/types/shared.type';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';

export class FileLogQueryDto {
  @ApiPropertyOptional({
    description: 'Type of log (e.g., info, warn, error)',
    enum: LogType,
    required: false,
  })
  @IsEnum(LogType)
  @IsOptional()
  logType?: LogType;

  @ApiPropertyOptional({
    description: 'Time unit for the timeframe (e.g., second, minute, hour)',
    enum: TimeUnit,
    required: false,
  })
  @IsEnum(TimeUnit)
  @IsOptional()
  timeUnit?: TimeUnit;

  @ApiPropertyOptional({
    description: 'Timeframe value in the specified time unit (e.g., 10)',
    type: Number,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  timeFrame?: number;

  @ApiPropertyOptional({
    description: 'Start date in ISO 8601 format',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date in ISO 8601 format',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
