import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpException,
  HttpStatus,
  Req,
  Get,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ScoreCvService } from "../../services/score-cv/score-cv.service";
import { saveResource } from "src/common/utlities/utlities";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { ResourcesService } from "src/modules/resources/resources.service";
import { UpdateCvScoreDto } from "src/schemas/dto/update-cv-score.dto";

@Controller("score-cv")
export class ScoreCvController {
  constructor(
    private readonly scoreCvService: ScoreCvService,
    private readonly resourceService: ResourcesService,
  ) {}

  @Post("analyze")
  @UseInterceptors(FileInterceptor("cvFile"))
  async analyzeCv(
    @UploadedFile() file: Express.Multer.File,
    @Body("jobDescription") jobDescription: string
  ) {
    if (!file || !jobDescription) {
      throw new HttpException("File and jobDescription are required", HttpStatus.BAD_REQUEST);
    }
    const result = await this.scoreCvService.analyzeCV(file, jobDescription);
    return result;
  }

  @ApiBearerAuth()
  @Post("analyze-auth")
  @UseInterceptors(FileInterceptor("cvFile"))
  async analyzeCvAuth(
    @UploadedFile() file: Express.Multer.File,
    @Body("jobDescription") jobDescription: string,
    @Req() req
  ) {
    const user = req["user"];
    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    if (!file || !jobDescription) {
      throw new HttpException("File and jobDescription are required", HttpStatus.BAD_REQUEST);
    }
    const result = await this.scoreCvService.analyzeCV(file, jobDescription);

    if (result.error == true) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    } else {
      const cvFileUrl = await saveResource(
        file.buffer,
        user.username,
        "resume",
        this.resourceService
      );

      const pdf = await import("pdf-parse");
      const pdfData = await pdf(file.buffer);

      await this.scoreCvService.saveScore({
        userId: user.id,
        username: user.username,
        cvText: pdfData.text,
        jobDescription,
        jobSection: user.Fields || [],
        scoreResult: result,
        cvFileUrl,
      });
    }
    return result;
  }

  @Get("user/:userId")
  @ApiBearerAuth()
  async getUserCvScores(@Param("userId") userId: string, @Req() req) {
    const user = req["user"];
    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    // Allow if admin or the user himself
    if (user.role === "admin" || user.id === userId) {
      return this.scoreCvService.getScoresByUserId(userId);
    } else {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
  }

  @Post("get-candidate")
  @ApiBearerAuth()
  @ApiBody({ description: "Job description to find candidates" })
  async getCandidate(@Body("jobDescription") jobDescription: string) {
    const result = await this.scoreCvService.getCandidate(jobDescription);
    return result;
  }

  @Get("admin/all")
  @ApiBearerAuth()
  async getAllCvScores(@Req() req) {
    const user = req["user"];
    if (!user || user.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    return this.scoreCvService.getAllScores();
  }

  @Get("admin/:cvId")
  @ApiBearerAuth()
  async getCvScoreById(@Param("cvId") cvId: string, @Req() req) {
    const user = req["user"];
    if (!user || user.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    return this.scoreCvService.getScoreById(cvId);
  }

  @Patch("admin/:cvId")
  @ApiBearerAuth()
  async updateCvScoreById(
    @Param("cvId") cvId: string,
    @Body() updateDto: UpdateCvScoreDto,
    @Req() req
  ) {
    const user = req["user"];
    if (!user || user.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    return this.scoreCvService.updateScoreById(cvId, updateDto);
  }

  @Delete("admin/:cvId")
  @ApiBearerAuth()
  async deleteCvScoreById(@Param("cvId") cvId: string, @Req() req) {
    const user = req["user"];
    if (!user || user.role !== "admin") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    return this.scoreCvService.deleteScoreById(cvId);
  }
}
